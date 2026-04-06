using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Jibz.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddSportType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "MapURL",
                table: "Mountains",
                newName: "MapImageURL");

            migrationBuilder.RenameColumn(
                name: "Score",
                table: "MountainRatings",
                newName: "Rating");

            migrationBuilder.AddColumn<int>(
                name: "SportType",
                table: "Users",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ClipSportTypes",
                columns: table => new
                {
                    ClipId = table.Column<int>(type: "INTEGER", nullable: false),
                    Sport = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClipSportTypes", x => new { x.ClipId, x.Sport });
                    table.ForeignKey(
                        name: "FK_ClipSportTypes_Clips_ClipId",
                        column: x => x.ClipId,
                        principalTable: "Clips",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ClipSportTypes");

            migrationBuilder.DropColumn(
                name: "SportType",
                table: "Users");

            migrationBuilder.RenameColumn(
                name: "MapImageURL",
                table: "Mountains",
                newName: "MapURL");

            migrationBuilder.RenameColumn(
                name: "Rating",
                table: "MountainRatings",
                newName: "Score");
        }
    }
}
