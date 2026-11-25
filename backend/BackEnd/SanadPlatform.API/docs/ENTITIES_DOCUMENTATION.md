# Database Entities - Complete Documentation

## Overview
This document provides a comprehensive reference for all C# entity models created based on the SQL schema and database documentation. Entities are organized by feature following the vertical slice architecture.

---

## 1. Authentication Feature
**Location:** `Features/Authentication/Entities/`

### User
- **File:** `User.cs`
- **Purpose:** Central authentication table for all user types (patients, providers, admins)
- **Key Properties:**
  - Authentication: Email, PasswordHash, EmailVerified, TwoFactorEnabled
  - Role & Status: Role, IsActive, IsSuspended
  - Contact: Phone, PhoneVerified
  - Security: FailedLoginAttempts, LockedUntil, PasswordChangedAt
  - Metadata: LastLoginAt, CreatedAt, UpdatedAt, DeletedAt (soft delete)
- **Navigation:** Patient, Provider, Sessions, PasswordResetTokens, EmailVerificationTokens, Notifications

### UserSession
- **Purpose:** Security tracking for user sessions
- **Key Properties:** TokenHash, RefreshTokenHash, DeviceInfo, IsActive, ExpiresAt, RevokedAt

### PasswordResetToken
- **Purpose:** Token for password reset functionality
- **Key Properties:** TokenHash, ExpiresAt, UsedAt

### EmailVerificationToken
- **Purpose:** Token for email verification
- **Key Properties:** Email, TokenHash, ExpiresAt, VerifiedAt

---

## 2. Patients Feature
**Location:** `Features/Patients/Entities/`

### Patient
- **File:** `Patient.cs`
- **Purpose:** Patient profile with medical and demographic information
- **Key Properties:**
  - Personal: FirstName, LastName, DateOfBirth, Gender
  - Address: AddressLine1, City, PostalCode, Country, Latitude, Longitude
  - Emergency: EmergencyContactName, EmergencyContactPhone, EmergencyContactRelationship
  - Medical: BloodType, MedicalConditions, Allergies, CurrentMedications
  - Insurance: InsuranceProvider, InsurancePolicyNumber, InsuranceExpiryDate
  - Profile: ProfilePictureUrl, Bio, PreferredCommunication
  - Stats: TotalBookings, CompletedBookings, CancelledBookings, TotalSpent
- **Navigation:** User, Bookings, FamilyMembers, FamilyAccessGrants, ActivityTrackings, HealthTracking

### FamilyMember
- **Purpose:** Represents family members of a patient
- **Key Properties:**
  - FirstName, LastName, Relationship (parent, child, spouse, sibling)
  - DateOfBirth, Gender, Phone, Email
  - Medical: BloodType, MedicalConditions, Allergies, CurrentMedications
  - Permissions: CanBookFor, CanViewHistory

### FamilyAccess
- **Purpose:** Manages family member access permissions
- **Key Properties:**
  - PatientId, GrantedToUserId
  - Permissions: CanBook, CanViewHistory, CanViewMedical, CanManagePayments
  - IsActive

### ActivityTracking
- **Purpose:** Daily activity tracking for patients
- **Key Properties:**
  - Date, Steps, DistanceKm, CaloriesBurned, ActiveMinutes, FloorsClimbed
  - Source (manual, fitbit, apple_health, google_fit)

### HydrationTracking
- **Purpose:** Daily water intake tracking
- **Key Properties:** Date, WaterMl, GoalMl

### NutritionTracking
- **Purpose:** Per-meal nutrition tracking
- **Key Properties:**
  - Date, MealType (breakfast, lunch, dinner, snack)
  - FoodName, Calories, Protein, Carbs, Fat, Fiber, Sugar, Sodium
  - Notes, PhotoUrl

