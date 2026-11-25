using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SanadPlatform.API.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddSessionLevelReviews : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DELETE FROM reviews;");

            migrationBuilder.DropIndex(
                name: "IX_reviews_booking_id",
                table: "reviews");

            migrationBuilder.AddColumn<Guid>(
                name: "booking_session_id",
                table: "reviews",
                type: "uuid",
                nullable: false);

            migrationBuilder.CreateIndex(
                name: "idx_reviews_booking",
                table: "reviews",
                column: "booking_id");

            migrationBuilder.CreateIndex(
                name: "ux_reviews_booking_session_id",
                table: "reviews",
                column: "booking_session_id",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_reviews_booking_sessions_booking_session_id",
                table: "reviews",
                column: "booking_session_id",
                principalTable: "booking_sessions",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_reviews_booking_sessions_booking_session_id",
                table: "reviews");

            migrationBuilder.DropIndex(
                name: "idx_reviews_booking",
                table: "reviews");

            migrationBuilder.DropIndex(
                name: "ux_reviews_booking_session_id",
                table: "reviews");

            migrationBuilder.DropColumn(
                name: "booking_session_id",
                table: "reviews");

            migrationBuilder.CreateIndex(
                name: "IX_reviews_booking_id",
                table: "reviews",
                column: "booking_id",
                unique: true);
        }
    }
}
