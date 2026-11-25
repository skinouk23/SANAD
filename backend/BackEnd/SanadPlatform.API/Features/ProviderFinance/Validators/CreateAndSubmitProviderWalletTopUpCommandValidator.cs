using FluentValidation;
using SanadPlatform.API.Features.ProviderFinance.Commands;

namespace SanadPlatform.API.Features.ProviderFinance.Validators;

/// <summary>
/// Validates <see cref="CreateAndSubmitProviderWalletTopUpCommand"/>.
/// </summary>
public class CreateAndSubmitProviderWalletTopUpCommandValidator : AbstractValidator<CreateAndSubmitProviderWalletTopUpCommand>
{
    public CreateAndSubmitProviderWalletTopUpCommandValidator()
    {
        RuleFor(x => x.Amount)
            .GreaterThan(0m)
            .WithMessage("Amount must be greater than zero.");

        RuleFor(x => x.Currency)
            .NotEmpty().WithMessage("Currency is required.")
            .Must(BeSupportedCurrency)
            .WithMessage("Currency must be 'TND'.");

        RuleFor(x => x.PaymentChannel)
            .NotEmpty().WithMessage("PaymentChannel is required.")
            .Must(ProviderFinanceConstants.IsSupportedPaymentChannel)
            .WithMessage("PaymentChannel must be 'bank_transfer' or 'd17'.");

        RuleFor(x => x.ProviderTransferReference)
            .Must(value => !string.IsNullOrWhiteSpace(value))
            .WithMessage("ProviderTransferReference is required.")
            .Must(value => string.IsNullOrWhiteSpace(value) || value.Trim().Length <= 120)
            .WithMessage("ProviderTransferReference must not exceed 120 characters.");

        RuleFor(x => x.EvidenceUrl)
            .Must(value => value == null || value.Trim().Length <= 500)
            .WithMessage("EvidenceUrl must not exceed 500 characters.");
    }

    private static bool BeSupportedCurrency(string? currency)
    {
        return !string.IsNullOrWhiteSpace(currency)
            && string.Equals(currency.Trim(), ProviderFinanceConstants.DefaultCurrency, StringComparison.OrdinalIgnoreCase);
    }
}
