using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SanadPlatform.API.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class ProjetcInit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("Npgsql:PostgresExtension:pg_trgm", ",,")
                .Annotation("Npgsql:PostgresExtension:pgcrypto", ",,")
                .Annotation("Npgsql:PostgresExtension:uuid-ossp", ",,");

            migrationBuilder.CreateTable(
                name: "accounts",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    code = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: false),
                    name = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    is_active = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_accounts", x => x.id);
                    table.UniqueConstraint("ak_accounts_code", x => x.code);
                });

            migrationBuilder.CreateTable(
                name: "admin_actions",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    admin_id = table.Column<Guid>(type: "uuid", nullable: false),
                    action = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    entity_type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    entity_id = table.Column<Guid>(type: "uuid", nullable: true),
                    description = table.Column<string>(type: "text", nullable: true),
                    old_values = table.Column<string>(type: "jsonb", nullable: true),
                    new_values = table.Column<string>(type: "jsonb", nullable: true),
                    ip_address = table.Column<string>(type: "character varying(45)", maxLength: 45, nullable: true),
                    user_agent = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_admin_actions", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "ambulance_service_types_config",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    code = table.Column<string>(type: "text", nullable: false),
                    name_en = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    name_fr = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    name_ar = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    name_de = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    icon = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    color = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    is_active = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    display_order = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ambulance_service_types_config", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "audit_logs",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    table_name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    record_id = table.Column<Guid>(type: "uuid", nullable: false),
                    action = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: true),
                    old_data = table.Column<string>(type: "jsonb", nullable: true),
                    new_data = table.Column<string>(type: "jsonb", nullable: true),
                    changed_fields = table.Column<List<string>>(type: "text[]", nullable: true),
                    ip_address = table.Column<string>(type: "character varying(45)", maxLength: 45, nullable: true),
                    user_agent = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_audit_logs", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "badges",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    code = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    description = table.Column<string>(type: "text", nullable: true),
                    icon_url = table.Column<string>(type: "text", nullable: true),
                    color = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    requirement_type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    requirement_value = table.Column<int>(type: "integer", nullable: true),
                    points_awarded = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    is_active = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_badges", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "discount_codes",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    code = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    description = table.Column<string>(type: "text", nullable: true),
                    discount_type = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    discount_value = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    max_discount_amount = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: true),
                    valid_from = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    valid_until = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    max_uses = table.Column<int>(type: "integer", nullable: true),
                    max_uses_per_user = table.Column<int>(type: "integer", nullable: false, defaultValue: 1),
                    current_uses = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    min_order_amount = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: true),
                    applicable_services = table.Column<List<Guid>>(type: "uuid[]", nullable: true),
                    applicable_categories = table.Column<List<string>>(type: "text[]", nullable: true),
                    first_booking_only = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    is_active = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_discount_codes", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "equipment_categories_config",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    code = table.Column<string>(type: "text", nullable: false),
                    name_en = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    name_fr = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    name_ar = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    name_de = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    description_en = table.Column<string>(type: "text", nullable: true),
                    description_fr = table.Column<string>(type: "text", nullable: true),
                    icon = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    color = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    default_commission_rate = table.Column<decimal>(type: "numeric(5,2)", precision: 5, scale: 2, nullable: false, defaultValue: 15.00m),
                    is_active = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    display_order = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_equipment_categories_config", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "fraud_blacklist",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    entity_type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    entity_value = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    reason = table.Column<string>(type: "text", nullable: true),
                    severity = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false, defaultValue: "high"),
                    source = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    added_by = table.Column<Guid>(type: "uuid", nullable: true),
                    expires_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_fraud_blacklist", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "fraud_events",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    event_type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: true),
                    provider_id = table.Column<Guid>(type: "uuid", nullable: true),
                    booking_id = table.Column<Guid>(type: "uuid", nullable: true),
                    payment_attempt_id = table.Column<Guid>(type: "uuid", nullable: true),
                    review_id = table.Column<Guid>(type: "uuid", nullable: true),
                    fraud_score = table.Column<decimal>(type: "numeric(5,2)", precision: 5, scale: 2, nullable: false),
                    decision = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    risk_level = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    features = table.Column<string>(type: "jsonb", nullable: false),
                    top_risk_factors = table.Column<string>(type: "jsonb", nullable: true),
                    model_version = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    processing_time_ms = table.Column<int>(type: "integer", nullable: true),
                    requires_review = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    reviewed_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    reviewed_by = table.Column<Guid>(type: "uuid", nullable: true),
                    review_decision = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    review_notes = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_fraud_events", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "fraud_rules",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    description = table.Column<string>(type: "text", nullable: true),
                    rule_type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    config = table.Column<string>(type: "jsonb", nullable: false),
                    action = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    priority = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    is_active = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_fraud_rules", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "ledger_transactions",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    reference_number = table.Column<string>(type: "character varying(60)", maxLength: 60, nullable: false),
                    type = table.Column<string>(type: "character varying(60)", maxLength: 60, nullable: false),
                    status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false, defaultValue: "posted"),
                    description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    source_type = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    source_id = table.Column<Guid>(type: "uuid", nullable: false),
                    currency = table.Column<string>(type: "character(3)", fixedLength: true, maxLength: 3, nullable: false, defaultValue: "TND"),
                    occurred_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    created_by_user_id = table.Column<Guid>(type: "uuid", nullable: true),
                    idempotency_key = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ledger_transactions", x => x.id);
                    table.CheckConstraint("ck_ledger_transactions_status", "status IN ('posted', 'voided')");
                    table.CheckConstraint("ck_ledger_transactions_type", "type IN ('cash_booking_fee_reserved', 'cash_booking_fee_released', 'cash_booking_fee_settled', 'wallet_top_up_credited', 'wallet_adjustment', 'compensating_adjustment')");
                });

            migrationBuilder.CreateTable(
                name: "nutrition_diet_types_config",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    code = table.Column<string>(type: "text", nullable: false),
                    name_en = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    name_fr = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    name_ar = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    name_de = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    icon = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    color = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    is_active = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    display_order = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_nutrition_diet_types_config", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "nutrition_subcategories_config",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    code = table.Column<string>(type: "text", nullable: false),
                    name_en = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    name_fr = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    name_ar = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    name_de = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    icon = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    color = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    is_active = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    display_order = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_nutrition_subcategories_config", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "outbox_messages",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    event_type = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    aggregate_type = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    aggregate_id = table.Column<Guid>(type: "uuid", nullable: false),
                    payload_json = table.Column<string>(type: "jsonb", nullable: false),
                    correlation_id = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    idempotency_key = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    occurred_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    next_attempt_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    published_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    processed_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    retry_count = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    locked_by = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    locked_until = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    last_error = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    dead_lettered_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_outbox_messages", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "provider_service_presets",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    provider_category = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    code = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    name_en = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    name_fr = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    name_ar = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    name_de = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    description_en = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    description_fr = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    description_ar = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    description_de = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    price = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    price_type = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false, defaultValue: "fixed"),
                    currency = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false, defaultValue: "TND"),
                    duration_minutes = table.Column<int>(type: "integer", nullable: true),
                    service_location = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false, defaultValue: "home"),
                    requires_prescription = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    is_urgent = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    requires_medical_history = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    type_config = table.Column<string>(type: "jsonb", nullable: true),
                    is_active = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    display_order = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_provider_service_presets", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "service_categories_config",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    code = table.Column<string>(type: "text", nullable: false),
                    name_en = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    name_fr = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    name_ar = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    name_de = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    description_en = table.Column<string>(type: "text", nullable: true),
                    description_fr = table.Column<string>(type: "text", nullable: true),
                    description_ar = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    description_de = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    display_group = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    icon = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    color = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    badge = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    default_commission_rate = table.Column<decimal>(type: "numeric(5,2)", precision: 5, scale: 2, nullable: false, defaultValue: 15.00m),
                    min_price = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: true),
                    max_price = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: true),
                    is_active = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    display_order = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_service_categories_config", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "stored_files",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    use_case = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: false),
                    category = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    visibility = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    scan_status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    scan_verdict = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    scan_engine = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    scan_engine_version = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    bucket = table.Column<string>(type: "character varying(63)", maxLength: 63, nullable: false),
                    object_key = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: false),
                    object_version_id = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    staging_bucket = table.Column<string>(type: "character varying(63)", maxLength: 63, nullable: false),
                    staging_object_key = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: false),
                    quarantine_bucket = table.Column<string>(type: "character varying(63)", maxLength: 63, nullable: true),
                    quarantine_object_key = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: true),
                    original_file_name = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    declared_content_type = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    detected_content_type = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    size_bytes = table.Column<long>(type: "bigint", nullable: false),
                    sha256 = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    etag = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    owner_user_id = table.Column<Guid>(type: "uuid", nullable: true),
                    owner_role = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    related_patient_id = table.Column<Guid>(type: "uuid", nullable: true),
                    related_provider_id = table.Column<Guid>(type: "uuid", nullable: true),
                    related_service_id = table.Column<Guid>(type: "uuid", nullable: true),
                    related_booking_id = table.Column<Guid>(type: "uuid", nullable: true),
                    related_application_id = table.Column<Guid>(type: "uuid", nullable: true),
                    retention_policy = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    retention_expires_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    ready_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    rejection_reason = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_stored_files", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "system_settings",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    setting_key = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    setting_value = table.Column<string>(type: "text", nullable: true),
                    setting_type = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false, defaultValue: "string"),
                    description = table.Column<string>(type: "text", nullable: true),
                    is_public = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    updated_by = table.Column<Guid>(type: "uuid", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_system_settings", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    email = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    email_verified = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    email_verified_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    password_hash = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    role = table.Column<string>(type: "text", nullable: false, defaultValue: "patient"),
                    is_active = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    is_suspended = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    suspended_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    suspended_reason = table.Column<string>(type: "text", nullable: true),
                    phone = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: true),
                    phone_verified = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    phone_verified_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    two_factor_enabled = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    two_factor_secret = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    failed_login_attempts = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    locked_until = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    password_changed_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    preferred_language = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false, defaultValue: "fr"),
                    timezone = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false, defaultValue: "Europe/Paris"),
                    last_login_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    last_login_ip = table.Column<string>(type: "character varying(45)", maxLength: 45, nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    deleted_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "veterinary_animal_types_config",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    code = table.Column<string>(type: "text", nullable: false),
                    name_en = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    name_fr = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    name_ar = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    name_de = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    icon = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    color = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    is_active = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    display_order = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_veterinary_animal_types_config", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "file_access_audit",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    file_id = table.Column<Guid>(type: "uuid", nullable: false),
                    actor_user_id = table.Column<Guid>(type: "uuid", nullable: true),
                    actor_role = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    action = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    outcome = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    ip_address = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    user_agent = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    correlation_id = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    details_json = table.Column<string>(type: "jsonb", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_file_access_audit", x => x.id);
                    table.ForeignKey(
                        name: "FK_file_access_audit_stored_files_file_id",
                        column: x => x.file_id,
                        principalTable: "stored_files",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "email_verification_tokens",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    email = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    token_hash = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    expires_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    verified_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_email_verification_tokens", x => x.id);
                    table.ForeignKey(
                        name: "FK_email_verification_tokens_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "login_otp_challenges",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    channel = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    destination_hash = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    code_hash = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    expires_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    consumed_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    failed_attempts = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    last_sent_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ip_address = table.Column<string>(type: "character varying(45)", maxLength: 45, nullable: true),
                    user_agent = table.Column<string>(type: "text", nullable: true),
                    device_fingerprint = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_login_otp_challenges", x => x.id);
                    table.ForeignKey(
                        name: "FK_login_otp_challenges_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "password_reset_tokens",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    token_hash = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    expires_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    used_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_password_reset_tokens", x => x.id);
                    table.ForeignKey(
                        name: "FK_password_reset_tokens_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "patients",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    first_name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    last_name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    date_of_birth = table.Column<DateOnly>(type: "date", nullable: true),
                    gender = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    address_line1 = table.Column<string>(type: "text", nullable: true),
                    address_line2 = table.Column<string>(type: "text", nullable: true),
                    city = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    state_province = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    postal_code = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    country_code = table.Column<string>(type: "character(2)", fixedLength: true, maxLength: 2, nullable: false, defaultValue: "TN"),
                    latitude = table.Column<decimal>(type: "numeric(10,8)", precision: 10, scale: 8, nullable: true),
                    longitude = table.Column<decimal>(type: "numeric(11,8)", precision: 11, scale: 8, nullable: true),
                    emergency_contact_name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    emergency_contact_phone = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: true),
                    emergency_contact_relationship = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    blood_type = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true),
                    medical_conditions = table.Column<string>(type: "text", nullable: true),
                    allergies = table.Column<string>(type: "text", nullable: true),
                    current_medications = table.Column<string>(type: "text", nullable: true),
                    medical_notes = table.Column<string>(type: "text", nullable: true),
                    insurance_provider = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    insurance_policy_number = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    insurance_expiry_date = table.Column<DateOnly>(type: "date", nullable: true),
                    avatar_file_id = table.Column<Guid>(type: "uuid", nullable: true),
                    bio = table.Column<string>(type: "text", nullable: true),
                    preferred_communication = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true, defaultValue: "App"),
                    marketing_consent = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    data_sharing_consent = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    total_bookings = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    completed_bookings = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    cancelled_bookings = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    total_spent = table.Column<decimal>(type: "numeric(12,2)", precision: 12, scale: 2, nullable: false, defaultValue: 0.00m),
                    profile_completed = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    onboarding_completed_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    deleted_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_patients", x => x.id);
                    table.ForeignKey(
                        name: "FK_patients_stored_files_avatar_file_id",
                        column: x => x.avatar_file_id,
                        principalTable: "stored_files",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_patients_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "providers",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    service_category = table.Column<string>(type: "text", nullable: false),
                    nutrition_provider_subtype = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    is_individual = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    business_name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    legal_name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    tax_id = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    first_name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    last_name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    license_number = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    license_issuing_authority = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    license_expiry_date = table.Column<DateOnly>(type: "date", nullable: true),
                    specializations = table.Column<List<string>>(type: "text[]", nullable: false),
                    years_of_experience = table.Column<int>(type: "integer", nullable: false),
                    education = table.Column<string>(type: "text", nullable: true),
                    certifications = table.Column<List<string>>(type: "text[]", nullable: false),
                    languages_spoken = table.Column<List<string>>(type: "text[]", nullable: false, defaultValueSql: "ARRAY['fr']"),
                    bio = table.Column<string>(type: "text", nullable: true),
                    short_description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    address_line1 = table.Column<string>(type: "text", nullable: true),
                    address_line2 = table.Column<string>(type: "text", nullable: true),
                    city = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    state_province = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    postal_code = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    country_code = table.Column<string>(type: "character(2)", fixedLength: true, maxLength: 2, nullable: false, defaultValue: "TN"),
                    latitude = table.Column<decimal>(type: "numeric(10,8)", precision: 10, scale: 8, nullable: true),
                    longitude = table.Column<decimal>(type: "numeric(11,8)", precision: 11, scale: 8, nullable: true),
                    service_radius_km = table.Column<int>(type: "integer", nullable: false, defaultValue: 20),
                    serves_at_home = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    serves_at_clinic = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    clinic_address = table.Column<string>(type: "text", nullable: true),
                    avatar_file_id = table.Column<Guid>(type: "uuid", nullable: true),
                    cover_image_url = table.Column<string>(type: "text", nullable: true),
                    gallery_urls = table.Column<List<string>>(type: "text[]", nullable: false),
                    video_intro_url = table.Column<string>(type: "text", nullable: true),
                    rating_average = table.Column<decimal>(type: "numeric(3,2)", precision: 3, scale: 2, nullable: false, defaultValue: 0.00m),
                    rating_count = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    rating_professionalism = table.Column<decimal>(type: "numeric(3,2)", precision: 3, scale: 2, nullable: false, defaultValue: 0.00m),
                    rating_punctuality = table.Column<decimal>(type: "numeric(3,2)", precision: 3, scale: 2, nullable: false, defaultValue: 0.00m),
                    rating_quality = table.Column<decimal>(type: "numeric(3,2)", precision: 3, scale: 2, nullable: false, defaultValue: 0.00m),
                    total_bookings = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    completed_bookings = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    cancelled_bookings = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    no_show_count = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    total_revenue = table.Column<decimal>(type: "numeric(12,2)", precision: 12, scale: 2, nullable: false, defaultValue: 0.00m),
                    available_balance = table.Column<decimal>(type: "numeric(12,2)", precision: 12, scale: 2, nullable: false, defaultValue: 0.00m),
                    response_rate = table.Column<decimal>(type: "numeric(5,2)", precision: 5, scale: 2, nullable: false, defaultValue: 100.00m),
                    response_time_minutes = table.Column<int>(type: "integer", nullable: false, defaultValue: 60),
                    is_verified = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    verification_consent_given = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    verification_status = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false, defaultValue: "not_requested"),
                    verification_requested_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    verification_reviewed_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    verified_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    verified_by = table.Column<Guid>(type: "uuid", nullable: true),
                    is_approved = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    approved_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    approved_by = table.Column<Guid>(type: "uuid", nullable: true),
                    rejection_reason = table.Column<string>(type: "text", nullable: true),
                    subscription_tier = table.Column<string>(type: "text", nullable: false, defaultValue: "free"),
                    subscription_expires_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    commission_rate = table.Column<decimal>(type: "numeric(5,2)", precision: 5, scale: 2, nullable: false, defaultValue: 15.00m),
                    stripe_account_id = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    stripe_account_status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    bank_name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    bank_account_number = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    bank_routing_number = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    timezone = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false, defaultValue: "Africa/Tunis"),
                    instant_booking_enabled = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    auto_accept_bookings = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    min_booking_notice_hours = table.Column<int>(type: "integer", nullable: false, defaultValue: 2),
                    max_booking_advance_days = table.Column<int>(type: "integer", nullable: false, defaultValue: 365),
                    cancellation_policy = table.Column<string>(type: "text", nullable: true),
                    is_available = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    availability_status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false, defaultValue: "available"),
                    vacation_start_date = table.Column<DateOnly>(type: "date", nullable: true),
                    vacation_end_date = table.Column<DateOnly>(type: "date", nullable: true),
                    profile_completed = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    onboarding_step = table.Column<int>(type: "integer", nullable: false, defaultValue: 1),
                    featured = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    featured_until = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    deleted_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_providers", x => x.id);
                    table.CheckConstraint("ck_providers_verification_status", "verification_status IN ('not_requested', 'requested', 'ai_prechecked', 'approved', 'rejected')");
                    table.CheckConstraint("ck_providers_verified_requires_approved_status", "is_verified = FALSE OR verification_status = 'approved'");
                    table.ForeignKey(
                        name: "FK_providers_stored_files_avatar_file_id",
                        column: x => x.avatar_file_id,
                        principalTable: "stored_files",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_providers_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "push_tokens",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    token = table.Column<string>(type: "text", nullable: false),
                    platform = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    device_id = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    is_active = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_push_tokens", x => x.id);
                    table.ForeignKey(
                        name: "FK_push_tokens_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "support_tickets",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    ticket_number = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    category = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    subject = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    description = table.Column<string>(type: "text", nullable: false),
                    priority = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false, defaultValue: "normal"),
                    status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false, defaultValue: "open"),
                    assigned_to = table.Column<Guid>(type: "uuid", nullable: true),
                    assigned_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    resolution = table.Column<string>(type: "text", nullable: true),
                    resolved_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    booking_id = table.Column<Guid>(type: "uuid", nullable: true),
                    satisfaction_rating = table.Column<int>(type: "integer", nullable: true),
                    satisfaction_feedback = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_support_tickets", x => x.id);
                    table.ForeignKey(
                        name: "FK_support_tickets_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "user_behavior",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    user_id = table.Column<Guid>(type: "uuid", nullable: true),
                    session_id = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    action = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    ip_address = table.Column<string>(type: "character varying(45)", maxLength: 45, nullable: true),
                    user_agent = table.Column<string>(type: "text", nullable: true),
                    device_fingerprint = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    country_code = table.Column<string>(type: "character(2)", fixedLength: true, maxLength: 2, nullable: true),
                    city = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    metadata = table.Column<string>(type: "jsonb", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_behavior", x => x.id);
                    table.ForeignKey(
                        name: "FK_user_behavior_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "user_sessions",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    token_hash = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    refresh_token_hash = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    ip_address = table.Column<string>(type: "character varying(45)", maxLength: 45, nullable: true),
                    user_agent = table.Column<string>(type: "text", nullable: true),
                    device_fingerprint = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    device_type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    is_active = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    expires_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    revoked_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_sessions", x => x.id);
                    table.ForeignKey(
                        name: "FK_user_sessions_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "activity_tracking",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    patient_id = table.Column<Guid>(type: "uuid", nullable: false),
                    date = table.Column<DateOnly>(type: "date", nullable: false),
                    steps = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    distance_km = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false, defaultValue: 0.00m),
                    calories_burned = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    active_minutes = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    floors_climbed = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    source = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_activity_tracking", x => x.id);
                    table.ForeignKey(
                        name: "FK_activity_tracking_patients_patient_id",
                        column: x => x.patient_id,
                        principalTable: "patients",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "discount_code_usage",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    discount_code_id = table.Column<Guid>(type: "uuid", nullable: false),
                    booking_id = table.Column<Guid>(type: "uuid", nullable: false),
                    patient_id = table.Column<Guid>(type: "uuid", nullable: false),
                    discount_amount = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_discount_code_usage", x => x.id);
                    table.ForeignKey(
                        name: "FK_discount_code_usage_discount_codes_discount_code_id",
                        column: x => x.discount_code_id,
                        principalTable: "discount_codes",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_discount_code_usage_patients_patient_id",
                        column: x => x.patient_id,
                        principalTable: "patients",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "family_access",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    patient_id = table.Column<Guid>(type: "uuid", nullable: false),
                    granted_to_user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    can_book = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    can_view_history = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    can_view_medical = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    can_manage_payments = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    is_active = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_family_access", x => x.id);
                    table.ForeignKey(
                        name: "FK_family_access_patients_patient_id",
                        column: x => x.patient_id,
                        principalTable: "patients",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_family_access_users_granted_to_user_id",
                        column: x => x.granted_to_user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "family_members",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    patient_id = table.Column<Guid>(type: "uuid", nullable: false),
                    first_name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    last_name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    relationship = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    date_of_birth = table.Column<DateOnly>(type: "date", nullable: true),
                    gender = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    phone = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: true),
                    email = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    blood_type = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true),
                    medical_conditions = table.Column<string>(type: "text", nullable: true),
                    allergies = table.Column<string>(type: "text", nullable: true),
                    current_medications = table.Column<string>(type: "text", nullable: true),
                    profile_picture_url = table.Column<string>(type: "text", nullable: true),
                    can_book_for = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    can_view_history = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_family_members", x => x.id);
                    table.ForeignKey(
                        name: "FK_family_members_patients_patient_id",
                        column: x => x.patient_id,
                        principalTable: "patients",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "hydration_tracking",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    patient_id = table.Column<Guid>(type: "uuid", nullable: false),
                    date = table.Column<DateOnly>(type: "date", nullable: false),
                    water_ml = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    goal_ml = table.Column<int>(type: "integer", nullable: false, defaultValue: 2000),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_hydration_tracking", x => x.id);
                    table.ForeignKey(
                        name: "FK_hydration_tracking_patients_patient_id",
                        column: x => x.patient_id,
                        principalTable: "patients",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "nutrition_profiles",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    patient_id = table.Column<Guid>(type: "uuid", nullable: false),
                    height_cm = table.Column<decimal>(type: "numeric(5,2)", precision: 5, scale: 2, nullable: true),
                    weight_kg = table.Column<decimal>(type: "numeric(5,2)", precision: 5, scale: 2, nullable: true),
                    target_weight_kg = table.Column<decimal>(type: "numeric(5,2)", precision: 5, scale: 2, nullable: true),
                    activity_level = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    goal = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: true),
                    daily_calories = table.Column<int>(type: "integer", nullable: true),
                    daily_protein_g = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: true),
                    daily_carbs_g = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: true),
                    daily_fat_g = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: true),
                    daily_fiber_g = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: true),
                    daily_water_ml = table.Column<int>(type: "integer", nullable: false, defaultValue: 2000),
                    dietary_restrictions = table.Column<List<string>>(type: "text[]", nullable: false),
                    food_allergies = table.Column<List<string>>(type: "text[]", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_nutrition_profiles", x => x.id);
                    table.ForeignKey(
                        name: "FK_nutrition_profiles_patients_patient_id",
                        column: x => x.patient_id,
                        principalTable: "patients",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "nutrition_tracking",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    patient_id = table.Column<Guid>(type: "uuid", nullable: false),
                    date = table.Column<DateOnly>(type: "date", nullable: false),
                    meal_type = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    food_name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    calories = table.Column<int>(type: "integer", nullable: true),
                    protein_g = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: true),
                    carbs_g = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: true),
                    fat_g = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: true),
                    fiber_g = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: true),
                    sugar_g = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: true),
                    sodium_mg = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: true),
                    notes = table.Column<string>(type: "text", nullable: true),
                    photo_url = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_nutrition_tracking", x => x.id);
                    table.ForeignKey(
                        name: "FK_nutrition_tracking_patients_patient_id",
                        column: x => x.patient_id,
                        principalTable: "patients",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "patient_badges",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    patient_id = table.Column<Guid>(type: "uuid", nullable: false),
                    badge_id = table.Column<Guid>(type: "uuid", nullable: false),
                    earned_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_patient_badges", x => x.id);
                    table.ForeignKey(
                        name: "FK_patient_badges_badges_badge_id",
                        column: x => x.badge_id,
                        principalTable: "badges",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_patient_badges_patients_patient_id",
                        column: x => x.patient_id,
                        principalTable: "patients",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "patient_preferences",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    patient_id = table.Column<Guid>(type: "uuid", nullable: false),
                    email_notifications = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    sms_notifications = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    push_notifications = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    marketing_emails = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    auto_validation_enabled = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    validation_reminder_hours = table.Column<int>(type: "integer", nullable: false, defaultValue: 24),
                    share_with_family = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    allow_provider_messages = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_patient_preferences", x => x.id);
                    table.ForeignKey(
                        name: "FK_patient_preferences_patients_patient_id",
                        column: x => x.patient_id,
                        principalTable: "patients",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "patient_rewards",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    patient_id = table.Column<Guid>(type: "uuid", nullable: false),
                    total_points = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    available_points = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    redeemed_points = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    current_streak = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    longest_streak = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    last_activity_date = table.Column<DateOnly>(type: "date", nullable: true),
                    level = table.Column<int>(type: "integer", nullable: false, defaultValue: 1),
                    level_name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false, defaultValue: "Bronze"),
                    total_bookings = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    total_reviews = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    total_referrals = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_patient_rewards", x => x.id);
                    table.ForeignKey(
                        name: "FK_patient_rewards_patients_patient_id",
                        column: x => x.patient_id,
                        principalTable: "patients",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "referrals",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    referrer_id = table.Column<Guid>(type: "uuid", nullable: false),
                    referred_user_id = table.Column<Guid>(type: "uuid", nullable: true),
                    referral_code = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false, defaultValue: "pending"),
                    referrer_points = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    referrer_rewarded_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    referred_points = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    referred_rewarded_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_referrals", x => x.id);
                    table.ForeignKey(
                        name: "FK_referrals_patients_referrer_id",
                        column: x => x.referrer_id,
                        principalTable: "patients",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_referrals_users_referred_user_id",
                        column: x => x.referred_user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "vital_signs",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    patient_id = table.Column<Guid>(type: "uuid", nullable: false),
                    measured_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    blood_pressure_systolic = table.Column<int>(type: "integer", nullable: true),
                    blood_pressure_diastolic = table.Column<int>(type: "integer", nullable: true),
                    heart_rate = table.Column<int>(type: "integer", nullable: true),
                    temperature_celsius = table.Column<decimal>(type: "numeric(4,2)", precision: 4, scale: 2, nullable: true),
                    oxygen_saturation = table.Column<int>(type: "integer", nullable: true),
                    blood_glucose = table.Column<decimal>(type: "numeric(5,2)", precision: 5, scale: 2, nullable: true),
                    weight_kg = table.Column<decimal>(type: "numeric(5,2)", precision: 5, scale: 2, nullable: true),
                    notes = table.Column<string>(type: "text", nullable: true),
                    measured_by = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_vital_signs", x => x.id);
                    table.ForeignKey(
                        name: "FK_vital_signs_patients_patient_id",
                        column: x => x.patient_id,
                        principalTable: "patients",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "conversations",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    patient_id = table.Column<Guid>(type: "uuid", nullable: false),
                    provider_id = table.Column<Guid>(type: "uuid", nullable: false),
                    is_active = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    last_message_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    last_message_preview = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    last_message_by = table.Column<Guid>(type: "uuid", nullable: true),
                    patient_unread_count = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    provider_unread_count = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_conversations", x => x.id);
                    table.ForeignKey(
                        name: "FK_conversations_patients_patient_id",
                        column: x => x.patient_id,
                        principalTable: "patients",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_conversations_providers_provider_id",
                        column: x => x.provider_id,
                        principalTable: "providers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "insurance_claims",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    claim_number = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    provider_id = table.Column<Guid>(type: "uuid", nullable: false),
                    booking_id = table.Column<Guid>(type: "uuid", nullable: true),
                    patient_name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    patient_insurance_provider = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    patient_insurance_number = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    service_date = table.Column<DateOnly>(type: "date", nullable: false),
                    service_description = table.Column<string>(type: "text", nullable: false),
                    diagnosis_codes = table.Column<List<string>>(type: "text[]", nullable: true),
                    procedure_codes = table.Column<List<string>>(type: "text[]", nullable: true),
                    claimed_amount = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    approved_amount = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: true),
                    paid_amount = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: true),
                    status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false, defaultValue: "draft"),
                    submitted_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    reviewed_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    approved_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    paid_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    rejection_reason = table.Column<string>(type: "text", nullable: true),
                    reviewer_notes = table.Column<string>(type: "text", nullable: true),
                    invoice_url = table.Column<string>(type: "text", nullable: true),
                    medical_report_url = table.Column<string>(type: "text", nullable: true),
                    supporting_documents = table.Column<List<string>>(type: "text[]", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_insurance_claims", x => x.id);
                    table.ForeignKey(
                        name: "FK_insurance_claims_providers_provider_id",
                        column: x => x.provider_id,
                        principalTable: "providers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "insurance_coverages",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    provider_id = table.Column<Guid>(type: "uuid", nullable: false),
                    category = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_insurance_coverages", x => x.id);
                    table.ForeignKey(
                        name: "FK_insurance_coverages_providers_provider_id",
                        column: x => x.provider_id,
                        principalTable: "providers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "insurance_documents",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    provider_id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    size = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    url = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_insurance_documents", x => x.id);
                    table.ForeignKey(
                        name: "FK_insurance_documents_providers_provider_id",
                        column: x => x.provider_id,
                        principalTable: "providers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "marketing_campaigns",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    provider_id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    campaign_type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    objective = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false, defaultValue: "draft"),
                    start_date = table.Column<DateOnly>(type: "date", nullable: true),
                    end_date = table.Column<DateOnly>(type: "date", nullable: true),
                    budget = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: true),
                    spent_amount = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false, defaultValue: 0.00m),
                    target_age_min = table.Column<int>(type: "integer", nullable: true),
                    target_age_max = table.Column<int>(type: "integer", nullable: true),
                    target_gender = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    target_locations = table.Column<List<string>>(type: "text[]", nullable: true),
                    target_interests = table.Column<List<string>>(type: "text[]", nullable: true),
                    headline = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    description = table.Column<string>(type: "text", nullable: true),
                    cta_text = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    image_url = table.Column<string>(type: "text", nullable: true),
                    landing_url = table.Column<string>(type: "text", nullable: true),
                    impressions = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    clicks = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    conversions = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_marketing_campaigns", x => x.id);
                    table.ForeignKey(
                        name: "FK_marketing_campaigns_providers_provider_id",
                        column: x => x.provider_id,
                        principalTable: "providers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "patient_favorites",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    patient_id = table.Column<Guid>(type: "uuid", nullable: false),
                    provider_id = table.Column<Guid>(type: "uuid", nullable: false),
                    notes = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_patient_favorites", x => x.id);
                    table.ForeignKey(
                        name: "FK_patient_favorites_patients_patient_id",
                        column: x => x.patient_id,
                        principalTable: "patients",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_patient_favorites_providers_provider_id",
                        column: x => x.provider_id,
                        principalTable: "providers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "payouts",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    payout_number = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    provider_id = table.Column<Guid>(type: "uuid", nullable: false),
                    amount = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    currency = table.Column<string>(type: "character(3)", fixedLength: true, maxLength: 3, nullable: false, defaultValue: "TND"),
                    status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false, defaultValue: "pending"),
                    payout_method = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    bank_account_last_four = table.Column<string>(type: "character varying(4)", maxLength: 4, nullable: true),
                    gateway = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    gateway_payout_id = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    gateway_response = table.Column<string>(type: "jsonb", nullable: true),
                    scheduled_for = table.Column<DateOnly>(type: "date", nullable: true),
                    processed_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    completed_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    failure_reason = table.Column<string>(type: "text", nullable: true),
                    notes = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_payouts", x => x.id);
                    table.ForeignKey(
                        name: "FK_payouts_providers_provider_id",
                        column: x => x.provider_id,
                        principalTable: "providers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "provider_availability_history",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    provider_id = table.Column<Guid>(type: "uuid", nullable: false),
                    is_available = table.Column<bool>(type: "boolean", nullable: false),
                    status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    status_changed_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    reason = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    changed_by = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_provider_availability_history", x => x.id);
                    table.ForeignKey(
                        name: "FK_provider_availability_history_providers_provider_id",
                        column: x => x.provider_id,
                        principalTable: "providers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_provider_availability_history_users_changed_by",
                        column: x => x.changed_by,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "provider_certifications",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    provider_id = table.Column<Guid>(type: "uuid", nullable: false),
                    certification_name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    issuing_organization = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    certification_number = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    issue_date = table.Column<DateOnly>(type: "date", nullable: true),
                    expiry_date = table.Column<DateOnly>(type: "date", nullable: true),
                    file_id = table.Column<Guid>(type: "uuid", nullable: true),
                    is_verified = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    verified_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_provider_certifications", x => x.id);
                    table.ForeignKey(
                        name: "FK_provider_certifications_providers_provider_id",
                        column: x => x.provider_id,
                        principalTable: "providers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_provider_certifications_stored_files_file_id",
                        column: x => x.file_id,
                        principalTable: "stored_files",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "provider_documents",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    provider_id = table.Column<Guid>(type: "uuid", nullable: false),
                    document_type = table.Column<string>(type: "text", nullable: false),
                    document_name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    file_id = table.Column<Guid>(type: "uuid", nullable: false),
                    file_size_bytes = table.Column<int>(type: "integer", nullable: true),
                    mime_type = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    extracted_data = table.Column<string>(type: "jsonb", nullable: true),
                    is_verified = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    verified_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    verified_by = table.Column<Guid>(type: "uuid", nullable: true),
                    verification_notes = table.Column<string>(type: "text", nullable: true),
                    issue_date = table.Column<DateOnly>(type: "date", nullable: true),
                    expiry_date = table.Column<DateOnly>(type: "date", nullable: true),
                    is_expired = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_provider_documents", x => x.id);
                    table.ForeignKey(
                        name: "FK_provider_documents_providers_provider_id",
                        column: x => x.provider_id,
                        principalTable: "providers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_provider_documents_stored_files_file_id",
                        column: x => x.file_id,
                        principalTable: "stored_files",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "provider_preferences",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    provider_id = table.Column<Guid>(type: "uuid", nullable: false),
                    email_notifications = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    sms_notifications = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    push_notifications = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    marketing_emails = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    allow_patient_messages = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    profile_visibility = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false, defaultValue: "public"),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_provider_preferences", x => x.id);
                    table.ForeignKey(
                        name: "FK_provider_preferences_providers_provider_id",
                        column: x => x.provider_id,
                        principalTable: "providers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "provider_unavailability",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    provider_id = table.Column<Guid>(type: "uuid", nullable: false),
                    start_datetime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    end_datetime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    is_all_day = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    is_recurring = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    recurrence_rule = table.Column<string>(type: "text", nullable: true),
                    reason = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    notes = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_provider_unavailability", x => x.id);
                    table.ForeignKey(
                        name: "FK_provider_unavailability_providers_provider_id",
                        column: x => x.provider_id,
                        principalTable: "providers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "provider_wallet_top_ups",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    reference_number = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    provider_id = table.Column<Guid>(type: "uuid", nullable: false),
                    initiated_amount = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    credited_amount = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: true),
                    currency = table.Column<string>(type: "character(3)", fixedLength: true, maxLength: 3, nullable: false, defaultValue: "TND"),
                    method_type = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    provider_submitted_reference = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: true),
                    evidence_url = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    status = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false, defaultValue: "credited"),
                    initiated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    submitted_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    credited_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    failed_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    cancelled_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    expires_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    expired_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_provider_wallet_top_ups", x => x.id);
                    table.CheckConstraint("ck_provider_wallet_top_ups_credited_amount_positive", "credited_amount IS NULL OR credited_amount > 0");
                    table.CheckConstraint("ck_provider_wallet_top_ups_initiated_amount_positive", "initiated_amount > 0");
                    table.CheckConstraint("ck_provider_wallet_top_ups_method_type", "method_type IN ('manual_bank_transfer', 'manual_d17')");
                    table.CheckConstraint("ck_provider_wallet_top_ups_status", "status IN ('credited', 'failed', 'expired', 'cancelled')");
                    table.ForeignKey(
                        name: "FK_provider_wallet_top_ups_providers_provider_id",
                        column: x => x.provider_id,
                        principalTable: "providers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "services",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    provider_id = table.Column<Guid>(type: "uuid", nullable: false),
                    category = table.Column<string>(type: "text", nullable: false),
                    name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    description = table.Column<string>(type: "text", nullable: true),
                    short_description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    price = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    price_type = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false, defaultValue: "fixed"),
                    currency = table.Column<string>(type: "character(3)", fixedLength: true, maxLength: 3, nullable: false, defaultValue: "TND"),
                    min_price = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: true),
                    max_price = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: true),
                    duration_minutes = table.Column<int>(type: "integer", nullable: true),
                    min_duration_minutes = table.Column<int>(type: "integer", nullable: true),
                    max_duration_minutes = table.Column<int>(type: "integer", nullable: true),
                    service_location = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false, defaultValue: "home"),
                    is_active = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    is_featured = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    requires_prescription = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    is_urgent = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    requires_medical_history = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    age_restriction_min = table.Column<int>(type: "integer", nullable: true),
                    age_restriction_max = table.Column<int>(type: "integer", nullable: true),
                    main_image_file_id = table.Column<Guid>(type: "uuid", nullable: true),
                    booking_count = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    available_quantity = table.Column<int>(type: "integer", nullable: true),
                    metadata = table.Column<string>(type: "jsonb", nullable: true, defaultValueSql: "'{}'"),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    deleted_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_services", x => x.id);
                    table.ForeignKey(
                        name: "FK_services_providers_provider_id",
                        column: x => x.provider_id,
                        principalTable: "providers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_services_stored_files_main_image_file_id",
                        column: x => x.main_image_file_id,
                        principalTable: "stored_files",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "subscriptions",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    provider_id = table.Column<Guid>(type: "uuid", nullable: false),
                    tier = table.Column<string>(type: "text", nullable: false),
                    status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false, defaultValue: "active"),
                    start_date = table.Column<DateOnly>(type: "date", nullable: false),
                    end_date = table.Column<DateOnly>(type: "date", nullable: true),
                    trial_end_date = table.Column<DateOnly>(type: "date", nullable: true),
                    next_billing_date = table.Column<DateOnly>(type: "date", nullable: true),
                    cancelled_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    monthly_price = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    currency = table.Column<string>(type: "character(3)", fixedLength: true, maxLength: 3, nullable: false, defaultValue: "TND"),
                    commission_rate = table.Column<decimal>(type: "numeric(5,2)", precision: 5, scale: 2, nullable: false),
                    marketing_budget = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false, defaultValue: 0.00m),
                    priority_listing = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    advanced_analytics = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    api_access = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    dedicated_support = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    auto_renew = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    gateway_subscription_id = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_subscriptions", x => x.id);
                    table.ForeignKey(
                        name: "FK_subscriptions_providers_provider_id",
                        column: x => x.provider_id,
                        principalTable: "providers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "wallets",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    provider_id = table.Column<Guid>(type: "uuid", nullable: false),
                    available_balance = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false, defaultValue: 0.00m),
                    reserved_balance = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false, defaultValue: 0.00m),
                    usable_balance = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false, defaultValue: 0.00m),
                    currency = table.Column<string>(type: "character(3)", fixedLength: true, maxLength: 3, nullable: false, defaultValue: "TND"),
                    last_rebuilt_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_wallets", x => x.id);
                    table.CheckConstraint("ck_wallets_non_negative", "available_balance >= 0 AND reserved_balance >= 0 AND usable_balance >= 0 AND usable_balance = available_balance");
                    table.ForeignKey(
                        name: "FK_wallets_providers_provider_id",
                        column: x => x.provider_id,
                        principalTable: "providers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "support_ticket_messages",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    ticket_id = table.Column<Guid>(type: "uuid", nullable: false),
                    sender_id = table.Column<Guid>(type: "uuid", nullable: false),
                    message = table.Column<string>(type: "text", nullable: false),
                    attachment_urls = table.Column<List<string>>(type: "text[]", nullable: true),
                    is_internal = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_support_ticket_messages", x => x.id);
                    table.ForeignKey(
                        name: "FK_support_ticket_messages_support_tickets_ticket_id",
                        column: x => x.ticket_id,
                        principalTable: "support_tickets",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_support_ticket_messages_users_sender_id",
                        column: x => x.sender_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "messages",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    conversation_id = table.Column<Guid>(type: "uuid", nullable: false),
                    sender_id = table.Column<Guid>(type: "uuid", nullable: false),
                    message_type = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false, defaultValue: "text"),
                    content = table.Column<string>(type: "text", nullable: false),
                    attachment_url = table.Column<string>(type: "text", nullable: true),
                    attachment_name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    attachment_size_bytes = table.Column<int>(type: "integer", nullable: true),
                    attachment_mime_type = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    latitude = table.Column<decimal>(type: "numeric(10,8)", precision: 10, scale: 8, nullable: true),
                    longitude = table.Column<decimal>(type: "numeric(11,8)", precision: 11, scale: 8, nullable: true),
                    is_read = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    read_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    metadata = table.Column<string>(type: "jsonb", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_messages", x => x.id);
                    table.ForeignKey(
                        name: "FK_messages_conversations_conversation_id",
                        column: x => x.conversation_id,
                        principalTable: "conversations",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_messages_users_sender_id",
                        column: x => x.sender_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "insurance_coverage_items",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    coverage_id = table.Column<Guid>(type: "uuid", nullable: false),
                    text = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    limit = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_insurance_coverage_items", x => x.id);
                    table.ForeignKey(
                        name: "FK_insurance_coverage_items_insurance_coverages_coverage_id",
                        column: x => x.coverage_id,
                        principalTable: "insurance_coverages",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "campaign_performance",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    campaign_id = table.Column<Guid>(type: "uuid", nullable: false),
                    date = table.Column<DateOnly>(type: "date", nullable: false),
                    impressions = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    clicks = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    conversions = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    spent_amount = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false, defaultValue: 0.00m),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_campaign_performance", x => x.id);
                    table.ForeignKey(
                        name: "FK_campaign_performance_marketing_campaigns_campaign_id",
                        column: x => x.campaign_id,
                        principalTable: "marketing_campaigns",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "bookings",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    booking_number = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    patient_id = table.Column<Guid>(type: "uuid", nullable: false),
                    provider_id = table.Column<Guid>(type: "uuid", nullable: false),
                    service_id = table.Column<Guid>(type: "uuid", nullable: false),
                    start_date = table.Column<DateOnly>(type: "date", nullable: false),
                    end_date = table.Column<DateOnly>(type: "date", nullable: false),
                    daily_start_time = table.Column<TimeOnly>(type: "time without time zone", nullable: false),
                    daily_end_time = table.Column<TimeOnly>(type: "time without time zone", nullable: true),
                    daily_duration_minutes = table.Column<int>(type: "integer", nullable: true),
                    timezone = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false, defaultValue: "Africa/Tunis"),
                    status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false, defaultValue: "Pending"),
                    payment_method = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false, defaultValue: "card"),
                    status_changed_by = table.Column<Guid>(type: "uuid", nullable: true),
                    status_change_reason = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    patient_name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    patient_phone = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: true),
                    patient_email = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    service_location = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    address_line1 = table.Column<string>(type: "text", nullable: true),
                    address_line2 = table.Column<string>(type: "text", nullable: true),
                    city = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    postal_code = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    latitude = table.Column<decimal>(type: "numeric(10,8)", precision: 10, scale: 8, nullable: true),
                    longitude = table.Column<decimal>(type: "numeric(11,8)", precision: 11, scale: 8, nullable: true),
                    address_instructions = table.Column<string>(type: "text", nullable: true),
                    prescription_file_id = table.Column<Guid>(type: "uuid", nullable: true),
                    patient_notes = table.Column<string>(type: "text", nullable: true),
                    symptoms = table.Column<string>(type: "text", nullable: true),
                    medical_history_shared = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    is_for_family_member = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    family_member_id = table.Column<Guid>(type: "uuid", nullable: true),
                    family_member_name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    family_member_age = table.Column<int>(type: "integer", nullable: true),
                    service_price = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    addons_price = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false, defaultValue: 0.00m),
                    discount_amount = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false, defaultValue: 0.00m),
                    discount_code = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    subtotal = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    platform_fee = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    tax_amount = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false, defaultValue: 0.00m),
                    total_amount = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    currency = table.Column<string>(type: "character(3)", fixedLength: true, maxLength: 3, nullable: false, defaultValue: "TND"),
                    commission_rate = table.Column<decimal>(type: "numeric(5,2)", precision: 5, scale: 2, nullable: false),
                    commission_amount = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    provider_amount = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    wallet_reserved_amount = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false, defaultValue: 0.00m),
                    wallet_reserved_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    wallet_reservation_released_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    wallet_settled_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    validation_required = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    validation_code = table.Column<string>(type: "character varying(6)", maxLength: 6, nullable: true),
                    validation_code_expires_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    validated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    settlement_completed_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    settlement_completed_by = table.Column<Guid>(type: "uuid", nullable: true),
                    validation_method = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    validation_attempts = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    auto_validate_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    provider_accepted_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    provider_departed_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    provider_arrived_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    service_started_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    service_completed_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    cancelled_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    cancelled_by = table.Column<Guid>(type: "uuid", nullable: true),
                    cancellation_reason = table.Column<string>(type: "text", nullable: true),
                    cancellation_fee = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: true),
                    rescheduled_from_id = table.Column<Guid>(type: "uuid", nullable: true),
                    reschedule_count = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    provider_notes = table.Column<string>(type: "text", nullable: true),
                    source = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false, defaultValue: "web"),
                    utm_source = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    utm_medium = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    utm_campaign = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    deleted_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_bookings", x => x.id);
                    table.CheckConstraint("ck_bookings_payment_method", "payment_method IN ('card', 'd17', 'cash')");
                    table.ForeignKey(
                        name: "FK_bookings_bookings_rescheduled_from_id",
                        column: x => x.rescheduled_from_id,
                        principalTable: "bookings",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_bookings_family_members_family_member_id",
                        column: x => x.family_member_id,
                        principalTable: "family_members",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_bookings_patients_patient_id",
                        column: x => x.patient_id,
                        principalTable: "patients",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_bookings_providers_provider_id",
                        column: x => x.provider_id,
                        principalTable: "providers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_bookings_services_service_id",
                        column: x => x.service_id,
                        principalTable: "services",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_bookings_users_cancelled_by",
                        column: x => x.cancelled_by,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_bookings_users_settlement_completed_by",
                        column: x => x.settlement_completed_by,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_bookings_users_status_changed_by",
                        column: x => x.status_changed_by,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "provider_schedules",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    provider_id = table.Column<Guid>(type: "uuid", nullable: false),
                    day_of_week = table.Column<int>(type: "integer", nullable: false),
                    start_time = table.Column<TimeOnly>(type: "time without time zone", nullable: false),
                    end_time = table.Column<TimeOnly>(type: "time without time zone", nullable: false),
                    is_available = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    service_id = table.Column<Guid>(type: "uuid", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_provider_schedules", x => x.id);
                    table.ForeignKey(
                        name: "FK_provider_schedules_providers_provider_id",
                        column: x => x.provider_id,
                        principalTable: "providers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_provider_schedules_services_service_id",
                        column: x => x.service_id,
                        principalTable: "services",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "service_addons",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    service_id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    description = table.Column<string>(type: "text", nullable: true),
                    price = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    duration_minutes = table.Column<int>(type: "integer", nullable: true),
                    icon = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    is_supplement = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    is_active = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    deleted_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_service_addons", x => x.id);
                    table.ForeignKey(
                        name: "FK_service_addons_services_service_id",
                        column: x => x.service_id,
                        principalTable: "services",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "service_photos",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    service_id = table.Column<Guid>(type: "uuid", nullable: false),
                    file_id = table.Column<Guid>(type: "uuid", nullable: false),
                    sort_order = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    is_main = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_service_photos", x => x.id);
                    table.ForeignKey(
                        name: "FK_service_photos_services_service_id",
                        column: x => x.service_id,
                        principalTable: "services",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_service_photos_stored_files_file_id",
                        column: x => x.file_id,
                        principalTable: "stored_files",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "subscription_payments",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    subscription_id = table.Column<Guid>(type: "uuid", nullable: false),
                    amount = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    currency = table.Column<string>(type: "character(3)", fixedLength: true, maxLength: 3, nullable: false, defaultValue: "TND"),
                    billing_period_start = table.Column<DateOnly>(type: "date", nullable: false),
                    billing_period_end = table.Column<DateOnly>(type: "date", nullable: false),
                    status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false, defaultValue: "pending"),
                    gateway_payment_id = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    gateway_response = table.Column<string>(type: "jsonb", nullable: true),
                    paid_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_subscription_payments", x => x.id);
                    table.ForeignKey(
                        name: "FK_subscription_payments_subscriptions_subscription_id",
                        column: x => x.subscription_id,
                        principalTable: "subscriptions",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ambulance_bookings",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    booking_id = table.Column<Guid>(type: "uuid", nullable: false),
                    service_type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    pickup_address = table.Column<string>(type: "text", nullable: false),
                    pickup_latitude = table.Column<decimal>(type: "numeric(10,8)", precision: 10, scale: 8, nullable: true),
                    pickup_longitude = table.Column<decimal>(type: "numeric(11,8)", precision: 11, scale: 8, nullable: true),
                    pickup_contact_name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    pickup_contact_phone = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: true),
                    destination_address = table.Column<string>(type: "text", nullable: false),
                    destination_latitude = table.Column<decimal>(type: "numeric(10,8)", precision: 10, scale: 8, nullable: true),
                    destination_longitude = table.Column<decimal>(type: "numeric(11,8)", precision: 11, scale: 8, nullable: true),
                    destination_facility_name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    patient_condition = table.Column<string>(type: "text", nullable: true),
                    requires_stretcher = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    requires_oxygen = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    requires_medical_staff = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    vehicle_type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    vehicle_registration = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    driver_name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    medic_name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    requested_pickup_time = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    actual_pickup_time = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    actual_arrival_time = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    estimated_distance_km = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: true),
                    actual_distance_km = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ambulance_bookings", x => x.id);
                    table.ForeignKey(
                        name: "FK_ambulance_bookings_bookings_booking_id",
                        column: x => x.booking_id,
                        principalTable: "bookings",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "booking_line_items",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    booking_id = table.Column<Guid>(type: "uuid", nullable: false),
                    service_id = table.Column<Guid>(type: "uuid", nullable: false),
                    service_name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    service_category = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    currency = table.Column<string>(type: "character(3)", fixedLength: true, maxLength: 3, nullable: false, defaultValue: "TND"),
                    quantity = table.Column<int>(type: "integer", nullable: false, defaultValue: 1),
                    unit_price = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    subtotal = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_booking_line_items", x => x.id);
                    table.ForeignKey(
                        name: "FK_booking_line_items_bookings_booking_id",
                        column: x => x.booking_id,
                        principalTable: "bookings",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_booking_line_items_services_service_id",
                        column: x => x.service_id,
                        principalTable: "services",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "booking_sessions",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    booking_id = table.Column<Guid>(type: "uuid", nullable: false),
                    provider_id = table.Column<Guid>(type: "uuid", nullable: false),
                    patient_id = table.Column<Guid>(type: "uuid", nullable: false),
                    scheduled_date = table.Column<DateOnly>(type: "date", nullable: false),
                    scheduled_start_time = table.Column<TimeOnly>(type: "time without time zone", nullable: false),
                    scheduled_end_time = table.Column<TimeOnly>(type: "time without time zone", nullable: true),
                    scheduled_duration_minutes = table.Column<int>(type: "integer", nullable: true),
                    timezone = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false, defaultValue: "Africa/Tunis"),
                    status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false, defaultValue: "Pending"),
                    provider_departed_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    provider_arrived_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    service_started_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    service_completed_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    verification_code = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: true),
                    verification_code_generated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    verification_code_expires_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    verification_attempts = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    verified_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    verification_method = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    cancelled_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    cancelled_by = table.Column<Guid>(type: "uuid", nullable: true),
                    cancellation_reason = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    no_show_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    no_show_reason = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    disputed_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    dispute_reason = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_booking_sessions", x => x.id);
                    table.ForeignKey(
                        name: "FK_booking_sessions_bookings_booking_id",
                        column: x => x.booking_id,
                        principalTable: "bookings",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_booking_sessions_patients_patient_id",
                        column: x => x.patient_id,
                        principalTable: "patients",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_booking_sessions_providers_provider_id",
                        column: x => x.provider_id,
                        principalTable: "providers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_booking_sessions_users_cancelled_by",
                        column: x => x.cancelled_by,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "booking_status_history",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    booking_id = table.Column<Guid>(type: "uuid", nullable: false),
                    previous_status = table.Column<string>(type: "text", nullable: true),
                    new_status = table.Column<string>(type: "text", nullable: false),
                    changed_by = table.Column<Guid>(type: "uuid", nullable: true),
                    change_reason = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    notes = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    latitude = table.Column<decimal>(type: "numeric(10,8)", precision: 10, scale: 8, nullable: true),
                    longitude = table.Column<decimal>(type: "numeric(11,8)", precision: 11, scale: 8, nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_booking_status_history", x => x.id);
                    table.ForeignKey(
                        name: "FK_booking_status_history_bookings_booking_id",
                        column: x => x.booking_id,
                        principalTable: "bookings",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_booking_status_history_users_changed_by",
                        column: x => x.changed_by,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "equipment_rentals",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    booking_id = table.Column<Guid>(type: "uuid", nullable: false),
                    equipment_name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    equipment_serial_number = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    rental_start_date = table.Column<DateOnly>(type: "date", nullable: false),
                    rental_end_date = table.Column<DateOnly>(type: "date", nullable: false),
                    actual_return_date = table.Column<DateOnly>(type: "date", nullable: true),
                    rental_duration_type = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false, defaultValue: "daily"),
                    period_rate = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    period_count = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    deposit_amount = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: true),
                    deposit_paid = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    deposit_returned = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    condition_at_pickup = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    condition_at_return = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    damage_notes = table.Column<string>(type: "text", nullable: true),
                    damage_fee = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: true),
                    pickup_photos = table.Column<List<string>>(type: "text[]", nullable: true),
                    return_photos = table.Column<List<string>>(type: "text[]", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_equipment_rentals", x => x.id);
                    table.ForeignKey(
                        name: "FK_equipment_rentals_bookings_booking_id",
                        column: x => x.booking_id,
                        principalTable: "bookings",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "funeral_bookings",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    booking_id = table.Column<Guid>(type: "uuid", nullable: false),
                    deceased_name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    deceased_age = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    deceased_birth_date = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    deceased_death_date = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    death_place = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    religion = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    contact_name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    contact_phone = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    contact_email = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    contact_relationship = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    ceremony_type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    ceremony_location = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    burial_type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    requires_repatriation = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    repatriation_country = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    special_requests = table.Column<string>(type: "text", nullable: true),
                    floral_service = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    transport_service = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    admin_assistance = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    grief_support = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_funeral_bookings", x => x.id);
                    table.ForeignKey(
                        name: "FK_funeral_bookings_bookings_booking_id",
                        column: x => x.booking_id,
                        principalTable: "bookings",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "notifications",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    type = table.Column<string>(type: "text", nullable: false),
                    title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    message = table.Column<string>(type: "text", nullable: false),
                    booking_id = table.Column<Guid>(type: "uuid", nullable: true),
                    provider_id = table.Column<Guid>(type: "uuid", nullable: true),
                    action_url = table.Column<string>(type: "text", nullable: true),
                    action_data = table.Column<string>(type: "jsonb", nullable: true),
                    is_read = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    read_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    sent_via_push = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    sent_via_email = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    sent_via_sms = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_notifications", x => x.id);
                    table.ForeignKey(
                        name: "FK_notifications_bookings_booking_id",
                        column: x => x.booking_id,
                        principalTable: "bookings",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_notifications_providers_provider_id",
                        column: x => x.provider_id,
                        principalTable: "providers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_notifications_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "payments",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    reference_number = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    purpose = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    method_type = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    status = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false, defaultValue: "pending"),
                    amount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    currency = table.Column<string>(type: "character(3)", fixedLength: true, maxLength: 3, nullable: false, defaultValue: "TND"),
                    booking_id = table.Column<Guid>(type: "uuid", nullable: true),
                    provider_wallet_top_up_id = table.Column<Guid>(type: "uuid", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    settled_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    failed_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    cancelled_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    expired_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_payments", x => x.id);
                    table.CheckConstraint("ck_payments_amount_non_negative", "amount >= 0");
                    table.CheckConstraint("ck_payments_method_type", "method_type IN ('cash', 'manual_bank_transfer', 'manual_d17', 'external_placeholder', 'admin_adjustment')");
                    table.CheckConstraint("ck_payments_purpose", "purpose IN ('booking_payment', 'wallet_top_up')");
                    table.CheckConstraint("ck_payments_single_source", "((CASE WHEN booking_id IS NULL THEN 0 ELSE 1 END) + (CASE WHEN provider_wallet_top_up_id IS NULL THEN 0 ELSE 1 END)) = 1");
                    table.CheckConstraint("ck_payments_status", "status IN ('pending', 'processing', 'reserved', 'settled', 'failed', 'expired', 'cancelled')");
                    table.ForeignKey(
                        name: "FK_payments_bookings_booking_id",
                        column: x => x.booking_id,
                        principalTable: "bookings",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_payments_provider_wallet_top_ups_provider_wallet_top_up_id",
                        column: x => x.provider_wallet_top_up_id,
                        principalTable: "provider_wallet_top_ups",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "pharmacy_orders",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    booking_id = table.Column<Guid>(type: "uuid", nullable: false),
                    items = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: false),
                    amount = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: true),
                    prescription_file_id = table.Column<Guid>(type: "uuid", nullable: true),
                    delivery_address = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    patient_phone = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    notes = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    order_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    completed_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    deleted_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_pharmacy_orders", x => x.id);
                    table.ForeignKey(
                        name: "FK_pharmacy_orders_bookings_booking_id",
                        column: x => x.booking_id,
                        principalTable: "bookings",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_pharmacy_orders_stored_files_prescription_file_id",
                        column: x => x.prescription_file_id,
                        principalTable: "stored_files",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "provider_locations",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    provider_id = table.Column<Guid>(type: "uuid", nullable: false),
                    latitude = table.Column<decimal>(type: "numeric(10,8)", precision: 10, scale: 8, nullable: false),
                    longitude = table.Column<decimal>(type: "numeric(11,8)", precision: 11, scale: 8, nullable: false),
                    accuracy_meters = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: true),
                    heading = table.Column<decimal>(type: "numeric(5,2)", precision: 5, scale: 2, nullable: true),
                    speed_kmh = table.Column<decimal>(type: "numeric(6,2)", precision: 6, scale: 2, nullable: true),
                    booking_id = table.Column<Guid>(type: "uuid", nullable: true),
                    recorded_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_provider_locations", x => x.id);
                    table.ForeignKey(
                        name: "FK_provider_locations_bookings_booking_id",
                        column: x => x.booking_id,
                        principalTable: "bookings",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_provider_locations_providers_provider_id",
                        column: x => x.provider_id,
                        principalTable: "providers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "reviews",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    booking_id = table.Column<Guid>(type: "uuid", nullable: false),
                    patient_id = table.Column<Guid>(type: "uuid", nullable: false),
                    provider_id = table.Column<Guid>(type: "uuid", nullable: false),
                    service_id = table.Column<Guid>(type: "uuid", nullable: false),
                    rating = table.Column<int>(type: "integer", nullable: false),
                    rating_professionalism = table.Column<int>(type: "integer", nullable: true),
                    rating_punctuality = table.Column<int>(type: "integer", nullable: true),
                    rating_quality = table.Column<int>(type: "integer", nullable: true),
                    rating_communication = table.Column<int>(type: "integer", nullable: true),
                    title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    comment = table.Column<string>(type: "text", nullable: true),
                    photo_urls = table.Column<List<string>>(type: "text[]", nullable: false),
                    is_verified = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    is_visible = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    is_flagged = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    flagged_reason = table.Column<string>(type: "text", nullable: true),
                    moderated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    moderated_by = table.Column<Guid>(type: "uuid", nullable: true),
                    provider_response = table.Column<string>(type: "text", nullable: true),
                    provider_responded_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    fraud_score = table.Column<decimal>(type: "numeric(5,2)", precision: 5, scale: 2, nullable: true),
                    is_suspicious = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_reviews", x => x.id);
                    table.ForeignKey(
                        name: "FK_reviews_bookings_booking_id",
                        column: x => x.booking_id,
                        principalTable: "bookings",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_reviews_patients_patient_id",
                        column: x => x.patient_id,
                        principalTable: "patients",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_reviews_providers_provider_id",
                        column: x => x.provider_id,
                        principalTable: "providers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "reward_transactions",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    patient_id = table.Column<Guid>(type: "uuid", nullable: false),
                    transaction_type = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    points = table.Column<int>(type: "integer", nullable: false),
                    balance_after = table.Column<int>(type: "integer", nullable: false),
                    reason = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    booking_id = table.Column<Guid>(type: "uuid", nullable: true),
                    badge_id = table.Column<Guid>(type: "uuid", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_reward_transactions", x => x.id);
                    table.ForeignKey(
                        name: "FK_reward_transactions_badges_badge_id",
                        column: x => x.badge_id,
                        principalTable: "badges",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_reward_transactions_bookings_booking_id",
                        column: x => x.booking_id,
                        principalTable: "bookings",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_reward_transactions_patients_patient_id",
                        column: x => x.patient_id,
                        principalTable: "patients",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "tracking_sessions",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    booking_id = table.Column<Guid>(type: "uuid", nullable: false),
                    is_active = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    share_token = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    share_expires_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    estimated_arrival_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    last_eta_update_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    total_distance_km = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: true),
                    started_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    ended_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tracking_sessions", x => x.id);
                    table.ForeignKey(
                        name: "FK_tracking_sessions_bookings_booking_id",
                        column: x => x.booking_id,
                        principalTable: "bookings",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "veterinary_bookings",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    booking_id = table.Column<Guid>(type: "uuid", nullable: false),
                    animal_type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    animal_name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    animal_breed = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    animal_age = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    animal_weight = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    is_sterilized = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    is_vaccinated = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    is_aggressive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    has_medical_record = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    notes = table.Column<string>(type: "text", nullable: true),
                    home_visit_address = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_veterinary_bookings", x => x.id);
                    table.ForeignKey(
                        name: "FK_veterinary_bookings_bookings_booking_id",
                        column: x => x.booking_id,
                        principalTable: "bookings",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "disputes",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    dispute_number = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    booking_id = table.Column<Guid>(type: "uuid", nullable: false),
                    payment_id = table.Column<Guid>(type: "uuid", nullable: true),
                    reported_by = table.Column<Guid>(type: "uuid", nullable: false),
                    reported_against = table.Column<Guid>(type: "uuid", nullable: false),
                    reason = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    description = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: false),
                    evidence_urls = table.Column<List<string>>(type: "text[]", nullable: false),
                    status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false, defaultValue: "open"),
                    resolution = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    resolution_amount = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: true),
                    resolved_by = table.Column<Guid>(type: "uuid", nullable: true),
                    resolved_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    is_escalated = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    escalated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    escalated_to = table.Column<Guid>(type: "uuid", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_disputes", x => x.id);
                    table.ForeignKey(
                        name: "FK_disputes_bookings_booking_id",
                        column: x => x.booking_id,
                        principalTable: "bookings",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_disputes_payments_payment_id",
                        column: x => x.payment_id,
                        principalTable: "payments",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_disputes_users_escalated_to",
                        column: x => x.escalated_to,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_disputes_users_reported_against",
                        column: x => x.reported_against,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_disputes_users_reported_by",
                        column: x => x.reported_by,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_disputes_users_resolved_by",
                        column: x => x.resolved_by,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ledger_entries",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    ledger_transaction_id = table.Column<Guid>(type: "uuid", nullable: false),
                    account_code = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: false),
                    provider_id = table.Column<Guid>(type: "uuid", nullable: true),
                    booking_id = table.Column<Guid>(type: "uuid", nullable: true),
                    payment_id = table.Column<Guid>(type: "uuid", nullable: true),
                    provider_wallet_top_up_id = table.Column<Guid>(type: "uuid", nullable: true),
                    amount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    signed_amount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    currency = table.Column<string>(type: "character(3)", fixedLength: true, maxLength: 3, nullable: false, defaultValue: "TND"),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ledger_entries", x => x.id);
                    table.CheckConstraint("ck_ledger_entries_amount_matches_signed_amount", "amount = ABS(signed_amount)");
                    table.CheckConstraint("ck_ledger_entries_amount_positive", "amount > 0");
                    table.CheckConstraint("ck_ledger_entries_signed_amount_non_zero", "signed_amount <> 0");
                    table.ForeignKey(
                        name: "FK_ledger_entries_accounts_account_code",
                        column: x => x.account_code,
                        principalTable: "accounts",
                        principalColumn: "code",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ledger_entries_bookings_booking_id",
                        column: x => x.booking_id,
                        principalTable: "bookings",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ledger_entries_ledger_transactions_ledger_transaction_id",
                        column: x => x.ledger_transaction_id,
                        principalTable: "ledger_transactions",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ledger_entries_payments_payment_id",
                        column: x => x.payment_id,
                        principalTable: "payments",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ledger_entries_provider_wallet_top_ups_provider_wallet_top_~",
                        column: x => x.provider_wallet_top_up_id,
                        principalTable: "provider_wallet_top_ups",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ledger_entries_providers_provider_id",
                        column: x => x.provider_id,
                        principalTable: "providers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "payment_attempts",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    payment_id = table.Column<Guid>(type: "uuid", nullable: false),
                    attempt_number = table.Column<int>(type: "integer", nullable: false),
                    method_type = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    status = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false, defaultValue: "initiated"),
                    amount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    currency = table.Column<string>(type: "character(3)", fixedLength: true, maxLength: 3, nullable: false, defaultValue: "TND"),
                    provider_code = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    external_reference = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    manual_reference = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    safe_metadata_json = table.Column<string>(type: "jsonb", nullable: true),
                    gateway = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    gateway_payment_id = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    gateway_charge_id = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    gateway_transfer_id = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    gateway_refund_id = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    gateway_payout_id = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    gateway_response = table.Column<string>(type: "jsonb", nullable: true),
                    gateway_fraud_response = table.Column<string>(type: "jsonb", nullable: true),
                    fraud_score = table.Column<decimal>(type: "numeric(5,2)", precision: 5, scale: 2, nullable: true),
                    fraud_decision = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    fraud_flags = table.Column<List<string>>(type: "text[]", nullable: false),
                    is_flagged = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    ip_address = table.Column<string>(type: "character varying(45)", maxLength: 45, nullable: true),
                    device_fingerprint = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    card_last_four = table.Column<string>(type: "character varying(4)", maxLength: 4, nullable: true),
                    card_brand = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    card_country = table.Column<string>(type: "character(2)", fixedLength: true, maxLength: 2, nullable: true),
                    authorized_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    held_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    captured_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    released_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    idempotency_key = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_payment_attempts", x => x.id);
                    table.CheckConstraint("ck_payment_attempts_amount_non_negative", "amount >= 0");
                    table.CheckConstraint("ck_payment_attempts_attempt_number_positive", "attempt_number > 0");
                    table.CheckConstraint("ck_payment_attempts_method_type", "method_type IN ('cash', 'manual_bank_transfer', 'manual_d17', 'external_placeholder', 'admin_adjustment')");
                    table.CheckConstraint("ck_payment_attempts_status", "status IN ('initiated', 'submitted', 'processing', 'succeeded', 'failed', 'expired', 'cancelled')");
                    table.ForeignKey(
                        name: "FK_payment_attempts_payments_payment_id",
                        column: x => x.payment_id,
                        principalTable: "payments",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "payout_items",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    payout_id = table.Column<Guid>(type: "uuid", nullable: false),
                    payment_id = table.Column<Guid>(type: "uuid", nullable: false),
                    amount = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_payout_items", x => x.id);
                    table.ForeignKey(
                        name: "FK_payout_items_payments_payment_id",
                        column: x => x.payment_id,
                        principalTable: "payments",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_payout_items_payouts_payout_id",
                        column: x => x.payout_id,
                        principalTable: "payouts",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "refunds",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    payment_id = table.Column<Guid>(type: "uuid", nullable: false),
                    booking_id = table.Column<Guid>(type: "uuid", nullable: false),
                    amount = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    reason = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false, defaultValue: "pending"),
                    gateway_refund_id = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    gateway_response = table.Column<string>(type: "jsonb", nullable: true),
                    requested_by = table.Column<Guid>(type: "uuid", nullable: true),
                    approved_by = table.Column<Guid>(type: "uuid", nullable: true),
                    processed_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_refunds", x => x.id);
                    table.ForeignKey(
                        name: "FK_refunds_bookings_booking_id",
                        column: x => x.booking_id,
                        principalTable: "bookings",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_refunds_payments_payment_id",
                        column: x => x.payment_id,
                        principalTable: "payments",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "review_reports",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    review_id = table.Column<Guid>(type: "uuid", nullable: false),
                    reported_by = table.Column<Guid>(type: "uuid", nullable: false),
                    reason = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    description = table.Column<string>(type: "text", nullable: true),
                    status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false, defaultValue: "pending"),
                    resolved_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    resolved_by = table.Column<Guid>(type: "uuid", nullable: true),
                    resolution_notes = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_review_reports", x => x.id);
                    table.ForeignKey(
                        name: "FK_review_reports_reviews_review_id",
                        column: x => x.review_id,
                        principalTable: "reviews",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "dispute_messages",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    dispute_id = table.Column<Guid>(type: "uuid", nullable: false),
                    sender_id = table.Column<Guid>(type: "uuid", nullable: false),
                    message = table.Column<string>(type: "character varying(5000)", maxLength: 5000, nullable: false),
                    attachment_urls = table.Column<List<string>>(type: "text[]", nullable: false),
                    is_internal = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_dispute_messages", x => x.id);
                    table.ForeignKey(
                        name: "FK_dispute_messages_disputes_dispute_id",
                        column: x => x.dispute_id,
                        principalTable: "disputes",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_dispute_messages_users_sender_id",
                        column: x => x.sender_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "accounts",
                columns: new[] { "id", "code", "created_at", "description", "is_active", "name", "updated_at" },
                values: new object[,]
                {
                    { new Guid("1292ea52-34af-4f42-9c46-995abab5daa2"), "ProviderWalletReserved", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Provider wallet reserved balance projection account.", true, "Provider Wallet Reserved", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("a87c3317-3c34-4ab7-8990-49e2b7fe1801"), "ProviderWalletAvailable", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Provider wallet available balance projection account.", true, "Provider Wallet Available", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("b9cb6688-acce-4b92-9a1a-bdff59c4e703"), "PlatformRevenue", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Platform fee revenue account.", true, "Platform Revenue", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("bb9ba9b7-afc5-45e5-964a-3b2892af7904"), "AdjustmentSuspense", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Counter-account for manual and compensating adjustments.", true, "Adjustment Suspense", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) }
                });

            migrationBuilder.CreateIndex(
                name: "ux_accounts_code",
                table: "accounts",
                column: "code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_activity_tracking_patient_id_date",
                table: "activity_tracking",
                columns: new[] { "patient_id", "date" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ambulance_bookings_booking_id",
                table: "ambulance_bookings",
                column: "booking_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ambulance_service_types_config_code",
                table: "ambulance_service_types_config",
                column: "code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_badges_code",
                table: "badges",
                column: "code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "idx_booking_line_items_booking_id",
                table: "booking_line_items",
                column: "booking_id");

            migrationBuilder.CreateIndex(
                name: "idx_booking_line_items_service_id",
                table: "booking_line_items",
                column: "service_id");

            migrationBuilder.CreateIndex(
                name: "idx_booking_sessions_booking",
                table: "booking_sessions",
                column: "booking_id");

            migrationBuilder.CreateIndex(
                name: "idx_booking_sessions_date_time",
                table: "booking_sessions",
                columns: new[] { "scheduled_date", "scheduled_start_time" });

            migrationBuilder.CreateIndex(
                name: "idx_booking_sessions_patient_date",
                table: "booking_sessions",
                columns: new[] { "patient_id", "scheduled_date" });

            migrationBuilder.CreateIndex(
                name: "idx_booking_sessions_provider_date",
                table: "booking_sessions",
                columns: new[] { "provider_id", "scheduled_date" });

            migrationBuilder.CreateIndex(
                name: "idx_booking_sessions_provider_date_time",
                table: "booking_sessions",
                columns: new[] { "provider_id", "scheduled_date", "scheduled_start_time" });

            migrationBuilder.CreateIndex(
                name: "idx_booking_sessions_status",
                table: "booking_sessions",
                column: "status");

            migrationBuilder.CreateIndex(
                name: "IX_booking_sessions_cancelled_by",
                table: "booking_sessions",
                column: "cancelled_by");

            migrationBuilder.CreateIndex(
                name: "IX_booking_status_history_booking_id",
                table: "booking_status_history",
                column: "booking_id");

            migrationBuilder.CreateIndex(
                name: "IX_booking_status_history_changed_by",
                table: "booking_status_history",
                column: "changed_by");

            migrationBuilder.CreateIndex(
                name: "idx_bookings_created",
                table: "bookings",
                column: "created_at",
                descending: new bool[0]);

            migrationBuilder.CreateIndex(
                name: "idx_bookings_end_date",
                table: "bookings",
                column: "end_date");

            migrationBuilder.CreateIndex(
                name: "idx_bookings_number",
                table: "bookings",
                column: "booking_number",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "idx_bookings_patient",
                table: "bookings",
                column: "patient_id");

            migrationBuilder.CreateIndex(
                name: "idx_bookings_patient_start_date",
                table: "bookings",
                columns: new[] { "patient_id", "start_date" },
                filter: "deleted_at IS NULL");

            migrationBuilder.CreateIndex(
                name: "idx_bookings_provider",
                table: "bookings",
                column: "provider_id");

            migrationBuilder.CreateIndex(
                name: "idx_bookings_provider_start_date",
                table: "bookings",
                columns: new[] { "provider_id", "start_date" },
                filter: "deleted_at IS NULL");

            migrationBuilder.CreateIndex(
                name: "idx_bookings_provider_start_date_time",
                table: "bookings",
                columns: new[] { "provider_id", "start_date", "daily_start_time" },
                filter: "deleted_at IS NULL");

            migrationBuilder.CreateIndex(
                name: "idx_bookings_start_date",
                table: "bookings",
                column: "start_date");

            migrationBuilder.CreateIndex(
                name: "idx_bookings_status",
                table: "bookings",
                column: "status");

            migrationBuilder.CreateIndex(
                name: "IX_bookings_cancelled_by",
                table: "bookings",
                column: "cancelled_by");

            migrationBuilder.CreateIndex(
                name: "IX_bookings_family_member_id",
                table: "bookings",
                column: "family_member_id");

            migrationBuilder.CreateIndex(
                name: "IX_bookings_rescheduled_from_id",
                table: "bookings",
                column: "rescheduled_from_id");

            migrationBuilder.CreateIndex(
                name: "IX_bookings_service_id",
                table: "bookings",
                column: "service_id");

            migrationBuilder.CreateIndex(
                name: "IX_bookings_settlement_completed_by",
                table: "bookings",
                column: "settlement_completed_by");

            migrationBuilder.CreateIndex(
                name: "IX_bookings_status_changed_by",
                table: "bookings",
                column: "status_changed_by");

            migrationBuilder.CreateIndex(
                name: "IX_campaign_performance_campaign_id_date",
                table: "campaign_performance",
                columns: new[] { "campaign_id", "date" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "idx_conversations_provider",
                table: "conversations",
                column: "provider_id");

            migrationBuilder.CreateIndex(
                name: "ix_conversations_patient_provider",
                table: "conversations",
                columns: new[] { "patient_id", "provider_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_discount_code_usage_discount_code_id",
                table: "discount_code_usage",
                column: "discount_code_id");

            migrationBuilder.CreateIndex(
                name: "IX_discount_code_usage_patient_id",
                table: "discount_code_usage",
                column: "patient_id");

            migrationBuilder.CreateIndex(
                name: "IX_discount_codes_code",
                table: "discount_codes",
                column: "code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_dispute_messages_dispute_id",
                table: "dispute_messages",
                column: "dispute_id");

            migrationBuilder.CreateIndex(
                name: "IX_dispute_messages_sender_id",
                table: "dispute_messages",
                column: "sender_id");

            migrationBuilder.CreateIndex(
                name: "idx_disputes_number",
                table: "disputes",
                column: "dispute_number",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_disputes_booking_id",
                table: "disputes",
                column: "booking_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_disputes_escalated_to",
                table: "disputes",
                column: "escalated_to");

            migrationBuilder.CreateIndex(
                name: "IX_disputes_payment_id",
                table: "disputes",
                column: "payment_id");

            migrationBuilder.CreateIndex(
                name: "IX_disputes_reported_against",
                table: "disputes",
                column: "reported_against");

            migrationBuilder.CreateIndex(
                name: "IX_disputes_reported_by",
                table: "disputes",
                column: "reported_by");

            migrationBuilder.CreateIndex(
                name: "IX_disputes_resolved_by",
                table: "disputes",
                column: "resolved_by");

            migrationBuilder.CreateIndex(
                name: "IX_email_verification_tokens_user_id",
                table: "email_verification_tokens",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_equipment_categories_config_code",
                table: "equipment_categories_config",
                column: "code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_equipment_rentals_booking_id",
                table: "equipment_rentals",
                column: "booking_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_family_access_granted_to_user_id",
                table: "family_access",
                column: "granted_to_user_id");

            migrationBuilder.CreateIndex(
                name: "IX_family_access_patient_id_granted_to_user_id",
                table: "family_access",
                columns: new[] { "patient_id", "granted_to_user_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "idx_family_members_unique_profile",
                table: "family_members",
                columns: new[] { "patient_id", "first_name", "last_name", "date_of_birth" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_file_access_audit_file_created",
                table: "file_access_audit",
                columns: new[] { "file_id", "created_at" });

            migrationBuilder.CreateIndex(
                name: "idx_fraud_blacklist_type_value",
                table: "fraud_blacklist",
                columns: new[] { "entity_type", "entity_value" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "idx_fraud_events_created",
                table: "fraud_events",
                column: "created_at",
                descending: new bool[0]);

            migrationBuilder.CreateIndex(
                name: "idx_fraud_events_decision",
                table: "fraud_events",
                column: "decision");

            migrationBuilder.CreateIndex(
                name: "idx_fraud_events_score",
                table: "fraud_events",
                column: "fraud_score");

            migrationBuilder.CreateIndex(
                name: "idx_fraud_events_user",
                table: "fraud_events",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_funeral_bookings_booking_id",
                table: "funeral_bookings",
                column: "booking_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_hydration_tracking_patient_id_date",
                table: "hydration_tracking",
                columns: new[] { "patient_id", "date" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_insurance_claims_claim_number",
                table: "insurance_claims",
                column: "claim_number",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_insurance_claims_provider_id",
                table: "insurance_claims",
                column: "provider_id");

            migrationBuilder.CreateIndex(
                name: "IX_insurance_coverage_items_coverage_id",
                table: "insurance_coverage_items",
                column: "coverage_id");

            migrationBuilder.CreateIndex(
                name: "IX_insurance_coverages_provider_id",
                table: "insurance_coverages",
                column: "provider_id");

            migrationBuilder.CreateIndex(
                name: "IX_insurance_documents_provider_id",
                table: "insurance_documents",
                column: "provider_id");

            migrationBuilder.CreateIndex(
                name: "idx_ledger_entries_account_code",
                table: "ledger_entries",
                column: "account_code");

            migrationBuilder.CreateIndex(
                name: "idx_ledger_entries_booking_id",
                table: "ledger_entries",
                column: "booking_id");

            migrationBuilder.CreateIndex(
                name: "idx_ledger_entries_created_at",
                table: "ledger_entries",
                column: "created_at",
                descending: new bool[0]);

            migrationBuilder.CreateIndex(
                name: "idx_ledger_entries_ledger_transaction_id",
                table: "ledger_entries",
                column: "ledger_transaction_id");

            migrationBuilder.CreateIndex(
                name: "idx_ledger_entries_payment_id",
                table: "ledger_entries",
                column: "payment_id");

            migrationBuilder.CreateIndex(
                name: "idx_ledger_entries_provider_id",
                table: "ledger_entries",
                column: "provider_id");

            migrationBuilder.CreateIndex(
                name: "idx_ledger_entries_provider_wallet_top_up_id",
                table: "ledger_entries",
                column: "provider_wallet_top_up_id");

            migrationBuilder.CreateIndex(
                name: "idx_ledger_transactions_occurred_at",
                table: "ledger_transactions",
                column: "occurred_at",
                descending: new bool[0]);

            migrationBuilder.CreateIndex(
                name: "idx_ledger_transactions_source",
                table: "ledger_transactions",
                columns: new[] { "source_type", "source_id" });

            migrationBuilder.CreateIndex(
                name: "ux_ledger_transactions_idempotency_key",
                table: "ledger_transactions",
                column: "idempotency_key",
                unique: true,
                filter: "idempotency_key IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "ux_ledger_transactions_reference_number",
                table: "ledger_transactions",
                column: "reference_number",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_login_otp_challenges_active_lookup",
                table: "login_otp_challenges",
                columns: new[] { "id", "consumed_at", "expires_at" });

            migrationBuilder.CreateIndex(
                name: "ix_login_otp_challenges_expires_at",
                table: "login_otp_challenges",
                column: "expires_at");

            migrationBuilder.CreateIndex(
                name: "ix_login_otp_challenges_user_id",
                table: "login_otp_challenges",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_marketing_campaigns_provider_id",
                table: "marketing_campaigns",
                column: "provider_id");

            migrationBuilder.CreateIndex(
                name: "idx_messages_conv_created",
                table: "messages",
                columns: new[] { "conversation_id", "created_at" },
                descending: new[] { false, true });

            migrationBuilder.CreateIndex(
                name: "idx_messages_conv_read_sender",
                table: "messages",
                columns: new[] { "conversation_id", "is_read", "sender_id" });

            migrationBuilder.CreateIndex(
                name: "idx_messages_conversation",
                table: "messages",
                column: "conversation_id");

            migrationBuilder.CreateIndex(
                name: "idx_messages_created",
                table: "messages",
                column: "created_at",
                descending: new bool[0]);

            migrationBuilder.CreateIndex(
                name: "idx_messages_sender",
                table: "messages",
                column: "sender_id");

            migrationBuilder.CreateIndex(
                name: "idx_notifications_created",
                table: "notifications",
                column: "created_at",
                descending: new bool[0]);

            migrationBuilder.CreateIndex(
                name: "idx_notifications_unread",
                table: "notifications",
                columns: new[] { "user_id", "is_read" },
                filter: "is_read = FALSE");

            migrationBuilder.CreateIndex(
                name: "idx_notifications_user",
                table: "notifications",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_notifications_booking_id",
                table: "notifications",
                column: "booking_id");

            migrationBuilder.CreateIndex(
                name: "IX_notifications_provider_id",
                table: "notifications",
                column: "provider_id");

            migrationBuilder.CreateIndex(
                name: "IX_nutrition_diet_types_config_code",
                table: "nutrition_diet_types_config",
                column: "code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_nutrition_profiles_patient_id",
                table: "nutrition_profiles",
                column: "patient_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_nutrition_subcategories_config_code",
                table: "nutrition_subcategories_config",
                column: "code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_nutrition_tracking_patient_id",
                table: "nutrition_tracking",
                column: "patient_id");

            migrationBuilder.CreateIndex(
                name: "ix_outbox_messages_idempotency_key",
                table: "outbox_messages",
                column: "idempotency_key",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_outbox_messages_status_next_attempt_occurred",
                table: "outbox_messages",
                columns: new[] { "status", "next_attempt_at", "occurred_at" });

            migrationBuilder.CreateIndex(
                name: "IX_password_reset_tokens_user_id",
                table: "password_reset_tokens",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_patient_badges_badge_id",
                table: "patient_badges",
                column: "badge_id");

            migrationBuilder.CreateIndex(
                name: "IX_patient_badges_patient_id_badge_id",
                table: "patient_badges",
                columns: new[] { "patient_id", "badge_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_patient_favorites_patient_id",
                table: "patient_favorites",
                column: "patient_id");

            migrationBuilder.CreateIndex(
                name: "IX_patient_favorites_patient_id_provider_id",
                table: "patient_favorites",
                columns: new[] { "patient_id", "provider_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_patient_favorites_provider_id",
                table: "patient_favorites",
                column: "provider_id");

            migrationBuilder.CreateIndex(
                name: "IX_patient_preferences_patient_id",
                table: "patient_preferences",
                column: "patient_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_patient_rewards_patient_id",
                table: "patient_rewards",
                column: "patient_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "idx_patients_avatar_file_id",
                table: "patients",
                column: "avatar_file_id");

            migrationBuilder.CreateIndex(
                name: "idx_patients_city",
                table: "patients",
                column: "city");

            migrationBuilder.CreateIndex(
                name: "idx_patients_user_id",
                table: "patients",
                column: "user_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "idx_payment_attempts_created_at",
                table: "payment_attempts",
                column: "created_at",
                descending: new bool[0]);

            migrationBuilder.CreateIndex(
                name: "idx_payment_attempts_payment_id",
                table: "payment_attempts",
                column: "payment_id");

            migrationBuilder.CreateIndex(
                name: "ux_payment_attempts_idempotency_key",
                table: "payment_attempts",
                column: "idempotency_key",
                unique: true,
                filter: "idempotency_key IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "ux_payment_attempts_payment_id_attempt_number",
                table: "payment_attempts",
                columns: new[] { "payment_id", "attempt_number" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "idx_payments_created_at",
                table: "payments",
                column: "created_at",
                descending: new bool[0]);

            migrationBuilder.CreateIndex(
                name: "idx_payments_purpose",
                table: "payments",
                column: "purpose");

            migrationBuilder.CreateIndex(
                name: "idx_payments_status",
                table: "payments",
                column: "status");

            migrationBuilder.CreateIndex(
                name: "ux_payments_booking_id",
                table: "payments",
                column: "booking_id",
                unique: true,
                filter: "booking_id IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "ux_payments_provider_wallet_top_up_id",
                table: "payments",
                column: "provider_wallet_top_up_id",
                unique: true,
                filter: "provider_wallet_top_up_id IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "ux_payments_reference_number",
                table: "payments",
                column: "reference_number",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_payout_items_payment_id",
                table: "payout_items",
                column: "payment_id");

            migrationBuilder.CreateIndex(
                name: "IX_payout_items_payout_id",
                table: "payout_items",
                column: "payout_id");

            migrationBuilder.CreateIndex(
                name: "IX_payouts_payout_number",
                table: "payouts",
                column: "payout_number",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_payouts_provider_id",
                table: "payouts",
                column: "provider_id");

            migrationBuilder.CreateIndex(
                name: "IX_pharmacy_orders_booking_id",
                table: "pharmacy_orders",
                column: "booking_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_pharmacy_orders_prescription_file_id",
                table: "pharmacy_orders",
                column: "prescription_file_id");

            migrationBuilder.CreateIndex(
                name: "IX_provider_availability_history_changed_by",
                table: "provider_availability_history",
                column: "changed_by");

            migrationBuilder.CreateIndex(
                name: "IX_provider_availability_history_provider_id",
                table: "provider_availability_history",
                column: "provider_id");

            migrationBuilder.CreateIndex(
                name: "IX_provider_availability_history_status_changed_at",
                table: "provider_availability_history",
                column: "status_changed_at");

            migrationBuilder.CreateIndex(
                name: "IX_provider_certifications_file_id",
                table: "provider_certifications",
                column: "file_id");

            migrationBuilder.CreateIndex(
                name: "IX_provider_certifications_provider_id",
                table: "provider_certifications",
                column: "provider_id");

            migrationBuilder.CreateIndex(
                name: "ix_provider_documents_file_id",
                table: "provider_documents",
                column: "file_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_provider_documents_provider_id",
                table: "provider_documents",
                column: "provider_id");

            migrationBuilder.CreateIndex(
                name: "idx_provider_locations_booking",
                table: "provider_locations",
                column: "booking_id");

            migrationBuilder.CreateIndex(
                name: "idx_provider_locations_provider",
                table: "provider_locations",
                column: "provider_id");

            migrationBuilder.CreateIndex(
                name: "idx_provider_locations_time",
                table: "provider_locations",
                column: "recorded_at",
                descending: new bool[0]);

            migrationBuilder.CreateIndex(
                name: "IX_provider_preferences_provider_id",
                table: "provider_preferences",
                column: "provider_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_provider_schedules_provider_id_day_of_week_start_time_servi~",
                table: "provider_schedules",
                columns: new[] { "provider_id", "day_of_week", "start_time", "service_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_provider_schedules_service_id",
                table: "provider_schedules",
                column: "service_id");

            migrationBuilder.CreateIndex(
                name: "ix_provider_service_presets_category_active_order",
                table: "provider_service_presets",
                columns: new[] { "provider_category", "is_active", "display_order" });

            migrationBuilder.CreateIndex(
                name: "ix_provider_service_presets_category_code",
                table: "provider_service_presets",
                columns: new[] { "provider_category", "code" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_provider_unavailability_provider_id",
                table: "provider_unavailability",
                column: "provider_id");

            migrationBuilder.CreateIndex(
                name: "idx_provider_wallet_top_ups_initiated_at",
                table: "provider_wallet_top_ups",
                column: "initiated_at",
                descending: new bool[0]);

            migrationBuilder.CreateIndex(
                name: "idx_provider_wallet_top_ups_provider",
                table: "provider_wallet_top_ups",
                column: "provider_id");

            migrationBuilder.CreateIndex(
                name: "idx_provider_wallet_top_ups_status",
                table: "provider_wallet_top_ups",
                column: "status");

            migrationBuilder.CreateIndex(
                name: "ux_provider_wallet_top_ups_reference_number",
                table: "provider_wallet_top_ups",
                column: "reference_number",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "idx_providers_approved",
                table: "providers",
                column: "is_approved",
                filter: "is_approved = TRUE");

            migrationBuilder.CreateIndex(
                name: "idx_providers_available_balance",
                table: "providers",
                column: "available_balance");

            migrationBuilder.CreateIndex(
                name: "idx_providers_avatar_file_id",
                table: "providers",
                column: "avatar_file_id");

            migrationBuilder.CreateIndex(
                name: "idx_providers_category",
                table: "providers",
                column: "service_category");

            migrationBuilder.CreateIndex(
                name: "idx_providers_city",
                table: "providers",
                column: "city");

            migrationBuilder.CreateIndex(
                name: "idx_providers_rating",
                table: "providers",
                column: "rating_average",
                descending: new bool[0]);

            migrationBuilder.CreateIndex(
                name: "idx_providers_user_id",
                table: "providers",
                column: "user_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "idx_providers_verification_status",
                table: "providers",
                column: "verification_status");

            migrationBuilder.CreateIndex(
                name: "IX_push_tokens_user_id_token",
                table: "push_tokens",
                columns: new[] { "user_id", "token" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_referrals_referred_user_id",
                table: "referrals",
                column: "referred_user_id");

            migrationBuilder.CreateIndex(
                name: "IX_referrals_referrer_id",
                table: "referrals",
                column: "referrer_id");

            migrationBuilder.CreateIndex(
                name: "IX_refunds_booking_id",
                table: "refunds",
                column: "booking_id");

            migrationBuilder.CreateIndex(
                name: "IX_refunds_payment_id",
                table: "refunds",
                column: "payment_id");

            migrationBuilder.CreateIndex(
                name: "IX_review_reports_review_id",
                table: "review_reports",
                column: "review_id");

            migrationBuilder.CreateIndex(
                name: "idx_reviews_patient",
                table: "reviews",
                column: "patient_id");

            migrationBuilder.CreateIndex(
                name: "idx_reviews_provider",
                table: "reviews",
                column: "provider_id");

            migrationBuilder.CreateIndex(
                name: "idx_reviews_rating",
                table: "reviews",
                column: "rating");

            migrationBuilder.CreateIndex(
                name: "idx_reviews_visible",
                table: "reviews",
                column: "is_visible",
                filter: "is_visible = TRUE");

            migrationBuilder.CreateIndex(
                name: "IX_reviews_booking_id",
                table: "reviews",
                column: "booking_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_reward_transactions_badge_id",
                table: "reward_transactions",
                column: "badge_id");

            migrationBuilder.CreateIndex(
                name: "IX_reward_transactions_booking_id",
                table: "reward_transactions",
                column: "booking_id");

            migrationBuilder.CreateIndex(
                name: "IX_reward_transactions_patient_id",
                table: "reward_transactions",
                column: "patient_id");

            migrationBuilder.CreateIndex(
                name: "idx_service_addons_service_id",
                table: "service_addons",
                column: "service_id");

            migrationBuilder.CreateIndex(
                name: "IX_service_categories_config_code",
                table: "service_categories_config",
                column: "code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_service_categories_config_display_group",
                table: "service_categories_config",
                column: "display_group");

            migrationBuilder.CreateIndex(
                name: "IX_service_photos_file_id",
                table: "service_photos",
                column: "file_id");

            migrationBuilder.CreateIndex(
                name: "ix_service_photos_service_file",
                table: "service_photos",
                columns: new[] { "service_id", "file_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_service_photos_service_main",
                table: "service_photos",
                columns: new[] { "service_id", "is_main" });

            migrationBuilder.CreateIndex(
                name: "idx_services_active",
                table: "services",
                column: "is_active",
                filter: "is_active = TRUE");

            migrationBuilder.CreateIndex(
                name: "idx_services_available_quantity",
                table: "services",
                column: "available_quantity",
                filter: "available_quantity IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "idx_services_category",
                table: "services",
                column: "category");

            migrationBuilder.CreateIndex(
                name: "idx_services_description_trgm",
                table: "services",
                column: "description")
                .Annotation("Npgsql:IndexMethod", "gin")
                .Annotation("Npgsql:IndexOperators", new[] { "gin_trgm_ops" });

            migrationBuilder.CreateIndex(
                name: "idx_services_name_trgm",
                table: "services",
                column: "name")
                .Annotation("Npgsql:IndexMethod", "gin")
                .Annotation("Npgsql:IndexOperators", new[] { "gin_trgm_ops" });

            migrationBuilder.CreateIndex(
                name: "idx_services_price",
                table: "services",
                column: "price");

            migrationBuilder.CreateIndex(
                name: "idx_services_provider",
                table: "services",
                column: "provider_id");

            migrationBuilder.CreateIndex(
                name: "ix_services_equipment_catalog",
                table: "services",
                columns: new[] { "category", "is_active", "created_at" });

            migrationBuilder.CreateIndex(
                name: "ix_services_equipment_price",
                table: "services",
                columns: new[] { "category", "is_active", "price" });

            migrationBuilder.CreateIndex(
                name: "IX_services_main_image_file_id",
                table: "services",
                column: "main_image_file_id");

            migrationBuilder.CreateIndex(
                name: "ix_services_provider_name",
                table: "services",
                columns: new[] { "provider_id", "name" },
                unique: true,
                filter: "deleted_at IS NULL");

            migrationBuilder.CreateIndex(
                name: "ix_stored_files_bucket_object_key",
                table: "stored_files",
                columns: new[] { "bucket", "object_key" });

            migrationBuilder.CreateIndex(
                name: "ix_stored_files_owner_status_created",
                table: "stored_files",
                columns: new[] { "owner_user_id", "status", "created_at" });

            migrationBuilder.CreateIndex(
                name: "ix_stored_files_staging_bucket_object_key",
                table: "stored_files",
                columns: new[] { "staging_bucket", "staging_object_key" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_stored_files_use_case_related_application_id",
                table: "stored_files",
                columns: new[] { "use_case", "related_application_id" });

            migrationBuilder.CreateIndex(
                name: "IX_subscription_payments_subscription_id",
                table: "subscription_payments",
                column: "subscription_id");

            migrationBuilder.CreateIndex(
                name: "IX_subscriptions_provider_id",
                table: "subscriptions",
                column: "provider_id");

            migrationBuilder.CreateIndex(
                name: "IX_support_ticket_messages_sender_id",
                table: "support_ticket_messages",
                column: "sender_id");

            migrationBuilder.CreateIndex(
                name: "IX_support_ticket_messages_ticket_id",
                table: "support_ticket_messages",
                column: "ticket_id");

            migrationBuilder.CreateIndex(
                name: "IX_support_tickets_ticket_number",
                table: "support_tickets",
                column: "ticket_number",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_support_tickets_user_id",
                table: "support_tickets",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_system_settings_setting_key",
                table: "system_settings",
                column: "setting_key",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "idx_tracking_sessions_share_token",
                table: "tracking_sessions",
                column: "share_token",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_tracking_sessions_booking_id",
                table: "tracking_sessions",
                column: "booking_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "idx_user_behavior_created",
                table: "user_behavior",
                column: "created_at",
                descending: new bool[0]);

            migrationBuilder.CreateIndex(
                name: "idx_user_behavior_device",
                table: "user_behavior",
                column: "device_fingerprint");

            migrationBuilder.CreateIndex(
                name: "idx_user_behavior_ip",
                table: "user_behavior",
                column: "ip_address");

            migrationBuilder.CreateIndex(
                name: "idx_user_behavior_user",
                table: "user_behavior",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "ix_user_sessions_refresh_token_hash",
                table: "user_sessions",
                column: "refresh_token_hash",
                filter: "refresh_token_hash IS NOT NULL AND is_active = true");

            migrationBuilder.CreateIndex(
                name: "ix_user_sessions_user_id",
                table: "user_sessions",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "ix_user_sessions_user_id_device_fingerprint_is_active",
                table: "user_sessions",
                columns: new[] { "user_id", "device_fingerprint", "is_active" });

            migrationBuilder.CreateIndex(
                name: "ix_user_sessions_user_id_is_active",
                table: "user_sessions",
                columns: new[] { "user_id", "is_active" });

            migrationBuilder.CreateIndex(
                name: "idx_users_email",
                table: "users",
                column: "email",
                unique: true,
                filter: "deleted_at IS NULL");

            migrationBuilder.CreateIndex(
                name: "idx_users_phone",
                table: "users",
                column: "phone");

            migrationBuilder.CreateIndex(
                name: "idx_users_role",
                table: "users",
                column: "role");

            migrationBuilder.CreateIndex(
                name: "IX_veterinary_animal_types_config_code",
                table: "veterinary_animal_types_config",
                column: "code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_veterinary_bookings_booking_id",
                table: "veterinary_bookings",
                column: "booking_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_vital_signs_patient_id",
                table: "vital_signs",
                column: "patient_id");

            migrationBuilder.CreateIndex(
                name: "ux_wallets_provider",
                table: "wallets",
                column: "provider_id",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "activity_tracking");

            migrationBuilder.DropTable(
                name: "admin_actions");

            migrationBuilder.DropTable(
                name: "ambulance_bookings");

            migrationBuilder.DropTable(
                name: "ambulance_service_types_config");

            migrationBuilder.DropTable(
                name: "audit_logs");

            migrationBuilder.DropTable(
                name: "booking_line_items");

            migrationBuilder.DropTable(
                name: "booking_sessions");

            migrationBuilder.DropTable(
                name: "booking_status_history");

            migrationBuilder.DropTable(
                name: "campaign_performance");

            migrationBuilder.DropTable(
                name: "discount_code_usage");

            migrationBuilder.DropTable(
                name: "dispute_messages");

            migrationBuilder.DropTable(
                name: "email_verification_tokens");

            migrationBuilder.DropTable(
                name: "equipment_categories_config");

            migrationBuilder.DropTable(
                name: "equipment_rentals");

            migrationBuilder.DropTable(
                name: "family_access");

            migrationBuilder.DropTable(
                name: "file_access_audit");

            migrationBuilder.DropTable(
                name: "fraud_blacklist");

            migrationBuilder.DropTable(
                name: "fraud_events");

            migrationBuilder.DropTable(
                name: "fraud_rules");

            migrationBuilder.DropTable(
                name: "funeral_bookings");

            migrationBuilder.DropTable(
                name: "hydration_tracking");

            migrationBuilder.DropTable(
                name: "insurance_claims");

            migrationBuilder.DropTable(
                name: "insurance_coverage_items");

            migrationBuilder.DropTable(
                name: "insurance_documents");

            migrationBuilder.DropTable(
                name: "ledger_entries");

            migrationBuilder.DropTable(
                name: "login_otp_challenges");

            migrationBuilder.DropTable(
                name: "messages");

            migrationBuilder.DropTable(
                name: "notifications");

            migrationBuilder.DropTable(
                name: "nutrition_diet_types_config");

            migrationBuilder.DropTable(
                name: "nutrition_profiles");

            migrationBuilder.DropTable(
                name: "nutrition_subcategories_config");

            migrationBuilder.DropTable(
                name: "nutrition_tracking");

            migrationBuilder.DropTable(
                name: "outbox_messages");

            migrationBuilder.DropTable(
                name: "password_reset_tokens");

            migrationBuilder.DropTable(
                name: "patient_badges");

            migrationBuilder.DropTable(
                name: "patient_favorites");

            migrationBuilder.DropTable(
                name: "patient_preferences");

            migrationBuilder.DropTable(
                name: "patient_rewards");

            migrationBuilder.DropTable(
                name: "payment_attempts");

            migrationBuilder.DropTable(
                name: "payout_items");

            migrationBuilder.DropTable(
                name: "pharmacy_orders");

            migrationBuilder.DropTable(
                name: "provider_availability_history");

            migrationBuilder.DropTable(
                name: "provider_certifications");

            migrationBuilder.DropTable(
                name: "provider_documents");

            migrationBuilder.DropTable(
                name: "provider_locations");

            migrationBuilder.DropTable(
                name: "provider_preferences");

            migrationBuilder.DropTable(
                name: "provider_schedules");

            migrationBuilder.DropTable(
                name: "provider_service_presets");

            migrationBuilder.DropTable(
                name: "provider_unavailability");

            migrationBuilder.DropTable(
                name: "push_tokens");

            migrationBuilder.DropTable(
                name: "referrals");

            migrationBuilder.DropTable(
                name: "refunds");

            migrationBuilder.DropTable(
                name: "review_reports");

            migrationBuilder.DropTable(
                name: "reward_transactions");

            migrationBuilder.DropTable(
                name: "service_addons");

            migrationBuilder.DropTable(
                name: "service_categories_config");

            migrationBuilder.DropTable(
                name: "service_photos");

            migrationBuilder.DropTable(
                name: "subscription_payments");

            migrationBuilder.DropTable(
                name: "support_ticket_messages");

            migrationBuilder.DropTable(
                name: "system_settings");

            migrationBuilder.DropTable(
                name: "tracking_sessions");

            migrationBuilder.DropTable(
                name: "user_behavior");

            migrationBuilder.DropTable(
                name: "user_sessions");

            migrationBuilder.DropTable(
                name: "veterinary_animal_types_config");

            migrationBuilder.DropTable(
                name: "veterinary_bookings");

            migrationBuilder.DropTable(
                name: "vital_signs");

            migrationBuilder.DropTable(
                name: "wallets");

            migrationBuilder.DropTable(
                name: "marketing_campaigns");

            migrationBuilder.DropTable(
                name: "discount_codes");

            migrationBuilder.DropTable(
                name: "disputes");

            migrationBuilder.DropTable(
                name: "insurance_coverages");

            migrationBuilder.DropTable(
                name: "accounts");

            migrationBuilder.DropTable(
                name: "ledger_transactions");

            migrationBuilder.DropTable(
                name: "conversations");

            migrationBuilder.DropTable(
                name: "payouts");

            migrationBuilder.DropTable(
                name: "reviews");

            migrationBuilder.DropTable(
                name: "badges");

            migrationBuilder.DropTable(
                name: "subscriptions");

            migrationBuilder.DropTable(
                name: "support_tickets");

            migrationBuilder.DropTable(
                name: "payments");

            migrationBuilder.DropTable(
                name: "bookings");

            migrationBuilder.DropTable(
                name: "provider_wallet_top_ups");

            migrationBuilder.DropTable(
                name: "family_members");

            migrationBuilder.DropTable(
                name: "services");

            migrationBuilder.DropTable(
                name: "patients");

            migrationBuilder.DropTable(
                name: "providers");

            migrationBuilder.DropTable(
                name: "stored_files");

            migrationBuilder.DropTable(
                name: "users");
        }
    }
}
