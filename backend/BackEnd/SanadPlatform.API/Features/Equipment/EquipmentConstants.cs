namespace SanadPlatform.API.Features.Equipment;

/// <summary>
/// Constants specific to the equipment catalog and rental feature.
/// System-wide concepts (service categories, payment statuses) live in Common/Constants/.
/// </summary>
public static class EquipmentConstants
{
    public const string CategoriesCacheKey = "equipment_categories_list";

    public static class RentalDurationTypes
    {
        public const string Daily = "daily";
        public const string Weekly = "weekly";
        public const string Monthly = "monthly";

        public static readonly IReadOnlyList<string> All = [Daily, Weekly, Monthly];
    }

    public static class SortFields
    {
        public const string PricePerDay = "pricePerDay";
        public const string Rating = "rating";
        public const string CreatedAt = "createdAt";

        public static readonly IReadOnlyList<string> All = [PricePerDay, Rating, CreatedAt];
    }
}
