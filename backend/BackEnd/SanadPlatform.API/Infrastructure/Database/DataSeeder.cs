using Microsoft.EntityFrameworkCore;
using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Admin.Entities;
using SanadPlatform.API.Features.AppFeatures;
using SanadPlatform.API.Features.AppFeatures.Entities;
using SanadPlatform.API.Features.Ambulance.Entities;
using SanadPlatform.API.Features.Equipment.Entities;
using SanadPlatform.API.Features.Nutrition.Entities;
using SanadPlatform.API.Features.Rewards.Entities;
using SanadPlatform.API.Features.Services.Entities;
using SanadPlatform.API.Features.Veterinary.Entities;

namespace SanadPlatform.API.Infrastructure.Database;

/// <summary>
/// Seeds essential reference data (service categories, equipment categories, system settings, badges)
/// on application startup. All operations are idempotent and safe to run on every boot.
/// </summary>
public class DataSeeder
{
    private readonly SanadDbContext _db;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<DataSeeder> _logger;

    public DataSeeder(SanadDbContext db, IUnitOfWork unitOfWork, ILogger<DataSeeder> logger)
    {
        _db = db;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    /// <summary>
    /// Entry point. Runs all seed operations inside a single transaction.
    /// </summary>
    public async Task SeedAsync(CancellationToken cancellationToken = default)
    {
        await _unitOfWork.BeginTransactionAsync(cancellationToken);
        try
        {
            await SeedAppFeaturesAsync(cancellationToken);
            await SeedServiceCategoriesAsync(cancellationToken);
            await SeedEquipmentCategoriesAsync(cancellationToken);
            await SeedNutritionSubcategoriesAsync(cancellationToken);
            await SeedNutritionDietTypesAsync(cancellationToken);
            await SeedAmbulanceServiceTypesAsync(cancellationToken);
            await SeedVeterinaryAnimalTypesAsync(cancellationToken);
            await SeedSystemSettingsAsync(cancellationToken);
            await SeedBadgesAsync(cancellationToken);

            await _unitOfWork.CommitTransactionAsync(cancellationToken);
            _logger.LogInformation("DataSeeder completed successfully.");
        }
        catch (Exception ex)
        {
            await _unitOfWork.RollbackTransactionAsync(cancellationToken);
            _logger.LogError(ex, "DataSeeder failed. Transaction rolled back.");
            throw;
        }
    }

    private async Task SeedAppFeaturesAsync(CancellationToken ct)
    {
        var existingFeatures = await _db.AppFeatures
            .ToListAsync(ct);

        var existingByCode = existingFeatures.ToDictionary(
            feature => feature.Code,
            StringComparer.Ordinal);

        var features = new[]
        {
            new AppFeature
            {
                Code = "family_circle",
                Name = "Cercle familial",
                Description = "Manage and share care access with family members.",
                IsActive = false,
                DisplayOrder = 10
            },
            new AppFeature
            {
                Code = "medicine_donation",
                Name = "Don de médicaments",
                Description = "Donate or access medication donation flows.",
                IsActive = false,
                DisplayOrder = 20
            },
            new AppFeature
            {
                Code = "health_concierge",
                Name = "Concierge santé",
                Description = "Access health concierge support flows.",
                IsActive = false,
                DisplayOrder = 30
            },
            new AppFeature
            {
                Code = "health_tracking",
                Name = "Suivi santé",
                Description = "Access health tracking screens and shortcuts.",
                IsActive = false,
                DisplayOrder = 40
            },
            new AppFeature
            {
                Code = AppFeatureCodes.BookingPaymentCard,
                Name = "Paiement par carte bancaire",
                Description = "Controls visibility of bank card payment in booking flows.",
                IsActive = false,
                DisplayOrder = 50
            },
            new AppFeature
            {
                Code = AppFeatureCodes.BookingPaymentD17,
                Name = "Paiement D17",
                Description = "Controls visibility of D17 payment in booking flows.",
                IsActive = false,
                DisplayOrder = 60
            }
        };

        var addedCount = 0;
        var patchedCount = 0;

        foreach (var seed in features)
        {
            if (!existingByCode.TryGetValue(seed.Code, out var existing))
            {
                _db.AppFeatures.Add(seed);
                addedCount++;
                continue;
            }

            var changed = false;

            if (existing.Name != seed.Name)
            {
                existing.Name = seed.Name;
                changed = true;
            }

            if (existing.Description != seed.Description)
            {
                existing.Description = seed.Description;
                changed = true;
            }

            if (existing.DisplayOrder != seed.DisplayOrder)
            {
                existing.DisplayOrder = seed.DisplayOrder;
                changed = true;
            }

            if (changed)
            {
                patchedCount++;
            }
        }

        if (addedCount > 0 || patchedCount > 0)
        {
            await _unitOfWork.SaveChangesAsync(ct);

            _logger.LogInformation(
                "Seeded {AddedCount} app feature(s) and patched metadata for {PatchedCount} app feature(s).",
                addedCount,
                patchedCount);
        }
        else
        {
            _logger.LogDebug("App features already seeded, skipping.");
        }
    }

    private async Task SeedServiceCategoriesAsync(CancellationToken ct)
    {
        var existingCodes = (await _db.ServiceCategoryConfigs
            .AsNoTracking()
            .Select(s => s.Code)
            .ToListAsync(ct))
            .ToHashSet();

        var categories = new[]
        {
            new ServiceCategoryConfig
            {
                Code = "nursing",
                NameEn = "Nursing Care",
                NameFr = "Soins Infirmiers",
                DescriptionEn = "Injections, wound care, infusions, blood draws.",
                DescriptionFr = "Injections, pansements, perfusions, prise de sang.",
                Icon = "syringe",
                Color = "#06b6d4,#3b82f6",
                DefaultCommissionRate = 15m,
                DisplayGroup = DisplayGroup.Medical,
                DisplayOrder = 1
            },
            new ServiceCategoryConfig
            {
                Code = "elderly_care",
                NameEn = "Elderly Care",
                NameFr = "Aide aux Seniors",
                DescriptionEn = "Bathing, dressing, meals, companionship.",
                DescriptionFr = "Toilette, habillage, repas, compagnie.",
                Icon = "heart",
                Color = "#f43f5e,#ec4899",
                DefaultCommissionRate = 12m,
                DisplayGroup = DisplayGroup.Daily,
                DisplayOrder = 2
            },
            new ServiceCategoryConfig
            {
                Code = "physiotherapy",
                NameEn = "Physiotherapy",
                NameFr = "Kinésithérapie",
                DescriptionEn = "Motor, respiratory rehabilitation, massage.",
                DescriptionFr = "Rééducation motrice, respiratoire, massage.",
                Icon = "activity",
                Color = "#3b82f6,#a855f7",
                DefaultCommissionRate = 18m,
                DisplayGroup = DisplayGroup.Rehabilitation,
                DisplayOrder = 3
            },
            new ServiceCategoryConfig
            {
                Code = "doctor",
                NameEn = "Doctor at Home",
                NameFr = "Médecin à Domicile",
                DescriptionEn = "General or specialist consultations at home.",
                DescriptionFr = "Généraliste ou spécialiste. Consultations à domicile.",
                Icon = "stethoscope",
                Color = "#3b82f6,#06b6d4",
                DefaultCommissionRate = 20m,
                DisplayGroup = DisplayGroup.Medical,
                DisplayOrder = 4
            },
            new ServiceCategoryConfig
            {
                Code = "maternity",
                NameEn = "Maternity Care",
                NameFr = "Soins Maternité",
                DescriptionEn = "Post-natal care, breastfeeding, baby care.",
                DescriptionFr = "Suivi post-natal, allaitement, soins bébé.",
                Icon = "baby",
                Color = "#f59e0b,#f97316",
                DefaultCommissionRate = 15m,
                DisplayGroup = DisplayGroup.Daily,
                DisplayOrder = 5
            },
            new ServiceCategoryConfig
            {
                Code = "night_care",
                NameEn = "Night Care",
                NameFr = "Garde de Nuit",
                DescriptionEn = "Overnight monitoring and assistance (12h).",
                DescriptionFr = "Surveillance et assistance nocturne (12h).",
                Icon = "user-check",
                Color = "#6366f1,#a855f7",
                DefaultCommissionRate = 12m,
                DisplayGroup = DisplayGroup.Daily,
                DisplayOrder = 6
            },
            new ServiceCategoryConfig
            {
                Code = "psychology",
                NameEn = "Psychology",
                NameFr = "Soutien Psychologique",
                DescriptionEn = "Seniors, caregivers. Home therapy sessions.",
                DescriptionFr = "Dépression seniors, aidants familiaux. Séances à domicile.",
                Icon = "brain",
                Color = "#ec4899,#f43f5e",
                DefaultCommissionRate = 15m,
                DisplayGroup = DisplayGroup.Wellness,
                DisplayOrder = 7
            },
            new ServiceCategoryConfig
            {
                Code = "chronic_care",
                NameEn = "Chronic Care",
                NameFr = "Soins Chroniques",
                DescriptionEn = "Diabetes, hypertension, cancer. Weekly/monthly packages.",
                DescriptionFr = "Diabète, HTA, cancer. Forfaits hebdomadaires/mensuels.",
                Icon = "calendar",
                Color = "#a855f7,#ec4899",
                Badge = "Abonnement",
                DefaultCommissionRate = 15m,
                DisplayGroup = DisplayGroup.Rehabilitation,
                DisplayOrder = 8
            },
            new ServiceCategoryConfig
            {
                Code = "laboratory",
                NameEn = "Laboratory",
                NameFr = "Laboratoire",
                DescriptionEn = "Medical analyses, home sample collection, online results.",
                DescriptionFr = "Analyses médicales, prélèvements à domicile, résultats en ligne.",
                Icon = "flask-conical",
                Color = "#3b82f6,#6366f1",
                Badge = "Nouveau",
                DefaultCommissionRate = 10m,
                DisplayGroup = DisplayGroup.Medical,
                DisplayOrder = 9
            },
            new ServiceCategoryConfig
            {
                Code = "radiology",
                NameEn = "Radiology",
                NameFr = "Radiologie",
                DescriptionEn = "X-ray, ultrasound, CT, MRI. Quick appointments.",
                DescriptionFr = "Radio, échographie, scanner, IRM. Rendez-vous rapides.",
                Icon = "scan",
                Color = "#a855f7,#6366f1",
                Badge = "Nouveau",
                DefaultCommissionRate = 10m,
                DisplayGroup = DisplayGroup.Medical,
                DisplayOrder = 10
            },
            new ServiceCategoryConfig
            {
                Code = "ambulance",
                NameEn = "Ambulance",
                NameFr = "Ambulance",
                DescriptionEn = "Medical transport, hospital–home, inter-clinic.",
                DescriptionFr = "Transport médicalisé, hôpital–domicile, inter-cliniques.",
                Icon = "ambulance",
                Color = "#ef4444,#f43f5e",
                Badge = "Premium",
                DefaultCommissionRate = 12m,
                DisplayGroup = DisplayGroup.Medical,
                DisplayOrder = 11
            },
            new ServiceCategoryConfig
            {
                Code = "nutrition",
                NameEn = "Nutrition",
                NameFr = "Nutrition",
                DescriptionEn = "Diabetic, low-salt, post-hospitalisation meals.",
                DescriptionFr = "Repas diabétiques, pauvres en sel, post-hospitalisation.",
                Icon = "utensils-crossed",
                Color = "#f59e0b,#eab308",
                DefaultCommissionRate = 15m,
                DisplayGroup = DisplayGroup.Wellness,
                DisplayOrder = 12
            },
            new ServiceCategoryConfig
            {
                Code = "equipment_rental",
                NameEn = "Equipment Rental",
                NameFr = "Location Équipement",
                DescriptionEn = "Wheelchairs, beds, medical devices for home use.",
                DescriptionFr = "Fauteuils roulants, lits, dispositifs médicaux à domicile.",
                Icon = "accessibility",
                Color = "#64748b,#3b82f6",
                DefaultCommissionRate = 15m,
                DisplayGroup = DisplayGroup.Daily,
                DisplayOrder = 13
            },
            new ServiceCategoryConfig
            {
                Code = "gym",
                NameEn = "Gym & Fitness",
                NameFr = "Salle de Sport",
                DescriptionEn = "Fitness, weight training, group classes. Flexible plans.",
                DescriptionFr = "Fitness, musculation, cours collectifs. Abonnements flexibles.",
                Icon = "trophy",
                Color = "#f59e0b,#f97316",
                Badge = "Nouveau",
                DefaultCommissionRate = 20m,
                DisplayGroup = DisplayGroup.Wellness,
                DisplayOrder = 14
            },
            new ServiceCategoryConfig
            {
                Code = "checkup",
                NameEn = "Health Checkup",
                NameFr = "Bilan de Santé",
                DescriptionEn = "Vital signs, blood pressure, blood sugar monitoring.",
                DescriptionFr = "Prise de constantes, tension, glycémie.",
                Icon = "thermometer",
                Color = "#22c55e,#10b981",
                DefaultCommissionRate = 15m,
                DisplayGroup = DisplayGroup.Medical,
                DisplayOrder = 15
            },
            new ServiceCategoryConfig
            {
                Code = "medical_companion",
                NameEn = "Medical Companion",
                NameFr = "Accompagnement Médical",
                DescriptionEn = "Hospital visits, appointments, administrative support.",
                DescriptionFr = "Accompagnement hôpital, rendez-vous, démarches administratives.",
                Icon = "hand-heart",
                Color = "#14b8a6,#06b6d4",
                DefaultCommissionRate = 12m,
                DisplayGroup = DisplayGroup.Daily,
                DisplayOrder = 16
            },
            new ServiceCategoryConfig
            {
                Code = "babysitting",
                NameEn = "Babysitting",
                NameFr = "Baby Sitting",
                DescriptionEn = "Professional in-home childcare services.",
                DescriptionFr = "Garde d'enfants à domicile par des professionnels qualifiés.",
                Icon = "smile",
                Color = "#ec4899,#f43f5e",
                Badge = "Nouveau",
                DefaultCommissionRate = 12m,
                DisplayGroup = DisplayGroup.Daily,
                DisplayOrder = 17
            },
            new ServiceCategoryConfig
            {
                Code = "pharmacy",
                NameEn = "Pharmacy",
                NameFr = "Pharmacie",
                DescriptionEn = "Pharmaceutical services, screenings, medication delivery.",
                DescriptionFr = "Services pharmaceutiques, dépistages, livraison de médicaments.",
                Icon = "pill",
                Color = "#22c55e,#14b8a6",
                DefaultCommissionRate = 10m,
                DisplayGroup = DisplayGroup.Medical,
                DisplayOrder = 18
            },
            new ServiceCategoryConfig
            {
                Code = "funeral",
                NameEn = "Funeral Services",
                NameFr = "Services Funéraires",
                DescriptionEn = "Dignified bereavement support and funeral arrangements.",
                DescriptionFr = "Accompagnement et organisation des obsèques avec dignité.",
                Icon = "flower-2",
                Color = "#64748b,#6b7280",
                DefaultCommissionRate = 15m,
                DisplayGroup = DisplayGroup.Daily,
                DisplayOrder = 19
            },
            new ServiceCategoryConfig
            {
                Code = "veterinary",
                NameEn = "Veterinary",
                NameFr = "Vétérinaire",
                DescriptionEn = "Veterinary care, vaccination, surgery, grooming, and emergencies.",
                DescriptionFr = "Soins vétérinaires, vaccination, chirurgie, toilettage et urgences.",
                Icon = "paw-print",
                Color = "#10b981,#22c55e",
                DefaultCommissionRate = 15m,
                DisplayGroup = DisplayGroup.Wellness,
                DisplayOrder = 20
            }
        };

        var toAdd = categories.Where(c => !existingCodes.Contains(c.Code)).ToList();
        if (toAdd.Count > 0)
        {
            _db.ServiceCategoryConfigs.AddRange(toAdd);
            _logger.LogInformation("Seeded {Count} new service categories.", toAdd.Count);
        }

        // Patch descriptions for existing categories that were seeded before descriptions were added
        var needsDescriptionUpdate = await _db.ServiceCategoryConfigs
            .Where(c => c.DescriptionEn == null)
            .ToListAsync(ct);

        if (needsDescriptionUpdate.Count > 0)
        {
            var seedLookup = categories.ToDictionary(c => c.Code);
            foreach (var existing in needsDescriptionUpdate)
            {
                if (seedLookup.TryGetValue(existing.Code, out var seed))
                {
                    existing.DescriptionEn = seed.DescriptionEn;
                    existing.DescriptionFr = seed.DescriptionFr;
                }
            }
            _logger.LogInformation("Updated descriptions for {Count} existing service categories.", needsDescriptionUpdate.Count);
        }

        // Patch Icon, Color, and Badge for existing categories to match frontend UI metadata
        var allExisting = await _db.ServiceCategoryConfigs.ToListAsync(ct);
        var uiMetaLookup = categories.ToDictionary(c => c.Code);
        var uiMetaPatched = 0;
        foreach (var existing in allExisting)
        {
            if (uiMetaLookup.TryGetValue(existing.Code, out var seed))
            {
                var changed = false;
                if (existing.Icon != seed.Icon) { existing.Icon = seed.Icon; changed = true; }
                if (existing.Color != seed.Color) { existing.Color = seed.Color; changed = true; }
                if (existing.Badge != seed.Badge) { existing.Badge = seed.Badge; changed = true; }
                if (changed) uiMetaPatched++;
            }
        }
        if (uiMetaPatched > 0)
            _logger.LogInformation("Patched Icon/Color/Badge for {Count} existing service categories.", uiMetaPatched);

        if (toAdd.Count > 0 || needsDescriptionUpdate.Count > 0 || uiMetaPatched > 0)
        {
            await _unitOfWork.SaveChangesAsync(ct);
        }
        else
        {
            _logger.LogDebug("Service categories already up to date, skipping.");
        }

        // Recalculate MinPrice/MaxPrice from active services for all categories
        await RecalculateCategoryPricesAsync(ct);
    }

    /// <summary>
    /// Recalculates MinPrice and MaxPrice on all service categories by aggregating
    /// prices across active services. Runs on every boot to keep denormalized
    /// pricing in sync with the current service set.
    /// </summary>
    private async Task RecalculateCategoryPricesAsync(CancellationToken ct)
    {
        var pricesByCategory = await _db.Services
            .AsNoTracking()
            .Where(s => s.IsActive)
            .GroupBy(s => s.Category)
            .Select(g => new
            {
                Category = g.Key,
                Min = g.Min(s => s.MinPrice ?? s.Price),
                Max = g.Max(s => s.MaxPrice ?? s.Price)
            })
            .ToDictionaryAsync(x => x.Category, ct);

        if (pricesByCategory.Count == 0)
        {
            _logger.LogDebug("No active services found, skipping category price recalculation.");
            return;
        }

        var categories = await _db.ServiceCategoryConfigs.ToListAsync(ct);
        var updated = 0;

        foreach (var config in categories)
        {
            if (pricesByCategory.TryGetValue(config.Code, out var prices))
            {
                if (config.MinPrice != prices.Min || config.MaxPrice != prices.Max)
                {
                    config.MinPrice = prices.Min;
                    config.MaxPrice = prices.Max;
                    updated++;
                }
            }
            else if (config.MinPrice != null || config.MaxPrice != null)
            {
                // No active services for this category — clear stale prices
                config.MinPrice = null;
                config.MaxPrice = null;
                updated++;
            }
        }

        if (updated > 0)
        {
            await _unitOfWork.SaveChangesAsync(ct);
            _logger.LogInformation("Recalculated MinPrice/MaxPrice for {Count} service categories.", updated);
        }
        else
        {
            _logger.LogDebug("Category prices already up to date, skipping.");
        }
    }

    private async Task SeedEquipmentCategoriesAsync(CancellationToken ct)
    {
        var existingCodes = (await _db.EquipmentCategoryConfigs
            .AsNoTracking()
            .Select(c => c.Code)
            .ToListAsync(ct))
            .ToHashSet();

        var categories = new[]
        {
            new EquipmentCategoryConfig { Code = "mobilite",         NameEn = "Mobility",          NameFr = "Mobilité",           NameAr = "التنقل",          Icon = "wheelchair",    Color = "#3b82f6", DefaultCommissionRate = 12m, DisplayOrder = 1 },
            new EquipmentCategoryConfig { Code = "respiratoire",     NameEn = "Respiratory",       NameFr = "Respiratoire",       NameAr = "الجهاز التنفسي", Icon = "wind",          Color = "#22c55e", DefaultCommissionRate = 15m, DisplayOrder = 2 },
            new EquipmentCategoryConfig { Code = "lit_medicalise",   NameEn = "Medical Bed",       NameFr = "Lit médicalisé",     NameAr = "سرير طبي",       Icon = "bed",           Color = "#6366f1", DefaultCommissionRate = 15m, DisplayOrder = 3 },
            new EquipmentCategoryConfig { Code = "monitoring",       NameEn = "Monitoring",        NameFr = "Monitoring",         NameAr = "المراقبة",       Icon = "heart-pulse",   Color = "#ef4444", DefaultCommissionRate = 10m, DisplayOrder = 4 },
            new EquipmentCategoryConfig { Code = "reeducation",      NameEn = "Rehabilitation",    NameFr = "Rééducation",        NameAr = "إعادة التأهيل",  Icon = "activity",      Color = "#f97316", DefaultCommissionRate = 10m, DisplayOrder = 5 },
            new EquipmentCategoryConfig { Code = "aide_quotidienne", NameEn = "Daily Living Aid",  NameFr = "Aide quotidienne",   NameAr = "المساعدة اليومية", Icon = "home",        Color = "#14b8a6", DefaultCommissionRate = 10m, DisplayOrder = 6 },
        };

        var toAdd = categories.Where(c => !existingCodes.Contains(c.Code)).ToList();
        if (toAdd.Count == 0)
        {
            _logger.LogDebug("Equipment categories already seeded, skipping.");
            return;
        }

        _db.EquipmentCategoryConfigs.AddRange(toAdd);
        await _unitOfWork.SaveChangesAsync(ct);
        _logger.LogInformation("Seeded {Count} equipment categories.", toAdd.Count);
    }

    private async Task SeedNutritionSubcategoriesAsync(CancellationToken ct)
    {
        var existingCodes = (await _db.NutritionSubcategoryConfigs
            .AsNoTracking()
            .Select(c => c.Code)
            .ToListAsync(ct))
            .ToHashSet();

        var subcategories = new[]
        {
            new NutritionSubcategoryConfig { Code = "consultation", NameEn = "Consultation", NameFr = "Consultation", NameAr = "استشارة تغذية", Icon = "stethoscope", Color = "#06b6d4", DisplayOrder = 1 },
            new NutritionSubcategoryConfig { Code = "meal_plan", NameEn = "Meal Plan", NameFr = "Plan alimentaire", NameAr = "خطة وجبات", Icon = "clipboard-list", Color = "#f59e0b", DisplayOrder = 2 },
            new NutritionSubcategoryConfig { Code = "meal_delivery", NameEn = "Meal Delivery", NameFr = "Livraison de repas", NameAr = "توصيل وجبات", Icon = "truck", Color = "#22c55e", DisplayOrder = 3 },
        };

        var toAdd = subcategories.Where(c => !existingCodes.Contains(c.Code)).ToList();
        if (toAdd.Count == 0)
        {
            _logger.LogDebug("Nutrition subcategories already seeded, skipping.");
            return;
        }

        _db.NutritionSubcategoryConfigs.AddRange(toAdd);
        await _unitOfWork.SaveChangesAsync(ct);
        _logger.LogInformation("Seeded {Count} nutrition subcategories.", toAdd.Count);
    }

    private async Task SeedNutritionDietTypesAsync(CancellationToken ct)
    {
        var existingCodes = (await _db.NutritionDietTypeConfigs
            .AsNoTracking()
            .Select(c => c.Code)
            .ToListAsync(ct))
            .ToHashSet();

        var dietTypes = new[]
        {
            new NutritionDietTypeConfig { Code = "diabetic", NameEn = "Diabetic", NameFr = "Diabétique", NameAr = "للسكري", Icon = "activity", Color = "#ef4444", DisplayOrder = 1 },
            new NutritionDietTypeConfig { Code = "low_salt", NameEn = "Low Salt", NameFr = "Faible en sel", NameAr = "قليل الملح", Icon = "salt", Color = "#64748b", DisplayOrder = 2 },
            new NutritionDietTypeConfig { Code = "cardiac", NameEn = "Cardiac", NameFr = "Cardiaque", NameAr = "للقلب", Icon = "heart-pulse", Color = "#ec4899", DisplayOrder = 3 },
            new NutritionDietTypeConfig { Code = "gluten_free", NameEn = "Gluten Free", NameFr = "Sans gluten", NameAr = "خالٍ من الغلوتين", Icon = "wheat-off", Color = "#f97316", DisplayOrder = 4 },
            new NutritionDietTypeConfig { Code = "vegetarian", NameEn = "Vegetarian", NameFr = "Végétarien", NameAr = "نباتي", Icon = "leaf", Color = "#22c55e", DisplayOrder = 5 },
            new NutritionDietTypeConfig { Code = "vegan", NameEn = "Vegan", NameFr = "Végétalien", NameAr = "نباتي صرف", Icon = "sprout", Color = "#16a34a", DisplayOrder = 6 },
        };

        var toAdd = dietTypes.Where(c => !existingCodes.Contains(c.Code)).ToList();
        if (toAdd.Count == 0)
        {
            _logger.LogDebug("Nutrition diet types already seeded, skipping.");
            return;
        }

        _db.NutritionDietTypeConfigs.AddRange(toAdd);
        await _unitOfWork.SaveChangesAsync(ct);
        _logger.LogInformation("Seeded {Count} nutrition diet types.", toAdd.Count);
    }

    private async Task SeedAmbulanceServiceTypesAsync(CancellationToken ct)
    {
        var existingCodes = (await _db.AmbulanceServiceTypeConfigs
            .AsNoTracking()
            .Select(c => c.Code)
            .ToListAsync(ct))
            .ToHashSet();

        var serviceTypes = new[]
        {
            new AmbulanceServiceTypeConfig { Code = "emergency", NameEn = "Emergency", NameFr = "Urgence", NameAr = "طوارئ", Icon = "ambulance", Color = "#ef4444", DisplayOrder = 1 },
            new AmbulanceServiceTypeConfig { Code = "inter_hospital", NameEn = "Inter-Hospital", NameFr = "Inter-hospitalier", NameAr = "بين المستشفيات", Icon = "building-2", Color = "#3b82f6", DisplayOrder = 2 },
            new AmbulanceServiceTypeConfig { Code = "repatriation", NameEn = "Repatriation", NameFr = "Rapatriement", NameAr = "إعادة إلى الوطن", Icon = "plane", Color = "#8b5cf6", DisplayOrder = 3 },
            new AmbulanceServiceTypeConfig { Code = "event_assistance", NameEn = "Event Assistance", NameFr = "Assistance événementielle", NameAr = "مساندة الفعاليات", Icon = "shield-plus", Color = "#f59e0b", DisplayOrder = 4 },
        };

        var toAdd = serviceTypes.Where(c => !existingCodes.Contains(c.Code)).ToList();
        if (toAdd.Count == 0)
        {
            _logger.LogDebug("Ambulance service types already seeded, skipping.");
            return;
        }

        _db.AmbulanceServiceTypeConfigs.AddRange(toAdd);
        await _unitOfWork.SaveChangesAsync(ct);
        _logger.LogInformation("Seeded {Count} ambulance service types.", toAdd.Count);
    }

    private async Task SeedVeterinaryAnimalTypesAsync(CancellationToken ct)
    {
        var existingCodes = (await _db.VeterinaryAnimalTypeConfigs
            .AsNoTracking()
            .Select(c => c.Code)
            .ToListAsync(ct))
            .ToHashSet();

        var animalTypes = new[]
        {
            new VeterinaryAnimalTypeConfig { Code = "dog", NameEn = "Dog", NameFr = "Chien", NameAr = "كلب", Icon = "paw-print", Color = "#f59e0b", DisplayOrder = 1 },
            new VeterinaryAnimalTypeConfig { Code = "cat", NameEn = "Cat", NameFr = "Chat", NameAr = "قط", Icon = "cat", Color = "#8b5cf6", DisplayOrder = 2 },
            new VeterinaryAnimalTypeConfig { Code = "bird", NameEn = "Bird", NameFr = "Oiseau", NameAr = "طائر", Icon = "bird", Color = "#06b6d4", DisplayOrder = 3 },
            new VeterinaryAnimalTypeConfig { Code = "reptile", NameEn = "Reptile", NameFr = "Reptile", NameAr = "زاحف", Icon = "turtle", Color = "#22c55e", DisplayOrder = 4 },
            new VeterinaryAnimalTypeConfig { Code = "nac", NameEn = "Exotic Pets", NameFr = "NAC", NameAr = "حيوانات أليفة جديدة", Icon = "rabbit", Color = "#ec4899", DisplayOrder = 5 },
            new VeterinaryAnimalTypeConfig { Code = "horse", NameEn = "Horse", NameFr = "Cheval", NameAr = "حصان", Icon = "badge-plus", Color = "#a16207", DisplayOrder = 6 },
        };

        var toAdd = animalTypes.Where(c => !existingCodes.Contains(c.Code)).ToList();
        if (toAdd.Count == 0)
        {
            _logger.LogDebug("Veterinary animal types already seeded, skipping.");
            return;
        }

        _db.VeterinaryAnimalTypeConfigs.AddRange(toAdd);
        await _unitOfWork.SaveChangesAsync(ct);
        _logger.LogInformation("Seeded {Count} veterinary animal types.", toAdd.Count);
    }

    private async Task SeedSystemSettingsAsync(CancellationToken ct)
    {
        var existingKeys = (await _db.SystemSettings
            .AsNoTracking()
            .Select(s => s.SettingKey)
            .ToListAsync(ct))
            .ToHashSet();

        var settings = new[]
        {
            new SystemSetting
            {
                SettingKey = "platform_commission_rate",
                SettingValue = "15",
                SettingType = "number",
                Description = "Default platform commission percentage",
                IsPublic = false
            },
            new SystemSetting
            {
                SettingKey = "escrow_hold_hours",
                SettingValue = "48",
                SettingType = "number",
                Description = "Hours to hold payment in escrow after service completion",
                IsPublic = false
            },
            new SystemSetting
            {
                SettingKey = "auto_validate_hours",
                SettingValue = "48",
                SettingType = "number",
                Description = "Hours after which booking auto-validates if no dispute",
                IsPublic = false
            },
            new SystemSetting
            {
                SettingKey = "min_booking_notice_hours",
                SettingValue = "2",
                SettingType = "number",
                Description = "Minimum hours notice required for booking",
                IsPublic = true
            },
            new SystemSetting
            {
                SettingKey = "max_booking_advance_days",
                SettingValue = "365",
                SettingType = "number",
                Description = "Maximum days in advance a booking can be made",
                IsPublic = true
            },
            new SystemSetting
            {
                SettingKey = "cancellation_fee_percentage",
                SettingValue = "10",
                SettingType = "number",
                Description = "Cancellation fee percentage if cancelled within 24h",
                IsPublic = true
            },
            new SystemSetting
            {
                SettingKey = "referral_points_referrer",
                SettingValue = "100",
                SettingType = "number",
                Description = "Points awarded to referrer",
                IsPublic = false
            },
            new SystemSetting
            {
                SettingKey = "referral_points_referred",
                SettingValue = "50",
                SettingType = "number",
                Description = "Points awarded to referred user",
                IsPublic = false
            },
            new SystemSetting
            {
                SettingKey = "points_per_booking",
                SettingValue = "10",
                SettingType = "number",
                Description = "Points earned per completed booking",
                IsPublic = false
            },
            new SystemSetting
            {
                SettingKey = "points_per_review",
                SettingValue = "5",
                SettingType = "number",
                Description = "Points earned per review submitted",
                IsPublic = false
            }
        };

        var toAdd = settings.Where(s => !existingKeys.Contains(s.SettingKey)).ToList();
        if (toAdd.Count == 0)
        {
            _logger.LogDebug("System settings already seeded, skipping.");
            return;
        }

        _db.SystemSettings.AddRange(toAdd);
        await _unitOfWork.SaveChangesAsync(ct);
        _logger.LogInformation("Seeded {Count} system settings.", toAdd.Count);
    }

    private async Task SeedBadgesAsync(CancellationToken ct)
    {
        var existingCodes = (await _db.Badges
            .AsNoTracking()
            .Select(b => b.Code)
            .ToListAsync(ct))
            .ToHashSet();

        var badges = new[]
        {
            new Badge
            {
                Code = "first_booking",
                Name = "First Steps",
                Description = "Complete your first booking",
                RequirementType = "bookings",
                RequirementValue = 1,
                PointsAwarded = 50
            },
            new Badge
            {
                Code = "loyal_5",
                Name = "Regular",
                Description = "Complete 5 bookings",
                RequirementType = "bookings",
                RequirementValue = 5,
                PointsAwarded = 100
            },
            new Badge
            {
                Code = "loyal_10",
                Name = "Loyal Customer",
                Description = "Complete 10 bookings",
                RequirementType = "bookings",
                RequirementValue = 10,
                PointsAwarded = 200
            },
            new Badge
            {
                Code = "loyal_25",
                Name = "VIP",
                Description = "Complete 25 bookings",
                RequirementType = "bookings",
                RequirementValue = 25,
                PointsAwarded = 500
            },
            new Badge
            {
                Code = "reviewer",
                Name = "Reviewer",
                Description = "Leave your first review",
                RequirementType = "reviews",
                RequirementValue = 1,
                PointsAwarded = 25
            },
            new Badge
            {
                Code = "super_reviewer",
                Name = "Super Reviewer",
                Description = "Leave 10 reviews",
                RequirementType = "reviews",
                RequirementValue = 10,
                PointsAwarded = 150
            },
            new Badge
            {
                Code = "streak_7",
                Name = "Week Warrior",
                Description = "Maintain a 7-day streak",
                RequirementType = "streak",
                RequirementValue = 7,
                PointsAwarded = 100
            },
            new Badge
            {
                Code = "streak_30",
                Name = "Monthly Champion",
                Description = "Maintain a 30-day streak",
                RequirementType = "streak",
                RequirementValue = 30,
                PointsAwarded = 300
            },
            new Badge
            {
                Code = "referrer",
                Name = "Ambassador",
                Description = "Refer your first friend",
                RequirementType = "referrals",
                RequirementValue = 1,
                PointsAwarded = 100
            },
            new Badge
            {
                Code = "super_referrer",
                Name = "Super Ambassador",
                Description = "Refer 5 friends",
                RequirementType = "referrals",
                RequirementValue = 5,
                PointsAwarded = 500
            }
        };

        var toAdd = badges.Where(b => !existingCodes.Contains(b.Code)).ToList();
        if (toAdd.Count == 0)
        {
            _logger.LogDebug("Badges already seeded, skipping.");
            return;
        }

        _db.Badges.AddRange(toAdd);
        await _unitOfWork.SaveChangesAsync(ct);
        _logger.LogInformation("Seeded {Count} badges.", toAdd.Count);
    }
}