### NutritionProfile
- **Purpose:** Patient nutrition goals and profile
- **Key Properties:**
  - Physical: HeightCm, WeightKg, TargetWeightKg
  - ActivityLevel, Goal (lose_weight, maintain, gain_weight, build_muscle)
  - DailyTargets: DailyCalories, DailyProteinG, DailyCarbsG, DailyFatG, DailyWaterMl
  - Restrictions: DietaryRestrictions, FoodAllergies

### VitalSign
- **Purpose:** Vital signs tracking
- **Key Properties:**
  - MeasuredAt, BloodPressure (systolic/diastolic), HeartRate, Temperature
  - OxygenSaturation, BloodGlucose, Weight
  - MeasuredBy (self, provider, device)

---

## 3. Providers Feature
**Location:** `Features/Providers/Entities/`

### Provider
- **File:** `Provider.cs`
- **Purpose:** Healthcare provider profile
- **Key Properties:**
  - Type: ServiceCategory, IsIndividual
  - Business: BusinessName, LegalName, TaxId
  - Personal: FirstName, LastName (for individuals)
  - Professional: LicenseNumber, LicenseIssuingAuthority, Specializations, YearsOfExperience
  - Address: Full address with latitude/longitude
  - ServiceArea: ServiceRadiusKm, ServesAtHome, ServesAtClinic
  - Media: ProfilePictureUrl, CoverImageUrl, GalleryUrls, VideoIntroUrl
  - Ratings: RatingAverage, RatingCount, CategoryRatings
  - Stats: TotalBookings, CompletedBookings, TotalRevenue, ResponseRate
  - Verification: IsVerified, IsApproved, RejectionReason
  - Subscription: SubscriptionTier, CommissionRate
  - Payment: StripeAccountId, BankDetails
  - Settings: InstantBookingEnabled, AutoAcceptBookings, CancellationPolicy
  - Availability: IsAvailable, AvailabilityStatus, VacationDates
- **Navigation:** User, Services, Documents, Certifications, Schedules, Bookings, Reviews, Conversations

### ProviderDocument
- **Purpose:** Verification documents for providers
- **Key Properties:**
  - DocumentType (diploma, license, insurance, id_card, passport, certification, etc.)
  - DocumentName, DocumentUrl, MimeType, FileSizeBytes
  - ExtractedData (from OCR)
  - Verification: IsVerified, VerifiedAt, VerifiedBy, VerificationNotes
  - Validity: IssueDate, ExpiryDate, IsExpired

### ProviderCertification
- **Purpose:** Professional certifications
- **Key Properties:**
  - CertificationName, IssuingOrganization, CertificationNumber
  - IssueDate, ExpiryDate, DocumentUrl
  - IsVerified, VerifiedAt

### Service
- **Purpose:** Services offered by providers
- **Key Properties:**
  - ServiceCategory, Name, Description, ShortDescription
  - Pricing: Price, PriceType (fixed, hourly, daily, etc.), Currency, MinPrice, MaxPrice
  - Duration: DurationMinutes, MinDurationMinutes, MaxDurationMinutes
  - ServiceLocation (home, clinic, both, remote)
  - Availability: IsActive, IsFeatured
  - Requirements: RequiresPrescription, RequiresMedicalHistory, AgeRestrictions
  - Media: ImageUrl, GalleryUrls
  - BookingCount, Metadata (JSON for category-specific fields)
- **Navigation:** Provider, Addons, Bookings, Reviews

### ServiceAddon
- **Purpose:** Optional add-ons for services
- **Key Properties:** ServiceId, Name, Description, Price, DurationMinutes, IsActive

### ProviderSchedule
- **Purpose:** Weekly recurring schedule
- **Key Properties:**
  - ProviderId, DayOfWeek (0-6), StartTime, EndTime
  - IsAvailable
  - ServiceId (optional, for service-specific schedule)

### ProviderUnavailability
- **Purpose:** Exceptions and unavailability periods
- **Key Properties:**
  - StartDateTime, EndDateTime
  - IsAllDay, IsRecurring, RecurrenceRule (iCal format)
  - Reason, Notes

