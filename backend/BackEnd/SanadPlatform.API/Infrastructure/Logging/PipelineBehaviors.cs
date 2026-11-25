using MediatR;
using FluentValidation;

namespace SanadPlatform.API.Infrastructure.Logging;

/// <summary>
/// Marker interface for MediatR requests that contain sensitive data (e.g. passwords, tokens).
/// When a request implements this interface, LoggingBehavior will suppress logging the
/// request body, preventing sensitive fields from appearing in log files or aggregators.
/// </summary>
public interface ISensitiveRequest { }

/// <summary>
/// MediatR pipeline behavior for FluentValidation.
/// Automatically validates all commands and queries before the handler executes.
/// </summary>
public class ValidationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private readonly IEnumerable<IValidator<TRequest>> _validators;
    private readonly ILogger<ValidationBehavior<TRequest, TResponse>> _logger;

    public ValidationBehavior(
        IEnumerable<IValidator<TRequest>> validators,
        ILogger<ValidationBehavior<TRequest, TResponse>> logger)
    {
        _validators = validators ?? throw new ArgumentNullException(nameof(validators));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        if (!_validators.Any())
        {
            return await next();
        }

        var context = new ValidationContext<TRequest>(request);
        var validationResults = await Task.WhenAll(_validators.Select(v => v.ValidateAsync(context, cancellationToken)));
        var failures = validationResults.Where(r => r.Errors.Count != 0).SelectMany(r => r.Errors).ToList();

        if (failures.Count != 0)
        {
            _logger.LogWarning("Validation failed for {RequestType} with {ErrorCount} error(s)",
                typeof(TRequest).Name,
                failures.Count);

            throw new ValidationException(failures);
        }

        return await next();
    }
}

/// <summary>
/// MediatR pipeline behavior for request/response logging.
/// Requests that implement <see cref="ISensitiveRequest"/> are logged without their
/// body to prevent passwords and other sensitive fields from appearing in logs.
/// </summary>
public class LoggingBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private readonly ILogger<LoggingBehavior<TRequest, TResponse>> _logger;

    public LoggingBehavior(ILogger<LoggingBehavior<TRequest, TResponse>> logger)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        var requestName = typeof(TRequest).Name;
        var isSensitive = request is ISensitiveRequest;

        if (isSensitive)
        {
            // Do NOT log the request body — it contains passwords or tokens.
            _logger.LogInformation("Handling sensitive request: {RequestName}", requestName);
        }
        else
        {
            _logger.LogInformation("Handling request: {RequestName} with data: {@Request}", requestName, request);
        }

        var startTime = DateTime.UtcNow;

        try
        {
            var response = await next();

            var duration = DateTime.UtcNow - startTime;
            _logger.LogInformation(
                "Request {RequestName} completed successfully in {DurationMs}ms",
                requestName,
                duration.TotalMilliseconds);

            return response;
        }
        catch (Exception ex)
        {
            var duration = DateTime.UtcNow - startTime;
            _logger.LogError(ex,
                "Request {RequestName} failed after {DurationMs}ms",
                requestName,
                duration.TotalMilliseconds);
            throw;
        }
    }
}
