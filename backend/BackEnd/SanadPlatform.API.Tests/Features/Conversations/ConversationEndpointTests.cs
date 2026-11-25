using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using FluentValidation.TestHelper;
using SanadPlatform.API.Features.Conversations.DTOs;
using SanadPlatform.API.Features.Conversations.Entities;
using SanadPlatform.API.Features.Conversations.Queries;
using SanadPlatform.API.Features.Conversations.Specifications;
using SanadPlatform.API.Features.Conversations.Validators;
using SanadPlatform.API.Features.Patients.Entities;
using SanadPlatform.API.Features.Providers.Entities;
using SanadPlatform.API.Features.Conversations.Repository;
using SanadPlatform.API.Infrastructure.Database;

using AutoMapper;
using Microsoft.EntityFrameworkCore.Storage;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Authentication.Entities;
using SanadPlatform.API.Features.Conversations.Commands;
using SanadPlatform.API.Features.Conversations.Mappings;
using SanadPlatform.API.Features.Patients.Repository;
using SanadPlatform.API.Features.Providers.Repository;
namespace SanadPlatform.API.Tests.Features.Conversations;

public class ConversationEndpointTests
{
    [Fact]
    public void GetConversationsValidator_RejectsSearchQueryLongerThan100Characters()
    {
        var validator = new GetConversationsQueryValidator();
        var query = new GetConversationsQuery(
            new GetConversationsRequest
            {
                SearchQuery = new string('x', 101),
                Page = 1,
                Limit = 20
            },
            Guid.NewGuid(),
            IsPatient: true,
            IsProvider: false,
            IsAdmin: false);

        var result = validator.TestValidate(query);

        result.ShouldHaveValidationErrorFor(x => x.Request.SearchQuery)
            .WithErrorMessage("Search query must not exceed 100 characters.");
    }

    [Fact]
    public void GetConversationsValidator_RejectsWhitespaceOnlySearchQueryLongerThan100Characters()
    {
        var validator = new GetConversationsQueryValidator();
        var query = new GetConversationsQuery(
            new GetConversationsRequest
            {
                SearchQuery = new string(' ', 101),
                Page = 1,
                Limit = 20
            },
            Guid.NewGuid(),
            IsPatient: true,
            IsProvider: false,
            IsAdmin: false);

        var result = validator.TestValidate(query);

        result.ShouldHaveValidationErrorFor(x => x.Request.SearchQuery)
            .WithErrorMessage("Search query must not exceed 100 characters.");
    }

    [Fact]
    public void ConversationSpecification_BlankSearchQueryReturnAllConversations()
    {
        var patientUserId = Guid.NewGuid();
        var request = new GetConversationsRequest
        {
            SearchQuery = "   ",  // Whitespace-only query
            Page = 1,
            Limit = 20
        };

        var spec = new ConversationSpecification(
            request,
            patientUserId,
            isPatient: true,
            isProvider: false,
            isAdmin: false);

        var conversations = CreateSampleConversations(patientUserId);
        var matches = conversations
            .Where(spec.Criteria!.Compile())
            .Select(conversation => conversation.Id)
            .ToList();

        // Whitespace-only search should not filter, returning all conversations
        Assert.Equal(3, matches.Count);
        Assert.Equal(
            [conversations[0].Id, conversations[1].Id, conversations[2].Id],
            matches);
    }

    [Fact]
    public void ConversationSpecification_PatientSearchMatchesProviderNameAndPreviewCaseInsensitively()
    {
        var patientUserId = Guid.NewGuid();
        var request = new GetConversationsRequest
        {
            SearchQuery = "  tomorrow  ",
            Page = 1,
            Limit = 20
        };

        var spec = new ConversationSpecification(
            request,
            patientUserId,
            isPatient: true,
            isProvider: false,
            isAdmin: false);

        var conversations = CreateSampleConversations(patientUserId);
        var matches = conversations
            .Where(spec.Criteria!.Compile())
            .Select(conversation => conversation.Id)
            .ToList();

        Assert.Equal(2, matches.Count);
        Assert.Equal(
            [conversations[0].Id, conversations[1].Id],
            matches);
    }

