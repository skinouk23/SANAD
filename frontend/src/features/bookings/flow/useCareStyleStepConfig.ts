interface BookingFlowTranslations {
  bookingFlow: Record<string, string>;
}

export function useCareStyleStepConfig(
  t: BookingFlowTranslations,
  needsLocationSelection: boolean,
) {
  const locationStep = needsLocationSelection ? 2 : null;
  const infoStep = needsLocationSelection ? 3 : 2;
  const paymentStep = needsLocationSelection ? 4 : 3;
  const successStep = needsLocationSelection ? 5 : 4;
  const stepLabels = needsLocationSelection
    ? [
        t.bookingFlow.stepDetails,
        t.bookingFlow.chooseServiceLocation,
        t.bookingFlow.stepInfo,
        t.bookingFlow.stepPayment,
        t.bookingFlow.bookingSuccess,
      ]
    : [
        t.bookingFlow.stepDetails,
        t.bookingFlow.stepInfo,
        t.bookingFlow.stepPayment,
        t.bookingFlow.bookingSuccess,
      ];

  return {
    infoStep,
    locationStep,
    paymentStep,
    stepLabels,
    successStep,
  };
}
