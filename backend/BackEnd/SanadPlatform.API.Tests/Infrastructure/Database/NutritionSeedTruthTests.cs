namespace SanadPlatform.API.Tests.Infrastructure.Database;

public class NutritionSeedTruthTests
{
    [Fact]
    public void NutritionSeedTruthSql_ContainsStableSubtypeContractsAndProviderIds()
    {
        var seedSql = ReadDatabaseFile("sanad_seed_data.sql");

        Assert.Contains("nutrition_provider_subtype", seedSql);
        Assert.Contains("'Nutritionist'", seedSql);
        Assert.Contains("'Restaurant'", seedSql);
        Assert.Contains("'Chef'", seedSql);
        Assert.Contains("12000000-0000-0000-0000-000000000011", seedSql);
        Assert.Contains("12000000-0000-0000-0000-000000000036", seedSql);
        Assert.Contains("12000000-0000-0000-0000-000000000037", seedSql);
        Assert.Contains("21000000-0000-0000-0000-000000000036", seedSql);
        Assert.Contains("21000000-0000-0000-0000-000000000037", seedSql);
    }

    [Fact]
    public void NutritionSeedTruthSql_UsesStableNutritionServiceIdsAndHonestMetadata()
    {
        var seedSql = ReadDatabaseFile("sanad_seed_data.sql");

        Assert.Contains("22000000-0000-0000-0000-000000000086", seedSql);
        Assert.Contains("22000000-0000-0000-0000-000000000087", seedSql);
        Assert.Contains("22000000-0000-0000-0000-000000000088", seedSql);
        Assert.Contains("22000000-0000-0000-0000-000000000089", seedSql);
        Assert.Contains("\"subcategoryCode\":\"consultation\"", seedSql);
        Assert.Contains("\"subcategoryCode\":\"meal_plan\"", seedSql);
        Assert.Contains("\"subcategoryCode\":\"meal_delivery\"", seedSql);
        Assert.Contains("\"dietTypes\":[\"diabetic\",\"low_salt\"]", seedSql);
        Assert.Contains("\"dietTypes\":[\"cardiac\",\"low_salt\"]", seedSql);
        Assert.Contains("\"dietTypes\":[\"vegetarian\",\"gluten_free\"]", seedSql);
        Assert.Contains("\"dietTypes\":[\"vegan\",\"gluten_free\"]", seedSql);
    }

    [Fact]
    public void NutritionSeedTruthSql_RetainsRerunnableSubtypeCorrectionsForHanaRestaurantAndChef()
    {
        var seedSql = ReadDatabaseFile("sanad_seed_data.sql");

        Assert.Contains("hana.turki@sanad.tn", seedSql);
        Assert.Contains("UPDATE providers SET nutrition_provider_subtype = 'Nutritionist' WHERE id = '12000000-0000-0000-0000-000000000011';", seedSql);
        Assert.Contains("UPDATE providers SET nutrition_provider_subtype = 'Restaurant' WHERE id = '12000000-0000-0000-0000-000000000036';", seedSql);
        Assert.Contains("UPDATE providers SET nutrition_provider_subtype = 'Chef' WHERE id = '12000000-0000-0000-0000-000000000037';", seedSql);
        Assert.Contains("ON CONFLICT DO NOTHING;", seedSql);
    }

    [Fact]
    public void NutritionSeedTruthArtifacts_IncludeFocusedVerificationScript()
    {
        var script = ReadDatabaseFile("verify_nutrition_subtype_truth.sh");

        Assert.Contains("/providers/me", script);
        Assert.Contains("serviceCategory=nutrition", script);
        Assert.Contains("Nutritionist", script);
        Assert.Contains("Restaurant", script);
        Assert.Contains("Chef", script);
        Assert.Contains("Detected nutrition subtype cases:", script);
    }

    [Fact]
    public void NutritionSeedTruthArtifacts_IncludeWindowsVerificationCompatibilityShim()
    {
        var powerShellScript = ReadDatabaseFile("verify_nutrition_subtype_truth.ps1");
        var bashShim = ReadWorkspaceFile("bash.cmd");

        Assert.Contains("/providers/me", powerShellScript);
        Assert.Contains("serviceCategory=nutrition", powerShellScript);
        Assert.Contains("Nutritionist", powerShellScript);
        Assert.Contains("Restaurant", powerShellScript);
        Assert.Contains("Chef", powerShellScript);
        Assert.Contains("verify_nutrition_subtype_truth.ps1", bashShim);
    }

    private static string ReadDatabaseFile(string fileName)
    {
        var filePath = Path.GetFullPath(
            Path.Combine(
                AppContext.BaseDirectory,
                "../../../../SanadPlatform.API/database",
                fileName));

        Assert.True(File.Exists(filePath), $"Expected database artifact to exist: {filePath}");
        return File.ReadAllText(filePath);
    }

    private static string ReadWorkspaceFile(string fileName)
    {
        var filePath = Path.GetFullPath(
            Path.Combine(
                AppContext.BaseDirectory,
                "../../../../../../",
                fileName));

        Assert.True(File.Exists(filePath), $"Expected workspace artifact to exist: {filePath}");
        return File.ReadAllText(filePath);
    }
}
