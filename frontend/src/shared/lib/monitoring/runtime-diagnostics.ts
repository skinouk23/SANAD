import type { ErrorInfo } from 'react';
import { ZodError } from 'zod';

import { env, isDevelopment } from '@/config/env';
import { redactSensitiveData, redactSensitiveText, isSensitiveFieldName } from '@/utils/security';

// ============================================
// TYPES
// ============================================

export type DiagnosticLevel = 'info' | 'warning' | 'error' | 'critical';

export type DiagnosticType =
  | 'bootstrap.failure'
  | 'react.boundary.error'
  | 'runtime.window.error'
  | 'runtime.unhandled-rejection'
  | 'router.error'
  | 'api.failure'
  | 'api.failure.repeated'
  | 'schema.parse.failure';

export interface SafeUrlContext {
  path: string;
  queryKeys: string[];
  hasHash: boolean;
}

export interface DiagnosticActorContext {
  userId?: string;
  role?: string;
  sessionId?: string;
}

export interface DiagnosticEvent {
  id: string;
  timestamp: string;
  type: DiagnosticType;
  level: DiagnosticLevel;
  message: string;
  route?: SafeUrlContext;
  actor?: DiagnosticActorContext;
  context?: Record<string, unknown>;
}

export interface ApiFailureDiagnosticInput {
  method?: string;
  url?: string;
  statusCode?: number;
  code?: string;
  retryCount?: number;
  requestId?: string;
}

interface SchemaDiagnosticInput {
  context: string;
  source?: string;
  details?: Record<string, unknown>;
}

interface DiagnosticEventInput {
  type: DiagnosticType;
  level: DiagnosticLevel;
  message: string;
  context?: Record<string, unknown>;
  route?: SafeUrlContext;
}

type UrlLike =
  | string
  | URL
  | Pick<Location, 'pathname' | 'search' | 'hash'>
  | Pick<Location, 'href' | 'pathname' | 'search' | 'hash'>
  | Pick<URL, 'href' | 'pathname' | 'search' | 'hash'>;

// ============================================
// CONSTANTS
// ============================================

const DIAGNOSTICS_STORAGE_KEY = '__sanad_runtime_diagnostics';
const MAX_DIAGNOSTIC_EVENTS = 50;
const DIAGNOSTIC_DUPLICATE_WINDOW_MS = 5000;
const API_FAILURE_WINDOW_MS = 60000;
const API_FAILURE_THRESHOLD = 3;
const MAX_CONTEXT_DEPTH = 4;
const MAX_CONTEXT_KEYS = 20;
const MAX_CONTEXT_ARRAY_ITEMS = 10;
const MAX_STRING_LENGTH = 300;
const OPAQUE_IDENTIFIER_SEGMENT_PATTERN =
  /^(?:\d+|[0-9a-f]{8}-[0-9a-f-]{27,}|[0-9a-f]{16,}|(?=.*\d)[A-Za-z0-9_-]{12,})$/i;

function isDevelopmentDiagnosticsEnabled(): boolean {
  return isDevelopment() && env.ENABLE_DEBUG_MODE;
}

