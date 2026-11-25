using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SanadPlatform.API.Infrastructure.Database.Migrations
{
    public partial class AddBookingAddonsSequence : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Creates a global sequence used by GenerateBookingNumberAsync.
            // Using IF NOT EXISTS so re-running is safe.
            migrationBuilder.Sql(
                "CREATE SEQUENCE IF NOT EXISTS booking_number_seq START WITH 1 INCREMENT BY 1 NO CYCLE;");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                "DROP SEQUENCE IF EXISTS booking_number_seq;");
        }
    }
}
