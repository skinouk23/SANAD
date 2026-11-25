# MinIO Storage Structure for Healthcare Document Management

## Overview

This document defines the MinIO bucket and folder structure for secure, compliant storage of sensitive healthcare documents across patient, provider, and admin spaces.

## Security Principles

1. **Isolation**: Each user type (patient/provider/admin) has isolated storage
2. **Least Privilege**: Users can only access their own documents
3. **Encryption**: All documents encrypted at rest and in transit
4. **Audit Trail**: All access logged with user ID, timestamp, action
5. **GDPR/HIPAA Compliance**: Data retention policies, right to deletion
6. **Versioning**: Document history maintained for compliance

---

## Bucket Structure

### Root Buckets

```
sanad-healthcare/
├── patients/           # Patient documents (HIPAA/GDPR protected)
├── providers/          # Provider documents (professional credentials)
├── admin/              # Administrative documents
├── shared/             # Shared documents (appointments, prescriptions)
└── system/             # System-level documents (templates, policies)
```

---

## 1. Patient Documents (`patients/`)

### Structure

```
patients/
└── {patient_id}/                           # UUID-based patient identifier
    ├── profile/
    │   ├── identity/
    │   │   ├── id_card_front.pdf
    │   │   ├── id_card_back.pdf
    │   │   └── proof_of_address.pdf
    │   ├── insurance/
    │   │   ├── insurance_card.pdf
    │   │   └── insurance_policy_{policy_id}.pdf
    │   └── photos/
    │       └── profile_photo.jpg
    │
    ├── medical_records/
    │   ├── prescriptions/
    │   │   └── {prescription_id}/
    │   │       ├── prescription.pdf
    │   │       └── metadata.json
    │   ├── lab_results/
    │   │   └── {lab_result_id}/
    │   │       ├── report.pdf
    │   │       ├── images/
    │   │       └── metadata.json
    │   ├── radiology/
    │   │   └── {radiology_id}/
    │   │       ├── report.pdf
    │   │       ├── images/
    │   │       │   ├── scan_001.dcm
    │   │       │   └── scan_002.dcm
    │   │       └── metadata.json
    │   ├── discharge_summaries/
    │   │   └── {hospital_stay_id}/
    │   │       ├── summary.pdf
    │   │       └── metadata.json
    │   └── vaccination_records/
    │       └── vaccination_card.pdf
    │
    ├── appointments/
    │   └── {appointment_id}/
    │       ├── appointment_summary.pdf
    │       ├── visit_notes.pdf
    │       ├── attachments/
    │       └── metadata.json
    │
    ├── care_plans/
    │   └── {care_plan_id}/
    │       ├── care_plan.pdf
    │       ├── progress_notes/
    │       └── metadata.json
    │
    ├── consents/
    │   ├── gdpr_consent_{timestamp}.pdf
    │   ├── treatment_consent_{appointment_id}.pdf
    │   └── data_sharing_consent.pdf
    │
    ├── invoices/
    │   └── {invoice_id}/
    │       ├── invoice.pdf
    │       ├── receipt.pdf
    │       └── metadata.json
    │
    └── uploads/                            # Patient-uploaded documents
        └── {upload_id}/
            ├── document.pdf
            └── metadata.json
```

### Access Control (Patient Space)

- **Patient**: Full read/write access to own folder
- **Assigned Provider**: Read-only access to medical_records, appointments, care_plans during active care relationship
- **Admin**: Read-only access for support/compliance (with audit log)
- **System**: Automated cleanup of expired consents, old documents per retention policy

---

## 2. Provider Documents (`providers/`)

### Structure

