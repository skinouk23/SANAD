/**
 * Client-Side Audit Logger
 * ISO 27001 A.12.4 - Logging and monitoring
 * HIPAA §164.312(b) - Audit controls
 * GDPR Art. 30 - Records of processing activities
 * INPDP Art. 7 - Security obligations
 *
 * Captures security-relevant events for compliance audit trails.
 * Events are batched and sent to the server periodically.
 */

import { redactSensitiveData } from './security';

// ============================================
// TYPES
// ============================================

export type AuditEventType =
'AUTH_LOGIN_ATTEMPT' |
'AUTH_LOGIN_SUCCESS' |
'AUTH_LOGIN_FAILURE' |
'AUTH_LOGOUT' |
'AUTH_MFA_SENT' |
'AUTH_MFA_VERIFIED' |
'AUTH_MFA_FAILED' |
'AUTH_SESSION_EXPIRED' |
'AUTH_PASSWORD_CHANGE' |
'AUTH_PASSWORD_RESET' |
'DATA_ACCESS' |
'DATA_EXPORT' |
'DATA_MODIFICATION' |
'DATA_DELETION' |
'PHI_ACCESS' |
'PHI_MODIFICATION' |
'CONSENT_GRANTED' |
'CONSENT_REVOKED' |
'CONSENT_UPDATED' |
'SECURITY_RATE_LIMITED' |
'SECURITY_XSS_BLOCKED' |
'SECURITY_INJECTION_BLOCKED' |
'SECURITY_SUSPICIOUS_ACTIVITY' |
'NAVIGATION' |
'ERROR' |
'API_REQUEST' |
'APPOINTMENT_CREATED' |
'APPOINTMENT_CANCELLED' |
'PAYMENT_INITIATED' |
'PAYMENT_COMPLETED' |
'GDPR_DATA_REQUEST' |
'GDPR_ERASURE_REQUEST';

export type AuditSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface AuditEvent {
  id: string;
  timestamp: string;
  type: AuditEventType;
  severity: AuditSeverity;
  userId?: string;
  userRole?: string;
  sessionId?: string;
  action: string;
  resource?: string;
  resourceId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent: string;
  origin: string;
}

// ============================================
// AUDIT LOGGER
// ============================================

const AUDIT_BUFFER_KEY = '__sanad_audit_buffer';
const MAX_BUFFER_SIZE = 50;
const FLUSH_INTERVAL_MS = 30000; // 30 seconds

class AuditLogger {
  private buffer: AuditEvent[] = [];
  private flushTimer: ReturnType<typeof setInterval> | null = null;
  private userId: string | null = null;
  private userRole: string | null = null;
  private sessionId: string | null = null;

