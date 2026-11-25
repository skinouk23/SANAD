using MediatR;
using Microsoft.AspNetCore.Mvc;
using SanadPlatform.API.Common.Models;
using SanadPlatform.API.Features.Services.Commands;
using SanadPlatform.API.Features.Services.Controllers;
using SanadPlatform.API.Features.Services.DTOs;

namespace SanadPlatform.API.Tests.Features.Services.Presets;

public class AdminProviderPresetMutationControllerTests
{
    [Fact]
    public async Task ToggleProviderServicePresetActivation_SendsToggleCommand_AndReturnsOkResponse()
    {
        var presetId = Guid.NewGuid();
        var mediator = new CommandMediator();
        var controller = new ProviderServicePresetsController(mediator);

        var actionResult = await controller.ToggleProviderServicePresetActivation(
            presetId,
            new ToggleProviderServicePresetRequest { IsActive = false },
            CancellationToken.None);

        var ok = Assert.IsType<OkObjectResult>(actionResult.Result);
        var payload = Assert.IsType<ApiResponse<object>>(ok.Value);
        Assert.True(payload.Success);
        Assert.Equal("Provider service preset activation updated successfully.", payload.Message);

        var command = Assert.IsType<ToggleProviderServicePresetCommand>(mediator.LastRequest);
        Assert.Equal(presetId, command.Id);
        Assert.False(command.IsActive);
    }

    [Fact]
    public async Task ReorderProviderServicePresets_SendsReorderCommand_AndReturnsOkResponse()
    {
        var orderedIds = new[] { Guid.NewGuid(), Guid.NewGuid(), Guid.NewGuid() };
        var mediator = new CommandMediator();
        var controller = new ProviderServicePresetsController(mediator);

        var actionResult = await controller.ReorderProviderServicePresets(
            new ReorderProviderServicePresetsRequest
            {
                ProviderCategory = "nutrition",
                OrderedIds = orderedIds
            },
            CancellationToken.None);

        var ok = Assert.IsType<OkObjectResult>(actionResult.Result);
        var payload = Assert.IsType<ApiResponse<object>>(ok.Value);
        Assert.True(payload.Success);
        Assert.Equal("Provider service presets reordered successfully.", payload.Message);

        var command = Assert.IsType<ReorderProviderServicePresetsCommand>(mediator.LastRequest);
        Assert.Equal("nutrition", command.ProviderCategory);
        Assert.Equal(orderedIds, command.OrderedIds);
    }

    [Fact]
    public async Task DeleteProviderServicePreset_SendsDeleteCommand_AndReturnsOkResponse()
    {
        var presetId = Guid.NewGuid();
        var mediator = new CommandMediator();
        var controller = new ProviderServicePresetsController(mediator);

        var actionResult = await controller.DeleteProviderServicePreset(presetId, CancellationToken.None);

        var ok = Assert.IsType<OkObjectResult>(actionResult.Result);
        var payload = Assert.IsType<ApiResponse<object>>(ok.Value);
        Assert.True(payload.Success);
        Assert.Equal("Provider service preset deleted successfully.", payload.Message);

        var command = Assert.IsType<DeleteProviderServicePresetCommand>(mediator.LastRequest);
        Assert.Equal(presetId, command.Id);
    }

    private sealed class CommandMediator : IMediator
    {
        public object? LastRequest { get; private set; }

        public IAsyncEnumerable<object?> CreateStream(object request, CancellationToken cancellationToken = default)
            => throw new NotSupportedException();

        public IAsyncEnumerable<TResponse> CreateStream<TResponse>(
            IStreamRequest<TResponse> request,
            CancellationToken cancellationToken = default)
            => throw new NotSupportedException();

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
            return Task.FromResult<object?>(Unit.Value);
        }

        public Task<TResponse> Send<TResponse>(IRequest<TResponse> request, CancellationToken cancellationToken = default)
        {
            LastRequest = request;

            if (typeof(TResponse) == typeof(Unit))
            {
                return Task.FromResult((TResponse)(object)Unit.Value);
            }

            throw new NotSupportedException($"Response type {typeof(TResponse).Name} is not supported by {nameof(CommandMediator)}.");
        }
    }
}
