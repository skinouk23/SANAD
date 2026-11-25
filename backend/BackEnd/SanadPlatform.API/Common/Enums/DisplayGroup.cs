namespace SanadPlatform.API.Common.Enums;

/// <summary>
/// Patient-facing browse group for the service selection screen.
/// Used to power the filter tabs: medical | daily | rehabilitation | wellness.
/// </summary>
public enum DisplayGroup
{
    Medical,         // Nursing, Doctor, Laboratory, Radiology, Ambulance
    Daily,           // Elderly Care, Night Care, Maternity, Equipment Rental
    Rehabilitation,  // Physiotherapy, Chronic Care
    Wellness         // Psychology, Nutrition, Gym & Fitness
}