```
providers/
└── {provider_id}/                          # UUID-based provider identifier
    ├── profile/
    │   ├── identity/
    │   │   ├── id_card_front.pdf
    │   │   ├── id_card_back.pdf
    │   │   └── proof_of_address.pdf
    │   ├── professional/
    │   │   ├── medical_license.pdf
    │   │   ├── diplomas/
    │   │   │   ├── medical_degree.pdf
    │   │   │   └── specialization_certificate.pdf
    │   │   ├── certifications/
    │   │   │   ├── cpr_certification.pdf
    │   │   │   └── specialty_board_certification.pdf
    │   │   ├── insurance/
    │   │   │   └── malpractice_insurance.pdf
    │   │   └── background_check.pdf
    │   ├── business/
    │   │   ├── business_registration.pdf
    │   │   ├── tax_id.pdf
    │   │   └── bank_details.pdf
    │   └── photos/
    │       ├── profile_photo.jpg
    │       └── clinic_photos/
    │
    ├── appointments/
    │   └── {appointment_id}/
    │       ├── visit_notes.pdf
    │       ├── prescriptions_issued.pdf
    │       ├── attachments/
    │       └── metadata.json
    │
    ├── patient_records/                    # Provider's copy of patient interactions
    │   └── {patient_id}/
    │       └── {appointment_id}/
    │           ├── consultation_notes.pdf
    │           ├── treatment_plan.pdf
    │           └── metadata.json
    │
    ├── financial/
    │   ├── invoices_sent/
    │   │   └── {invoice_id}/
    │   │       ├── invoice.pdf
    │   │       └── metadata.json
    │   ├── receipts/
    │   │   └── {receipt_id}.pdf
    │   ├── tax_documents/
    │   │   └── {year}/
    │   │       ├── annual_statement.pdf
    │   │       └── tax_form.pdf
    │   └── commission_statements/
    │       └── {month_year}/
    │           └── statement.pdf
    │
    ├── marketing/
    │   └── {campaign_id}/
    │       ├── campaign_materials.pdf
    │       ├── images/
    │       └── metadata.json
    │
    ├── compliance/
    │   ├── hipaa_training_{year}.pdf
    │   ├── gdpr_compliance_{year}.pdf
    │   └── audit_reports/
    │       └── {audit_id}.pdf
    │
    └── uploads/                            # Provider-uploaded documents
        └── {upload_id}/
            ├── document.pdf
            └── metadata.json
```

### Access Control (Provider Space)

- **Provider**: Full read/write access to own folder
- **Patient**: Read-only access to specific appointment documents shared by provider
- **Admin**: Read-only access to profile/professional for verification; full access to compliance
- **System**: Automated verification status updates, document expiry notifications

---

## 3. Admin Documents (`admin/`)

### Structure

```
admin/
├── verification/
│   ├── pending/
│   │   └── {provider_id}/
│   │       ├── documents_to_verify/
│   │       └── verification_notes.txt
│   ├── approved/
│   │   └── {provider_id}/
│   │       ├── approval_certificate.pdf
│   │       └── verification_report.pdf
│   └── rejected/
│       └── {provider_id}/
│           ├── rejection_reason.txt
│           └── documents/
│
├── compliance/
│   ├── audit_logs/
│   │   └── {year}/{month}/
│   │       └── audit_log_{date}.json
│   ├── gdpr_requests/
│   │   └── {request_id}/
│   │       ├── request.pdf
│   │       ├── response.pdf
│   │       └── metadata.json
│   ├── data_breach_reports/
│   │   └── {incident_id}/
│   │       ├── incident_report.pdf
│   │       └── remediation_plan.pdf
│   └── regulatory_filings/
│       └── {year}/
│           └── {filing_type}.pdf
│
├── reports/
│   ├── financial/
│   │   └── {year}/{month}/
│   │       ├── revenue_report.pdf
│   │       └── commission_summary.pdf
│   ├── operational/
│   │   └── {year}/{month}/
│   │       ├── appointment_statistics.pdf
│   │       └── provider_performance.pdf
│   └── fraud_detection/
│       └── {report_id}/
│           ├── fraud_alert.pdf
│           └── investigation_notes.pdf
│
├── legal/
│   ├── contracts/
│   │   ├── provider_agreements/
│   │   │   └── {provider_id}/
│   │   │       └── contract_{version}.pdf
│   │   └── vendor_agreements/
│   │       └── {vendor_id}/
│   │           └── contract.pdf
│   ├── terms_of_service/
│   │   └── {version}/
│   │       ├── tos_patients.pdf
│   │       └── tos_providers.pdf
│   └── litigation/
│       └── {case_id}/
│           └── case_documents/
│
└── system/
    ├── backups/
    │   └── {date}/
    │       └── database_backup.sql.gz
    └── logs/
        └── {year}/{month}/{day}/
            └── system_log.json
```

### Access Control (Admin Space)

- **Super Admin**: Full read/write access
- **Compliance Officer**: Read/write access to compliance/, verification/, reports/
- **Financial Admin**: Read/write access to reports/financial/, verification/approved/
- **Support Admin**: Read-only access to verification/, limited patient/provider document access
- **System**: Automated backup, log rotation, compliance report generation

