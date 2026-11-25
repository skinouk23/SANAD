# Entities Integration Guide

## Quick Start

### 1. Update SanadDbContext.cs

Add all DbSet properties to `SanadDbContext.cs`:

```csharp
using Microsoft.EntityFrameworkCore;
using SanadPlatform.API.Features.Authentication.Entities;
using SanadPlatform.API.Features.Patients.Entities;
using SanadPlatform.API.Features.Providers.Entities;
using SanadPlatform.API.Features.Bookings.Entities;
using SanadPlatform.API.Features.Reviews.Entities;
using SanadPlatform.API.Features.Conversations.Entities;
using SanadPlatform.API.Features.Notifications.Entities;
using SanadPlatform.API.Features.Rewards.Entities;
using SanadPlatform.API.Features.Subscriptions.Entities;
using SanadPlatform.API.Features.Marketing.Entities;
using SanadPlatform.API.Features.Insurance.Entities;
using SanadPlatform.API.Features.Support.Entities;
using SanadPlatform.API.Features.Payments.Entities;

namespace SanadPlatform.API.Infrastructure.Database;

public class SanadDbContext : DbContext
{
    public SanadDbContext(DbContextOptions<SanadDbContext> options) 
        : base(options)
    {
    }

    // ==================== Authentication ====================
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<UserSession> UserSessions { get; set; } = null!;
    public DbSet<PasswordResetToken> PasswordResetTokens { get; set; } = null!;
    public DbSet<EmailVerificationToken> EmailVerificationTokens { get; set; } = null!;

    // ==================== Patients ====================
    public DbSet<Patient> Patients { get; set; } = null!;
    public DbSet<FamilyMember> FamilyMembers { get; set; } = null!;
    public DbSet<FamilyAccess> FamilyAccess { get; set; } = null!;
    public DbSet<ActivityTracking> ActivityTrackings { get; set; } = null!;
    public DbSet<HydrationTracking> HydrationTrackings { get; set; } = null!;
    public DbSet<NutritionTracking> NutritionTrackings { get; set; } = null!;
    public DbSet<NutritionProfile> NutritionProfiles { get; set; } = null!;
    public DbSet<VitalSign> VitalSigns { get; set; } = null!;

    // ==================== Providers ====================
    public DbSet<Provider> Providers { get; set; } = null!;
    public DbSet<ProviderDocument> ProviderDocuments { get; set; } = null!;
    public DbSet<ProviderCertification> ProviderCertifications { get; set; } = null!;
    public DbSet<Service> Services { get; set; } = null!;
    public DbSet<ServiceAddon> ServiceAddons { get; set; } = null!;
    public DbSet<ProviderSchedule> ProviderSchedules { get; set; } = null!;
    public DbSet<ProviderUnavailability> ProviderUnavailabilities { get; set; } = null!;

    // ==================== Bookings ====================
    public DbSet<Booking> Bookings { get; set; } = null!;
    public DbSet<BookingAddon> BookingAddons { get; set; } = null!;
    public DbSet<BookingStatusHistory> BookingStatusHistories { get; set; } = null!;
    public DbSet<Transaction> Transactions { get; set; } = null!;
    public DbSet<Refund> Refunds { get; set; } = null!;
    public DbSet<TrackingSession> TrackingSessions { get; set; } = null!;
    public DbSet<ProviderLocation> ProviderLocations { get; set; } = null!;
    public DbSet<Dispute> Disputes { get; set; } = null!;
    public DbSet<DisputeMessage> DisputeMessages { get; set; } = null!;

    // ==================== Reviews ====================
    public DbSet<Review> Reviews { get; set; } = null!;
    public DbSet<ReviewReport> ReviewReports { get; set; } = null!;

    // ==================== Conversations ====================
    public DbSet<Conversation> Conversations { get; set; } = null!;
    public DbSet<Message> Messages { get; set; } = null!;

    // ==================== Notifications ====================
    public DbSet<Notification> Notifications { get; set; } = null!;
    public DbSet<PushToken> PushTokens { get; set; } = null!;

    // ==================== Rewards ====================
    public DbSet<PatientRewards> PatientRewards { get; set; } = null!;
    public DbSet<Badge> Badges { get; set; } = null!;
    public DbSet<PatientBadge> PatientBadges { get; set; } = null!;
    public DbSet<RewardTransaction> RewardTransactions { get; set; } = null!;
    public DbSet<Referral> Referrals { get; set; } = null!;

    // ==================== Subscriptions ====================
    public DbSet<Subscription> Subscriptions { get; set; } = null!;
    public DbSet<SubscriptionPayment> SubscriptionPayments { get; set; } = null!;

    // ==================== Marketing ====================
    public DbSet<MarketingCampaign> MarketingCampaigns { get; set; } = null!;
    public DbSet<CampaignPerformance> CampaignPerformances { get; set; } = null!;
    public DbSet<DiscountCode> DiscountCodes { get; set; } = null!;
    public DbSet<DiscountCodeUsage> DiscountCodeUsages { get; set; } = null!;

    // ==================== Insurance ====================
    public DbSet<InsuranceClaim> InsuranceClaims { get; set; } = null!;

    // ==================== Support ====================
    public DbSet<SupportTicket> SupportTickets { get; set; } = null!;
    public DbSet<SupportTicketMessage> SupportTicketMessages { get; set; } = null!;

    // ==================== Payments ====================
    public DbSet<Payout> Payouts { get; set; } = null!;
    public DbSet<PayoutItem> PayoutItems { get; set; } = null!;
    public DbSet<ServiceCategoryConfig> ServiceCategoryConfigs { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure unique indexes
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<PushToken>()
            .HasIndex(p => new { p.UserId, p.Token })
            .IsUnique();

        modelBuilder.Entity<PatientBadge>()
            .HasIndex(pb => new { pb.PatientId, pb.BadgeId })
            .IsUnique();

        // Configure relationships (optional if using navigation properties)
        modelBuilder.Entity<Patient>()
            .HasOne(p => p.User)
            .WithOne(u => u.Patient)
            .HasForeignKey<Patient>(p => p.UserId);

        modelBuilder.Entity<Provider>()
            .HasOne(p => p.User)
            .WithOne(u => u.Provider)
            .HasForeignKey<Provider>(p => p.UserId);

        // Configure cascade deletes
        modelBuilder.Entity<Booking>()
            .HasOne(b => b.Patient)
            .WithMany(p => p.Bookings)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Booking>()
            .HasOne(b => b.Provider)
            .WithMany(p => p.Bookings)
            .OnDelete(DeleteBehavior.Restrict);

        // Configure string lengths
        modelBuilder.Entity<User>()
            .Property(u => u.Email)
            .HasMaxLength(255)
            .IsRequired();

        modelBuilder.Entity<Provider>()
            .Property(p => p.LicenseNumber)
            .HasMaxLength(100);

        // Configure decimal precision
        modelBuilder.Entity<Booking>()
            .Property(b => b.TotalAmount)
            .HasPrecision(10, 2);

        modelBuilder.Entity<Transaction>()
            .Property(t => t.Amount)
            .HasPrecision(10, 2);
    }
}
```

