/**
 * Consent Management Utility
 * GDPR Art. 6-7 - Lawfulness of processing & Conditions for consent
 * INPDP Loi n°2004-63 - Protection des données personnelles (Tunisia)
 * HIPAA §164.508 - Uses and disclosures for which an authorization is required
 *
 * Manages user consent for data processing, cookies, and health data sharing.
 */

import { auditLogger } from './audit-logger';

// ============================================
// TYPES
// ============================================

export type ConsentCategory =
'essential' // Required for app to function
| 'analytics' // Usage analytics and performance
| 'marketing' // Marketing communications
| 'health_data' // PHI processing (HIPAA)
| 'location' // Geolocation tracking
| 'notifications' // Push notifications
| 'data_sharing' // Sharing with third parties
| 'cookies'; // Cookie usage

export interface ConsentRecord {
  category: ConsentCategory;
  granted: boolean;
  timestamp: string;
  version: string;
  method: 'explicit' | 'implicit';
  ipAddress?: string;
}

export interface ConsentState {
  consents: Record<ConsentCategory, ConsentRecord>;
  lastUpdated: string;
  policyVersion: string;
  userId?: string;
}

// ============================================
// CONSTANTS
// ============================================

const CONSENT_STORAGE_KEY = '__sanad_consent';
const CURRENT_POLICY_VERSION = '2.0.0';

const DEFAULT_CONSENTS: Record<ConsentCategory, boolean> = {
  essential: true, // Always required
  analytics: false,
  marketing: false,
  health_data: false,
  location: false,
  notifications: false,
  data_sharing: false,
  cookies: false
};

// ============================================
// CONSENT MANAGER
// ============================================

class ConsentManager {
  private state: ConsentState | null = null;

  constructor() {
    this.loadState();
  }

  /**
   * Get current consent state
   */
  getState(): ConsentState | null {
    return this.state;
  }

  /**
   * Check if a specific consent has been granted
   */
  hasConsent(category: ConsentCategory): boolean {
    if (category === 'essential') return true; // Always granted
    return this.state?.consents[category]?.granted ?? false;
  }

  /**
   * Check if user has made any consent choices
   */
  hasConsentBeenGiven(): boolean {
    return (
      this.state !== null && this.state.policyVersion === CURRENT_POLICY_VERSION);

  }

  /**
   * Grant consent for a category
   */
  grantConsent(
  category: ConsentCategory,
  method: 'explicit' | 'implicit' = 'explicit')
  : void {
    this.updateConsent(category, true, method);
    auditLogger.logConsent('CONSENT_GRANTED', {
      category,
      method,
      policyVersion: CURRENT_POLICY_VERSION
    });
  }

  /**
   * Revoke consent for a category
   * GDPR Art. 7(3) - Right to withdraw consent
   */
  revokeConsent(category: ConsentCategory): void {
    if (category === 'essential') return; // Cannot revoke essential
    this.updateConsent(category, false, 'explicit');
    auditLogger.logConsent('CONSENT_REVOKED', {
      category,
      policyVersion: CURRENT_POLICY_VERSION
    });
  }

  /**
   * Accept all consents
   */
  acceptAll(): void {
    const categories = Object.keys(DEFAULT_CONSENTS) as ConsentCategory[];
    categories.forEach((cat) => this.updateConsent(cat, true, 'explicit'));
    auditLogger.logConsent('CONSENT_GRANTED', {
      categories: categories,
      method: 'accept_all',
      policyVersion: CURRENT_POLICY_VERSION
    });
  }

  /**
   * Reject all optional consents (keep essential)
   */
  rejectAll(): void {
    const categories = Object.keys(DEFAULT_CONSENTS) as ConsentCategory[];
    categories.forEach((cat) => {
      this.updateConsent(cat, cat === 'essential', 'explicit');
    });
    auditLogger.logConsent('CONSENT_REVOKED', {
      categories: categories.filter((c) => c !== 'essential'),
      method: 'reject_all',
      policyVersion: CURRENT_POLICY_VERSION
    });
  }

  /**
   * Grant specific health data consent (HIPAA Authorization)
   * Requires explicit consent with specific purpose
   */
  grantHealthDataConsent(purpose: string, dataTypes: string[]): void {
    this.updateConsent('health_data', true, 'explicit');
    auditLogger.logConsent('CONSENT_GRANTED', {
      category: 'health_data',
      purpose,
      dataTypes,
      hipaaAuthorization: true,
      policyVersion: CURRENT_POLICY_VERSION
    });
  }

  /**
   * Get consent history for GDPR compliance reporting
   */
  getConsentHistory(): ConsentRecord[] {
    if (!this.state) return [];
    return Object.values(this.state.consents);
  }

  /**
   * Export consent data (GDPR Art. 20 - Right to data portability)
   */
  exportConsentData(): string {
    return JSON.stringify(
      {
        consentState: this.state,
        exportedAt: new Date().toISOString(),
        platform: 'Care@Home Tunisia - Sanad',
        policyVersion: CURRENT_POLICY_VERSION
      },
      null,
      2
    );
  }

  /**
   * Delete all consent data (GDPR Art. 17 - Right to erasure)
   */
  deleteConsentData(): void {
    auditLogger.logConsent('CONSENT_REVOKED', {
      action: 'full_erasure',
      policyVersion: CURRENT_POLICY_VERSION
    });
    this.state = null;
    localStorage.removeItem(CONSENT_STORAGE_KEY);
  }

  // ---- Private methods ----

  private updateConsent(
  category: ConsentCategory,
  granted: boolean,
  method: 'explicit' | 'implicit')
  : void {
    if (!this.state) {
      this.state = {
        consents: {} as Record<ConsentCategory, ConsentRecord>,
        lastUpdated: new Date().toISOString(),
        policyVersion: CURRENT_POLICY_VERSION
      };
    }

    this.state.consents[category] = {
      category,
      granted,
      timestamp: new Date().toISOString(),
      version: CURRENT_POLICY_VERSION,
      method
    };

    this.state.lastUpdated = new Date().toISOString();
    this.state.policyVersion = CURRENT_POLICY_VERSION;
    this.saveState();
  }

  private loadState(): void {
    try {
      const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (stored) {
        this.state = JSON.parse(stored);
        // Check if policy version has changed (requires re-consent)
        if (this.state && this.state.policyVersion !== CURRENT_POLICY_VERSION) {
          // Keep essential, reset others
          this.state.policyVersion = CURRENT_POLICY_VERSION;
          const categories = Object.keys(
            this.state.consents
          ) as ConsentCategory[];
          categories.forEach((cat) => {
            if (cat !== 'essential') {
              this.state!.consents[cat].granted = false;
            }
          });
          this.saveState();
        }
      }
    } catch {
      this.state = null;
    }
  }

  private saveState(): void {
    try {
      if (this.state) {
        localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(this.state));
      }
    } catch {

      /* ignore */}
  }
}

// ============================================
// SINGLETON INSTANCE
// ============================================

export const consentManager = new ConsentManager();