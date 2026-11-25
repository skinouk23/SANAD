using SanadPlatform.API.Features.Patients.DTOs;
using SanadPlatform.API.Features.Patients.Entities;

namespace SanadPlatform.API.Features.Patients.Repository;

/// <summary>
/// Repository interface for patient data access operations.
/// Provides abstraction for CRUD operations on Patient entities.
/// All methods accept a <see cref="CancellationToken"/> to support request cancellation.
/// </summary>
public interface IPatientRepository
{
    /// <summary>
    /// Stages a new patient in the EF change tracker.
    /// The caller must invoke IUnitOfWork.SaveChangesAsync to persist.
    /// </summary>
    Task<Patient> CreateAsync(Patient patient, CancellationToken cancellationToken = default);

    /// <summary>
    /// Retrieves a patient by unique identifier (untracked, read-only).
    /// </summary>
    Task<Patient?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Retrieves a patient by associated user ID (untracked, read-only).
    /// Useful for finding a patient's profile after authentication.
    /// </summary>
    Task<Patient?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Retrieves a patient by associated user ID with the User entity included (untracked, read-only).
    /// Used for capturing phone numbers during booking creation.
    /// </summary>
    Task<Patient?> GetByUserIdWithUserAsync(Guid userId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Efficiently retrieves the patient's ID for a given user ID via projection.
    /// </summary>
    Task<Guid?> GetPatientIdByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Retrieves a tracked patient entity by patient ID.
    /// Use for write operations where only the patient ID is known (e.g., booking stats updates).
    /// The xmin shadow property is automatically loaded as a concurrency token.
    /// </summary>
    Task<Patient?> GetByIdForUpdateAsync(Guid patientId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Retrieves a tracked patient entity by associated user ID.
    /// Use for write operations (update, concurrency-checked save).
    /// The xmin shadow property is automatically loaded as a concurrency token.
    /// </summary>
    Task<Patient?> GetByUserIdForUpdateAsync(Guid userId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Efficiently checks if a patient exists by its entity ID without loading the full entity.
    /// </summary>
    Task<bool> ExistsByIdAsync(Guid id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Efficiently checks if a patient exists for a given user ID without loading the full entity.
    /// </summary>
    Task<bool> ExistsByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Stages property changes on a tracked patient entity.
    /// <para>
    /// The entity must have been loaded as tracked (e.g. via
    /// <see cref="GetByUserIdForUpdateAsync"/>). Property mutations are already
    /// tracked by EF Core, so no explicit <c>Update()</c> call is needed — this method
    /// simply validates the argument and returns it.
    /// </para>
    /// The caller must invoke IUnitOfWork.SaveChangesAsync to persist.
    /// </summary>
    Task<Patient> UpdateAsync(Patient patient, CancellationToken cancellationToken = default);

    /// <summary>
    /// Retrieves engagement statistics for a specific patient.
    /// Returns <c>null</c> when no patient row exists for <paramref name="userId"/>.
    /// </summary>
    Task<PatientStatsResponse?> GetStatsByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Retrieves family circle members for a specific patient.
    /// Returns an empty list when the patient has no family members or when no patient
    /// exists for <paramref name="userId"/>. Callers that need to distinguish "patient not
    /// found" from "no members" must call <see cref="ExistsByUserIdAsync"/> first.
    /// </summary>
    Task<IReadOnlyList<FamilyMemberResponse>> GetFamilyMembersByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Stages a new family member in the EF change tracker.
    /// The caller must invoke IUnitOfWork.SaveChangesAsync to persist.
    /// </summary>
    Task<FamilyMember> CreateFamilyMemberAsync(FamilyMember member, CancellationToken cancellationToken = default);

    /// <summary>
    /// Deletes a family member from a patient's circle.
    /// <para>
    /// <b>Self-committing:</b> Uses <c>ExecuteDeleteAsync</c> which issues a single
    /// <c>DELETE</c> SQL statement directly, bypassing the EF change tracker and
    /// <c>IUnitOfWork</c>. The caller must NOT call <c>SaveChangesAsync</c> afterwards.
    /// </para>
    /// Returns <c>true</c> if a row was deleted, <c>false</c> if the member was not found
    /// or does not belong to the specified patient.
    /// </summary>
    Task<bool> DeleteFamilyMemberAsync(Guid userId, Guid memberId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Retrieves a patient's favorite providers.
    /// Returns an empty list when the patient has no favorites or when no patient
    /// exists for <paramref name="userId"/>. Callers that need to distinguish "patient not
    /// found" from "no favorites" must call <see cref="ExistsByUserIdAsync"/> first.
    /// </summary>
    Task<IReadOnlyList<PatientFavoriteResponse>> GetFavoritesByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Retrieves a patient's preferences projected to <see cref="PatientPreferencesResponse"/>.
    /// Returns <c>null</c> if no preferences record exists for this patient.
    /// </summary>
    Task<PatientPreferencesResponse?> GetPreferencesByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Stages a new favorite in the EF change tracker.
    /// The caller must invoke IUnitOfWork.SaveChangesAsync to persist.
    /// </summary>
    Task<PatientFavorite> CreateFavoriteAsync(PatientFavorite favorite, CancellationToken cancellationToken = default);

    /// <summary>
    /// Removes a provider from a patient's favorites.
    /// <para>
    /// <b>Self-committing:</b> Uses <c>ExecuteDeleteAsync</c> which issues a single
    /// <c>DELETE</c> SQL statement directly, bypassing the EF change tracker and
    /// <c>IUnitOfWork</c>. The caller must NOT call <c>SaveChangesAsync</c> afterwards.
    /// </para>
    /// Returns <c>true</c> if a row was deleted, <c>false</c> if the favorite was not found.
    /// </summary>
    Task<bool> DeleteFavoriteAsync(Guid userId, Guid providerId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Retrieves the tracked preferences entity for a user.
    /// Use for write operations. Returns <c>null</c> if not found.
    /// </summary>
    Task<PatientPreferences?> GetPreferencesByUserIdForUpdateAsync(Guid userId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Stages preference changes in the EF change tracker.
    /// <para>
    /// The entity must have been loaded as tracked (e.g. via
    /// <see cref="GetPreferencesByUserIdForUpdateAsync"/>). Property mutations are already
    /// tracked by EF Core, so no explicit <c>Update()</c> call is needed — this method
    /// simply validates the argument and returns it.
    /// </para>
    /// The caller must invoke IUnitOfWork.SaveChangesAsync to persist.
    /// </summary>
    Task<PatientPreferences> UpdatePreferencesAsync(PatientPreferences preferences, CancellationToken cancellationToken = default);
}
