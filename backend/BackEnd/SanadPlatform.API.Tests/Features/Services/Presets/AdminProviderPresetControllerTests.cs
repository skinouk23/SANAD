using System.Reflection;
using System.Text.Json;
using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SanadPlatform.API.Common.Models;
using SanadPlatform.API.Features.Services.Commands;
using SanadPlatform.API.Features.Services.Controllers;
using SanadPlatform.API.Features.Services.DTOs;
using SanadPlatform.API.Features.Services.Queries;
using SanadPlatform.API.Infrastructure.Versioning;

namespace SanadPlatform.API.Tests.Features.Services.Presets;

public class AdminProviderPresetControllerTests
{
    [Fact]
    public void ProviderServicePresetsController_UsesExpectedRouteVersionAndAdminAuthorization()
    {
        var controllerType = typeof(ProviderServicePresetsController);

        Assert.NotNull(controllerType.GetCustomAttribute<ApiControllerAttribute>());

        var authorize = controllerType.GetCustomAttribute<AuthorizeAttribute>();
        Assert.NotNull(authorize);
        Assert.Equal("admin", authorize!.Roles);

        var apiVersion = controllerType.GetCustomAttribute<ApiVersionAttribute>();
        Assert.NotNull(apiVersion);
        Assert.Contains(apiVersion!.Versions, version => version.ToString() == ApiVersions.V1_0);

        var route = controllerType.GetCustomAttribute<RouteAttribute>();
        Assert.NotNull(route);
        Assert.Equal("api/v{version:apiVersion}/provider-service-presets", route!.Template);
    }

    [Fact]
    public void ProviderServicePresetsController_DeclaresAllExpectedEndpoints()
    {
        AssertRootGet(nameof(ProviderServicePresetsController.GetProviderServicePresets));
        AssertRootPost(nameof(ProviderServicePresetsController.CreateProviderServicePreset));
        AssertPut(nameof(ProviderServicePresetsController.UpdateProviderServicePreset), "{id:guid}");
        AssertPatch(nameof(ProviderServicePresetsController.ToggleProviderServicePresetActivation), "{id:guid}/activation");
        AssertPost(nameof(ProviderServicePresetsController.ReorderProviderServicePresets), "reorder");
        AssertDelete(nameof(ProviderServicePresetsController.DeleteProviderServicePreset), "{id:guid}");
    }

    [Fact]
    public async Task GetProviderServicePresets_SendsAdminQuery_AndWrapsApiResponse()
    {
        var mediator = new TestMediator
        {
            Response = new List<AdminProviderServicePresetResponse>
            {
                new()
                {
                    Id = Guid.NewGuid(),
                    ProviderCategory = "nutrition",
                    Code = "assessment",
                    NameEn = "Assessment",
                    NameFr = "Bilan",
                    IsActive = true,
                    DisplayOrder = 1,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                }
            }
        };

        var controller = new ProviderServicePresetsController(mediator);

        var actionResult = await controller.GetProviderServicePresets("nutrition", CancellationToken.None);

        var ok = Assert.IsType<OkObjectResult>(actionResult.Result);
        var payload = Assert.IsType<ApiResponse<IReadOnlyList<AdminProviderServicePresetResponse>>>(ok.Value);
        Assert.True(payload.Success);
        Assert.Equal("Provider service presets retrieved successfully.", payload.Message);
        Assert.Single(payload.Data!);

        var request = Assert.IsType<GetAdminProviderServicePresetsQuery>(mediator.LastRequest);
        Assert.Equal("nutrition", request.ProviderCategory);
    }

