using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SanadPlatform.API.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddFinanceTimelineSqlView : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                """
                DROP VIEW IF EXISTS vw_finance_timeline_items;

                CREATE VIEW vw_finance_timeline_items AS
                WITH latest_payment_attempts AS (
                    SELECT DISTINCT ON (payment_id)
                        payment_id,
                        id AS payment_attempt_id
                    FROM payment_attempts
                    ORDER BY payment_id, attempt_number DESC, created_at DESC, id DESC
                ),
                top_up_payments AS (
                    SELECT
                        p.id AS payment_id,
                        lpa.payment_attempt_id,
                        pwu.id AS provider_wallet_top_up_id,
                        pwu.provider_id,
                        COALESCE(pwu.credited_amount, pwu.initiated_amount, p.amount) AS amount,
                        p.currency,
                        pwu.created_at,
                        pwu.reference_number,
                        pwu.initiated_at,
                        pwu.submitted_at,
                        pwu.credited_at,
                        pwu.failed_at,
                        pwu.cancelled_at,
                        pwu.expired_at,
                        CASE
                            WHEN pwu.status IN ('initiated', 'awaiting_transfer', 'submitted')
                                AND pwu.expires_at <= CURRENT_TIMESTAMP
                                THEN 'expired'
                            ELSE pwu.status
                        END AS resolved_status
                    FROM payments p
                    INNER JOIN provider_wallet_top_ups pwu ON pwu.id = p.provider_wallet_top_up_id
                    LEFT JOIN latest_payment_attempts lpa ON lpa.payment_id = p.id
                    WHERE p.purpose = 'wallet_top_up'
                ),
                booking_payments AS (
                    SELECT
                        p.id AS payment_id,
                        lpa.payment_attempt_id,
                        b.id AS booking_id,
                        b.provider_id,
                        b.patient_id,
                        p.amount,
                        p.currency,
                        p.reference_number,
                        p.status,
                        p.method_type,
                        p.created_at,
                        p.settled_at,
                        p.failed_at,
                        p.cancelled_at,
                        p.expired_at
                    FROM payments p
                    LEFT JOIN bookings b ON b.id = p.booking_id
                    LEFT JOIN latest_payment_attempts lpa ON lpa.payment_id = p.id
                    WHERE p.purpose = 'booking_payment'
                ),
                ledger_rollup AS (
                    SELECT
                        lt.id AS ledger_transaction_id,
                        lt.type,
                        lt.status,
                        lt.description,
                        lt.reference_number,
                        lt.currency,
                        lt.occurred_at,
                        lt.created_at,
                        MAX(le.provider_id::text)::uuid AS provider_id,
                        COALESCE(
                            MAX(le.booking_id::text)::uuid,
                            CASE WHEN lt.source_type = 'booking' THEN lt.source_id END
                        ) AS booking_id,
                        MAX(le.payment_id::text)::uuid AS payment_id,
                        COALESCE(
                            MAX(le.provider_wallet_top_up_id::text)::uuid,
                            CASE WHEN lt.source_type = 'provider_wallet_top_up' THEN lt.source_id END
                        ) AS provider_wallet_top_up_id,
                        COALESCE(
                            MAX(ABS(le.signed_amount)) FILTER (
                                WHERE le.account_code IN ('ProviderWalletAvailable', 'ProviderWalletReserved')
                            ),
                            MAX(ABS(le.signed_amount)),
                            0::numeric
                        ) AS amount,
                        CASE
                            WHEN lt.type = 'wallet_top_up_credited' THEN 'credit'
                            WHEN lt.type = 'cash_booking_fee_reserved' THEN 'debit'
                            WHEN lt.type = 'cash_booking_fee_released' THEN 'credit'
                            WHEN lt.type = 'cash_booking_fee_settled' THEN 'debit'
                            WHEN COALESCE(
                                SUM(le.signed_amount) FILTER (
                                    WHERE le.account_code IN ('ProviderWalletAvailable', 'ProviderWalletReserved')
                                ),
                                0::numeric
                            ) >= 0 THEN 'credit'
                            ELSE 'debit'
                        END AS direction
                    FROM ledger_transactions lt
                    LEFT JOIN ledger_entries le ON le.ledger_transaction_id = lt.id
                    GROUP BY
                        lt.id,
                        lt.type,
                        lt.status,
                        lt.description,
                        lt.reference_number,
                        lt.currency,
                        lt.occurred_at,
                        lt.created_at,
                        lt.source_type,
                        lt.source_id
                )
                SELECT
                    tp.payment_id AS id,
                    'wallet_top_up' AS type,
                    'credit' AS direction,
                    tp.resolved_status AS status,
                    tp.amount,
                    tp.currency,
                    'Provider wallet top-up' AS title,
                    CASE tp.resolved_status
                        WHEN 'initiated' THEN 'Provider wallet top-up initiated.'
                        WHEN 'awaiting_transfer' THEN 'Manual prepaid wallet top-up request created.'
                        WHEN 'submitted' THEN 'Manual prepaid wallet top-up submitted.'
                        WHEN 'credited' THEN 'Manual prepaid wallet top-up credited to the wallet.'
                        WHEN 'failed' THEN 'Manual prepaid wallet top-up failed.'
                        WHEN 'cancelled' THEN 'Manual prepaid wallet top-up cancelled.'
                        WHEN 'expired' THEN 'Manual prepaid wallet top-up request expired.'
                        ELSE 'Manual prepaid wallet top-up request.'
                    END AS description,
                    CASE
                        WHEN tp.resolved_status = 'credited' AND tp.credited_at IS NOT NULL THEN tp.credited_at
                        WHEN tp.resolved_status = 'submitted' AND tp.submitted_at IS NOT NULL THEN tp.submitted_at
                        WHEN tp.resolved_status = 'failed' AND tp.failed_at IS NOT NULL THEN tp.failed_at
                        WHEN tp.resolved_status = 'cancelled' AND tp.cancelled_at IS NOT NULL THEN tp.cancelled_at
                        WHEN tp.resolved_status = 'expired' AND tp.expired_at IS NOT NULL THEN tp.expired_at
                        ELSE tp.initiated_at
                    END AS occurred_at,
                    tp.created_at,
                    'payment' AS source_type,
                    tp.payment_id AS source_id,
                    tp.provider_id,
                    NULL::uuid AS patient_id,
                    NULL::uuid AS booking_id,
                    tp.payment_id,
                    tp.payment_attempt_id,
                    tp.provider_wallet_top_up_id,
                    NULL::uuid AS ledger_transaction_id,
                    tp.reference_number
                FROM top_up_payments tp

                UNION ALL

                SELECT
                    bp.payment_id AS id,
                    'booking_payment' AS type,
                    'debit' AS direction,
                    bp.status,
                    bp.amount,
                    bp.currency,
                    'Booking payment' AS title,
                    CASE bp.status
                        WHEN 'reserved' THEN 'Cash booking payment reserved.'
                        WHEN 'settled' THEN 'Booking payment settled.'
                        WHEN 'failed' THEN 'Booking payment failed.'
                        WHEN 'cancelled' THEN 'Booking payment cancelled.'
                        WHEN 'expired' THEN 'Booking payment expired.'
                        WHEN 'processing' THEN 'Booking payment is processing.'
                        ELSE 'Booking payment pending.'
                    END AS description,
                    CASE
                        WHEN bp.status = 'settled' AND bp.settled_at IS NOT NULL THEN bp.settled_at
                        WHEN bp.status = 'failed' AND bp.failed_at IS NOT NULL THEN bp.failed_at
                        WHEN bp.status = 'cancelled' AND bp.cancelled_at IS NOT NULL THEN bp.cancelled_at
                        WHEN bp.status = 'expired' AND bp.expired_at IS NOT NULL THEN bp.expired_at
                        ELSE bp.created_at
                    END AS occurred_at,
                    bp.created_at,
                    'payment' AS source_type,
                    bp.payment_id AS source_id,
                    bp.provider_id,
                    bp.patient_id,
                    bp.booking_id,
                    bp.payment_id,
                    bp.payment_attempt_id,
                    NULL::uuid AS provider_wallet_top_up_id,
                    NULL::uuid AS ledger_transaction_id,
                    bp.reference_number
                FROM booking_payments bp

                UNION ALL

                SELECT
                    lr.ledger_transaction_id AS id,
                    lr.type,
                    lr.direction,
                    lr.status,
                    lr.amount,
                    lr.currency,
                    CASE lr.type
                        WHEN 'cash_booking_fee_reserved' THEN 'Cash booking fee reserved'
                        WHEN 'cash_booking_fee_released' THEN 'Cash booking fee released'
                        WHEN 'cash_booking_fee_settled' THEN 'Cash booking fee settled'
                        WHEN 'wallet_top_up_credited' THEN 'Wallet top-up credited'
                        WHEN 'wallet_adjustment' THEN 'Wallet adjustment'
                        WHEN 'compensating_adjustment' THEN 'Compensating adjustment'
                        ELSE 'Ledger transaction'
                    END AS title,
                    COALESCE(
                        NULLIF(lr.description, ''),
                        CASE lr.type
                            WHEN 'cash_booking_fee_reserved' THEN 'Reserved platform-fee wallet exposure for a cash booking.'
                            WHEN 'cash_booking_fee_released' THEN 'Released platform-fee wallet reservation for a cancelled cash booking.'
                            WHEN 'cash_booking_fee_settled' THEN 'Settled platform-fee wallet exposure for a validated cash booking.'
                            WHEN 'wallet_top_up_credited' THEN 'Credited provider wallet top-up to the wallet.'
                            WHEN 'wallet_adjustment' THEN 'Manual wallet adjustment completed.'
                            WHEN 'compensating_adjustment' THEN 'Compensating wallet adjustment completed.'
                            ELSE 'Ledger transaction completed.'
                        END
                    ) AS description,
                    lr.occurred_at,
                    lr.created_at,
                    'ledger_transaction' AS source_type,
                    lr.ledger_transaction_id AS source_id,
                    COALESCE(lr.provider_id, pwu.provider_id, b.provider_id) AS provider_id,
                    b.patient_id,
                    lr.booking_id,
                    lr.payment_id,
                    lpa.payment_attempt_id,
                    lr.provider_wallet_top_up_id,
                    lr.ledger_transaction_id,
                    lr.reference_number
                FROM ledger_rollup lr
                LEFT JOIN bookings b ON b.id = lr.booking_id
                LEFT JOIN provider_wallet_top_ups pwu ON pwu.id = lr.provider_wallet_top_up_id
                LEFT JOIN latest_payment_attempts lpa ON lpa.payment_id = lr.payment_id;
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP VIEW IF EXISTS vw_finance_timeline_items;");
        }
    }
}
