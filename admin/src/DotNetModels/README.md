# Care@Home Tunisia - .NET Models

This folder contains C# Entity Framework Core models for the Care@Home Tunisia healthcare marketplace platform.

## Overview

These models are generated from the PostgreSQL database schema and TypeScript API types. They provide a complete data model for a .NET backend implementation.

## Structure

### Core Entities
- **User.cs** - Main user entity (patients, providers, admins)
- **Patient.cs** - Patient profile with medical information
- **Provider.cs** - Healthcare provider profiles
- **Service.cs** - Services offered by providers
- **Booking.cs** - Appointments/bookings
- **Transaction.cs** - Payment transactions with escrow
- **Review.cs** - Provider ratings and reviews

### Supporting Models
- **SupportingModels.cs** - Provider certifications, schedules, service facilities
- **Message.cs** - Chat messages between users
- **Notification.cs** - User notifications
- **ProviderDocument.cs** - Document verification (licenses, insurance)
- **MarketingCampaign.cs** - Provider marketing campaigns

### Health Tracking
- **HealthTracking.cs** - Activity, hydration, and nutrition tracking
- **NutritionProfile.cs** - Patient nutrition goals and preferences

### Rewards & Family
- **RewardsAndFamily.cs** - Gamification, badges, family circle management

### Admin & Security
- **AdminAndFraud.cs** - Subscriptions, insurance claims, fraud detection, payouts

### Database Context
- **CareAtHomeDbContext.cs** - Entity Framework DbContext with relationships and configurations

## Features

### Relationships
- One-to-One: User ↔ Patient, User ↔ Provider
- One-to-Many: Provider → Services, Patient → Bookings
- Many-to-Many: Patients ↔ Badges (via PatientBadge)

### Enums
All enums are stored as strings in the database for readability:
- UserRole, ServiceType, BookingStatus, PaymentStatus
- SubscriptionTier, FraudSeverity, etc.

### Constraints
- Unique indexes on emails, claim numbers, composite keys
- Foreign key relationships with cascade/restrict behaviors
- Check constraints for ratings (1-5), day of week (0-6)

### Audit Fields
Most entities include:
- `CreatedAt` - Timestamp of creation
- `UpdatedAt` - Timestamp of last update

## Usage

### 1. Install NuGet Packages
```bash
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
dotnet add package Microsoft.EntityFrameworkCore.Design
```

### 2. Configure Connection String
```csharp
// appsettings.json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=carehome_tunisia;Username=postgres;Password=yourpassword"
  }
}

// Program.cs or Startup.cs
services.AddDbContext<CareAtHomeDbContext>(options =>
    options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));
```

### 3. Run Migrations
```bash
# Create initial migration
dotnet ef migrations add InitialCreate

# Update database
dotnet ef database update
```

### 4. Example Usage
```csharp
// Dependency injection
public class BookingService
{
    private readonly CareAtHomeDbContext _context;

    public BookingService(CareAtHomeDbContext context)
    {
        _context = context;
    }

    public async Task<Booking> CreateBookingAsync(Booking booking)
    {
        _context.Bookings.Add(booking);
        await _context.SaveChangesAsync();
        return booking;
    }

    public async Task<List<Booking>> GetPatientBookingsAsync(Guid patientId)
    {
        return await _context.Bookings
            .Include(b => b.Provider)
            .Include(b => b.Service)
            .Where(b => b.PatientId == patientId)
            .OrderByDescending(b => b.BookingDate)
            .ToListAsync();
    }
}
```

## Database Schema Alignment

These models align with:
- **PostgreSQL Schema**: `database/schema.sql`
- **TypeScript Types**: `types/api.types.ts`
- **Database Documentation**: `database/DATABASE_DOCUMENTATION.md`

## Migration from Mock Data

When integrating with real APIs:
1. Replace mock data in hooks with API calls
2. Use these models in your .NET backend
3. Implement repositories/services using the DbContext
4. Add DTOs (Data Transfer Objects) for API responses
5. Implement AutoMapper for model-to-DTO mapping

## Best Practices

1. **Use async/await** for all database operations
2. **Include related entities** with `.Include()` when needed
3. **Use DTOs** for API responses (don't expose entities directly)
4. **Implement repositories** for data access abstraction
5. **Add validation** using Data Annotations or Fluent Validation
6. **Handle soft deletes** if needed (add IsDeleted flag)
7. **Implement audit logging** for sensitive operations

## Security Considerations

- Password hashes are stored, never plain text passwords
- Sensitive data (medical history, insurance) should be encrypted at rest
- Implement role-based authorization
- Use HTTPS for all API endpoints
- Validate and sanitize all user inputs
- Implement rate limiting for API endpoints

## Next Steps

1. Implement DTOs and AutoMapper profiles
2. Create repository interfaces and implementations
3. Add business logic services
4. Implement API controllers
5. Add authentication/authorization (JWT, Identity)
6. Set up logging and monitoring
7. Implement caching strategies
8. Add API documentation (Swagger/OpenAPI)

## License

Proprietary - Care@Home Tunisia