---

## 4. Bookings Feature
**Location:** `Features/Bookings/Entities/`

### Booking
- **File:** `Booking.cs`
- **Purpose:** Appointment/booking record
- **Key Properties:**
  - BookingNumber (human-readable), PatientId, ProviderId, ServiceId
  - Timing: BookingDate, StartTime, EndTime, DurationMinutes, Timezone
  - Status: pending, confirmed, provider_on_way, in_progress, completed, validated, cancelled, no_show, disputed
  - PatientInfo: PatientName, PatientPhone, PatientEmail (snapshot)
  - Location: ServiceLocation, Address fields, Latitude/Longitude, AddressInstructions
  - Medical: PatientNotes, Symptoms, MedicalHistoryShared
  - FamilyMember: IsForFamilyMember, FamilyMemberId, FamilyMemberName, FamilyMemberAge
  - Pricing: ServicePrice, AddonsPrice, DiscountAmount, DiscountCode, Subtotal, PlatformFee, TaxAmount, TotalAmount
  - Commission: CommissionRate, CommissionAmount, ProviderAmount
  - Validation: ValidationRequired, ValidationCode, ValidatedAt, ValidationMethod, AutoValidateAt
  - Tracking: ProviderAcceptedAt, ProviderDepartedAt, ProviderArrivedAt, ServiceStartedAt, ServiceCompletedAt
  - Cancellation: CancelledAt, CancelledByUserId, CancellationReason, CancellationFee
  - Rescheduling: RescheduledFromId, RescheduleCount
  - Metadata: Source (web, mobile, api), UTM parameters
- **Navigation:** Patient, Provider, Service, Addons, StatusHistory, Transaction, Review, Conversation, TrackingSession, Dispute

### BookingAddon
- **Purpose:** Selected add-ons for a booking
- **Key Properties:** BookingId, AddonId, Name, Price, Quantity

### BookingStatusHistory
- **Purpose:** Audit trail of booking status changes
- **Key Properties:**
  - BookingId, PreviousStatus, NewStatus
  - ChangedByUserId, ChangeReason, Notes
  - Location: Latitude, Longitude

### Transaction
- **Purpose:** Payment transaction
- **Key Properties:**
  - TransactionNumber, BookingId, PatientId, ProviderId
  - Amount, PlatformFee, ProviderAmount, TaxAmount, Currency
  - PaymentMethod (card, sepa, d17, flouci, mobile_money, bank_transfer, cash)
  - PaymentStatus: pending, authorized, held, captured, released, refunded, partially_refunded, failed, disputed
  - Gateway: stripe, d17, flouci
  - GatewayPaymentId, GatewayChargeId, GatewayTransferId, GatewayResponse
  - CardInfo: CardLastFour, CardBrand, CardCountry
  - EscrowTimeline: AuthorizedAt, HeldAt, CapturedAt, ReleasedAt
  - Fraud: FraudScore, FraudDecision (approve, review, block), FraudFlags, IsFlagged
  - Metadata: IpAddress, DeviceFingerprint
- **Navigation:** Booking, Refunds, PayoutItems

### Refund
- **Purpose:** Refund for a transaction
- **Key Properties:**
  - TransactionId, BookingId, Amount, Reason
  - Status: pending, processing, completed, failed
  - GatewayRefundId, GatewayResponse
  - RequestedByUserId, ApprovedByUserId, ProcessedAt

### TrackingSession
- **Purpose:** Live tracking session for appointments
- **Key Properties:**
  - BookingId, IsActive, StartedAt, EndedAt, CurrentStatus
- **Navigation:** Booking, ProviderLocations

### ProviderLocation
- **Purpose:** Location point during tracking
- **Key Properties:** TrackingSessionId, ProviderId, Latitude, Longitude, Accuracy, RecordedAt