### 2. Create Initial Migration

```bash
cd BackEnd/SanadPlatform.API
dotnet ef migrations add InitialCreateAllEntities
dotnet ef database update
```

### 3. Create Repository Base Class

```csharp
// Features/Shared/Repositories/RepositoryBase.cs
using Microsoft.EntityFrameworkCore;
using SanadPlatform.API.Infrastructure.Database;
using System.Linq.Expressions;

namespace SanadPlatform.API.Features.Shared.Repositories;

public interface IRepositoryBase<T> where T : class
{
    Task<T?> GetByIdAsync(Guid id);
    Task<IEnumerable<T>> GetAllAsync();
    Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> expression);
    Task<T> AddAsync(T entity);
    void Update(T entity);
    void Delete(T entity);
    Task SaveChangesAsync();
}

public class RepositoryBase<T> : IRepositoryBase<T> where T : class
{
    protected readonly SanadDbContext _context;

    public RepositoryBase(SanadDbContext context)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public virtual async Task<T?> GetByIdAsync(Guid id)
    {
        return await _context.Set<T>().FindAsync(id);
    }

    public virtual async Task<IEnumerable<T>> GetAllAsync()
    {
        return await _context.Set<T>().ToListAsync();
    }

    public virtual async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> expression)
    {
        return await _context.Set<T>().Where(expression).ToListAsync();
    }

    public virtual async Task<T> AddAsync(T entity)
    {
        await _context.Set<T>().AddAsync(entity);
        await SaveChangesAsync();
        return entity;
    }

    public virtual void Update(T entity)
    {
        _context.Set<T>().Update(entity);
    }

    public virtual void Delete(T entity)
    {
        _context.Set<T>().Remove(entity);
    }

    public virtual async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}
```

