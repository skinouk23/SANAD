using System.Reflection;
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SanadPlatform.API.Features.Ambulance.Controllers;
using SanadPlatform.API.Features.Nutrition.Controllers;
using SanadPlatform.API.Features.Veterinary.Controllers;

namespace SanadPlatform.API.Tests.Features.Config.Controllers;

public class ConfigControllersTests
{
    [Theory]
    [InlineData(typeof(NutritionConfigController), "api/v{version:apiVersion}/nutrition")]
    [InlineData(typeof(AmbulanceConfigController), "api/v{version:apiVersion}/ambulance")]
    [InlineData(typeof(VeterinaryConfigController), "api/v{version:apiVersion}/veterinary")]
    public void Controllers_ExposeExpectedRoute_AndSecurityAttributes(Type controllerType, string routeTemplate)
    {
        Assert.NotNull(controllerType.GetCustomAttribute<ApiControllerAttribute>());
        Assert.NotNull(controllerType.GetCustomAttribute<AuthorizeAttribute>());
        Assert.NotNull(controllerType.GetCustomAttribute<ApiVersionAttribute>());

        var route = controllerType.GetCustomAttribute<RouteAttribute>();

        Assert.NotNull(route);
        Assert.Equal(routeTemplate, route!.Template);
    }

    [Theory]
    [InlineData(typeof(NutritionConfigController), nameof(NutritionConfigController.GetSubcategories), "subcategories")]
    [InlineData(typeof(NutritionConfigController), nameof(NutritionConfigController.GetDietTypes), "diet-types")]
    [InlineData(typeof(AmbulanceConfigController), nameof(AmbulanceConfigController.GetServiceTypes), "service-types")]
    [InlineData(typeof(VeterinaryConfigController), nameof(VeterinaryConfigController.GetAnimalTypes), "animal-types")]
    public void ConfigEndpoints_AreAnonymousHttpGetActions(Type controllerType, string methodName, string routeTemplate)
    {
        var method = controllerType.GetMethod(methodName);

        Assert.NotNull(method);
        Assert.NotNull(method!.GetCustomAttribute<AllowAnonymousAttribute>());

        var httpGet = method.GetCustomAttribute<HttpGetAttribute>();

        Assert.NotNull(httpGet);
        Assert.Equal(routeTemplate, httpGet!.Template);
    }
}