### Dispute
- **Purpose:** Booking dispute
- **Key Properties:**
  - BookingId, PatientId, ProviderId
  - Status: open, investigating, resolved_patient, resolved_provider, resolved_split, closed
  - Reason, Description, ResolutionNotes
  - PatientRefundAmount, ResolvedAt, ResolvedByUserId
  - EvidenceUrl
- **Navigation:** Booking, Messages

### DisputeMessage
- **Purpose:** Message in a dispute
- **Key Properties:** DisputeId, SenderUserId, Content, AttachmentUrl

---

## 5. Reviews Feature
**Location:** `Features/Reviews/Entities/`

### Review
- **File:** `Review.cs`
- **Purpose:** Rating and review for a service
- **Key Properties:**
  - BookingId, PatientId, ProviderId, ServiceId
  - Rating (1-5), RatingProfessionalism, RatingPunctuality, RatingQuality, RatingCommunication
  - Title, Comment
  - PhotoUrls
  - IsVerified (from actual booking)
  - Moderation: IsVisible, IsFlagged, FlaggedReason, ModeratedAt, ModeratedByUserId
  - ProviderResponse, ProviderRespondedAt
  - Fraud: FraudScore, IsSuspicious
- **Navigation:** Booking, Patient, Provider, Reports

### ReviewReport
- **Purpose:** Report of inappropriate review
- **Key Properties:**
  - ReviewId, ReportedByUserId, Reason, Description
  - Status: pending, investigating, resolved, dismissed
  - ResolvedAt, ResolvedByUserId, ResolutionNotes

---

## 6. Conversations Feature
**Location:** `Features/Conversations/Entities/`

### Conversation
- **File:** `Conversation.cs`
- **Purpose:** Messaging conversation between patient and provider
- **Key Properties:**
  - PatientId, ProviderId, BookingId (optional)
  - IsActive
  - LastMessageAt, LastMessagePreview, LastMessageByUserId
  - PatientUnreadCount, ProviderUnreadCount
- **Navigation:** Patient, Provider, Booking, Messages

### Message
- **Purpose:** Individual message in conversation
- **Key Properties:**
  - ConversationId, SenderUserId
  - MessageType: text, image, file, location, system
  - Content, AttachmentUrl, AttachmentName, AttachmentSizeBytes, AttachmentMimeType
  - Location: Latitude, Longitude (for location messages)
  - IsRead, ReadAt
  - Metadata (JSON)

---

## 7. Notifications Feature
**Location:** `Features/Notifications/Entities/`

### Notification
- **File:** `Notification.cs`
- **Purpose:** User notification
- **Key Properties:**
  - UserId, Type (booking_new, booking_confirmed, payment_received, etc.)
  - Title, Message
  - BookingId, ProviderId (optional related entities)
  - ActionUrl, ActionData (JSON)
  - IsRead, ReadAt
  - DeliveryChannels: SentViaPush, SentViaEmail, SentViaSms

### PushToken
- **Purpose:** Push notification device token
- **Key Properties:**
  - UserId, Token, Platform (ios, android, web), DeviceId
  - IsActive

---

## 8. Rewards Feature
**Location:** `Features/Rewards/Entities/`

### PatientRewards
- **File:** `Rewards.cs`
- **Purpose:** Summary of patient rewards
- **Key Properties:**
  - PatientId
  - Points: TotalPoints, AvailablePoints, RedeemedPoints
  - Streaks: CurrentStreak, LongestStreak, LastActivityDate
  - Level: Level (numeric), LevelName
  - Stats: TotalBookings, TotalReviews, TotalReferrals

### Badge
- **Purpose:** Achievement badge definition
- **Key Properties:**
  - Code, Name, Description
  - IconUrl, Color
  - RequirementType (bookings, reviews, streak, referrals, etc.), RequirementValue
  - PointsAwarded
  - IsActive

### PatientBadge
- **Purpose:** Badge earned by patient
- **Key Properties:** PatientId, BadgeId, EarnedAt

