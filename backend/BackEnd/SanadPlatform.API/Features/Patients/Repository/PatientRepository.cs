using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Features.Patients.DTOs;
using SanadPlatform.API.Features.Patients.Entities;
using SanadPlatform.API.Infrastructure.Database;

namespace SanadPlatform.API.Features.Patients.Repository;

/// <summary>
/// Implementation of patient repository.
/// Handles all database operations for patient entities.
/// Optimized for PostgreSQL with proper async/await patterns.
/// </summary>
public class PatientRepository : IPatientRepository
{
    private readonly SanadDbContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<PatientRepository> _logger;

    /// <summary>Initializes repository with database context and dependencies.</summary>
    /// <param name="context">Database context.</param>
    /// <param name="mapper">AutoMapper instance for projections.</param>
    /// <param name="logger">Logger instance.</param>
    public PatientRepository(SanadDbContext context, IMapper mapper, ILogger<PatientRepository> logger)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Stages a new patient in the EF change tracker.
    /// The caller must invoke IUnitOfWork.SaveChangesAsync to persist.
    /// </summary>
    public Task<Patient> CreateAsync(Patient patient, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(patient);

        _context.Patients.Add(patient);
        _logger.LogDebug("Staged new patient for creation");
        return Task.FromResult(patient);
    }