    [Fact]
    public void ConversationSpecification_ProviderSearchRespectsUnreadActiveAndVisibilityFilters()
    {
        var providerUserId = Guid.NewGuid();
        var expected = CreateConversation(
            patientUserId: Guid.NewGuid(),
            providerUserId,
            patientFirstName: "Fatma",
            patientLastName: "Zitoun",
            providerBusinessName: "Clinique Hayet",
            providerFirstName: "Hayet",
            providerLastName: "Ben Ali",
            lastMessagePreview: "Latest update",
            patientUnreadCount: 0,
            providerUnreadCount: 2);

        var inactive = CreateConversation(
            patientUserId: Guid.NewGuid(),
            providerUserId,
            patientFirstName: "Fatma",
            patientLastName: "Closed",
            providerBusinessName: "Clinique Hayet",
            providerFirstName: "Hayet",
            providerLastName: "Ben Ali",
            lastMessagePreview: "Inactive conversation",
            isActive: false,
            patientUnreadCount: 0,
            providerUnreadCount: 3);

        var readConversation = CreateConversation(
            patientUserId: Guid.NewGuid(),
            providerUserId,
            patientFirstName: "Fatma",
            patientLastName: "Read",
            providerBusinessName: "Clinique Hayet",
            providerFirstName: "Hayet",
            providerLastName: "Ben Ali",
            lastMessagePreview: "No unread items",
            patientUnreadCount: 0,
            providerUnreadCount: 0);

        var hiddenConversation = CreateConversation(
            patientUserId: Guid.NewGuid(),
            providerUserId,
            patientFirstName: "Fatma",
            patientLastName: "Hidden",
            providerBusinessName: "Clinique Hayet",
            providerFirstName: "Hayet",
            providerLastName: "Ben Ali",
            lastMessagePreview: "Draft only",
            patientUnreadCount: 0,
            providerUnreadCount: 1);
        hiddenConversation.LastMessageAt = null;

        var request = new GetConversationsRequest
        {
            SearchQuery = "fatma",
            UnreadOnly = true,
            Page = 1,
            Limit = 20
        };

        var spec = new ConversationSpecification(
            request,
            providerUserId,
            isPatient: false,
            isProvider: true,
            isAdmin: false);

        var matches = new[] { expected, inactive, readConversation, hiddenConversation }
            .Where(spec.Criteria!.Compile())
            .ToList();

        var match = Assert.Single(matches);
        Assert.Equal(expected.Id, match.Id);
    }

    [Fact]
    public void ConversationDtos_ExposeSendabilityContractAndBlockedReasonConstants()
    {
        var response = new ConversationResponse();

        Assert.False(response.CanSendMessage);
        Assert.Null(response.MessagingBlockedReason);
        Assert.Equal(
            "patient_disabled_provider_messages",
            ConversationMessagingBlockedReasons.PatientDisabledProviderMessages);
        Assert.Equal(
            "provider_disabled_patient_messages",
            ConversationMessagingBlockedReasons.ProviderDisabledPatientMessages);
    }

    [Fact]
    public async Task ConversationRepository_GetConversationsAsync_ProjectsPatientBlockedSendabilityFromProviderPreferences()
    {
        await using var context = CreateContext();
        var patientUserId = Guid.NewGuid();
        var conversation = CreateTrackedConversation(
            patientUserId,
            providerUserId: Guid.NewGuid(),
            patientFirstName: "Amal",
            patientLastName: "Ben Salah",
            providerBusinessName: "Clinique Nour",
            providerFirstName: "Nour",
            providerLastName: "Salah",
            lastMessagePreview: "Follow-up tomorrow morning",
            patientUnreadCount: 4,
            providerAllowsPatientMessages: false);

        context.Conversations.Add(conversation);
        await context.SaveChangesAsync();

        var repository = CreateRepository(context);
        var result = await repository.GetConversationsAsync(
            new ConversationSpecification(
                new GetConversationsRequest
                {
                    Page = 1,
                    Limit = 20
                },
                patientUserId,
                isPatient: true,
                isProvider: false,
                isAdmin: false),
            CancellationToken.None);

        var projected = Assert.Single(result.Items);
        Assert.False(projected.CanSendMessage);
        Assert.Equal(
            ConversationMessagingBlockedReasons.ProviderDisabledPatientMessages,
            projected.MessagingBlockedReason);
        Assert.Equal(conversation.PatientUnreadCount, projected.UnreadCount);
    }

