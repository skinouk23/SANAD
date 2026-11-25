# 📘 Sanad CareAtHome — Contributor's Guide

Welcome to the **Sanad CareAtHome Backend** project. This guide is your single reference for everything you need to contribute: setting up your environment, understanding the codebase, writing code that fits our conventions, and collaborating through Git. Read it once from top to bottom before you write your first line.

---

## 📑 Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Initial Setup](#2-initial-setup)
3. [Git Fundamentals](#3-git-fundamentals)
4. [Rules — Read These First](#4-rules--read-these-first)
5. [Branch Naming](#5-branch-naming)
6. [Commit Messages](#6-commit-messages)
7. [Step-by-Step Workflow](#7-step-by-step-workflow)
8. [Keeping Your Branch Up to Date](#8-keeping-your-branch-up-to-date)
9. [Project Architecture](#9-project-architecture)
10. [Code Style & Conventions](#10-code-style--conventions)
11. [How to Add a New Feature](#11-how-to-add-a-new-feature)
12. [Key Patterns Reference](#12-key-patterns-reference)
13. [Common Problems & Solutions](#13-common-problems--solutions)
14. [Need Help?](#14-need-help)

---

## 1. 🛠️ Prerequisites

Install all of the following before cloning the repository.

| Tool | Version | Purpose | Download |
|------|---------|---------|----------|
| **.NET SDK** | 8.0 or later | Build and run the API | https://dotnet.microsoft.com/download |
| **PostgreSQL** | 15 or later | Primary database | https://www.postgresql.org/download |
| **Git** | Any recent | Version control | https://git-scm.com/downloads |
| **EF Core CLI** | Latest | Run database migrations | See below |
| **IDE** | — | Code editor | See below |

### Install the EF Core CLI tool

After installing .NET, run this once:

```bash
dotnet tool install --global dotnet-ef
```

Verify the installation:

```bash
dotnet ef --version
```

### Recommended IDEs

| IDE | Notes |
|-----|-------|
| **Visual Studio 2022** (Community or above) | Best overall experience for .NET on Windows. Free. |
| **Visual Studio Code** + C# Dev Kit extension | Lightweight. Works on all platforms. |
| **JetBrains Rider** | Powerful, especially for refactoring. Paid (free for students). |

### Optional

- **Redis** — Only required if `RedisSettings:Enabled` is set to `true` in your configuration. Otherwise the project falls back to in-memory caching automatically.
- **pgAdmin** or **DBeaver** — GUI tools for browsing your PostgreSQL database.

---

## 2. 🚀 Initial Setup

### Step 1 — Clone the repository

```bash
git clone https://github.com/mehdimseddi/Sanad-Platform-backend.git
cd "Sanad-Platform-backend"
```

### Step 2 — Configure your Git identity

If you have never used Git on this machine, tell Git who you are. This identity appears on every commit you make:

```bash
git config --global user.name "Your Full Name"
git config --global user.email "your-email@example.com"
```

### Step 3 — Restore dependencies

```bash
dotnet restore "Sanad Platform Official.sln"
```

This downloads all NuGet packages the project needs. You only need to do this once (or after the `.csproj` file changes).

### Step 4 — Create your local database

Open **psql** or pgAdmin and create a PostgreSQL database:

```sql
CREATE DATABASE sanad_platform;
```

### Step 5 — Configure your local settings

The project reads configuration from `appsettings.Development.json` when running locally. This file is **not committed to Git** (it is in `.gitignore`) so you must create it yourself.

Create the file at:
```
BackEnd/SanadPlatform.API/appsettings.Development.json
```

Use this template and fill in your own values:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Debug",
      "Microsoft.AspNetCore": "Debug"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=sanad_platform;Username=YOUR_PG_USER;Password=YOUR_PG_PASSWORD"
  },
  "JwtSettings": {
    "SecretKey": "<set-locally>",
    "Issuer": "SanadPlatform",
    "Audience": "SanadPlatformUsers",
    "ExpiryMinutes": 60,
    "RefreshTokenExpiryDays": 7
  },
  "CorsSettings": {
    "AllowedOrigins": [ "http://localhost:3000" ]
  },
  "RedisSettings": {
    "Enabled": false,
    "Connection": ""
  },
  "Security": {
    "EncryptionKey": "<set-locally>",
    "DataInTransit": {
      "EnforceHsts": false,
      "HstsMaxAge": 31536000,
      "HstsIncludeSubDomains": true,
      "HstsPreload": false,
      "MinimumTlsVersion": "1.2",
      "EnforceSecureCookies": false,
      "EnableCertificatePinning": false
    }
  }
}
```

> ⚠️ **Never commit this file.** It contains passwords and secret keys. The `.gitignore` already excludes it, but double-check with `git status` before every commit.

### Step 6 — Apply database migrations

This creates all the tables in your local database:

```bash
dotnet ef database update --project BackEnd/SanadPlatform.API
```

If migrations run successfully you will see output ending with `Done.`

### Step 7 — Build the solution

```bash
dotnet build "Sanad Platform Official.sln"
```

Expected output: `Build succeeded. 0 Error(s)`

> A handful of warnings about nullable references and a MediatR package version mismatch are pre-existing and can be ignored.

### Step 8 — Run the API

```bash
dotnet run --project BackEnd/SanadPlatform.API/SanadPlatform.API.csproj
```

The API starts on:

| URL | Purpose |
|-----|---------|
| `http://localhost:5000` | Swagger UI (interactive API docs) |
| `http://localhost:5000/health` | Health check endpoint |
| `https://localhost:5001` | HTTPS (optional locally) |

Open `http://localhost:5000` in your browser. If you see the Swagger UI, setup is complete. ✅

---

## 3. 📖 Git Fundamentals

Git is a **version control system**. It tracks every change made to the codebase, who made it, and when. This lets multiple people work on the same project simultaneously without overwriting each other's work.

### Key concepts

| Concept | What it means |
|---------|--------------|
| **Repository (repo)** | The project folder, including its complete change history. |
| **Branch** | An independent line of work. Think of it as a copy of the project where you can make changes safely without affecting anyone else. |
| **Commit** | A saved snapshot of your changes. Like a save point in a video game. |
| **Staging area** | A holding area where you place files before committing them. You choose exactly what goes into each commit. |
| **Push** | Upload your local commits to GitHub so others can see them. |
| **Pull** | Download the latest commits from GitHub to your local machine. |
| **Merge** | Combine changes from one branch into another. |
| **Pull Request (PR)** | A request on GitHub to merge your branch into `master`. This is where code review happens. |
| **Conflict** | When two people edited the same part of the same file and Git cannot automatically combine both changes. Must be resolved manually. |

### Using Git

All Git commands in this guide are written for the **terminal** (Command Prompt, PowerShell, or bash). Your IDE (Visual Studio, VS Code, Rider) also has a built-in Git interface that does the same things visually — use whichever you prefer, but the terminal commands always work.

---

## 4. 🚨 Rules — Read These First

```
❌ NEVER push directly to the master branch
❌ NEVER commit directly to master
❌ NEVER commit secrets, passwords, or keys
❌ NEVER use git push --force unless explicitly told to
✅ ALWAYS create a new branch for every task
✅ ALWAYS open a Pull Request to get your code merged
✅ ALWAYS pull the latest changes before starting new work
✅ ALWAYS write clear, descriptive commit messages
✅ ALWAYS run dotnet build before pushing — fix all errors first
```

Breaking these rules causes problems for the entire team. When in doubt, ask before doing.

---

## 5. 🌿 Branch Naming

Every piece of work lives on its own branch. Name your branch based on what type of work it is:

| Type | Format | Example |
|------|--------|---------|
| New feature | `feature/short-description` | `feature/add-rewards-endpoints` |
| Bug fix | `bugfix/short-description` | `bugfix/patient-profile-null-check` |
| Hot fix (urgent production fix) | `hotfix/short-description` | `hotfix/jwt-token-expiry` |

**Rules for branch names:**
- Use lowercase letters and hyphens only — no spaces, no slashes beyond the prefix
- Keep descriptions short but meaningful (3–5 words)
- Describe *what* the branch does, not *who* is working on it

```bash
# Good
git checkout -b feature/add-notifications-service
git checkout -b bugfix/booking-status-not-updating

# Bad
git checkout -b johns-work
git checkout -b fix
git checkout -b my-branch-2
```

---

## 6. ✍️ Commit Messages

A commit message tells your teammates (and your future self) *what* changed and *why*. It is permanent — once pushed, it becomes part of the project history forever.

### Format

```
<Short summary in imperative mood, max 72 characters>

<Optional: longer explanation if the change is complex.
Explain the why, not the what. The code shows the what.>
```

Write in the **imperative mood** — as if giving an instruction:
- `Add patient profile endpoint` ✅
- `Added patient profile endpoint` ❌
- `Adding patient profile endpoint` ❌

### Examples

**Good commit messages ✅**
```
Add GetPatientFavorites query handler
Fix null reference in AppointmentService booking validation
Update ProviderRepository to use AsNoTracking for read queries
Remove unused IAuthenticationService registration from Program.cs
Add EF migration for Rewards entity table
```

**Bad commit messages ❌**
```
fix
updates
wip
done
asdfgh
my changes
final final v2
```

### When to commit

Commit **one logical change at a time**. Do not bundle ten unrelated changes into a single commit. Small, focused commits are easier to review and easier to undo if something goes wrong.

---

## 7. 💻 Step-by-Step Workflow

Follow this sequence every time you work on a task.

---

### Step 1 — Sync with master

Always start from the latest version of `master`. Stale starting points cause merge conflicts later.

```bash
git checkout master
git pull origin master
```

`git checkout master` switches you to the master branch.  
`git pull origin master` downloads the latest commits from GitHub.

---

### Step 2 — Create your branch

```bash
git checkout -b feature/your-task-name
```

This creates a new branch and switches to it in one command. You are now working in isolation — nothing you do here affects `master` or anyone else's branches.

Confirm which branch you are on at any time:

```bash
git branch
```

The currently active branch is marked with `*`.

---

### Step 3 — Make your changes

Write your code. Refer to [Section 9 (Architecture)](#9-project-architecture), [Section 10 (Code Style)](#10-code-style--conventions), and [Section 12 (Patterns)](#12-key-patterns-reference) as you work.

Build frequently to catch errors early:

```bash
dotnet build "Sanad Platform Official.sln"
```

Fix all build errors before proceeding. Warnings are acceptable (several pre-existing ones exist).

---

### Step 4 — Review what changed

Before committing, always check what you actually modified:

```bash
git status
```

This shows:
- **Red** files: modified or new, not yet staged
- **Green** files: staged and ready to commit

To see the exact line-by-line changes:

```bash
git diff
```

---

### Step 5 — Stage your changes

The staging area lets you choose exactly what goes into the commit.

```bash
# Stage specific files (preferred — you know exactly what you're committing)
git add BackEnd/SanadPlatform.API/Features/Patients/Commands/UpdatePatientProfile.cs
git add BackEnd/SanadPlatform.API/Features/Patients/Validators/UpdatePatientProfileValidator.cs

# Stage everything in the current directory
git add .
```

> ⚠️ Before using `git add .`, always run `git status` first to make sure you are not accidentally staging `appsettings.Development.json` or any file containing secrets.

---

### Step 6 — Commit your changes

```bash
git commit -m "Add UpdatePatientProfile command handler and validator"
```

For a more detailed commit with a body:

```bash
git commit -m "Add UpdatePatientProfile command handler and validator

Implements profile update endpoint for patients. Validator enforces
name format, phone number format, and valid birth date range using
shared ValidationExtensions. Handler uses Pattern B (change tracking)
with no explicit Update() call."
```

---

### Step 7 — Push your branch to GitHub

The first time you push a new branch:

```bash
git push -u origin feature/your-task-name
```

The `-u` flag links your local branch to the remote branch. From this point on, you can simply run `git push` without specifying the branch name for any subsequent pushes on the same branch.

---

### Step 8 — Open a Pull Request

1. Go to the repository on GitHub: **https://github.com/mehdimseddi/Sanad-Platform-backend**
2. GitHub will show a yellow banner: **"Compare & pull request"** — click it. If the banner is gone, click the **"Pull requests"** tab → **"New pull request"**, select your branch.
3. Set the **base branch** to `master` and the **compare branch** to your feature branch.
4. Fill in the PR description using this template:

```
## What
Brief description of the change (1-3 sentences).

## Why
Why is this change needed? What problem does it solve?

## How
Describe your approach. Mention any patterns or design decisions.
- Used Pattern B (change tracking) for entity updates
- Added FluentValidation rules for phone number format
- Registered new service in PatientServiceExtensions

## Related Issue
Closes #<issue-number>   (delete this line if not applicable)

## Checklist
- [ ] dotnet build passes with 0 errors
- [ ] No secrets or credentials in the diff
- [ ] XML doc comments on all new public classes and methods
- [ ] Section headers added where needed
- [ ] Feature registered in DI extension if new service/repo added
```

5. Assign a **reviewer** (the project owner or a senior team member).
6. Click **"Create Pull Request"**.

---

### Step 9 — Code review

After opening your PR, a reviewer will look at your code. You may receive:

| Response | Meaning |
|----------|---------|
| ✅ **Approved** | Your code is accepted and will be merged. |
| 💬 **Comments** | Questions or suggestions. Discuss or address them. |
| 🔄 **Changes requested** | Specific issues that must be fixed before merging. |

### Step 10 — Address review feedback

Make the requested changes on your local branch, then commit and push again:

```bash
git add .
git commit -m "Address review: rename method to ExistsByUserIdAsync"
git push
```

The PR on GitHub updates automatically. You do **not** need to open a new one.

Repeat until the PR is approved.

---

### Step 11 — After merge: clean up

Once your PR is merged, delete your local branch to keep things tidy:

```bash
git checkout master
git pull origin master
git branch -d feature/your-task-name
```

`git branch -d` safely deletes a branch only if it has been fully merged. You can also delete the remote branch from the GitHub PR page.

---

## 8. 🔄 Keeping Your Branch Up to Date

When other developers merge their PRs into `master` while you are still working on your branch, your branch falls behind. If you try to merge later with too many differences, you get conflicts that are harder to resolve. Sync your branch regularly — at least once a day on active development.

```bash
# Switch to master and download latest changes
git checkout master
git pull origin master

# Switch back to your branch
git checkout feature/your-task-name

# Merge master into your branch
git merge master
```

### Resolving merge conflicts

When two branches edit the same lines of the same file, Git cannot choose which version to keep. It marks the conflict in the file like this:

```
<<<<<<< HEAD
services.AddScoped<IPatientRepository, PatientRepository>();
=======
services.AddScoped<IPatientRepository, NewPatientRepository>();
>>>>>>> master
```

- Everything between `<<<<<<< HEAD` and `=======` is **your version**.
- Everything between `=======` and `>>>>>>> master` is the **version from master**.

To resolve:
1. Open the conflicted file in your IDE.
2. Decide which version to keep (or combine both if appropriate).
3. Delete the conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`).
4. Save the file.
5. Stage and commit:

```bash
git add BackEnd/SanadPlatform.API/Features/Patients/PatientServiceExtensions.cs
git commit -m "Resolve merge conflict in PatientServiceExtensions"
git push
```

> 💡 Visual Studio and VS Code both have visual merge conflict editors that highlight your version and the incoming version side by side. These are easier to use than editing the raw markers in the file.

---

## 9. 🏗️ Project Architecture

Understanding how the project is structured helps you know exactly where to put new code and what patterns to follow.

### What is Vertical Slice Architecture?

Most large projects are organized by **technical layer**: all controllers together, all services together, all repositories together. This means that to add a single feature you have to touch 5+ different folders spread across the project.

This project uses **Vertical Slice Architecture** instead. Every feature is **self-contained** in its own folder under `Features/`. All the code for a feature — controller, commands, queries, entities, validators, repository — lives together:

```
Features/
  Patients/
    Controllers/       ← HTTP endpoints
    Commands/          ← Write operations (create, update, delete)
    Queries/           ← Read operations (get, list)
    Entities/          ← EF Core entity classes
    Configurations/    ← EF Fluent API table mappings
    DTOs/              ← Request and response models
    Validators/        ← FluentValidation rules
    Repository/        ← Database access interface + implementation
    Services/          ← Complex domain logic (when needed)
    Mappings/          ← AutoMapper profiles
    PatientServiceExtensions.cs  ← DI registration for this feature
```

When you add a new feature, you create a new folder and work entirely inside it. You only touch `Program.cs` to register the new DI extension — nothing else.

### Active features vs skeleton features

| Status | Features |
|--------|---------|
| **Active** (full vertical slice) | Authentication, Patients, Providers, Bookings, Health |
| **Skeleton** (entities only, not yet implemented) | Admin, Ambulance, Appointments, Conversations, Equipment, Fraud, Insurance, Marketing, Notifications, Payments, Reviews, Rewards, Services, Subscriptions, Support |

When you are assigned to implement a skeleton feature, the entities and EF configurations are already there. You add the rest (commands, queries, controller, repository, DI extension, etc.).

### How a request travels through the system

```
HTTP Request (e.g. PATCH /api/v1/patients/profile)
      │
      ▼
  Controller  (Features/Patients/Controllers/PatientsController.cs)
  — validates JWT, extracts user ID from claims
  — creates a Command/Query record
  — calls _mediator.Send(command)
      │
      ▼
  MediatR Pipeline
      │
      ├── ValidationBehavior
      │     — runs FluentValidation on the command
      │     — throws ValidationException if rules fail → 400
      │
      ├── LoggingBehavior
      │     — logs request name and duration via Serilog
      │
      ▼
  Handler  (Features/Patients/Commands/UpdatePatientProfile.cs)
  — contains the business logic for this one operation
  — calls repository methods to read/write data
  — calls _unitOfWork.SaveChangesAsync() to persist
  — returns a DTO
      │
      ▼
  Repository  (Features/Patients/Repository/PatientRepository.cs)
  — issues EF Core queries against SanadDbContext
  — reads: AsNoTracking() + ProjectTo<TDto>() for efficiency
  — writes: tracked entity, no explicit Update() call
      │
      ▼
  EF Core + Npgsql
      │
      ▼
  PostgreSQL Database
      │
      ▼ (response travels back up the same chain)
      │
  Controller returns:
  Ok(ApiResponse<MyDto>.SuccessResponse(result, "Profile updated"))
```

If anything throws an unhandled exception, `GlobalExceptionHandlingMiddleware` catches it and maps it to the correct HTTP status code automatically. **Do not wrap your code in try-catch blocks** — let exceptions propagate.

### CQRS (Commands and Queries)

The project uses **CQRS** (Command Query Responsibility Segregation) via the **MediatR** library:

- **Commands** — operations that **change** data (create, update, delete). Named `{Action}{Entity}Command`.
- **Queries** — operations that only **read** data. Named `Get{Entity}{Detail}Query`.

Each command/query is a C# `record`. Its handler is a class in the **same file**.

---

## 10. 📐 Code Style & Conventions

The project enforces conventions through code review, not tooling (no `.editorconfig` or StyleCop). Learn these and apply them consistently.

### Formatting

| Rule | Correct | Incorrect |
|------|---------|-----------|
| **Namespace style** | `namespace SanadPlatform.API.Features.Patients;` | `namespace SanadPlatform.API.Features.Patients { }` |
| **Indentation** | 4 spaces | Tabs or 2 spaces |
| **Brace style** | Allman (opening brace on new line) | K&R (brace on same line) |
| **Nullable types** | Enabled — always handle nullability | Do not disable |

### Naming conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Classes, records, enums | PascalCase | `UpdatePatientProfileCommand` |
| Interfaces | `I` prefix + PascalCase | `IPatientRepository` |
| Methods | PascalCase + `Async` suffix for async | `GetByUserIdAsync()` |
| Properties | PascalCase | `FirstName`, `DateOfBirth` |
| Private fields | `_camelCase` | `_mediator`, `_patientRepository` |
| Constants | PascalCase | `NameRegex` |
| DTOs (request) | `{Action}{Entity}Request` | `UpdatePatientProfileRequest` |
| DTOs (response) | `{Entity}{Detail}Response` | `MyPatientProfileResponse` |
| Commands | `{Action}{Entity}Command` | `UpdatePatientProfileCommand` |
| Queries | `Get{Entity}{Detail}Query` | `GetMyPatientProfileQuery` |
| Validators | `{CommandName}Validator` | `UpdatePatientProfileCommandValidator` |
| Handlers | `{CommandName}Handler` | `UpdatePatientProfileCommandHandler` |
| Controllers | `{Feature}Controller` | `PatientsController` |
| DI extensions | `{Feature}ServiceExtensions` | `PatientServiceExtensions` |

### Documentation

All public classes and public methods must have XML doc comments:

```csharp
/// <summary>
/// Handles the UpdatePatientProfile command.
/// Updates the authenticated patient's personal information.
/// </summary>
public class UpdatePatientProfileCommandHandler : IRequestHandler<UpdatePatientProfileCommand, ApiResponse<MyPatientProfileResponse>>
{
    ...
}
```

### Section headers

Use this exact format to separate logical sections within large files:

```csharp
// ==================== Repositories ====================
```

That is exactly 20 `=` signs on each side. No more, no fewer.

### Structured logging

Always use **template placeholders** in log messages — never string interpolation:

```csharp
// Correct
_logger.LogInformation("Profile updated for User ID {UserId}", userId);

// Wrong — breaks structured logging, leaks PII into log indexes
_logger.LogInformation($"Profile updated for User ID {userId}");
```

Use `LogDebug` for routine operations (staging, loading entities).
Use `LogInformation` for significant events (user registered, booking confirmed).
Use `LogWarning` for unexpected but handled situations.
Use `LogError` for failures (caught at the middleware level).

### Constructor null-checks

Every constructor parameter must have a null guard:

```csharp
public PatientRepository(SanadDbContext context, ILogger<PatientRepository> logger)
{
    _context = context ?? throw new ArgumentNullException(nameof(context));
    _logger  = logger  ?? throw new ArgumentNullException(nameof(logger));
}
```

---

## 11. 🧩 How to Add a New Feature

Use this checklist every time you implement a new feature from scratch. The example feature is `Rewards`.

---

### Step 1 — Create the feature folder structure

```
Features/
  Rewards/
    Controllers/
    Commands/
    Queries/
    Entities/           ← may already exist if this is a skeleton feature
    Configurations/     ← may already exist
    DTOs/
    Validators/
    Repository/
    Mappings/
    RewardsServiceExtensions.cs
```

---

### Step 2 — Define your entity

`Features/Rewards/Entities/Reward.cs`

```csharp
namespace SanadPlatform.API.Features.Rewards.Entities;

/// <summary>Represents a reward earned by a patient.</summary>
public class Reward : IAuditableEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid PatientId { get; set; }
    public string Title { get; set; } = string.Empty;
    public int Points { get; set; }
    // IAuditableEntity provides CreatedAt and UpdatedAt (set automatically)
}
```

> Never set `CreatedAt` or `UpdatedAt` in your code — the `AuditableEntityInterceptor` sets them automatically.

---

### Step 3 — Add EF configuration

`Features/Rewards/Configurations/RewardConfiguration.cs`

```csharp
namespace SanadPlatform.API.Features.Rewards.Configurations;

/// <summary>EF Core Fluent API configuration for the Reward entity.</summary>
public class RewardConfiguration : IEntityTypeConfiguration<Reward>
{
    public void Configure(EntityTypeBuilder<Reward> builder)
    {
        builder.ToTable("rewards");
        builder.HasKey(r => r.Id);
        builder.Property(r => r.Title).IsRequired().HasMaxLength(200);
    }
}
```

Then add a `DbSet` to `SanadDbContext`:

```csharp
public DbSet<Reward> Rewards { get; set; }
```

---

### Step 4 — Create the repository

`Features/Rewards/Repository/IRewardRepository.cs`

```csharp
namespace SanadPlatform.API.Features.Rewards.Repository;

/// <summary>Data access contract for the Rewards feature.</summary>
public interface IRewardRepository
{
    Task<IReadOnlyList<RewardResponse>> GetByPatientIdAsync(Guid patientId, CancellationToken ct = default);
    Task<Reward> CreateAsync(Reward reward, CancellationToken ct = default);
}
```

`Features/Rewards/Repository/RewardRepository.cs`

```csharp
namespace SanadPlatform.API.Features.Rewards.Repository;

/// <summary>EF Core implementation of <see cref="IRewardRepository"/>.</summary>
public class RewardRepository : IRewardRepository
{
    private readonly SanadDbContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<RewardRepository> _logger;

    public RewardRepository(SanadDbContext context, IMapper mapper, ILogger<RewardRepository> logger)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
        _mapper  = mapper  ?? throw new ArgumentNullException(nameof(mapper));
        _logger  = logger  ?? throw new ArgumentNullException(nameof(logger));
    }

    // ==================== Queries ====================

    /// <summary>Returns all rewards for a patient.</summary>
    public async Task<IReadOnlyList<RewardResponse>> GetByPatientIdAsync(Guid patientId, CancellationToken ct = default)
    {
        _logger.LogDebug("Loading rewards for Patient ID {PatientId}", patientId);
        return await _context.Rewards
            .AsNoTracking()
            .Where(r => r.PatientId == patientId)
            .ProjectTo<RewardResponse>(_mapper.ConfigurationProvider)
            .ToListAsync(ct);
    }

    // ==================== Commands ====================

    /// <summary>Stages a new reward for insertion.</summary>
    public async Task<Reward> CreateAsync(Reward reward, CancellationToken ct = default)
    {
        ArgumentNullException.ThrowIfNull(reward);
        _logger.LogDebug("Staging new Reward for Patient ID {PatientId}", reward.PatientId);
        await _context.Rewards.AddAsync(reward, ct);
        return reward;
    }
}
```

> Read queries use `AsNoTracking()` + `ProjectTo<>()` — they never return tracked entities.  
> Write methods stage changes but do **not** call `SaveChangesAsync()` — the handler does that.

---

### Step 5 — Create your DTOs

`Features/Rewards/DTOs/RewardResponse.cs`

```csharp
namespace SanadPlatform.API.Features.Rewards.DTOs;

/// <summary>Response model for a single reward.</summary>
public record RewardResponse
{
    public Guid Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public int Points { get; init; }
    public DateTime CreatedAt { get; init; }
}
```

---

### Step 6 — Create a command (write operation)

Commands and their handlers live in the **same file**.

`Features/Rewards/Commands/CreateReward.cs`

```csharp
namespace SanadPlatform.API.Features.Rewards.Commands;

// ==================== Command ====================

/// <summary>Creates a new reward for a patient.</summary>
public record CreateRewardCommand(Guid PatientId, string Title, int Points)
    : IRequest<ApiResponse<RewardResponse>>;

// ==================== Handler ====================

/// <summary>Handles the CreateReward command.</summary>
public class CreateRewardCommandHandler : IRequestHandler<CreateRewardCommand, ApiResponse<RewardResponse>>
{
    private readonly IRewardRepository _rewardRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateRewardCommandHandler(IRewardRepository rewardRepository, IUnitOfWork unitOfWork)
    {
        _rewardRepository = rewardRepository ?? throw new ArgumentNullException(nameof(rewardRepository));
        _unitOfWork       = unitOfWork       ?? throw new ArgumentNullException(nameof(unitOfWork));
    }

    public async Task<ApiResponse<RewardResponse>> Handle(CreateRewardCommand request, CancellationToken cancellationToken)
    {
        var reward = new Reward
        {
            PatientId = request.PatientId,
            Title     = request.Title,
            Points    = request.Points
        };

        await _rewardRepository.CreateAsync(reward, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var response = new RewardResponse
        {
            Id    = reward.Id,
            Title = reward.Title,
            Points = reward.Points
        };

        return ApiResponse<RewardResponse>.SuccessResponse(response, "Reward created successfully.");
    }
}
```

---

### Step 7 — Create a validator

`Features/Rewards/Validators/CreateRewardCommandValidator.cs`

```csharp
namespace SanadPlatform.API.Features.Rewards.Validators;

/// <summary>Validates CreateRewardCommand before the handler runs.</summary>
public class CreateRewardCommandValidator : AbstractValidator<CreateRewardCommand>
{
    public CreateRewardCommandValidator()
    {
        RuleFor(x => x.PatientId)
            .NotEmpty().WithMessage("PatientId is required.");

        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required.")
            .MaximumLength(200).WithMessage("Title must not exceed 200 characters.");

        RuleFor(x => x.Points)
            .GreaterThan(0).WithMessage("Points must be greater than zero.");
    }
}
```

---

### Step 8 — Create an AutoMapper profile

`Features/Rewards/Mappings/RewardMappingProfile.cs`

```csharp
namespace SanadPlatform.API.Features.Rewards.Mappings;

/// <summary>AutoMapper profile for the Rewards feature.</summary>
public class RewardMappingProfile : Profile
{
    public RewardMappingProfile()
    {
        CreateMap<Reward, RewardResponse>();
    }
}
```

---

### Step 9 — Create the DI extension

`Features/Rewards/RewardsServiceExtensions.cs`

```csharp
namespace SanadPlatform.API.Features.Rewards;

/// <summary>
/// Dependency injection extension methods for the Rewards feature.
/// </summary>
public static class RewardsServiceExtensions
{
    /// <summary>
    /// Registers the Rewards feature's repositories and services with the DI container.
    /// </summary>
    public static IServiceCollection AddRewardsFeature(this IServiceCollection services)
    {
        // ==================== Repositories ====================
        services.AddScoped<IRewardRepository, RewardRepository>();

        return services;
    }
}
```

---

### Step 10 — Register in Program.cs

Open `Program.cs` and add one line to the Application Services section:

```csharp
// ==================== Application Services ====================
builder.Services.AddPipelineBehaviors();
builder.Services.AddAuthenticationFeature();
builder.Services.AddPatientFeature();
builder.Services.AddProviderFeature();
builder.Services.AddBookingFeature();
builder.Services.AddRewardsFeature();   // ← add this
builder.Services.AddSecurityServices();
```

---

### Step 11 — Create the controller

`Features/Rewards/Controllers/RewardsController.cs`

```csharp
namespace SanadPlatform.API.Features.Rewards.Controllers;

/// <summary>Manages patient rewards.</summary>
[ApiController]
[ApiVersion(ApiVersions.V1_0)]
[Route("api/v{version:apiVersion}/[controller]")]
[Authorize]
public class RewardsController : ControllerBase
{
    private readonly IMediator _mediator;

    public RewardsController(IMediator mediator)
    {
        _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
    }

    /// <summary>Creates a new reward for the authenticated patient.</summary>
    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<RewardResponse>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateReward(
        [FromBody] CreateRewardRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        var command = new CreateRewardCommand(userId, request.Title, request.Points);
        var result = await _mediator.Send(command, cancellationToken);
        return CreatedAtAction(nameof(CreateReward), ApiResponse<RewardResponse>.SuccessResponse(result.Data, "Reward created."));
    }

    // ==================== Helpers ====================

    private Guid GetAuthenticatedUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(claim, out var userId))
            throw new UnauthorizedAccessException("Invalid or missing user identity claim.");
        return userId;
    }
}
```

---

### Step 12 — Add a database migration

```bash
dotnet ef migrations add AddRewardsTable --project BackEnd/SanadPlatform.API
dotnet ef database update --project BackEnd/SanadPlatform.API
```

---

### Step 13 — Build and verify

```bash
dotnet build "Sanad Platform Official.sln"
```

Must end with `0 Error(s)` before you commit.

---

## 12. 📚 Key Patterns Reference

Quick reference for the patterns enforced throughout the codebase.

---

### CQRS — Commands vs Queries

| | Command | Query |
|-|---------|-------|
| **Purpose** | Mutates state (create, update, delete) | Reads state |
| **Naming** | `{Action}{Entity}Command` | `Get{Entity}{Detail}Query` |
| **Returns** | `ApiResponse<T>` | `ApiResponse<T>` |
| **DB access** | Tracked entities, calls `SaveChangesAsync` | `AsNoTracking()` + `ProjectTo<>()` |
| **Side effects** | Yes | None |

---

### Repository pattern

```csharp
// ✅ READ — always AsNoTracking + ProjectTo
public async Task<PatientResponse?> GetByUserIdAsync(Guid userId, CancellationToken ct = default)
{
    return await _context.Patients
        .AsNoTracking()
        .ProjectTo<PatientResponse>(_mapper.ConfigurationProvider)
        .FirstOrDefaultAsync(p => p.UserId == userId, ct);
}

// ✅ WRITE — tracked, return entity, no SaveChangesAsync here
public async Task<Patient> CreateAsync(Patient patient, CancellationToken ct = default)
{
    ArgumentNullException.ThrowIfNull(patient);
    await _context.Patients.AddAsync(patient, ct);
    return patient;
}

// ✅ UPDATE — load tracked entity first, mutate properties, no .Update() call
public async Task<Patient?> GetByUserIdForUpdateAsync(Guid userId, CancellationToken ct = default)
{
    return await _context.Patients
        .FirstOrDefaultAsync(p => p.UserId == userId, ct); // tracked, no AsNoTracking
}
```

---

### Unit of Work — saving changes

```csharp
// Simple single-step write
await _patientRepository.CreateAsync(patient, cancellationToken);
await _unitOfWork.SaveChangesAsync(cancellationToken);   // one DB roundtrip

// Multi-step atomic write (use execution strategy for retry-on-failure compatibility)
var strategy = _unitOfWork.CreateExecutionStrategy();
await strategy.ExecuteAsync(async () =>
{
    await _unitOfWork.BeginTransactionAsync(cancellationToken);
    await _repoA.CreateAsync(entityA, cancellationToken);
    await _repoB.CreateAsync(entityB, cancellationToken);
    await _unitOfWork.SaveChangesAsync(cancellationToken);
    await _unitOfWork.CommitTransactionAsync(cancellationToken);
});
```

---

### Error handling

**Throw these exceptions — the middleware maps them automatically:**

| Exception | HTTP status | When to use |
|-----------|-------------|-------------|
| `KeyNotFoundException` | 404 Not Found | Entity not found by ID or lookup key |
| `InvalidOperationException` | 400 Bad Request | Business rule violation |
| `UnauthorizedAccessException` | 401 Unauthorized | User is not allowed |
| `ArgumentException` / `ArgumentNullException` | 400 Bad Request | Invalid input argument |
| `DbUpdateConcurrencyException` | 409 Conflict | Concurrent update conflict |

```csharp
// Entity not found
var patient = await _patientRepository.GetByUserIdAsync(userId, ct)
    ?? throw new KeyNotFoundException($"Patient with user ID {userId} was not found.");

// Business rule violation
if (await _patientRepository.ExistsByUserIdAsync(userId, ct))
    throw new InvalidOperationException("A patient profile already exists for this user.");
```

**Do not use try-catch in controllers or handlers.** Let exceptions propagate.

---

### API response format

Every endpoint must return `ApiResponse<T>`:

```csharp
// Success
return Ok(ApiResponse<MyDto>.SuccessResponse(data, "Profile retrieved successfully."));

// Created
return CreatedAtAction(nameof(GetProfile), ApiResponse<MyDto>.SuccessResponse(result, "Profile created."));

// Error (only needed if you return early — usually throw exceptions instead)
return Unauthorized(ApiResponse<object>.ErrorResponse("Session has expired."));
```

---

### Validation

Validators target the **MediatR command record**, not the DTO. Use shared `ValidationExtensions` for common rules:

```csharp
public class UpdatePatientProfileCommandValidator : AbstractValidator<UpdatePatientProfileCommand>
{
    public UpdatePatientProfileCommandValidator()
    {
        RuleFor(x => x.FirstName).ValidName();           // shared extension
        RuleFor(x => x.PhoneNumber).ValidPhoneNumber();  // shared extension
        RuleFor(x => x.DateOfBirth).ValidBirthDate();    // shared extension
        RuleFor(x => x.Bio).ValidLargeText().When(x => x.Bio is not null);
    }
}
```

Validation runs automatically via `ValidationBehavior` before any handler executes. You do not need to call validators manually.

---

### Audit trail

| Interface | Fields provided | Apply when |
|-----------|----------------|-----------|
| `IHasCreatedAt` | `CreatedAt` | Entity is created once and never mutated |
| `IAuditableEntity` | `CreatedAt` + `UpdatedAt` | Entity is created and later updated |
| `ISoftDeletable` | `DeletedAt` | Entity should never be hard-deleted |

```csharp
// A reward is created once — only needs CreatedAt
public class Reward : IHasCreatedAt { ... }

// A patient profile is updated regularly — needs both timestamps
public class Patient : IAuditableEntity { ... }

// A user account is never hard-deleted
public class User : IAuditableEntity, ISoftDeletable { ... }
```

The `AuditableEntityInterceptor` sets these fields automatically on `SaveChangesAsync`. **Never set `CreatedAt`, `UpdatedAt`, or `DeletedAt` manually in your code.**

---

### DI registration

All services use `AddScoped`. New services go in the feature's extension method, not directly in `Program.cs`:

```csharp
// In Features/Rewards/RewardsServiceExtensions.cs
public static IServiceCollection AddRewardsFeature(this IServiceCollection services)
{
    services.AddScoped<IRewardRepository, RewardRepository>();
    // add more repos and services here as the feature grows
    return services;
}

// In Program.cs — one line only
builder.Services.AddRewardsFeature();
```

---

## 13. 🆘 Common Problems & Solutions

### Git problems

**"I accidentally committed to master!"**
```bash
# Move your changes to a new branch without losing them
git checkout -b feature/your-task-name
# master now points to the commit before your changes on origin,
# but your work is safe on the new branch
```

**"I need to undo my last commit (not yet pushed)"**
```bash
# Undo the commit but keep the changes in your files (staged)
git reset --soft HEAD~1
```

**"I made a typo in my last commit message (not yet pushed)"**
```bash
git commit --amend -m "Corrected commit message"
```

**"My push was rejected"**

This usually means `master` (or your branch on the remote) has commits you do not have locally. Pull first:
```bash
git pull origin your-branch-name
# Resolve any conflicts, then:
git push origin your-branch-name
```

**"I have a merge conflict I cannot resolve"**

1. Open the conflicted file. Look for the `<<<<<<<` markers.
2. Decide which version to keep or manually combine them.
3. Remove all conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`).
4. Save, then:
```bash
git add <the-file>
git commit -m "Resolve merge conflict in <filename>"
```
If you are truly stuck, ask for help before guessing — a bad conflict resolution can silently break things.

---

### Build problems

**"Migration error: Unable to connect to database"**

Check your connection string in `appsettings.Development.json`. Verify that:
- PostgreSQL is running
- The database name exists (`sanad_platform`)
- The username and password are correct
- The port is 5432 (default)

**"Build error: The type or namespace name 'X' could not be found"**

Usually a missing `using` statement. Check:
- Is the class in the right namespace?
- Is the `using` at the top of the file?
- Did you rename a file without updating its namespace?

**"InvalidOperationException: No service for type 'IXRepository'"**

You created a repository but forgot to register it. Add it to the feature's `ServiceExtensions` class:
```csharp
services.AddScoped<IXRepository, XRepository>();
```
And make sure `Add{Feature}Feature()` is called in `Program.cs`.

**"Startup error: Security:EncryptionKey must be configured"**

Your `appsettings.Development.json` is missing the `Security:EncryptionKey` value. Add it as shown in [Section 2 (Initial Setup)](#2-initial-setup).

**"Build warning: NU1608 — MediatR version mismatch"**

This is a pre-existing warning caused by a package version constraint between `MediatR` and `MediatR.Extensions.Microsoft.DependencyInjection`. It does not affect functionality and can be ignored.

---

## 14. 📞 Need Help?

If you are stuck:

1. **Search existing Issues** on GitHub — someone may have hit the same problem.
2. **Open a new Issue** describing the problem clearly:
   - What you were trying to do
   - What you expected to happen
   - What actually happened (paste error messages)
   - What you already tried
3. **Message the project owner** directly for urgent blockers.

**Never:**
- Force push without being told to: `git push --force` can destroy other people's work
- Push directly to `master` — always use a branch and a PR
- Commit credentials, passwords, or secret keys

---

*Sanad CareAtHome Backend — built with ASP.NET Core 8.0, PostgreSQL, and Vertical Slice Architecture.*