### RewardTransaction
- **Purpose:** Record of points earned/redeemed
- **Key Properties:**
  - PatientId
  - TransactionType: earned, redeemed, expired, adjusted
  - Points, BalanceAfter
  - Reason
  - BookingId, BadgeId (optional related entities)

### Referral
- **Purpose:** Referral program record
- **Key Properties:**
  - ReferrerId, ReferredUserId
  - ReferralCode
  - Status: pending, signed_up, completed, rewarded
  - ReferrerPoints, ReferredPoints, RewardedAt timestamps

---

## 9. Subscriptions Feature
**Location:** `Features/Subscriptions/Entities/`

### Subscription
- **File:** `Subscription.cs`
- **Purpose:** Provider subscription to service tiers
- **Key Properties:**
  - ProviderId, Tier (free, basic, premium, elite, enterprise)
  - Status: active, cancelled, paused
  - MonthlyPrice, BillingDayOfMonth
  - StartDate, EndDate, CancelledAt, RenewsAt
  - Features: MaxServices, HasAnalytics, HasMarketingTools, HasPrioritySupport, CommissionDiscount

### SubscriptionPayment
- **Purpose:** Payment record for subscription
- **Key Properties:**
  - SubscriptionId, Amount, Currency
  - PaymentStatus: pending, completed, failed
  - PeriodStart, PeriodEnd, DueDate, PaidAt
  - GatewayPaymentId, FailureReason

---

## 10. Marketing Feature
**Location:** `Features/Marketing/Entities/`

### MarketingCampaign
- **File:** `Marketing.cs`
- **Purpose:** Provider marketing campaign
- **Key Properties:**
  - ProviderId, Name
  - CampaignType: social, email, sms, display, search
  - Objective: awareness, engagement, conversions, retention
  - Status: draft, scheduled, active, paused, completed, cancelled
  - Dates: StartDate, EndDate
  - Budget, SpentAmount
  - Targeting: City, AgeRange, Gender
  - Content: Title, Description, ImageUrl, LandingPageUrl
  - Performance: TotalImpressions, TotalClicks, TotalConversions, CostPerClick, ConversionRate

### CampaignPerformance
- **Purpose:** Daily performance metrics
- **Key Properties:** CampaignId, Date, Impressions, Clicks, Conversions, Spent

### DiscountCode
- **Purpose:** Discount/promo code
- **Key Properties:**
  - Code, Description
  - DiscountType: percentage, fixed
  - DiscountValue, MaxDiscountAmount
  - ValidFrom, ValidUntil
  - MaxUses, MaxUsesPerUser, CurrentUses
  - MinOrderAmount
  - ApplicableServices (list), ApplicableCategories (list)
  - FirstBookingOnly, IsActive

### DiscountCodeUsage
- **Purpose:** Record of discount code use
- **Key Properties:** DiscountCodeId, BookingId, PatientId, DiscountAmount

---

## 11. Insurance Feature
**Location:** `Features/Insurance/Entities/`

### InsuranceClaim
- **File:** `Insurance.cs`
- **Purpose:** Insurance claim filed by provider
- **Key Properties:**
  - ProviderId, ClaimNumber
  - ClaimType: incident, damage, liability
  - Status: pending, investigating, approved, denied, resolved
  - ClaimAmount, ApprovedAmount
  - Description, IncidentDetails, IncidentDate
  - EvidenceUrls
  - SubmittedAt, ReviewedAt, ReviewedByUserId, ApprovedAt, PaidAt
  - ReviewNotes, DenialReason

---

## 12. Support Feature
**Location:** `Features/Support/Entities/`

### SupportTicket
- **File:** `Support.cs`
- **Purpose:** Customer support ticket
- **Key Properties:**
  - UserId, TicketNumber, Subject, Description
  - Category (billing, technical, booking, payment, etc.)
  - Priority: low, normal, high, urgent
  - Status: open, in_progress, waiting_customer, resolved, closed
  - AssignedToUserId, AssignedAt
  - ResolvedAt, Resolution, ClosedAt
  - SatisfactionRating (1-5), FeedbackComment
  - AttachmentUrls