    [Fact]
    public async Task ConversationRepository_GetByIdAsync_ProjectsProviderBlockedSendabilityFromPatientPreferences()
    {
        await using var context = CreateContext();
        var providerUserId = Guid.NewGuid();
        var conversation = CreateTrackedConversation(
            patientUserId: Guid.NewGuid(),
            providerUserId,
            patientFirstName: "Amal",
            patientLastName: "Ben Salah",
            providerBusinessName: "Clinique Nour",
            providerFirstName: "Nour",
            providerLastName: "Salah",
            lastMessagePreview: "General check-in",
            providerUnreadCount: 3,
            patientAllowsProviderMessages: false);

        context.Conversations.Add(conversation);
        await context.SaveChangesAsync();

        var repository = CreateRepository(context);
        var projected = await repository.GetByIdAsync(
            conversation.Id,
            providerUserId,
            isPatient: false,
            isProvider: true,
            isAdmin: false,
            CancellationToken.None);

        Assert.NotNull(projected);
        Assert.False(projected!.CanSendMessage);
        Assert.Equal(
            ConversationMessagingBlockedReasons.PatientDisabledProviderMessages,
            projected.MessagingBlockedReason);
        Assert.Equal(conversation.ProviderUnreadCount, projected.UnreadCount);
    }

    [Fact]
    public async Task ConversationRepository_GetConversationsAsync_ProjectsAdminAsNotSendableWithoutBlockedReason()
    {
        await using var context = CreateContext();
        var conversation = CreateTrackedConversation(
            patientUserId: Guid.NewGuid(),
            providerUserId: Guid.NewGuid(),
            patientFirstName: "Amal",
            patientLastName: "Ben Salah",
            providerBusinessName: "Clinique Nour",
            providerFirstName: "Nour",
            providerLastName: "Salah",
            lastMessagePreview: "Follow-up tomorrow morning",
            patientUnreadCount: 4,
            providerAllowsPatientMessages: false,
            patientAllowsProviderMessages: false);

        context.Conversations.Add(conversation);
        await context.SaveChangesAsync();

        var repository = CreateRepository(context);
        var result = await repository.GetConversationsAsync(
            new ConversationSpecification(
                new GetConversationsRequest
                {
                    Page = 1,
                    Limit = 20
                },
                Guid.NewGuid(),
                isPatient: false,
                isProvider: false,
                isAdmin: true),
            CancellationToken.None);

        var projected = Assert.Single(result.Items);
        Assert.False(projected.CanSendMessage);
        Assert.Null(projected.MessagingBlockedReason);
        Assert.Equal(conversation.PatientUnreadCount + conversation.ProviderUnreadCount, projected.UnreadCount);
    }

    [Fact]
    public async Task ConversationRepository_GetConversationsAsync_ProjectsInactiveConversationAsNotSendableWithoutPreferenceBlockedReason()
    {
        await using var context = CreateContext();
        var conversation = CreateTrackedConversation(
            patientUserId: Guid.NewGuid(),
            providerUserId: Guid.NewGuid(),
            patientFirstName: "Amal",
            patientLastName: "Ben Salah",
            providerBusinessName: "Clinique Nour",
            providerFirstName: "Nour",
            providerLastName: "Salah",
            lastMessagePreview: "Follow-up tomorrow morning",
            isActive: false,
            patientUnreadCount: 4,
            providerAllowsPatientMessages: false,
            patientAllowsProviderMessages: false);

        context.Conversations.Add(conversation);
        await context.SaveChangesAsync();

        var repository = CreateRepository(context);
        var result = await repository.GetConversationsAsync(
            new ConversationSpecification(
                new GetConversationsRequest
                {
                    Page = 1,
                    Limit = 20,
                    IncludeInactive = true
                },
                conversation.Patient.UserId,
                isPatient: true,
                isProvider: false,
                isAdmin: false),
            CancellationToken.None);

        var projected = Assert.Single(result.Items);
        Assert.False(projected.CanSendMessage);
        Assert.Null(projected.MessagingBlockedReason);
    }

