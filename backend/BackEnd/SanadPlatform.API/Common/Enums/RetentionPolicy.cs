namespace SanadPlatform.API.Common.Enums;

/// <summary>
/// Defines how long a document must be retained before it can be purged.
/// </summary>
public enum RetentionPolicy
{
    /// <summary>Medical records retained for 7 years per healthcare regulations.</summary>
    Medical7Years,

    /// <summary>Temporary files retained for 30 days (e.g. upload staging).</summary>
    Temporary30Days,

    /// <summary>Standard documents retained for 1 year.</summary>
    Standard1Year,

    /// <summary>Documents retained indefinitely with no automatic expiration.</summary>
    Indefinite
}
