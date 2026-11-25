using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SanadPlatform.API.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddProviderAvailabilityTrigger : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                """
                -- Function: inserts a history row when is_available changes on the providers table
                CREATE OR REPLACE FUNCTION fn_log_provider_availability_change()
                RETURNS TRIGGER AS $$
                BEGIN
                    IF OLD.is_available IS DISTINCT FROM NEW.is_available THEN
                        INSERT INTO provider_availability_history
                            (id, provider_id, is_available, status, status_changed_at, changed_by)
                        VALUES (
                            gen_random_uuid(),
                            NEW.id,
                            NEW.is_available,
                            CASE WHEN NEW.is_available THEN 'available' ELSE 'offline' END,
                            NOW(),
                            NEW.user_id
                        );
                    END IF;
                    RETURN NEW;
                END;
                $$ LANGUAGE plpgsql;

                -- Trigger: fires after each UPDATE on providers
                DROP TRIGGER IF EXISTS trg_provider_availability_change ON providers;
                CREATE TRIGGER trg_provider_availability_change
                    AFTER UPDATE ON providers
                    FOR EACH ROW
                    EXECUTE FUNCTION fn_log_provider_availability_change();
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                """
                DROP TRIGGER IF EXISTS trg_provider_availability_change ON providers;
                DROP FUNCTION IF EXISTS fn_log_provider_availability_change();
                """);
        }
    }
}