    [Fact]
    public async Task ConversationRepository_GetByIdAsync_ProjectsInactiveConversationAsNotSendableWithoutPreferenceBlockedReason()
    {
        await using var context = CreateContext();
        var conversation = CreateTrackedConversation(
            patientUserId: Guid.NewGuid(),
            providerUserId: Guid.NewGuid(),
            patientFirstName: "Amal",
            patientLastName: "Ben Salah",
            providerBusinessName: "Clinique Nour",
            providerFirstName: "Nour",
            providerLastName: "Salah",
            lastMessagePreview: "General check-in",
            isActive: false,
            patientUnreadCount: 1,
            providerAllowsPatientMessages: false,
            patientAllowsProviderMessages: false);

        context.Conversations.Add(conversation);
        await context.SaveChangesAsync();

        var repository = CreateRepository(context);
        var projected = await repository.GetByIdAsync(
            conversation.Id,
            conversation.Patient.UserId,
            isPatient: true,
            isProvider: false,
            isAdmin: false,
            CancellationToken.None);

        Assert.NotNull(projected);
        Assert.False(projected!.CanSendMessage);
        Assert.Null(projected.MessagingBlockedReason);
    }


    [Fact]
    public async Task ConversationRepository_GetMessagingAccessAsync_TreatsMissingPatientPreferencesAsAllowed()
    {
        await using var context = CreateContext();
        var conversation = CreateTrackedConversation(
            patientUserId: Guid.NewGuid(),
            providerUserId: Guid.NewGuid(),
            patientFirstName: "Amal",
            patientLastName: "Ben Salah",
            providerBusinessName: "Clinique Nour",
            providerFirstName: "Nour",
            providerLastName: "Salah",
            lastMessagePreview: "General check-in",
            patientAllowsProviderMessages: null,
            providerAllowsPatientMessages: false);

        context.Conversations.Add(conversation);
        await context.SaveChangesAsync();

        var repository = CreateRepository(context);
        var access = await repository.GetMessagingAccessAsync(
            conversation.PatientId,
            conversation.ProviderId,
            CancellationToken.None);

        Assert.NotNull(access);
        Assert.False(access!.CanPatientSendMessage);
        Assert.Equal(
            ConversationMessagingBlockedReasons.ProviderDisabledPatientMessages,
            access.PatientBlockedReason);
        Assert.True(access.CanProviderSendMessage);
        Assert.Null(access.ProviderBlockedReason);
    }

    [Fact]
    public async Task GetOrCreateConversationHandler_ThrowsWhenProviderDisablesPatientMessages()
    {
        await using var context = CreateContext();
        var patientUserId = Guid.NewGuid();
        var providerUserId = Guid.NewGuid();

        var patient = new Patient
        {
            Id = Guid.NewGuid(),
            UserId = patientUserId,
            FirstName = "Amal",
            LastName = "Ben Salah"
        };

        var provider = new Provider
        {
            Id = Guid.NewGuid(),
            UserId = providerUserId,
            FirstName = "Nour",
            LastName = "Salah",
            ServiceCategory = "doctor",
            Preferences = new ProviderPreferences
            {
                AllowPatientMessages = false,
                CreatedAt = DateTime.UtcNow.AddMinutes(-5),
                UpdatedAt = DateTime.UtcNow
            }
        };
        provider.Preferences.ProviderId = provider.Id;

        context.Patients.Add(patient);
        context.Providers.Add(provider);
        await context.SaveChangesAsync();

        var unitOfWork = new TrackingUnitOfWork(context);
        var handler = new GetOrCreateConversationHandler(
            CreateRepository(context),
            CreatePatientRepository(context),
            CreateProviderRepository(context),
            unitOfWork,
            NullLogger<GetOrCreateConversationHandler>.Instance);

        var exception = await Assert.ThrowsAsync<InvalidOperationException>(() => handler.Handle(
            new GetOrCreateConversationCommand(
                patientUserId,
                IsPatient: true,
                IsProvider: false,
                TargetProviderId: provider.Id,
                TargetPatientId: null),
            CancellationToken.None));

        Assert.Equal("Provider has disabled patient messages.", exception.Message);
        Assert.Equal(0, unitOfWork.SaveChangesCallCount);
        Assert.False(await context.Conversations.AnyAsync());
    }

