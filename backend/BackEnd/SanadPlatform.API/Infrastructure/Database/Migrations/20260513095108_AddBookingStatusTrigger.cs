using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SanadPlatform.API.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddBookingStatusTrigger : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                """
                -- Function: inserts a history row when status changes on the bookings table.
                -- Reads status_changed_by and status_change_reason directly from the updated row
                -- so there are no transaction-scoping issues (unlike session variables).
                CREATE OR REPLACE FUNCTION fn_booking_status_history()
                RETURNS TRIGGER AS $$
                BEGIN
                    IF OLD.status IS DISTINCT FROM NEW.status THEN
                        INSERT INTO booking_status_history
                            (id, booking_id, previous_status, new_status, changed_by, change_reason, created_at)
                        VALUES (
                            gen_random_uuid(),
                            NEW.id,
                            OLD.status,
                            NEW.status,
                            NEW.status_changed_by,
                            NEW.status_change_reason,
                            CURRENT_TIMESTAMP
                        );
                    END IF;
                    RETURN NEW;
                END;
                $$ LANGUAGE plpgsql;

                -- Trigger: fires after each UPDATE on bookings
                DROP TRIGGER IF EXISTS trg_booking_status_change ON bookings;
                CREATE TRIGGER trg_booking_status_change
                    AFTER UPDATE ON bookings
                    FOR EACH ROW
                    WHEN (OLD.status IS DISTINCT FROM NEW.status)
                    EXECUTE FUNCTION fn_booking_status_history();
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                """
                DROP TRIGGER IF EXISTS trg_booking_status_change ON bookings;
                DROP FUNCTION IF EXISTS fn_booking_status_history();
                """);
        }
    }
}
