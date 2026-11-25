import { HttpResponse } from 'msw';

export function apiOk<T>(data: T) {
  return HttpResponse.json({ success: true, data, status: 'success', message: null });
}

export function apiNotFound(message = 'Not found') {
  return HttpResponse.json(
    { success: false, data: null, status: 'error', message },
    { status: 404 },
  );
}

export function apiUnauthorized(message = 'Unauthorized') {
  return HttpResponse.json(
    { success: false, data: null, status: 'error', message },
    { status: 401 },
  );
}

export function apiBadRequest(
  message: string,
  code = 'BAD_REQUEST',
  details?: Record<string, unknown>,
) {
  return HttpResponse.json(
    {
      data: null,
      success: false,
      status: 'error',
      message,
      code,
      details,
    },
    { status: 400 },
  );
}

export function apiConflict(message: string, code: string, details?: Record<string, unknown>) {
  return HttpResponse.json(
    {
      data: null,
      success: false,
      status: 'error',
      message,
      code,
      details,
    },
    { status: 409 },
  );
}

export function apiGone(message: string, code = 'GONE') {
  return HttpResponse.json(
    {
      data: null,
      success: false,
      status: 'error',
      message,
      code,
    },
    { status: 410 },
  );
}

export function randomId(): string {
  return crypto.randomUUID?.() ?? Math.random().toString(36).substring(2, 15);
}
