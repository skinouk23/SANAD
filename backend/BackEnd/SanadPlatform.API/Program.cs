using System.Text;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Minio;
using SanadPlatform.API.Common.Models;
using SanadPlatform.API.Common.Options;
using SanadPlatform.API.Common.Storage;
using SanadPlatform.API.Features.AppFeatures;
using SanadPlatform.API.Features.Authentication;
using SanadPlatform.API.Features.Authentication.Repository;
using SanadPlatform.API.Features.Bookings;
using SanadPlatform.API.Features.Conversations;
using SanadPlatform.API.Features.Equipment;
using SanadPlatform.API.Features.Files;
using SanadPlatform.API.Features.Finance;
using SanadPlatform.API.Features.Insurance;
using SanadPlatform.API.Features.Marketing;
using SanadPlatform.API.Features.Notifications;
using SanadPlatform.API.Features.Notifications.Hubs;
using SanadPlatform.API.Features.Patients;
using SanadPlatform.API.Features.Payments;
using SanadPlatform.API.Features.Pharmacy;
using SanadPlatform.API.Features.ProviderFinance;
using SanadPlatform.API.Features.Providers;
using SanadPlatform.API.Features.Services;
using SanadPlatform.API.Infrastructure.Database;
using SanadPlatform.API.Infrastructure.Logging;
using SanadPlatform.API.Infrastructure.Security;
using SanadPlatform.API.Infrastructure.Storage;
using SanadPlatform.API.Infrastructure.Versioning;
using SanadPlatform.API.Middleware;
using Serilog;
using Serilog.Events;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog for structured logging
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
    .Enrich.FromLogContext()
    .Enrich.WithEnvironmentUserName()
    .Enrich.WithThreadId()
    .Enrich.WithProperty("Application", "SanadPlatform.API")
    .WriteTo.Console(outputTemplate: "[{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz}] [{Level:u3}] {Message:lj}{NewLine}{Exception}")
     .WriteTo.File("logs/sanad-platform-.txt", 
        rollingInterval: RollingInterval.Day,
        outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] {Message:lj}{NewLine}{Exception}")
    
    .CreateLogger();

builder.Host.UseSerilog();

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// All options are validated at startup — misconfigured settings cause a clear
// InvalidOperationException on launch rather than a null-ref at runtime.
builder.Services.AddOptions<JwtSettings>()
    .Bind(builder.Configuration.GetSection(JwtSettings.SectionName))
    .ValidateDataAnnotations()
    .ValidateOnStart();

builder.Services.AddOptions<CorsSettings>()
    .Bind(builder.Configuration.GetSection(CorsSettings.SectionName))
    .ValidateDataAnnotations()
    .ValidateOnStart();

builder.Services.AddOptions<SecuritySettings>()
    .Bind(builder.Configuration.GetSection(SecuritySettings.SectionName))
    .ValidateDataAnnotations()
    .ValidateOnStart();

builder.Services.AddOptions<LoginOtpSettings>()
    .Bind(builder.Configuration.GetSection(LoginOtpSettings.SectionName))
    .ValidateDataAnnotations()
    .ValidateOnStart();

builder.Services.AddOptions<EmailOptions>()
    .Bind(builder.Configuration.GetSection(EmailOptions.SectionName))
    .ValidateDataAnnotations()
    .ValidateOnStart();

builder.Services.AddOptions<SmsOptions>()
    .Bind(builder.Configuration.GetSection(SmsOptions.SectionName))
    .ValidateDataAnnotations()
    .Validate(options => !options.Enabled
        || (!string.IsNullOrWhiteSpace(options.ApiUrl)
            && !string.IsNullOrWhiteSpace(options.ClientId)
            && !string.IsNullOrWhiteSpace(options.ApiKey)
            && !string.IsNullOrWhiteSpace(options.SenderName)),
        "SMS provider delivery is enabled but configuration is incomplete.")
    .ValidateOnStart();

builder.Services.AddOptions<RedisSettings>()
    .Bind(builder.Configuration.GetSection(RedisSettings.SectionName))
    .ValidateOnStart();

builder.Services.AddOptions<MinioSettings>()
    .Bind(builder.Configuration.GetSection(MinioSettings.SectionName))
    .ValidateOnStart();

builder.Services.AddOptions<FileStorageOptions>()
    .Bind(builder.Configuration.GetSection(FileStorageOptions.SectionName))
    .ValidateDataAnnotations()
    .ValidateOnStart();