---

## 4. Shared Documents (`shared/`)

### Structure

```
shared/
├── appointments/
│   └── {appointment_id}/
│       ├── appointment_confirmation.pdf
│       ├── prescription.pdf
│       ├── visit_summary.pdf
│       └── metadata.json
│
├── prescriptions/
│   └── {prescription_id}/
│       ├── prescription.pdf
│       ├── qr_code.png
│       └── metadata.json
│
├── invoices/
│   └── {invoice_id}/
│       ├── invoice.pdf
│       ├── receipt.pdf
│       └── metadata.json
│
└── consents/
    └── {consent_id}/
        ├── consent_form.pdf
        ├── signed_consent.pdf
        └── metadata.json
```

### Access Control (Shared Space)

- **Patient**: Read-only access to documents where patient_id matches
- **Provider**: Read-only access to documents where provider_id matches
- **Admin**: Read-only access for support
- **System**: Write access for automated document generation

---

## 5. System Documents (`system/`)

### Structure

```
system/
├── templates/
│   ├── prescriptions/
│   │   └── prescription_template_{locale}.pdf
│   ├── invoices/
│   │   └── invoice_template_{locale}.pdf
│   ├── consents/
│   │   ├── gdpr_consent_{locale}.pdf
│   │   └── treatment_consent_{locale}.pdf
│   └── reports/
│       └── report_template_{type}.pdf
│
├── policies/
│   ├── privacy_policy_{version}_{locale}.pdf
│   ├── terms_of_service_{version}_{locale}.pdf
│   └── data_retention_policy.pdf
│
└── branding/
    ├── logos/
    │   ├── logo_primary.svg
    │   └── logo_secondary.svg
    └── assets/
        └── email_header.png
```

### Access Control (System Space)

- **All Users**: Read-only access to templates, policies, branding
- **Admin**: Read/write access
- **System**: Read/write access for automated updates

---

## Metadata Structure

Every document includes a `metadata.json` file:

```json
{
  "document_id": "uuid",
  "document_type": "prescription|lab_result|invoice|etc",
  "owner_id": "uuid",
  "owner_type": "patient|provider|admin",
  "created_at": "ISO8601 timestamp",
  "updated_at": "ISO8601 timestamp",
  "created_by": "user_id",
  "file_name": "original_filename.pdf",
  "file_size": 1024000,
  "mime_type": "application/pdf",
  "encryption": {
    "algorithm": "AES-256-GCM",
    "key_id": "encryption_key_identifier"
  },
  "access_log": [
    {
      "user_id": "uuid",
      "action": "read|write|delete",
      "timestamp": "ISO8601 timestamp",
      "ip_address": "xxx.xxx.xxx.xxx"
    }
  ],
  "retention": {
    "expires_at": "ISO8601 timestamp or null",
    "retention_policy": "7_years|indefinite|patient_controlled"
  },
  "related_entities": {
    "patient_id": "uuid or null",
    "provider_id": "uuid or null",
    "appointment_id": "uuid or null"
  },
  "tags": ["tag1", "tag2"],
  "version": 1,
  "previous_versions": ["document_id_v1", "document_id_v2"]
}
```

---

## Security Implementation

