using SanadPlatform.API.Common.Specifications;
using SanadPlatform.API.Common.Utilities;
using SanadPlatform.API.Features.Conversations.DTOs;
using SanadPlatform.API.Features.Conversations.Entities;

namespace SanadPlatform.API.Features.Conversations.Specifications;

/// <summary>
/// Specification that builds the filtering, sorting, and pagination criteria
/// for the paginated conversations list endpoint.
/// </summary>
/// <remarks>
/// Assumes <c>isPatient</c> and <c>isProvider</c> are mutually exclusive.
/// The controller enforces this via <c>EnsureSingleConversationRole</c> before constructing the spec.
/// </remarks>
public class ConversationSpecification : BaseSpecification<Conversation>
{
    /// <summary>Whether the caller has the patient role.</summary>
    public bool IsPatient { get; }

    /// <summary>Whether the caller has the provider role.</summary>
    public bool IsProvider { get; }

    /// <summary>Whether the caller has the admin role.</summary>
    public bool IsAdmin { get; }

    /// <summary>
    /// Initializes a new instance of <see cref="ConversationSpecification"/>.
    /// </summary>
    /// <param name="request">Pagination and filter parameters from the query string.</param>
    /// <param name="participantId">The authenticated user's ID.</param>
    /// <param name="isPatient">Whether the caller has the patient role.</param>
    /// <param name="isProvider">Whether the caller has the provider role.</param>
    /// <param name="isAdmin">Whether the caller has the admin role.</param>
    public ConversationSpecification(
        GetConversationsRequest request,
        Guid participantId,
        bool isPatient,
        bool isProvider,
        bool isAdmin)
    {
        IsPatient = isPatient;
        IsProvider = isProvider;
        IsAdmin = isAdmin;
        var predicate = PredicateBuilder.True<Conversation>();

        // ── Scope to the authenticated user ──────────────────────────────────
        if (isPatient)
        {
            predicate = predicate.And(c => c.Patient.UserId == participantId);

            if (request.UnreadOnly)
                predicate = predicate.And(c => c.PatientUnreadCount > 0);
        }
        else if (isProvider)
        {
            predicate = predicate.And(c => c.Provider.UserId == participantId);

            if (request.UnreadOnly)
                predicate = predicate.And(c => c.ProviderUnreadCount > 0);
        }
        else if (isAdmin)
        {
            // Admin: no participant filter — sees all conversations
            if (request.UnreadOnly)
                predicate = predicate.And(c => c.PatientUnreadCount + c.ProviderUnreadCount > 0);
        }
        else
        {
            throw new UnauthorizedAccessException("Unknown role — access denied.");
        }

        // ── Visibility filters ────────────────────────────────────────────────
        // Only show conversations that have at least one message.
        predicate = predicate.And(c => c.LastMessageAt != null);

        // Hide inactive (closed) conversations unless explicitly requested.
        if (!request.IncludeInactive)
            predicate = predicate.And(c => c.IsActive);

        if (!string.IsNullOrWhiteSpace(request.SearchQuery))
        {
            var search = request.SearchQuery.Trim().ToLowerInvariant();

            if (isPatient)
            {
                predicate = predicate.And(c =>
                    (c.Provider.BusinessName != null && c.Provider.BusinessName.ToLower().Contains(search))
                    || (((c.Provider.FirstName ?? string.Empty) + " " + (c.Provider.LastName ?? string.Empty)).ToLower().Contains(search))
                    || (c.LastMessagePreview != null && c.LastMessagePreview.ToLower().Contains(search)));
            }
            else if (isProvider)
            {
                predicate = predicate.And(c =>
                    (((c.Patient.FirstName ?? string.Empty) + " " + (c.Patient.LastName ?? string.Empty)).ToLower().Contains(search))
                    || (c.LastMessagePreview != null && c.LastMessagePreview.ToLower().Contains(search)));
            }
            else if (isAdmin)
            {
                predicate = predicate.And(c =>
                    (((c.Patient.FirstName ?? string.Empty) + " " + (c.Patient.LastName ?? string.Empty)).ToLower().Contains(search))
                    || (c.Provider.BusinessName != null && c.Provider.BusinessName.ToLower().Contains(search))
                    || (((c.Provider.FirstName ?? string.Empty) + " " + (c.Provider.LastName ?? string.Empty)).ToLower().Contains(search))
                    || (c.LastMessagePreview != null && c.LastMessagePreview.ToLower().Contains(search)));
            }
        }

        Criteria = predicate;

        ApplySorting(request);

        ApplyPaging((request.Page - 1) * request.Limit, request.Limit);
    }

    /// <summary>
    /// Applies the requested sort field and direction to the specification.
    /// </summary>
    private void ApplySorting(GetConversationsRequest request)
    {
        switch (request.SortBy?.ToLowerInvariant())
        {
            case "createdat":
                if (!request.SortDesc)
                    AddOrderBy(c => c.CreatedAt);
                else
                    AddOrderByDescending(c => c.CreatedAt);
                break;

            case "updatedat":
                if (!request.SortDesc)
                    AddOrderBy(c => c.UpdatedAt);
                else
                    AddOrderByDescending(c => c.UpdatedAt);
                break;

            default: // lastMessageAt (default) — coalesce null to CreatedAt
                if (!request.SortDesc)
                    AddOrderBy(c => c.LastMessageAt ?? c.CreatedAt);
                else
                    AddOrderByDescending(c => c.LastMessageAt ?? c.CreatedAt);
                break;
        }
    }
}
