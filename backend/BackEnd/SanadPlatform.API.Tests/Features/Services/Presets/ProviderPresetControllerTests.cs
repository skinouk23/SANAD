using System.Reflection;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SanadPlatform.API.Features.Services.Controllers;

namespace SanadPlatform.API.Tests.Features.Services.Presets;

public class ProviderPresetControllerTests
{
    [Fact]
    public void ProviderServicesController_RequiresProviderAuthorizeAttribute()
    {
        var authorize = typeof(ProviderServicesController).GetCustomAttribute<AuthorizeAttribute>();

        Assert.NotNull(authorize);
        Assert.Equal("provider", authorize!.Roles);
    }

    [Fact]
    public void GetMyServicePresets_HasExpectedHttpGetRoute()
    {
        var method = typeof(ProviderServicesController).GetMethod(nameof(ProviderServicesController.GetMyServicePresets));

        Assert.NotNull(method);

        var httpGet = method!.GetCustomAttribute<HttpGetAttribute>();

        Assert.NotNull(httpGet);
        Assert.Equal("presets", httpGet!.Template);
    }

    [Fact]
    public void GetMyServicePresets_AcceptsCancellationToken()
    {
        var method = typeof(ProviderServicesController).GetMethod(nameof(ProviderServicesController.GetMyServicePresets));

        Assert.NotNull(method);
        Assert.Contains(
            method!.GetParameters(),
            parameter => parameter.ParameterType == typeof(CancellationToken));
    }
}