builder.Services.AddOptions<RabbitMqOptions>()
    .Bind(builder.Configuration.GetSection(RabbitMqOptions.SectionName))
    .ValidateDataAnnotations()
    .Validate(options => !options.Enabled
        || (!string.IsNullOrWhiteSpace(options.UserName) && !string.IsNullOrWhiteSpace(options.Password)),
        "RabbitMQ is enabled but credentials are incomplete.")
    .ValidateOnStart();

builder.Services.AddOptions<FileWorkerOptions>()
    .Bind(builder.Configuration.GetSection(FileWorkerOptions.SectionName))
    .ValidateDataAnnotations()
    .ValidateOnStart();

builder.Services.AddOptions<FileScannerOptions>()
    .Bind(builder.Configuration.GetSection(FileScannerOptions.SectionName))
    .ValidateDataAnnotations()
    .Validate(options => builder.Environment.IsDevelopment()
        || !string.Equals(options.Provider, "NoopDevelopment", StringComparison.OrdinalIgnoreCase)
        || !options.AllowUnsafeNoopScanner,
        "The no-op file scanner cannot be enabled outside Development.")
    .ValidateOnStart();

builder.Services.AddOptions<ProviderSignupUploadTokenOptions>()
    .Bind(builder.Configuration.GetSection(ProviderSignupUploadTokenOptions.SectionName))
    .ValidateDataAnnotations()
    .Validate(options => builder.Environment.IsDevelopment() || !string.IsNullOrWhiteSpace(options.SigningKey),
        "Provider signup upload token signing key is required outside Development.")
    .ValidateOnStart();

// Register DataInTransitSecurityOptions so consumers can inject IOptions<DataInTransitSecurityOptions>
builder.Services.Configure<DataInTransitSecurityOptions>(
    builder.Configuration.GetSection($"{SecuritySettings.SectionName}:DataInTransit"));

// Add API Versioning
builder.Services.AddApiVersioningConfig();

// Add Swagger with versioning support
builder.Services.AddSwaggerGen(c =>
{
    c.AddSwaggerGenVersioning();
    
    // Enable XML documentation if file exists
    var xmlFile = Path.Combine(AppContext.BaseDirectory, "SanadPlatform.API.xml");
    if (File.Exists(xmlFile))
    {
        c.IncludeXmlComments(xmlFile);
    }
    
    // Add Security Definition
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "bearer"
    });
    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Database configuration
builder.Services.AddDatabase(builder.Configuration);

// In-memory cache is always available (used by ProviderRangeAvailabilityService, etc.)
builder.Services.AddMemoryCache();

// Add distributed caching (Redis)
// Reads RedisSettings:Enabled and RedisSettings:Connection from configuration.
var redisSettings = builder.Configuration.GetSection(RedisSettings.SectionName).Get<RedisSettings>()
    ?? new RedisSettings();
if (redisSettings.Enabled && !string.IsNullOrEmpty(redisSettings.Connection))
{
    builder.Services.AddStackExchangeRedisCache(options =>
    {
        options.Configuration = redisSettings.Connection;
    });
}

// Add MediatR for vertical slice architecture
builder.Services.AddMediatR(cfg =>
    cfg.RegisterServicesFromAssembly(typeof(Program).Assembly));

// Add FluentValidation
builder.Services.AddValidatorsFromAssembly(typeof(Program).Assembly);

// Add AutoMapper
builder.Services.AddAutoMapper(typeof(Program).Assembly);

// Authentication & JWT
// Read the already-validated JwtSettings options instead of accessing IConfiguration directly.
var jwtSettings = builder.Configuration.GetSection(JwtSettings.SectionName).Get<JwtSettings>()
    ?? throw new InvalidOperationException($"Configuration section '{JwtSettings.SectionName}' is missing.");
var secretKey = !string.IsNullOrEmpty(jwtSettings.SecretKey)
    ? jwtSettings.SecretKey
    : throw new InvalidOperationException("JWT SecretKey is not configured");
var issuer = jwtSettings.Issuer;
var audience = jwtSettings.Audience;

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = issuer,
        ValidAudience = audience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
        ClockSkew = TimeSpan.Zero
    };
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var accessToken = context.Request.Query["access_token"].ToString();
            var path = context.HttpContext.Request.Path;

            if (!string.IsNullOrWhiteSpace(accessToken)
                && path.StartsWithSegments("/hubs/notifications"))
            {
                context.Token = accessToken;
            }

            return Task.CompletedTask;
        },
        OnTokenValidated = async context =>
        {
            var sessionRepo = context.HttpContext.RequestServices
                .GetRequiredService<IUserSessionRepository>();

            var sessionIdClaim = context.Principal?.FindFirst("session_id")?.Value;
            if (!Guid.TryParse(sessionIdClaim, out var sessionId)
                || !await sessionRepo.IsActiveAsync(sessionId, context.HttpContext.RequestAborted))
            {
                context.Fail("Session is no longer active.");
            }
        },
        OnAuthenticationFailed = context =>
        {
            Log.Warning("Authentication failed: {Message}", context.Exception.Message);
            return Task.CompletedTask;
        }
    };
});