    [Fact]
    public async Task SendMessageHandler_ThrowsWhenPatientDisablesProviderMessages()
    {
        await using var context = CreateContext();
        var providerUserId = Guid.NewGuid();
        var conversation = CreateTrackedConversation(
            patientUserId: Guid.NewGuid(),
            providerUserId,
            patientFirstName: "Amal",
            patientLastName: "Ben Salah",
            providerBusinessName: "Clinique Nour",
            providerFirstName: "Nour",
            providerLastName: "Salah",
            lastMessagePreview: "General check-in",
            patientAllowsProviderMessages: false);
        AttachConversationUsers(conversation);

        var repository = new SendMessageRepositoryStub(
            conversation,
            new ConversationMessagingAccess
            {
                PatientId = conversation.PatientId,
                ProviderId = conversation.ProviderId,
                CanPatientSendMessage = true,
                PatientBlockedReason = null,
                CanProviderSendMessage = false,
                ProviderBlockedReason = ConversationMessagingBlockedReasons.PatientDisabledProviderMessages
            });
        var unitOfWork = new TrackingUnitOfWork(context);
        var handler = new SendMessageHandler(
            repository,
            unitOfWork,
            CreateConversationMapper(),
            NullLogger<SendMessageHandler>.Instance);

        var exception = await Assert.ThrowsAsync<InvalidOperationException>(() => handler.Handle(
            new SendMessageCommand(
                conversation.Id,
                providerUserId,
                IsPatient: false,
                IsProvider: true,
                MessageType: "text",
                Content: "Can you confirm the visit time?",
                AttachmentUrl: null,
                AttachmentName: null,
                AttachmentSizeBytes: null,
                AttachmentMimeType: null,
                Latitude: null,
                Longitude: null),
            CancellationToken.None));

        Assert.Equal("Patient has disabled provider messages.", exception.Message);
        Assert.Equal(1, unitOfWork.ExecuteInTransactionCallCount);
        Assert.Equal(0, unitOfWork.SaveChangesCallCount);
        Assert.Equal(0, repository.CreateMessageCallCount);
    }


    private static IReadOnlyList<Conversation> CreateSampleConversations(Guid patientUserId)
    {
        var matchByPreview = CreateConversation(
            patientUserId,
            providerUserId: Guid.NewGuid(),
            patientFirstName: "Amal",
            patientLastName: "Patient",
            providerBusinessName: "Clinique Nour",
            providerFirstName: "Nour",
            providerLastName: "Salah",
            lastMessagePreview: "Follow-up tomorrow morning");

        var matchByBusinessName = CreateConversation(
            patientUserId,
            providerUserId: Guid.NewGuid(),
            patientFirstName: "Amal",
            patientLastName: "Patient",
            providerBusinessName: "Tomorrow Care Center",
            providerFirstName: "Alya",
            providerLastName: "Kefi",
            lastMessagePreview: "See you soon");

        var noMatch = CreateConversation(
            patientUserId,
            providerUserId: Guid.NewGuid(),
            patientFirstName: "Amal",
            patientLastName: "Patient",
            providerBusinessName: "Clinique Hayat",
            providerFirstName: "Hayat",
            providerLastName: "Mrad",
            lastMessagePreview: "General check-in");

        return new[] { matchByPreview, matchByBusinessName, noMatch };
    }

    private static Conversation CreateConversation(
        Guid patientUserId,
        Guid providerUserId,
        string patientFirstName,
        string patientLastName,
        string? providerBusinessName,
        string? providerFirstName,
        string? providerLastName,
        string? lastMessagePreview,
        bool isActive = true,
        DateTime? lastMessageAt = null,
        int patientUnreadCount = 0,
        int providerUnreadCount = 0)
    {
        return new Conversation
        {
            Id = Guid.NewGuid(),
            IsActive = isActive,
            LastMessageAt = lastMessageAt ?? DateTime.UtcNow,
            LastMessagePreview = lastMessagePreview,
            PatientUnreadCount = patientUnreadCount,
            ProviderUnreadCount = providerUnreadCount,
            CreatedAt = DateTime.UtcNow.AddDays(-1),
            UpdatedAt = DateTime.UtcNow,
            Patient = new Patient
            {
                Id = Guid.NewGuid(),
                UserId = patientUserId,
                FirstName = patientFirstName,
                LastName = patientLastName
            },
            Provider = new Provider
            {
                Id = Guid.NewGuid(),
                UserId = providerUserId,
                BusinessName = providerBusinessName,
                FirstName = providerFirstName,
                LastName = providerLastName,
                ServiceCategory = "doctor"
            }
        };
    }

