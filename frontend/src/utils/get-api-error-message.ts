interface ValidationErrorResponse {
  errors?: Record<string, unknown>;
  message?: unknown;
}

function getFirstValidationMessage(errors: Record<string, unknown>): string | null {
  for (const value of Object.values(errors)) {
    if (!Array.isArray(value)) {
      continue;
    }

    for (const item of value) {
      if (typeof item === 'string' && item.trim().length > 0) {
        return item;
      }
    }
  }

  return null;
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === 'object') {
    const apiError = error as ValidationErrorResponse;
    const validationMessage = apiError.errors ? getFirstValidationMessage(apiError.errors) : null;

    if (validationMessage) {
      return validationMessage;
    }

    if (typeof apiError.message === 'string' && apiError.message.trim().length > 0) {
      return apiError.message;
    }
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return fallback;
}