builder.Services.AddAuthorization();

// CORS configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", corsPolicyBuilder =>
    {
        var corsSettings = builder.Configuration.GetSection(CorsSettings.SectionName).Get<CorsSettings>()
            ?? new CorsSettings();
        corsPolicyBuilder
            .WithOrigins(corsSettings.AllowedOrigins)
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

// Configure secure cookies
builder.Services.AddCookiePolicy(options =>
{
    options.HttpOnly = Microsoft.AspNetCore.CookiePolicy.HttpOnlyPolicy.Always;
    options.Secure = CookieSecurePolicy.Always;
    options.MinimumSameSitePolicy = SameSiteMode.Strict;
});

// Health checks
builder.Services.AddHealthChecks();

builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.InvalidModelStateResponseFactory = (context) =>
    {
        // Extract errors from ModelState
        var errors = new Dictionary<string, string[]>();

        foreach (var kvp in context.ModelState)
        {
            if (kvp.Value is { Errors.Count: > 0 })
            {
                errors[kvp.Key] = kvp.Value.Errors.Select(e => e.ErrorMessage).ToArray();
            }
        }

        var response = ApiResponse<object>.ErrorResponse("Validation failed.", errors);

        return new BadRequestObjectResult(response);
    };
});

// ==================== Application Services ====================
builder.Services.AddPipelineBehaviors();
builder.Services.AddAppFeature();
builder.Services.AddAuthenticationFeature();
builder.Services.AddPatientFeature();
builder.Services.AddNotificationFeature(builder.Configuration);
builder.Services.AddProviderFeature();
builder.Services.AddProviderFinanceFeature();
builder.Services.AddPaymentFeature();
builder.Services.AddFinanceFeature();
builder.Services.AddServiceFeature();
builder.Services.AddFileFeature();
builder.Services.AddBookingFeature();
builder.Services.AddMarketingFeature();
builder.Services.AddInsuranceFeature();
builder.Services.AddSecurityServices();
// MinIO object storage
var minioSettings = builder.Configuration.GetSection(MinioSettings.SectionName).Get<MinioSettings>()
    ?? new MinioSettings();
builder.Services.AddMinio(configureClient =>
{
    configureClient
        .WithEndpoint(minioSettings.Endpoint)
        .WithCredentials(minioSettings.AccessKey, minioSettings.SecretKey)
        .WithSSL(minioSettings.UseSSL)
        .Build();
});
builder.Services.AddScoped<IObjectStorageService, MinioObjectStorageService>();
builder.Services.AddHostedService<BucketInitializationService>();
builder.Services.AddEquipmentFeature();
builder.Services.AddPharmacyFeature();
builder.Services.AddConversationsFeature();
builder.Services.AddHttpContextAccessor();

var app = builder.Build();

await app.Services.SeedDatabaseAsync();

if (string.Equals(
    app.Configuration["ASPNETCORE_FORWARDEDHEADERS_ENABLED"],
    "true",
    StringComparison.OrdinalIgnoreCase))
{
    var forwardedHeadersOptions = new ForwardedHeadersOptions
    {
        ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
    };
    forwardedHeadersOptions.KnownNetworks.Clear();
    forwardedHeadersOptions.KnownProxies.Clear();
    app.UseForwardedHeaders(forwardedHeadersOptions);
}

// Use Serilog
app.UseSerilogRequestLogging();

// Configure secure cookies
app.UseCookiePolicy();

// Configure HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        // Display available versions in Swagger UI
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Sanad Platform API v1");
        options.SwaggerEndpoint("/swagger/v2/swagger.json", "Sanad Platform API v2");
        options.RoutePrefix = string.Empty;
    });
}

app.UseCors("AllowFrontend");

// Use HTTPS and data in transit security (TLS/SSL)
app.UseDataInTransitSecurity(enforceHstsInProduction: !app.Environment.IsDevelopment());

// Custom middleware
app.UseMiddleware<RequestLoggingMiddleware>();
app.UseMiddleware<GlobalExceptionHandlingMiddleware>();
//app.UseMiddleware<IdempotencyMiddleware>();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<NotificationHub>("/hubs/notifications");
app.MapHealthChecks("/health");

try
{
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "An unhandled exception occurred during application startup");
}
finally
{
    Log.CloseAndFlush();
}

