using System.Text.RegularExpressions;

namespace SanadPlatform.API.Tests.Features.Services.Presets;

public class ProviderServicePresetSeedTruthTests
{
    private static readonly string[] ExpectedProviderCategories =
    [
        "nursing",
        "physiotherapy",
        "doctor",
        "laboratory",
        "ambulance",
        "equipment_rental",
        "elderly_care",
        "psychology",
        "nutrition",
        "maternity",
        "night_care",
        "chronic_care",
        "radiology",
        "gym",
        "checkup",
        "medical_companion",
        "babysitting",
        "pharmacy",
        "funeral",
        "veterinary"
    ];

    private static readonly string[] StrictPolicyCategories =
    [
        "nutrition",
        "ambulance",
        "equipment_rental",
        "veterinary"
    ];

    [Fact]
    public void ProviderServicePresetSeedSql_ContainsInsertOnlySectionAndStableIds()
    {
        var seedSql = ReadDatabaseFile("sanad_seed_data.sql");
        var presetSection = ExtractPresetSection(seedSql);

        Assert.Contains("provider_service_presets", seedSql);
        Assert.Contains("-- PROVIDER SERVICE PRESETS (ON CONFLICT DO NOTHING", presetSection);
        Assert.Contains("ON CONFLICT (provider_category, code) DO NOTHING", presetSection);
        Assert.Contains("40000000-0000-0000-0001-000000000001", presetSection); // nursing
        Assert.Contains("40000000-0000-0000-0001-000000000009", presetSection); // ambulance
        Assert.Contains("40000000-0000-0000-0001-000000000011", presetSection); // equipment_rental
        Assert.Contains("40000000-0000-0000-0001-000000000017", presetSection); // nutrition
        Assert.Contains("40000000-0000-0000-0001-000000000039", presetSection); // veterinary
    }

    [Fact]
    public void ProviderServicePresetSeedSql_CoversCurrentProviderCategoriesWithAtLeastTwoFixedTndRowsEach()
    {
        var presetSection = ExtractPresetSection(ReadDatabaseFile("sanad_seed_data.sql"));

        Assert.Equal(40, CountOccurrences(presetSection, "'fixed', 'TND'"));

        Assert.All(ExpectedProviderCategories, category =>
        {
            var count = Regex.Matches(
                presetSection,
                $@", '{Regex.Escape(category)}', '",
                RegexOptions.CultureInvariant).Count;

            Assert.True(
                count >= 2,
                $"Expected at least 2 provider_service_presets rows for category '{category}', but found {count}.");
        });
    }

    [Fact]
    public void ProviderServicePresetSeedSql_UsesStrictPolicyMetadataKeys_AndLeavesOtherRowsNull()
    {
        var presetSection = ExtractPresetSection(ReadDatabaseFile("sanad_seed_data.sql"));
        var rowLines = presetSection
            .Split('\n', StringSplitOptions.RemoveEmptyEntries)
            .Where(line => line.TrimStart().StartsWith("('400", StringComparison.Ordinal)
                || line.TrimStart().StartsWith("('40000000", StringComparison.Ordinal)
                || line.TrimStart().StartsWith("('40000000-", StringComparison.Ordinal)
                || line.TrimStart().StartsWith("('40000000", StringComparison.Ordinal)
                || line.TrimStart().StartsWith("('400", StringComparison.Ordinal)
                || line.TrimStart().StartsWith("('4", StringComparison.Ordinal)
                || line.TrimStart().StartsWith("('", StringComparison.Ordinal))
            .ToArray();

        Assert.Contains("\"subcategoryCode\"", presetSection);
        Assert.Contains("\"serviceTypes\"", presetSection);
        Assert.Contains("\"equipment_type_code\"", presetSection);
        Assert.Contains("\"animalTypes\"", presetSection);

        Assert.All(
            rowLines.Where(line => StrictPolicyCategories.Any(category => line.Contains($"'{category}'", StringComparison.Ordinal))),
            line => Assert.Contains("::jsonb", line, StringComparison.Ordinal));

        Assert.All(
            rowLines.Where(line => StrictPolicyCategories.All(category => !line.Contains($"'{category}'", StringComparison.Ordinal))),
            line => Assert.Contains(", NULL, true,", line, StringComparison.Ordinal));
    }

    [Fact]
    public void ProviderServicePresetSeedSql_DoesNotContainUpdateStatements()
    {
        var seedSql = ReadDatabaseFile("sanad_seed_data.sql");

        Assert.DoesNotContain("UPDATE provider_service_presets", seedSql, StringComparison.OrdinalIgnoreCase);
    }

    private static string ExtractPresetSection(string seedSql)
    {
        var start = seedSql.IndexOf("-- PROVIDER SERVICE PRESETS", StringComparison.Ordinal);
        Assert.True(start >= 0, "Expected provider preset seed section to exist.");

        var end = seedSql.IndexOf("COMMIT;", start, StringComparison.Ordinal);
        Assert.True(end > start, "Expected provider preset seed section to appear before COMMIT.");

        return seedSql[start..end];
    }

    private static int CountOccurrences(string source, string value)
    {
        var count = 0;
        var index = 0;

        while ((index = source.IndexOf(value, index, StringComparison.Ordinal)) >= 0)
        {
            count++;
            index += value.Length;
        }

        return count;
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
}