### SupportTicketMessage
- **Purpose:** Message in support ticket
- **Key Properties:**
  - TicketId, SenderUserId, Content
  - AttachmentUrls
  - IsInternalNote

---

## 13. Payments Feature
**Location:** `Features/Payments/Entities/`

### Payout
- **File:** `Payout.cs`
- **Purpose:** Payment to provider
- **Key Properties:**
  - PayoutNumber, ProviderId
  - Amount, Currency
  - Status: pending, processing, completed, failed, cancelled
  - PayoutMethod: bank_transfer, stripe, mobile_money
  - BankAccountLastFour, Gateway, GatewayPayoutId
  - ScheduledFor, ProcessedAt, CompletedAt, FailureReason
  - Notes

### PayoutItem
- **Purpose:** Transaction included in payout
- **Key Properties:** PayoutId, TransactionId, Amount

### ServiceCategoryConfig
- **Purpose:** Service category configuration
- **Key Properties:**
  - Code, NameEn, NameFr, NameAr, NameDe
  - DescriptionEn, DescriptionFr
  - Icon, Color
  - DefaultCommissionRate, IsActive, DisplayOrder

---

## Key Design Patterns

### 1. Navigation Properties
All entities maintain bidirectional relationships where appropriate:
```csharp
public virtual User User { get; set; } = null!;
public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();
```

### 2. Soft Deletes
Some tables support soft deletes via `DeletedAt` timestamp:
```csharp
public DateTime? DeletedAt { get; set; }
```

### 3. Denormalization
Performance-critical counts/averages are cached:
- Provider: RatingAverage, RatingCount, TotalBookings, CompletedBookings
- Patient: TotalBookings, CompletedBookings, TotalSpent
- Service: BookingCount

### 4. JSONB Fields
Flexible metadata storage:
```csharp
public string? Metadata { get; set; } // JSON
public string? GatewayResponse { get; set; } // JSON
public string? ActionData { get; set; } // JSON
```

### 5. Arrays/Lists
Multi-value fields:
```csharp
public List<string> Specializations { get; set; } = new();
public List<string> DietaryRestrictions { get; set; } = new();
public List<Guid> ApplicableServices { get; set; } = new();
```

### 6. Enum-like String Fields
Status and type fields stored as strings (not C# enums for flexibility):
```csharp
public string Status { get; set; } = "pending";
public string PaymentMethod { get; set; } = string.Empty;
```

### 7. Timestamps
Standard audit timestamps:
```csharp
public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
public DateTime? DeletedAt { get; set; }
```

---

## Database Integration
These entities are designed to work with Entity Framework Core:

1. **DbContext Configuration**: Add to `SanadDbContext.cs`:
   ```csharp
   DbSet<User> Users { get; set; }
   DbSet<Patient> Patients { get; set; }
   DbSet<Provider> Providers { get; set; }
   // ... etc for all entities
   ```

2. **Migrations**: Generate migrations after adding entities:
   ```bash
   dotnet ef migrations add AddEntities
   dotnet ef database update
   ```

3. **Constraints**: Entity annotations handle constraints:
   - Primary keys: automatic on `Id` property
   - Foreign keys: via navigation properties
   - Unique constraints: Can be configured in `OnModelCreating`
   - Required fields: Use `required` or `?` for optional

---

## Next Steps
1. Configure DbSet properties in `SanadDbContext.cs`
2. Add entity type configurations in `OnModelCreating` for constraints
3. Create migrations: `dotnet ef migrations add InitialCreate`
4. Update database: `dotnet ef database update`
5. Create repository interfaces for data access
6. Implement MediatR request/response DTOs
7. Create service layer for business logic