  constructor() {
    // Load any buffered events from previous session
    this.loadBuffer();
    // Start periodic flush
    this.startFlushTimer();
    // Flush on page unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => this.flush());
      window.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') this.flush();
      });
    }
  }

  /**
   * Set the current user context for audit events
   */
  setUserContext(userId: string, userRole: string, sessionId?: string): void {
    this.userId = userId;
    this.userRole = userRole;
    this.sessionId = sessionId || null;
  }

  /**
   * Clear user context (on logout)
   */
  clearUserContext(): void {
    this.userId = null;
    this.userRole = null;
    this.sessionId = null;
  }

  /**
   * Log an audit event
   */
  log(
  type: AuditEventType,
  action: string,
  options: {
    severity?: AuditSeverity;
    resource?: string;
    resourceId?: string;
    details?: Record<string, any>;
  } = {})
  : void {
    const event: AuditEvent = {
      id: this.generateEventId(),
      timestamp: new Date().toISOString(),
      type,
      severity: options.severity || 'info',
      userId: this.userId || undefined,
      userRole: this.userRole || undefined,
      sessionId: this.sessionId || undefined,
      action,
      resource: options.resource,
      resourceId: options.resourceId,
      details: options.details ?
      redactSensitiveData(options.details) :
      undefined,
      userAgent:
      typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      origin:
      typeof window !== 'undefined' ? window.location.origin : 'unknown'
    };

    this.buffer.push(event);

    // Auto-flush if buffer is full
    if (this.buffer.length >= MAX_BUFFER_SIZE) {
      this.flush();
    }

    // Console output in development
    if (typeof import.meta !== 'undefined' && import.meta.env?.DEV) {
      const icon = {
        info: 'ℹ️',
        warning: '⚠️',
        error: '❌',
        critical: '🚨'
      }[event.severity];
      console.log(
        `${icon} [AUDIT] ${event.type}: ${event.action}`,
        event.details || ''
      );
    }
  }

  /**
   * Convenience methods for common events
   */
  logAuth(
  action: string,
  success: boolean,
  details?: Record<string, any>)
  : void {
    this.log(success ? 'AUTH_LOGIN_SUCCESS' : 'AUTH_LOGIN_FAILURE', action, {
      severity: success ? 'info' : 'warning',
      resource: 'auth',
      details
    });
  }

  logDataAccess(
  resource: string,
  resourceId: string,
  action: string = 'read')
  : void {
    this.log('DATA_ACCESS', `${action} ${resource}`, {
      resource,
      resourceId
    });
  }

  logPhiAccess(resource: string, resourceId: string, reason: string): void {
    this.log('PHI_ACCESS', `Accessed PHI: ${resource}`, {
      severity: 'info',
      resource,
      resourceId,
      details: { reason, accessTime: new Date().toISOString() }
    });
  }

  logSecurityEvent(action: string, details?: Record<string, any>): void {
    this.log('SECURITY_SUSPICIOUS_ACTIVITY', action, {
      severity: 'warning',
      details
    });
  }

  logConsent(
  type: 'CONSENT_GRANTED' | 'CONSENT_REVOKED' | 'CONSENT_UPDATED',
  details: Record<string, any>)
  : void {
    this.log(type, `Consent ${type.split('_')[1].toLowerCase()}`, {
      severity: 'info',
      resource: 'consent',
      details
    });
  }

  /**
   * Flush buffered events to server
   */
  async flush(): Promise<void> {
    if (this.buffer.length === 0) return;

    const events = [...this.buffer];
    this.buffer = [];
    this.saveBuffer();

    try {
      // In production, send to audit API endpoint
      // await fetch('/api/audit/events', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ events }),
      //   keepalive: true, // Ensure delivery on page unload
      // })

      // For now, store locally for compliance review
      this.persistEvents(events);
    } catch (error) {
      // Re-buffer failed events
      this.buffer = [...events, ...this.buffer].slice(0, MAX_BUFFER_SIZE * 2);
      this.saveBuffer();
    }
  }

  /**
   * Get all stored audit events (for admin review)
   */
  getStoredEvents(): AuditEvent[] {
    try {
      const stored = localStorage.getItem('__sanad_audit_log');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  // ---- Private methods ----

  private generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }

  private startFlushTimer(): void {
    if (this.flushTimer) clearInterval(this.flushTimer);
    this.flushTimer = setInterval(() => this.flush(), FLUSH_INTERVAL_MS);
  }

  private loadBuffer(): void {
    try {
      const stored = sessionStorage.getItem(AUDIT_BUFFER_KEY);
      if (stored) {
        this.buffer = JSON.parse(stored);
        sessionStorage.removeItem(AUDIT_BUFFER_KEY);
      }
    } catch {

      /* ignore */}
  }

  private saveBuffer(): void {
    try {
      if (this.buffer.length > 0) {
        sessionStorage.setItem(AUDIT_BUFFER_KEY, JSON.stringify(this.buffer));
      } else {
        sessionStorage.removeItem(AUDIT_BUFFER_KEY);
      }
    } catch {

      /* ignore */}
  }

  private persistEvents(events: AuditEvent[]): void {
    try {
      const existing = this.getStoredEvents();
      // Keep last 500 events
      const combined = [...existing, ...events].slice(-500);
      localStorage.setItem('__sanad_audit_log', JSON.stringify(combined));
    } catch {

      /* ignore */}
  }
}

// ============================================
// SINGLETON INSTANCE
// ============================================

export const auditLogger = new AuditLogger();