    [Fact]
    public async Task CreateProviderServicePreset_SendsCreateCommand_AndReturnsCreatedAtAction()
    {
        var response = new AdminProviderServicePresetResponse
        {
            Id = Guid.NewGuid(),
            ProviderCategory = "nutrition",
            Code = "assessment",
            NameEn = "Assessment",
            NameFr = "Bilan",
            TypeConfig = ParseJson("""
            {
              "subcategoryCode": "consultation"
            }
            """),
            IsActive = true,
            DisplayOrder = 1,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var mediator = new TestMediator
        {
            Response = response
        };

        var controller = new ProviderServicePresetsController(mediator);
        var request = new CreateProviderServicePresetRequest
        {
            ProviderCategory = "nutrition",
            Code = "assessment",
            NameEn = "Assessment",
            NameFr = "Bilan",
            Price = 55m,
            PriceType = "fixed",
            Currency = "TND",
            DurationMinutes = 30,
            ServiceLocation = "home",
            TypeConfig = ParseJson("""
            {
              "subcategoryCode": "consultation"
            }
            """),
            IsActive = true,
            DisplayOrder = 4
        };

        var actionResult = await controller.CreateProviderServicePreset(request, CancellationToken.None);

        var created = Assert.IsType<CreatedAtActionResult>(actionResult.Result);
        Assert.Equal(nameof(ProviderServicePresetsController.GetProviderServicePresets), created.ActionName);
        Assert.Equal(response.Id, Assert.IsType<Guid>(created.RouteValues!["id"]));
        Assert.Equal("nutrition", Assert.IsType<string>(created.RouteValues["providerCategory"]));

        var payload = Assert.IsType<ApiResponse<AdminProviderServicePresetResponse>>(created.Value);
        Assert.True(payload.Success);
        Assert.Equal("Provider service preset created successfully.", payload.Message);
        Assert.Equal(response.Id, payload.Data!.Id);

        var command = Assert.IsType<CreateProviderServicePresetCommand>(mediator.LastRequest);
        Assert.Equal(request.ProviderCategory, command.ProviderCategory);
        Assert.Equal(request.Code, command.Code);
        Assert.Equal(request.NameEn, command.NameEn);
        Assert.True(command.TypeConfig.HasValue);
        Assert.Equal("consultation", command.TypeConfig.Value.GetProperty("subcategoryCode").GetString());
    }

    [Fact]
    public async Task UpdateProviderServicePreset_SendsUpdateCommand_AndReturnsOkResponse()
    {
        var presetId = Guid.NewGuid();
        var response = new AdminProviderServicePresetResponse
        {
            Id = presetId,
            ProviderCategory = "nutrition",
            Code = "assessment",
            NameEn = "Updated Assessment",
            NameFr = "Bilan mis a jour",
            IsActive = false,
            DisplayOrder = 2,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var mediator = new TestMediator
        {
            Response = response
        };

        var controller = new ProviderServicePresetsController(mediator);
        var request = new UpdateProviderServicePresetRequest
        {
            NameEn = "Updated Assessment",
            NameFr = "Bilan mis a jour",
            Price = 80m,
            PriceType = "fixed",
            Currency = "EUR",
            DurationMinutes = 60,
            ServiceLocation = "home",
            RequiresPrescription = true,
            RequiresMedicalHistory = true,
            TypeConfig = ParseJson("""
            {
              "subcategoryCode": "meal_plan"
            }
            """),
            IsActive = false,
            DisplayOrder = 2
        };

        var actionResult = await controller.UpdateProviderServicePreset(presetId, request, CancellationToken.None);

        var ok = Assert.IsType<OkObjectResult>(actionResult.Result);
        var payload = Assert.IsType<ApiResponse<AdminProviderServicePresetResponse>>(ok.Value);
        Assert.True(payload.Success);
        Assert.Equal("Provider service preset updated successfully.", payload.Message);
        Assert.Equal(presetId, payload.Data!.Id);

        var command = Assert.IsType<UpdateProviderServicePresetCommand>(mediator.LastRequest);
        Assert.Equal(presetId, command.Id);
        Assert.Equal(request.NameEn, command.NameEn);
        Assert.Equal(request.Price, command.Price);
        Assert.True(command.TypeConfig.HasValue);
        Assert.Equal("meal_plan", command.TypeConfig.Value.GetProperty("subcategoryCode").GetString());
    }

    [Fact]
    public void GetProviderServicePresets_BindsProviderCategoryFromQuery()
    {
        var method = typeof(ProviderServicePresetsController).GetMethod(nameof(ProviderServicePresetsController.GetProviderServicePresets));

        Assert.NotNull(method);

        var providerCategoryParameter = method!.GetParameters()
            .Single(parameter => parameter.Name == "providerCategory");

        Assert.NotNull(providerCategoryParameter.GetCustomAttribute<FromQueryAttribute>());
        Assert.Contains(
            method.GetParameters(),
            parameter => parameter.ParameterType == typeof(CancellationToken));
    }

    [Fact]
    public void ProviderServicePresetsController_AllActionsAcceptCancellationToken()
    {
        var actionNames = new[]
        {
            nameof(ProviderServicePresetsController.GetProviderServicePresets),
            nameof(ProviderServicePresetsController.CreateProviderServicePreset),
            nameof(ProviderServicePresetsController.UpdateProviderServicePreset),
            nameof(ProviderServicePresetsController.ToggleProviderServicePresetActivation),
            nameof(ProviderServicePresetsController.ReorderProviderServicePresets),
            nameof(ProviderServicePresetsController.DeleteProviderServicePreset)
        };

        foreach (var actionName in actionNames)
        {
            var method = typeof(ProviderServicePresetsController).GetMethod(actionName);

            Assert.NotNull(method);
            Assert.Contains(
                method!.GetParameters(),
                parameter => parameter.ParameterType == typeof(CancellationToken));
        }
    }

    private static JsonElement ParseJson(string json)
    {
        using var document = JsonDocument.Parse(json);
        return document.RootElement.Clone();
    }

    private static void AssertRootGet(string methodName)
    {
        var method = typeof(ProviderServicePresetsController).GetMethod(methodName);
        Assert.NotNull(method);

        var attribute = method!.GetCustomAttribute<HttpGetAttribute>();
        Assert.NotNull(attribute);
        Assert.True(string.IsNullOrEmpty(attribute!.Template));
    }

    private static void AssertRootPost(string methodName)
    {
        var method = typeof(ProviderServicePresetsController).GetMethod(methodName);
        Assert.NotNull(method);

        var attribute = method!.GetCustomAttribute<HttpPostAttribute>();
        Assert.NotNull(attribute);
        Assert.True(string.IsNullOrEmpty(attribute!.Template));
    }

    private static void AssertPost(string methodName, string expectedTemplate)
    {
        var method = typeof(ProviderServicePresetsController).GetMethod(methodName);
        Assert.NotNull(method);

        var attribute = method!.GetCustomAttribute<HttpPostAttribute>();
        Assert.NotNull(attribute);
        Assert.Equal(expectedTemplate, attribute!.Template);
    }

    private static void AssertPut(string methodName, string expectedTemplate)
    {
        var method = typeof(ProviderServicePresetsController).GetMethod(methodName);
        Assert.NotNull(method);

        var attribute = method!.GetCustomAttribute<HttpPutAttribute>();
        Assert.NotNull(attribute);
        Assert.Equal(expectedTemplate, attribute!.Template);
    }

    private static void AssertPatch(string methodName, string expectedTemplate)
    {
        var method = typeof(ProviderServicePresetsController).GetMethod(methodName);
        Assert.NotNull(method);

        var attribute = method!.GetCustomAttribute<HttpPatchAttribute>();
        Assert.NotNull(attribute);
        Assert.Equal(expectedTemplate, attribute!.Template);
    }

    private static void AssertDelete(string methodName, string expectedTemplate)
    {
        var method = typeof(ProviderServicePresetsController).GetMethod(methodName);
        Assert.NotNull(method);

        var attribute = method!.GetCustomAttribute<HttpDeleteAttribute>();
        Assert.NotNull(attribute);
        Assert.Equal(expectedTemplate, attribute!.Template);
    }

    private sealed class TestMediator : IMediator
    {
        public object? LastRequest { get; private set; }

        public object? Response { get; init; }

        public IAsyncEnumerable<object?> CreateStream(object request, CancellationToken cancellationToken = default)
            => EmptyAsync<object?>();

        public IAsyncEnumerable<TResponse> CreateStream<TResponse>(
            IStreamRequest<TResponse> request,
            CancellationToken cancellationToken = default)
            => EmptyAsync<TResponse>();

        public Task Publish(object notification, CancellationToken cancellationToken = default)
            => Task.CompletedTask;

        public Task Publish<TNotification>(TNotification notification, CancellationToken cancellationToken = default)
            where TNotification : INotification
            => Task.CompletedTask;

        public Task Send<TRequest>(TRequest request, CancellationToken cancellationToken = default)
            where TRequest : IRequest
        {
            LastRequest = request;
            return Task.CompletedTask;
        }

        public Task<object?> Send(object request, CancellationToken cancellationToken = default)
        {
            LastRequest = request;
            return Task.FromResult(Response);
        }

        public Task<TResponse> Send<TResponse>(IRequest<TResponse> request, CancellationToken cancellationToken = default)
        {
            LastRequest = request;
            return Task.FromResult((TResponse)Response!);
        }

        private static async IAsyncEnumerable<T> EmptyAsync<T>()
        {
            yield break;
        }
    }
}
