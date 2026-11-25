namespace SanadPlatform.API.Features.Providers;

/// <summary>
/// Canonical constants and helpers for provider feature workflows.
/// </summary>
public static class ProviderConstants
{
    private static readonly Dictionary<string, string> ApprovalDocumentTypeAliases = new(StringComparer.OrdinalIgnoreCase)
    {
        ["professional_license"] = ApprovalDocumentTypes.License,
        ["professional-license"] = ApprovalDocumentTypes.License,
        ["license"] = ApprovalDocumentTypes.License,
        ["licence"] = ApprovalDocumentTypes.License,
        ["registration"] = ApprovalDocumentTypes.License,
        ["registration_number"] = ApprovalDocumentTypes.License,
        ["professional_registration"] = ApprovalDocumentTypes.License,
        ["id_card"] = ApprovalDocumentTypes.Identity,
        ["id-card"] = ApprovalDocumentTypes.Identity,
        ["identity_card"] = ApprovalDocumentTypes.Identity,
        ["identity-card"] = ApprovalDocumentTypes.Identity,
        ["identity"] = ApprovalDocumentTypes.Identity,
        ["national_id"] = ApprovalDocumentTypes.Identity,
        ["passport"] = ApprovalDocumentTypes.Identity,
        ["degree"] = ApprovalDocumentTypes.Diploma,
        ["diploma"] = ApprovalDocumentTypes.Diploma,
        ["diplome"] = ApprovalDocumentTypes.Diploma,
        ["pharmacist-degree"] = ApprovalDocumentTypes.Diploma,
        ["veterinary-degree"] = ApprovalDocumentTypes.Diploma,
        ["certificate"] = ApprovalDocumentTypes.Certification,
        ["certification"] = ApprovalDocumentTypes.Certification,
        ["capacity-certificate"] = ApprovalDocumentTypes.Certification,
        ["insurance-certificate"] = ApprovalDocumentTypes.Certification,
        ["liability-insurance"] = ApprovalDocumentTypes.Certification,
        ["exercise-license"] = ApprovalDocumentTypes.License,
        ["business-license"] = ApprovalDocumentTypes.License,
        ["prefectoral-license"] = ApprovalDocumentTypes.License,
        ["exercise-permit"] = ApprovalDocumentTypes.License,
        ["order-registration"] = ApprovalDocumentTypes.License,
        ["business-register"] = ApprovalDocumentTypes.License
    };

    /// <summary>
    /// Required normalized provider approval document types.
    /// </summary>
    public static class ApprovalDocumentTypes
    {
        public const string License = "license";
        public const string Identity = "id_card";
        public const string Diploma = "diploma";
        public const string Certification = "certification";

        public static readonly string[] Required =
        [
            License,
            Identity
        ];
    }

    /// <summary>
    /// Canonical lower snake-case document verification workflow statuses.
    /// </summary>
    public static class VerificationStatuses
    {
        public const string NotRequested = "not_requested";
        public const string Requested = "requested";
        public const string AiPrechecked = "ai_prechecked";
        public const string Approved = "approved";
        public const string Rejected = "rejected";

        public static readonly string[] All =
        [
            NotRequested,
            Requested,
            AiPrechecked,
            Approved,
            Rejected
        ];
    }

    /// <summary>
    /// Returns true when a provider may submit or resubmit a verification request.
    /// </summary>
    public static bool CanRequestVerification(string? verificationStatus)
    {
        return verificationStatus is VerificationStatuses.NotRequested or VerificationStatuses.Rejected;
    }

    /// <summary>
    /// Normalizes provider approval document type aliases to canonical values stored by provider documents.
    /// </summary>
    public static string NormalizeApprovalDocumentType(string documentType)
    {
        if (string.IsNullOrWhiteSpace(documentType))
        {
            return string.Empty;
        }

        var normalized = documentType.Trim().ToLowerInvariant();
        return ApprovalDocumentTypeAliases.TryGetValue(normalized, out var canonical)
            ? canonical
            : normalized;
    }

    /// <summary>
    /// Returns the required approval document types absent from the supplied document collection.
    /// </summary>
    public static string[] GetMissingRequiredApprovalDocumentTypes(IEnumerable<string> documentTypes)
    {
        var normalizedTypes = documentTypes
            .Select(NormalizeApprovalDocumentType)
            .Where(documentType => !string.IsNullOrWhiteSpace(documentType))
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        return ApprovalDocumentTypes.Required
            .Where(requiredType => !normalizedTypes.Contains(requiredType))
            .ToArray();
    }
}