    /// <summary>
    /// Retrieves a patient by ID with no tracking.
    /// Uses AsNoTracking() for read-only queries to improve performance.
    /// </summary>
    public async Task<Patient?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Fetching patient by ID {PatientId}", id);
        return await _context.Patients
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
    }

    /// <summary>
    /// Retrieves a patient by user ID with no tracking.
    /// Ideal for finding a patient's profile after authentication.
    /// </summary>
    public async Task<Patient?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Fetching patient by user ID {UserId}", userId);
        return await _context.Patients
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.UserId == userId, cancellationToken);
    }

    /// <inheritdoc/>
    public async Task<Patient?> GetByUserIdWithUserAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Fetching patient with user by user ID {UserId}", userId);
        return await _context.Patients
            .Include(p => p.User)
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.UserId == userId, cancellationToken);
    }

    /// <inheritdoc/>
    public async Task<Guid?> GetPatientIdByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Projecting patient ID for user ID {UserId}", userId);
        var id = await _context.Patients
            .AsNoTracking()
            .Where(p => p.UserId == userId)
            .Select(p => (Guid?)p.Id)
            .FirstOrDefaultAsync(cancellationToken);

        return id;
    }

    /// <summary>
    /// Retrieves a tracked patient entity by patient ID.
    /// Use for write operations where only the patient ID is known (e.g., booking stats updates).
    /// The xmin shadow property is automatically loaded as a concurrency token.
    /// </summary>
    public async Task<Patient?> GetByIdForUpdateAsync(Guid patientId, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Fetching tracked patient for update by patient ID {PatientId}", patientId);
        return await _context.Patients
            .FirstOrDefaultAsync(p => p.Id == patientId, cancellationToken);
    }

    /// <summary>
    /// Retrieves a tracked patient entity by user ID.
    /// Use for write operations (update, concurrency-checked save).
    /// The xmin shadow property is automatically loaded as a concurrency token.
    /// </summary>
    public async Task<Patient?> GetByUserIdForUpdateAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Fetching tracked patient for update by user ID {UserId}", userId);
        return await _context.Patients
            .FirstOrDefaultAsync(p => p.UserId == userId, cancellationToken);
    }

    /// <inheritdoc />
    public async Task<bool> ExistsByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Checking patient existence for ID {PatientId}", id);
        return await _context.Patients
            .AnyAsync(p => p.Id == id, cancellationToken);
    }

    /// <summary>
    /// Efficiently checks if a patient exists for a user without loading the full entity.
    /// </summary>
    public async Task<bool> ExistsByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Checking patient existence for user ID {UserId}", userId);
        return await _context.Patients
            .AnyAsync(p => p.UserId == userId, cancellationToken);
    }

    /// <summary>
    /// Stages property changes on a tracked patient entity.
    /// The entity must have been loaded as tracked (e.g. via GetByUserIdForUpdateAsync).
    /// Property mutations are already tracked by EF Core, so no explicit Update() call is needed.
    /// The caller must invoke IUnitOfWork.SaveChangesAsync to persist.
    /// </summary>
    public Task<Patient> UpdateAsync(Patient patient, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(patient);

        _logger.LogDebug("Staged patient {PatientId} update via change tracking", patient.Id);
        return Task.FromResult(patient);
    }

    /// <summary>
    /// Retrieves engagement statistics for a specific patient.
    /// Aggregates data from multiple sources (bookings, rewards, favorites) in a single optimized query.
    /// Returns <c>null</c> when no patient row exists for <paramref name="userId"/>.
    /// </summary>
    public async Task<PatientStatsResponse?> GetStatsByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Fetching patient stats for user ID {UserId}", userId);
        var now = DateOnly.FromDateTime(DateTime.UtcNow);

        return await _context.Patients
            .AsNoTracking()
            .Where(p => p.UserId == userId)
            .Select(p => new PatientStatsResponse
            {
                TotalAppointments = p.Bookings.Count(),
                CompletedAppointments = p.Bookings.Count(b => b.Status == BookingStatus.Completed),
                UpcomingAppointments = p.Bookings.Count(b => (b.Status == BookingStatus.Pending || b.Status == BookingStatus.Confirmed) && b.StartDate >= now),
                TotalSpent = p.TotalSpent,
                CareStreakDays = p.Rewards != null ? p.Rewards.CurrentStreak : 0,
                LongestStreak = p.Rewards != null ? p.Rewards.LongestStreak : 0,
                TotalPoints = p.Rewards != null ? p.Rewards.TotalPoints : 0,
                BadgesEarned = p.Badges.Count(),
                LastAppointmentDate = p.Bookings
                    .Where(b => b.Status == BookingStatus.Completed)
                    .OrderByDescending(b => b.StartDate)
                    .ThenByDescending(b => b.DailyStartTime)
                    .Select(b => (DateTime?)b.StartDate.ToDateTime(TimeOnly.MinValue))
                    .FirstOrDefault(),
                FavoriteProviders = p.Favorites.Count()
            })
            .FirstOrDefaultAsync(cancellationToken);
    }

    /// <summary>
    /// Retrieves family circle members for a specific patient.
    /// Returns an empty list when the patient has no members or does not exist.
    /// Callers that need to distinguish the two cases must call
    /// <see cref="ExistsByUserIdAsync"/> beforehand.
    /// </summary>
    public async Task<IReadOnlyList<FamilyMemberResponse>> GetFamilyMembersByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Fetching family members for user ID {UserId}", userId);

        return await _context.FamilyMembers
            .AsNoTracking()
            .Where(fm => fm.Patient.UserId == userId)
            .ProjectTo<FamilyMemberResponse>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Retrieves a patient's favorite providers.
    /// Returns an empty list when the patient has no favorites or does not exist.
    /// Callers that need to distinguish the two cases must call
    /// <see cref="ExistsByUserIdAsync"/> beforehand.
    /// </summary>
    public async Task<IReadOnlyList<PatientFavoriteResponse>> GetFavoritesByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Fetching favorites for user ID {UserId}", userId);

        return await _context.PatientFavorites
            .AsNoTracking()
            .Where(f => f.Patient.UserId == userId)
            .ProjectTo<PatientFavoriteResponse>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Retrieves a patient's preferences projected to <see cref="PatientPreferencesResponse"/>.
    /// Returns <c>null</c> if no preferences record exists.
    /// </summary>
    public async Task<PatientPreferencesResponse?> GetPreferencesByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Fetching preferences for user ID {UserId}", userId);
        return await _context.PatientPreferences
            .AsNoTracking()
            .Where(p => p.Patient.UserId == userId)
            .ProjectTo<PatientPreferencesResponse>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(cancellationToken);
    }

    /// <summary>
    /// Retrieves the tracked preferences entity for a user.
    /// Use for write operations. Returns <c>null</c> if not found.
    /// </summary>
    public async Task<PatientPreferences?> GetPreferencesByUserIdForUpdateAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Fetching tracked preferences for update for user ID {UserId}", userId);
        return await _context.PatientPreferences
            .FirstOrDefaultAsync(p => p.Patient.UserId == userId, cancellationToken);
    }

    /// <summary>
    /// Stages preference changes in the EF change tracker.
    /// The entity must have been loaded as tracked (e.g. via GetPreferencesByUserIdForUpdateAsync).
    /// Property mutations are already tracked by EF Core, so no explicit Update() call is needed.
    /// The caller must invoke IUnitOfWork.SaveChangesAsync to persist.
    /// </summary>
    public Task<PatientPreferences> UpdatePreferencesAsync(PatientPreferences preferences, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(preferences);

        _logger.LogDebug("Staged preferences update via change tracking");
        return Task.FromResult(preferences);
    }

    /// <summary>
    /// Stages a new family member in the EF change tracker.
    /// The caller must invoke IUnitOfWork.SaveChangesAsync to persist.
    /// </summary>
    public Task<FamilyMember> CreateFamilyMemberAsync(FamilyMember member, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(member);

        _context.FamilyMembers.Add(member);
        _logger.LogDebug("Staged new family member for creation");
        return Task.FromResult(member);
    }

    /// <summary>
    /// Deletes a family member that belongs to the specified patient user.
    /// Self-committing: uses ExecuteDeleteAsync which bypasses the EF change tracker.
    /// The caller must NOT call SaveChangesAsync afterwards.
    /// Returns <c>true</c> if a row was deleted, <c>false</c> if not found.
    /// </summary>
    public async Task<bool> DeleteFamilyMemberAsync(Guid userId, Guid memberId, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Deleting family member {MemberId} for user {UserId}", memberId, userId);
        var rowsAffected = await _context.FamilyMembers
            .Where(f => f.Id == memberId && f.Patient.UserId == userId)
            .ExecuteDeleteAsync(cancellationToken);

        return rowsAffected > 0;
    }

    /// <summary>
    /// Stages a new favorite in the EF change tracker.
    /// The caller must invoke IUnitOfWork.SaveChangesAsync to persist.
    /// </summary>
    public Task<PatientFavorite> CreateFavoriteAsync(PatientFavorite favorite, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(favorite);

        _context.PatientFavorites.Add(favorite);
        _logger.LogDebug("Staged new patient favorite for creation");
        return Task.FromResult(favorite);
    }

    /// <summary>
    /// Removes a provider from a patient's favorites.
    /// Self-committing: uses ExecuteDeleteAsync which bypasses the EF change tracker.
    /// The caller must NOT call SaveChangesAsync afterwards.
    /// Returns <c>true</c> if a row was deleted, <c>false</c> if the favorite was not found.
    /// </summary>
    public async Task<bool> DeleteFavoriteAsync(Guid userId, Guid providerId, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Deleting favorite provider {ProviderId} for user {UserId}", providerId, userId);
        var rowsAffected = await _context.PatientFavorites
            .Where(f => f.Patient.UserId == userId && f.ProviderId == providerId)
            .ExecuteDeleteAsync(cancellationToken);

        return rowsAffected > 0;
    }
}