### 4. Create Feature-Specific Repositories

Example for Patients:

```csharp
// Features/Patients/Repositories/PatientRepository.cs
using SanadPlatform.API.Features.Patients.Entities;
using SanadPlatform.API.Features.Shared.Repositories;
using SanadPlatform.API.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace SanadPlatform.API.Features.Patients.Repositories;

public interface IPatientRepository : IRepositoryBase<Patient>
{
    Task<Patient?> GetByUserIdAsync(Guid userId);
    Task<IEnumerable<Patient>> GetByBookingCountAsync(int minBookings);
}

public class PatientRepository : RepositoryBase<Patient>, IPatientRepository
{
    public PatientRepository(SanadDbContext context) : base(context)
    {
    }

    public async Task<Patient?> GetByUserIdAsync(Guid userId)
    {
        return await _context.Patients
            .Include(p => p.User)
            .Include(p => p.Bookings)
            .FirstOrDefaultAsync(p => p.UserId == userId);
    }

    public async Task<IEnumerable<Patient>> GetByBookingCountAsync(int minBookings)
    {
        return await _context.Patients
            .Where(p => p.TotalBookings >= minBookings)
            .OrderByDescending(p => p.TotalBookings)
            .ToListAsync();
    }
}
```

### 5. Register in Dependency Injection

Update `Program.cs`:

```csharp
// Register repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IPatientRepository, PatientRepository>();
builder.Services.AddScoped<IProviderRepository, ProviderRepository>();
builder.Services.AddScoped<IBookingRepository, BookingRepository>();
builder.Services.AddScoped<ITransactionRepository, TransactionRepository>();
// ... etc for all repositories
```

### 6. Create DTOs for MediatR

Example:

```csharp
// Features/Patients/DTOs/CreatePatientRequest.cs
namespace SanadPlatform.API.Features.Patients.DTOs;

public class CreatePatientRequest
{
    public Guid UserId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public DateTime? DateOfBirth { get; set; }
    public string? Gender { get; set; }
    public string? City { get; set; }
    public string? BloodType { get; set; }
}

public class CreatePatientResponse
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
```

### 7. Create MediatR Handlers

Example:

```csharp
// Features/Patients/Handlers/CreatePatientHandler.cs
using MediatR;
using SanadPlatform.API.Features.Patients.DTOs;
using SanadPlatform.API.Features.Patients.Entities;
using SanadPlatform.API.Features.Patients.Repositories;
using AutoMapper;

namespace SanadPlatform.API.Features.Patients.Handlers;

public class CreatePatientRequest : IRequest<CreatePatientResponse>
{
    public CreatePatientRequest(DTOs.CreatePatientRequest request)
    {
        UserId = request.UserId;
        FirstName = request.FirstName;
        LastName = request.LastName;
        DateOfBirth = request.DateOfBirth;
        Gender = request.Gender;
        City = request.City;
        BloodType = request.BloodType;
    }

    public Guid UserId { get; }
    public string FirstName { get; }
    public string LastName { get; }
    public DateTime? DateOfBirth { get; }
    public string? Gender { get; }
    public string? City { get; }
    public string? BloodType { get; }
}

public class CreatePatientHandler : IRequestHandler<CreatePatientRequest, CreatePatientResponse>
{
    private readonly IPatientRepository _repository;
    private readonly IMapper _mapper;

    public CreatePatientHandler(IPatientRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<CreatePatientResponse> Handle(CreatePatientRequest request, CancellationToken cancellationToken)
    {
        var patient = new Patient
        {
            UserId = request.UserId,
            FirstName = request.FirstName,
            LastName = request.LastName,
            DateOfBirth = request.DateOfBirth,
            Gender = request.Gender,
            City = request.City,
            BloodType = request.BloodType,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var createdPatient = await _repository.AddAsync(patient);
        return _mapper.Map<CreatePatientResponse>(createdPatient);
    }
}
```

---

## File Structure After Integration

```
Features/
├── Authentication/
│   ├── Entities/
│   │   ├── User.cs
│   │   └── AuthenticationEntities.cs
│   ├── Repositories/
│   │   ├── IUserRepository.cs
│   │   └── UserRepository.cs
│   ├── Services/
│   ├── Handlers/
│   ├── DTOs/
│   └── Controllers/
├── Patients/
│   ├── Entities/
│   │   └── Patient.cs
│   ├── Repositories/
│   │   ├── IPatientRepository.cs
│   │   └── PatientRepository.cs
│   ├── Services/
│   ├── Handlers/
│   ├── DTOs/
│   └── Controllers/
├── Providers/
├── Bookings/
├── Reviews/
├── Conversations/
├── Notifications/
├── Rewards/
├── Subscriptions/
├── Marketing/
├── Insurance/
├── Support/
├── Payments/
└── Shared/
    ├── Repositories/
    │   └── RepositoryBase.cs
    ├── Services/
    └── Exceptions/
```

---

## Common Queries

### Get Patient with All Relations
```csharp
var patient = await _context.Patients
    .Include(p => p.User)
    .Include(p => p.Bookings)
        .ThenInclude(b => b.Provider)
    .Include(p => p.FamilyMembers)
    .Include(p => p.Rewards)
    .FirstOrDefaultAsync(p => p.Id == patientId);
```

### Get Provider with Services
```csharp
var provider = await _context.Providers
    .Include(p => p.User)
    .Include(p => p.Services)
        .ThenInclude(s => s.Addons)
    .Include(p => p.Documents)
    .Include(p => p.Schedules)
    .FirstOrDefaultAsync(p => p.Id == providerId);
```

### Get Active Bookings for Patient
```csharp
var activeBookings = await _context.Bookings
    .Where(b => b.PatientId == patientId && b.Status != "cancelled")
    .Include(b => b.Provider)
    .Include(b => b.Service)
    .OrderByDescending(b => b.CreatedAt)
    .ToListAsync();
```

---

## Testing the Integration

### 1. Add migrations
```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### 2. Seed test data
```csharp
// In Program.cs or separate DbInitializer
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<SanadDbContext>();
    context.Database.EnsureCreated();
    // Add seed data
}
```

### 3. Test API endpoints
```bash
dotnet run
```

---

## Checklist

- [x] Create all entity classes with proper properties
- [x] Configure relationships and navigation properties
- [x] Add to DbContext as DbSet properties
- [x] Configure unique constraints in OnModelCreating
- [ ] Create repositories for each feature
- [ ] Create DTOs for request/response
- [ ] Create MediatR handlers
- [ ] Create service layer
- [ ] Create API controllers
- [ ] Add authentication/authorization
- [ ] Add validation rules
- [ ] Create unit tests
- [ ] Create integration tests

---

## References

- [Entity Framework Core Documentation](https://docs.microsoft.com/en-us/ef/core/)
- [MediatR Pattern](https://github.com/jbogard/MediatR)
- [Vertical Slice Architecture](https://jimmybogard.com/vertical-slice-architecture/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