### 1. Bucket Policies

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {"AWS": "arn:aws:iam::patient:{patient_id}"},
      "Action": ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::sanad-healthcare/patients/{patient_id}/*"
    },
    {
      "Effect": "Allow",
      "Principal": {"AWS": "arn:aws:iam::provider:{provider_id}"},
      "Action": ["s3:GetObject"],
      "Resource": "arn:aws:s3:::sanad-healthcare/patients/*/appointments/{appointment_id}/*",
      "Condition": {
        "StringEquals": {
          "s3:ExistingObjectTag/provider_id": "{provider_id}"
        }
      }
    }
  ]
}
```

### 2. Encryption

- **At Rest**: AES-256-GCM server-side encryption
- **In Transit**: TLS 1.3 for all connections
- **Key Management**: Separate encryption keys per user type, rotated quarterly

### 3. Access Logging

All document access logged to separate audit bucket:

```
audit-logs/
└── {year}/{month}/{day}/
    └── access_log_{hour}.json
```

### 4. Versioning

- Enabled on all buckets
- Previous versions retained per retention policy
- Soft delete with 30-day recovery window

---

## Data Retention Policies

| Document Type | Retention Period | Auto-Delete |
|--------------|------------------|-------------|
| Medical Records | 7 years (HIPAA) | No |
| Prescriptions | 7 years | No |
| Lab Results | 7 years | No |
| Invoices | 7 years (tax law) | No |
| Consents | Duration of relationship + 7 years | No |
| Appointment Notes | 7 years | No |
| Marketing Materials | 2 years | Yes |
| Audit Logs | 10 years | No |
| System Logs | 1 year | Yes |
| Temporary Uploads | 30 days | Yes |

---

## GDPR Compliance

### Right to Access
- Patients/providers can download all their documents via API
- Admin generates comprehensive data export

### Right to Deletion
- Soft delete with 30-day recovery
- Hard delete after 30 days (except legally required documents)
- Anonymization for statistical/research purposes

### Right to Portability
- Export in standard formats (PDF, JSON)
- Structured metadata for easy import to other systems

### Breach Notification
- Automated alerts on suspicious access patterns
- 72-hour breach notification workflow
- Incident documentation in `admin/compliance/data_breach_reports/`

---

## API Integration

### Upload Document

```typescript
POST /api/documents/upload
Headers:
  Authorization: Bearer {token}
  Content-Type: multipart/form-data

Body:
  file: File
  document_type: string
  metadata: JSON

Response:
  {
    "document_id": "uuid",
    "url": "presigned_url",
    "expires_at": "timestamp"
  }
```

### Get Document

```typescript
GET /api/documents/{document_id}
Headers:
  Authorization: Bearer {token}

Response:
  {
    "document_id": "uuid",
    "download_url": "presigned_url",
    "expires_at": "timestamp",
    "metadata": {...}
  }
```

### List Documents

```typescript
GET /api/documents?type={type}&from={date}&to={date}
Headers:
  Authorization: Bearer {token}

Response:
  {
    "documents": [
      {
        "document_id": "uuid",
        "document_type": "prescription",
        "created_at": "timestamp",
        "file_name": "prescription.pdf"
      }
    ],
    "total": 42,
    "page": 1
  }
```

---

## Monitoring & Alerts

### Metrics to Track

1. **Storage Usage**: Per user, per bucket
2. **Access Patterns**: Unusual access times, locations
3. **Failed Access Attempts**: Potential security breaches
4. **Document Expiry**: Upcoming expirations for licenses, certifications
5. **Compliance**: Documents pending verification, missing documents

### Automated Alerts

- Provider license expiring in 30 days
- Unusual access pattern detected
- Storage quota exceeded
- Failed verification attempts
- GDPR request pending > 48 hours

---

## Backup Strategy

1. **Daily Incremental Backups**: All buckets to separate region
2. **Weekly Full Backups**: Complete snapshot
3. **Monthly Archive**: Long-term storage (Glacier)
4. **Disaster Recovery**: 4-hour RTO, 1-hour RPO
5. **Backup Testing**: Monthly restore drills

---

## Migration Plan

### Phase 1: Setup (Week 1-2)
- Create MinIO buckets with encryption
- Configure IAM policies
- Set up versioning and lifecycle rules

### Phase 2: Patient Documents (Week 3-4)
- Migrate existing patient documents
- Update patient portal to use MinIO
- Test patient upload/download flows

### Phase 3: Provider Documents (Week 5-6)
- Migrate provider credentials
- Update provider portal
- Test verification workflows

### Phase 4: Admin & Shared (Week 7-8)
- Migrate admin documents
- Set up automated reporting
- Configure audit logging

### Phase 5: Testing & Go-Live (Week 9-10)
- End-to-end testing
- Security audit
- Performance testing
- Production deployment

---

## Cost Optimization

1. **Lifecycle Policies**: Move old documents to cheaper storage tiers
2. **Compression**: Compress PDFs before upload
3. **Deduplication**: Detect and remove duplicate uploads
4. **Intelligent Tiering**: Automatically move infrequently accessed documents

---

## Conclusion

This MinIO structure provides:
- ✅ **Security**: Isolated storage per user with encryption
- ✅ **Compliance**: GDPR/HIPAA compliant retention and access controls
- ✅ **Scalability**: Organized structure supports millions of documents
- ✅ **Auditability**: Complete access logs and versioning
- ✅ **Performance**: Efficient retrieval with metadata indexing
- ✅ **Maintainability**: Clear organization and automated lifecycle management