    private static ConversationRepository CreateRepository(SanadDbContext context)
    {
        return new ConversationRepository(context, NullLogger<ConversationRepository>.Instance);
    }

    private static SanadDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<SanadDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString("N"))
            .Options;

        return new SanadDbContext(options);
    }

    private static Conversation CreateTrackedConversation(
        Guid patientUserId,
        Guid providerUserId,
        string patientFirstName,
        string patientLastName,
        string? providerBusinessName,
        string? providerFirstName,
        string? providerLastName,
        string? lastMessagePreview,
        bool isActive = true,
        DateTime? lastMessageAt = null,
        int patientUnreadCount = 0,
        int providerUnreadCount = 0,
        bool? patientAllowsProviderMessages = true,
        bool? providerAllowsPatientMessages = true)
    {
        var patient = new Patient
        {
            Id = Guid.NewGuid(),
            UserId = patientUserId,
            FirstName = patientFirstName,
            LastName = patientLastName
        };

        if (patientAllowsProviderMessages.HasValue)
        {
            patient.Preferences = new PatientPreferences
            {
                PatientId = patient.Id,
                AllowProviderMessages = patientAllowsProviderMessages.Value,
                CreatedAt = DateTime.UtcNow.AddMinutes(-5),
                UpdatedAt = DateTime.UtcNow
            };
        }

        var provider = new Provider
        {
            Id = Guid.NewGuid(),
            UserId = providerUserId,
            BusinessName = providerBusinessName,
            FirstName = providerFirstName,
            LastName = providerLastName,
            ServiceCategory = "doctor"
        };

        if (providerAllowsPatientMessages.HasValue)
        {
            provider.Preferences = new ProviderPreferences
            {
                ProviderId = provider.Id,
                AllowPatientMessages = providerAllowsPatientMessages.Value,
                CreatedAt = DateTime.UtcNow.AddMinutes(-5),
                UpdatedAt = DateTime.UtcNow
            };
        }

        return new Conversation
        {
            Id = Guid.NewGuid(),
            PatientId = patient.Id,
            ProviderId = provider.Id,
            Patient = patient,
            Provider = provider,
            IsActive = isActive,
            LastMessageAt = lastMessageAt ?? DateTime.UtcNow,
            LastMessagePreview = lastMessagePreview,
            PatientUnreadCount = patientUnreadCount,
            ProviderUnreadCount = providerUnreadCount,
            CreatedAt = DateTime.UtcNow.AddDays(-1),
            UpdatedAt = DateTime.UtcNow
        };
    }
    private sealed class SendMessageRepositoryStub : IConversationRepository
    {
        private readonly Conversation _conversation;
        private readonly ConversationMessagingAccess _access;

        public SendMessageRepositoryStub(
            Conversation conversation,
            ConversationMessagingAccess access)
        {
            _conversation = conversation;
            _access = access;
        }

        public int CreateMessageCallCount { get; private set; }

        public Task<ConversationsResponse> GetConversationsAsync(
            ConversationSpecification spec,
            CancellationToken ct)
            => throw new NotSupportedException();

        public Task<ConversationResponse?> GetByIdAsync(
            Guid id,
            Guid userId,
            bool isPatient,
            bool isProvider,
            bool isAdmin,
            CancellationToken ct)
            => throw new NotSupportedException();

        public Task<ConversationMessagesResponse?> GetMessagesByConversationIdAsync(
            Guid conversationId,
            GetConversationMessagesRequest request,
            Guid userId,
            bool isPatient,
            bool isProvider,
            bool isAdmin,
            CancellationToken ct)
            => throw new NotSupportedException();

        public Task<int> GetTotalUnreadCountAsync(
            Guid userId,
            bool isPatient,
            bool isProvider,
            bool isAdmin,
            CancellationToken ct)
            => throw new NotSupportedException();

        public Task<Conversation?> GetConversationForUpdateAsync(
            Guid conversationId,
            CancellationToken ct)
            => Task.FromResult<Conversation?>(conversationId == _conversation.Id ? _conversation : null);

        public Task CreateMessageAsync(Message message, CancellationToken ct)
        {
            CreateMessageCallCount++;
            return Task.CompletedTask;
        }

        public Task<int> MarkMessagesAsReadAsync(
            Guid conversationId,
            Guid userId,
            CancellationToken ct)
            => throw new NotSupportedException();

        public Task ResetUnreadCountAsync(
            Guid conversationId,
            bool isPatient,
            int markedCount,
            CancellationToken ct)
            => throw new NotSupportedException();

        public Task UpdateConversationOnNewMessageAsync(
            Guid conversationId,
            string preview,
            Guid lastMessageBy,
            bool incrementPatientUnread,
            bool incrementProviderUnread,
            CancellationToken ct)
            => Task.CompletedTask;

        public Task<Conversation?> GetByParticipantsAsync(
            Guid patientId,
            Guid providerId,
            CancellationToken ct)
            => throw new NotSupportedException();

        public Task<ConversationMessagingAccess?> GetMessagingAccessAsync(
            Guid patientId,
            Guid providerId,
            CancellationToken ct)
            => Task.FromResult<ConversationMessagingAccess?>(patientId == _access.PatientId && providerId == _access.ProviderId
                ? _access
                : null);

        public Task CreateConversationAsync(Conversation conversation, CancellationToken ct)
            => throw new NotSupportedException();
    }


    private static PatientRepository CreatePatientRepository(SanadDbContext context)
    {
        return new PatientRepository(
            context,
            new MapperConfiguration(_ => { }).CreateMapper(),
            NullLogger<PatientRepository>.Instance);
    }

    private static ProviderRepository CreateProviderRepository(SanadDbContext context)
    {
        return new ProviderRepository(
            context,
            new MapperConfiguration(_ => { }).CreateMapper(),
            NullLogger<ProviderRepository>.Instance);
    }

    private static IMapper CreateConversationMapper()
    {
        return new MapperConfiguration(configuration => configuration.AddProfile<ConversationMappingProfile>())
            .CreateMapper();
    }

    private static void AttachConversationUsers(Conversation conversation)
    {
        conversation.Patient.User = CreateUser(conversation.Patient.UserId, "patient", "patient@example.com");
        conversation.Provider.User = CreateUser(conversation.Provider.UserId, "provider", "provider@example.com");
    }

    private static User CreateUser(Guid id, string role, string email)
    {
        return new User
        {
            Id = id,
            Email = email,
            PasswordHash = "hashed-password",
            Role = role,
            CreatedAt = DateTime.UtcNow.AddDays(-1),
            UpdatedAt = DateTime.UtcNow
        };
    }

    private sealed class TrackingUnitOfWork : IUnitOfWork
    {
        private readonly SanadDbContext _context;

        public TrackingUnitOfWork(SanadDbContext context)
        {
            _context = context;
        }

        public int ExecuteInTransactionCallCount { get; private set; }

        public int SaveChangesCallCount { get; private set; }

        public Task BeginTransactionAsync(CancellationToken cancellationToken = default)
            => Task.CompletedTask;

        public Task CommitTransactionAsync(CancellationToken cancellationToken = default)
            => Task.CompletedTask;

        public IExecutionStrategy CreateExecutionStrategy()
            => throw new NotSupportedException();

        public async Task ExecuteInTransactionAsync(
            Func<CancellationToken, Task> operation,
            CancellationToken cancellationToken = default)
        {
            ExecuteInTransactionCallCount++;
            await operation(cancellationToken);
        }

        public async Task<T> ExecuteInTransactionAsync<T>(
            Func<CancellationToken, Task<T>> operation,
            CancellationToken cancellationToken = default)
        {
            ExecuteInTransactionCallCount++;
            return await operation(cancellationToken);
        }

        public Task RollbackTransactionAsync(CancellationToken cancellationToken = default)
            => Task.CompletedTask;

        public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            SaveChangesCallCount++;
            return _context.SaveChangesAsync(cancellationToken);
        }
    }
}
