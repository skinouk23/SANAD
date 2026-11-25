using Asp.Versioning;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace SanadPlatform.API.Infrastructure.Versioning;

/// <summary>
/// Extension methods for API versioning configuration.
/// Simplifies setup of API versioning across the application.
/// 
/// USAGE:
/// In Program.cs:
/// - builder.Services.AddApiVersioningConfig();
/// - In Swagger config: generator.AddSwaggerGenVersioning();
/// 
/// In Controllers:
/// - [ApiVersion("1.0")]
/// - [ApiVersion("2.0", Deprecated = true)] (optional)
/// 
/// In Routes:
/// - [Route("api/v{version:apiVersion}/[controller]")]
/// </summary>
public static class VersioningExtensions
{
    /// <summary>
    /// Adds API versioning configuration to the service collection.
    /// Supports URL-path versioning by default: /api/v1/resource, /api/v2/resource
    /// </summary>
    public static IServiceCollection AddApiVersioningConfig(this IServiceCollection services)
    {
        services.AddApiVersioning(options =>
        {
            // Report API versions in response headers
            options.ReportApiVersions = true;

            // Default to version 1.0 if not specified
            options.DefaultApiVersion = new ApiVersion(1, 0);

            // Assume default version when no version specified
            options.AssumeDefaultVersionWhenUnspecified = true;

            // Use URL path versioning: /api/v1/resource
            options.ApiVersionReader = new UrlSegmentApiVersionReader();
        })
        .AddApiExplorer(options =>
        {
            // Format the group name for API versioning
            options.GroupNameFormat = "'v'VVV";
            options.SubstituteApiVersionInUrl = true;
        });

        return services;
    }

    /// <summary>
    /// Adds Swagger/OpenAPI support for versioned APIs.
    /// Generates separate Swagger docs for each API version.
    /// </summary>
    public static void AddSwaggerGenVersioning(this SwaggerGenOptions options)
    {
        // Create separate swagger documents for each version
        options.SwaggerDoc("v1", new OpenApiInfo
        {
            Title = "Sanad Platform API",
            Version = "v1",
            Description = "Initial API release",
            TermsOfService = new Uri("https://example.com/terms"),
            Contact = new OpenApiContact
            {
                Name = "Sanad Support",
                Email = "support@sanad.com"
            }
        });

        options.SwaggerDoc("v2", new OpenApiInfo
        {
            Title = "Sanad Platform API",
            Version = "v2",
            Description = "Updated API with enhanced features",
            TermsOfService = new Uri("https://example.com/terms"),
            Contact = new OpenApiContact
            {
                Name = "Sanad Support",
                Email = "support@sanad.com"
            }
        });

        // Add document filter to select endpoints by version
        options.DocInclusionPredicate((docName, apiDesc) =>
        {
            var actionApiVersionAttribute = apiDesc.CustomAttributes()
                .OfType<Asp.Versioning.ApiVersionAttribute>()
                .FirstOrDefault();

            if (actionApiVersionAttribute == null)
                return true; // Include non-versioned endpoints in all docs

            // docName is like "v1", "v2"
            // Extract version number (e.g., "1" from "v1")
            var docVersion = docName.Remove(0, 1); // Remove 'v' prefix
            
            // Check if endpoint supports this version
            return actionApiVersionAttribute.Versions.Any(v => v.MajorVersion.ToString() == docVersion);
        });

        // Add operation filter to handle multiple API versions
        options.OperationFilter<RemoveVersionFromParameterFilter>();
    }
}

/// <summary>
/// Removes the {version} parameter from Swagger operations.
/// The version is already specified in the URL path.
/// </summary>
public class RemoveVersionFromParameterFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        var versionParameter = operation.Parameters.FirstOrDefault(p => p.Name == "version");
        if (versionParameter != null)
        {
            operation.Parameters.Remove(versionParameter);
        }
    }
}

/// <summary>
/// Helper class for managing API versions.
/// Defines all supported versions in one place for easy maintenance.
/// </summary>
public static class ApiVersions
{
    /// <summary>Version 1.0 - Initial release</summary>
    public const string V1_0 = "1.0";

    /// <summary>Version 2.0 - Enhanced features</summary>
    public const string V2_0 = "2.0";

    /// <summary>Get all supported versions</summary>
    public static readonly Version[] All = 
    {
        new Version(1, 0),
        new Version(2, 0)
    };
}
