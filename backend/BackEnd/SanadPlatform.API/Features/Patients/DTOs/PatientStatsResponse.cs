using System;

namespace SanadPlatform.API.Features.Patients.DTOs;

/// <summary>
/// Data transfer object for patient engagement statistics.
/// </summary>
public record PatientStatsResponse
{
    public int TotalAppointments { get; init; }
    public int CompletedAppointments { get; init; }
    public int UpcomingAppointments { get; init; }
    public decimal TotalSpent { get; init; }
    public int CareStreakDays { get; init; }
    public int LongestStreak { get; init; }
    public int TotalPoints { get; init; }
    public int BadgesEarned { get; init; }
    public DateTime? LastAppointmentDate { get; init; }
    public int FavoriteProviders { get; init; }
}