function generateDiagnosticId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `diag_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function normalizePathSegment(segment: string): string {
  if (!segment) {
    return segment;
  }

  if (segment.includes('@')) {
    return ':identifier';
  }

  if (OPAQUE_IDENTIFIER_SEGMENT_PATTERN.test(segment)) {
    return ':id';
  }

  return redactSensitiveText(segment);
}

function trimString(value: string): string {
  return value.length > MAX_STRING_LENGTH ? `${value.slice(0, MAX_STRING_LENGTH)}...` : value;
}

function toSafeRecord(value: unknown, depth: number = 0): unknown {
  if (value === null || value === undefined) {
    return value;
  }

  if (depth >= MAX_CONTEXT_DEPTH) {
    return '[Truncated]';
  }

  if (typeof value === 'string') {
    return trimString(redactSensitiveText(value));
  }

  if (Array.isArray(value)) {
    return value.slice(0, MAX_CONTEXT_ARRAY_ITEMS).map((entry) => toSafeRecord(entry, depth + 1));
  }

  if (typeof value === 'object') {
    const redacted = redactSensitiveData(value);
    const entries = Object.entries(redacted as Record<string, unknown>).slice(0, MAX_CONTEXT_KEYS);

    return Object.fromEntries(entries.map(([key, entry]) => [key, toSafeRecord(entry, depth + 1)]));
  }

  return value;
}

function toSafeContext(context?: Record<string, unknown>): Record<string, unknown> | undefined {
  if (!context) {
    return undefined;
  }

  const safeContext = toSafeRecord(context) as Record<string, unknown>;
  return Object.keys(safeContext).length > 0 ? safeContext : undefined;
}

function buildFingerprint(event: DiagnosticEventInput): string {
  const statusCode = typeof event.context?.statusCode === 'number' ? event.context.statusCode : '';
  const code = typeof event.context?.code === 'string' ? event.context.code : '';
  const path =
    (typeof event.context?.requestPath === 'string' ? event.context.requestPath : undefined) ??
    event.route?.path ??
    '';

  return `${event.type}|${event.message}|${statusCode}|${code}|${path}`;
}

function createUrl(source: UrlLike): URL | null {
  const fallbackOrigin =
    typeof window !== 'undefined' ? window.location.origin : 'https://sanad.local';

  try {
    if (typeof source === 'string') {
      return new URL(source, fallbackOrigin);
    }

    if (source instanceof URL) {
      return source;
    }

    if ('href' in source && typeof source.href === 'string' && source.href) {
      return new URL(source.href, fallbackOrigin);
    }

    const pathname = source.pathname || '/';
    return new URL(`${pathname}${source.search || ''}${source.hash || ''}`, fallbackOrigin);
  } catch {
    return null;
  }
}

function getCurrentWindowLocation(): SafeUrlContext | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }

  return getSafeUrlContext(window.location) ?? undefined;
}

function getIssueSummary(error: ZodError): Array<Record<string, unknown>> {
  return error.issues.slice(0, 5).map((issue) => ({
    code: issue.code,
    path: issue.path.map((part) => String(part)).join('.') || '(root)',
    message: redactSensitiveText(issue.message),
  }));
}

function getDiagnosticLevelFromStatus(statusCode?: number): DiagnosticLevel | null {
  if (statusCode === undefined) {
    return 'error';
  }

  if (statusCode === 0 || statusCode >= 500) {
    return 'error';
  }

  if (statusCode === 401 || statusCode === 403 || statusCode === 408 || statusCode === 429) {
    return 'warning';
  }

  return null;
}

function safeSerializeError(error: unknown, includeStack: boolean): Record<string, unknown> {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: redactSensitiveText(error.message),
      ...(includeStack && error.stack
        ? {
            stack: trimString(redactSensitiveText(error.stack)),
          }
        : {}),
    };
  }

  if (typeof error === 'string') {
    return {
      message: redactSensitiveText(error),
    };
  }

  if (error && typeof error === 'object') {
    return redactSensitiveData(error) as Record<string, unknown>;
  }

  return {
    message: 'Unknown error',
  };
}

export function isSchemaValidationError(error: unknown): error is ZodError {
  return error instanceof ZodError;
}

export function getSafeUrlContext(source?: UrlLike | null): SafeUrlContext | null {
  if (!source) {
    return null;
  }

  const parsedUrl = createUrl(source);

  if (!parsedUrl) {
    return null;
  }

  const safePath = parsedUrl.pathname
    .split('/')
    .map((segment) => normalizePathSegment(segment))
    .join('/')
    .replace(/\/{2,}/g, '/');

  const queryKeys = Array.from(parsedUrl.searchParams.keys())
    .slice(0, 10)
    .map((key) =>
      isSensitiveFieldName(key) ? '[REDACTED]' : trimString(redactSensitiveText(key)),
    );

  return {
    path: safePath || '/',
    queryKeys,
    hasHash: parsedUrl.hash.length > 0,
  };
}

class RuntimeDiagnostics {
  private events: DiagnosticEvent[] = [];
  private initialized = false;
  private routeContext: SafeUrlContext | undefined;
  private actorContext: DiagnosticActorContext | undefined;
  private recentFingerprints = new Map<string, { eventId: string; timestamp: number }>();
  private repeatedApiFailures = new Map<
    string,
    { count: number; firstSeenAt: number; lastSeenAt: number; lastReportedAt: number }
  >();

  initialize(): void {
    if (this.initialized || typeof window === 'undefined') {
      return;
    }

    this.events = this.readStoredEvents();
    this.routeContext = getCurrentWindowLocation();

    window.addEventListener('error', this.handleWindowError);
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection);

    this.initialized = true;
  }

  setRouteContext(location: UrlLike): SafeUrlContext | undefined {
    this.routeContext = getSafeUrlContext(location) ?? getCurrentWindowLocation();
    return this.routeContext;
  }

  setActorContext(actor: DiagnosticActorContext): void {
    this.actorContext = redactSensitiveData(actor) as DiagnosticActorContext;
  }

  clearActorContext(): void {
    this.actorContext = undefined;
  }

  captureBootstrapFailure(error: unknown, options?: { phase?: string }): DiagnosticEvent {
    return this.record({
      type: 'bootstrap.failure',
      level: 'critical',
      message: 'Application bootstrap failed',
      context: {
        phase: options?.phase ?? 'startup',
        error: safeSerializeError(error, isDevelopmentDiagnosticsEnabled()),
      },
    });
  }

  captureReactBoundaryError(error: unknown, info?: ErrorInfo): DiagnosticEvent {
    return this.record({
      type: 'react.boundary.error',
      level: 'error',
      message: 'React error boundary captured an application crash',
      context: {
        error: safeSerializeError(error, isDevelopmentDiagnosticsEnabled()),
        ...(isDevelopmentDiagnosticsEnabled() && info?.componentStack
          ? {
              componentStack: trimString(redactSensitiveText(info.componentStack.trim())),
            }
          : {}),
      },
    });
  }

  captureRouterError(
    error: unknown,
    options?: { scope?: string; statusCode?: number },
  ): DiagnosticEvent {
    return this.record({
      type: 'router.error',
      level: 'error',
      message: 'Route error element rendered due to a routing failure',
      context: {
        scope: options?.scope,
        statusCode: options?.statusCode,
        error: safeSerializeError(error, isDevelopmentDiagnosticsEnabled()),
      },
    });
  }

  captureSchemaParseFailure(error: ZodError, input: SchemaDiagnosticInput): DiagnosticEvent {
    return this.record({
      type: 'schema.parse.failure',
      level: 'error',
      message: `Schema validation failed in ${input.context}`,
      context: {
        source: input.source ?? 'zod',
        issues: getIssueSummary(error),
        issueCount: error.issues.length,
        ...input.details,
      },
    });
  }

  captureApiFailure(input: ApiFailureDiagnosticInput): DiagnosticEvent | null {
    const request = getSafeUrlContext(input.url);
    const method = input.method?.toUpperCase() ?? 'GET';
    const level = getDiagnosticLevelFromStatus(input.statusCode);
    const signature = `${method}|${request?.path ?? 'unknown'}|${input.statusCode ?? 0}|${input.code ?? 'UNKNOWN'}`;

    if (level) {
      this.record({
        type: 'api.failure',
        level,
        message: `${method} ${request?.path ?? 'unknown'} failed`,
        context: {
          code: input.code,
          requestPath: request?.path,
          requestQueryKeys: request?.queryKeys,
          statusCode: input.statusCode,
          retryCount: input.retryCount ?? 0,
          requestId: input.requestId,
        },
      });
    }

    const repeatedEvent = this.captureRepeatedApiFailure(signature, {
      code: input.code,
      method,
      retryCount: input.retryCount ?? 0,
      route: request,
      statusCode: input.statusCode,
    });

    return repeatedEvent;
  }

  getLatestReferenceId(type?: DiagnosticType | DiagnosticType[]): string | null {
    const acceptedTypes = Array.isArray(type) ? type : type ? [type] : null;
    const matchingEvent = [...this.events]
      .reverse()
      .find((event) => !acceptedTypes || acceptedTypes.includes(event.type));

    return matchingEvent?.id ?? null;
  }

  private captureRepeatedApiFailure(
    signature: string,
    details: {
      code?: string;
      method: string;
      retryCount: number;
      route: SafeUrlContext | null;
      statusCode?: number;
    },
  ): DiagnosticEvent | null {
    const now = Date.now();
    const existing = this.repeatedApiFailures.get(signature);

    if (!existing || now - existing.firstSeenAt > API_FAILURE_WINDOW_MS) {
      this.repeatedApiFailures.set(signature, {
        count: 1,
        firstSeenAt: now,
        lastSeenAt: now,
        lastReportedAt: 0,
      });

      return null;
    }

    existing.count += 1;
    existing.lastSeenAt = now;

    if (
      existing.count < API_FAILURE_THRESHOLD ||
      now - existing.lastReportedAt < API_FAILURE_WINDOW_MS / 2
    ) {
      return null;
    }

    existing.lastReportedAt = now;

    return this.record({
      type: 'api.failure.repeated',
      level: details.statusCode === 0 || (details.statusCode ?? 0) >= 500 ? 'error' : 'warning',
      message: `Repeated API failures detected for ${details.method} ${details.route?.path ?? 'unknown'}`,
      context: {
        code: details.code,
        count: existing.count,
        requestPath: details.route?.path,
        requestQueryKeys: details.route?.queryKeys,
        retryCount: details.retryCount,
        statusCode: details.statusCode,
        windowMs: API_FAILURE_WINDOW_MS,
      },
    });
  }

  private handleWindowError = (event: ErrorEvent): void => {
    this.record({
      type: 'runtime.window.error',
      level: 'error',
      message: 'Unhandled browser runtime error',
      context: {
        column: event.colno,
        line: event.lineno,
        source: event.filename ? trimString(redactSensitiveText(event.filename)) : undefined,
        error: safeSerializeError(event.error ?? event.message, isDevelopmentDiagnosticsEnabled()),
      },
    });
  };

  private handleUnhandledRejection = (event: PromiseRejectionEvent): void => {
    this.record({
      type: 'runtime.unhandled-rejection',
      level: 'error',
      message: 'Unhandled promise rejection',
      context: {
        error: safeSerializeError(event.reason, isDevelopmentDiagnosticsEnabled()),
      },
    });
  };

  private record(input: DiagnosticEventInput): DiagnosticEvent {
    const route = input.route ?? this.routeContext ?? getCurrentWindowLocation();
    const fingerprint = buildFingerprint({ ...input, route });
    const now = Date.now();
    const duplicate = this.recentFingerprints.get(fingerprint);

    if (duplicate && now - duplicate.timestamp < DIAGNOSTIC_DUPLICATE_WINDOW_MS) {
      const duplicateEvent = this.events.find((event) => event.id === duplicate.eventId);

      if (duplicateEvent) {
        return duplicateEvent;
      }
    }

    const event: DiagnosticEvent = {
      id: generateDiagnosticId(),
      timestamp: new Date(now).toISOString(),
      type: input.type,
      level: input.level,
      message: trimString(redactSensitiveText(input.message)),
      route,
      actor: this.actorContext,
      context: toSafeContext(input.context),
    };

    this.events = [...this.events, event].slice(-MAX_DIAGNOSTIC_EVENTS);
    this.recentFingerprints.set(fingerprint, { eventId: event.id, timestamp: now });
    this.persistEvents();
    this.cleanupState(now);
    this.logInDevelopment(event);

    return event;
  }

  private cleanupState(now: number): void {
    for (const [fingerprint, value] of this.recentFingerprints.entries()) {
      if (now - value.timestamp > DIAGNOSTIC_DUPLICATE_WINDOW_MS) {
        this.recentFingerprints.delete(fingerprint);
      }
    }

    for (const [signature, value] of this.repeatedApiFailures.entries()) {
      if (now - value.lastSeenAt > API_FAILURE_WINDOW_MS) {
        this.repeatedApiFailures.delete(signature);
      }
    }
  }

  private logInDevelopment(event: DiagnosticEvent): void {
    if (!isDevelopment()) {
      return;
    }

    const logger =
      event.level === 'error' || event.level === 'critical' ? console.error : console.info;

    logger(`[diagnostics] ${event.type}`, event);
  }

  private persistEvents(): void {
    if (typeof sessionStorage === 'undefined') {
      return;
    }

    try {
      sessionStorage.setItem(DIAGNOSTICS_STORAGE_KEY, JSON.stringify(this.events));
    } catch {
      // Ignore storage failures. Diagnostics should never crash the app.
    }
  }

  private readStoredEvents(): DiagnosticEvent[] {
    if (typeof sessionStorage === 'undefined') {
      return [];
    }

    try {
      const stored = sessionStorage.getItem(DIAGNOSTICS_STORAGE_KEY);

      if (!stored) {
        return [];
      }

      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed.slice(-MAX_DIAGNOSTIC_EVENTS) : [];
    } catch {
      return [];
    }
  }
}

export const runtimeDiagnostics = new RuntimeDiagnostics();
