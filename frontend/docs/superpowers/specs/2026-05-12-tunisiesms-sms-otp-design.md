# TunisieSMS SMS OTP Readiness Design

## Status

Ready for user review.

This document records the approved design for making the existing OTP-first login flow SMS-ready for TunisieSMS. It is a planning artifact only; implementation should not begin until the user reviews and approves this written spec.

## Goal

Prepare SMS OTP login for Tunisia phone numbers so the app is ready when a TunisieSMS account is purchased and configured.

For now, SMS requests should be saved in the database and behave in the UI as if the SMS was sent, even when TunisieSMS is not configured. In Development only, the generated SMS OTP should be logged so the flow can be tested without a live provider.

## Approved Direction

Use the existing `login_otp_challenges` table for SMS OTP. Do not add an `sms_outbox` table in this slice.

The existing OTP endpoints stay in place:

```http
POST /api/v1/Auth/login/otp/request
POST /api/v1/Auth/login/otp/verify
```

They should support both channels:

```json
{ "channel": "email", "email": "user@example.com" }
```

```json
{ "channel": "sms", "phoneNumber": "+21655555555" }
```

SMS behavior:

- If TunisieSMS is enabled and configured, create the OTP challenge and send a real SMS.
- If TunisieSMS is disabled or not configured, create the OTP challenge and skip provider delivery.
- In both cases, return the same user-facing "sent" response.
- In Development only, log the generated SMS OTP with a clear `[DEV-ONLY SMS OTP]` marker.
- In Production, never log or return plaintext OTP values.

## Provider Context

TunisieSMS documents an API for SMS integration using XML or JSON over HTTP/HTTPS. Their public documentation describes API use for sending SMS to Tunisia networks including Tunisie Telecom, Ooredoo Tunisie, and Orange Tunisie. It also documents provider response codes such as successful send, authentication errors, insufficient balance, invalid phone number, and invalid sender.

Provider references:

- TunisieSMS API overview: https://www.tunisiesms.tn/api-SMS/
- TunisieSMS code examples/status codes: https://www.tunisiesms.tn/exemples-codes-api-sms/

Implementation should hide TunisieSMS-specific request and response details behind an `ISmsSender` abstraction so the auth flow does not depend directly on provider payload shape.

## Current Context

The app already has an OTP-first login implementation for email:

- Backend OTP endpoints under `Features/Authentication/Controllers/AuthController.cs`.
- OTP commands under `Features/Authentication/Commands/RequestLoginOtp.cs` and `VerifyLoginOtp.cs`.
- OTP challenge entity/table under `LoginOtpChallenge`.
- Frontend `/auth/login` flow with Email/SMS tabs, currently treating SMS as unavailable.
- Frontend schemas and service calls already model `channel: "email" | "sms"`, but the request schema currently blocks SMS.

The database already has user phone fields:

- `users.phone`
- `users.phone_verified`
- `users.phone_verified_at`

The SMS slice should reuse those fields for lookup and future eligibility decisions.

## Scope

In scope:

- Enable SMS as a request channel in the existing OTP request and verify flow.
- Normalize Tunisian phone numbers to E.164 format.
- Save SMS OTP challenges in `login_otp_challenges`.
- Simulate delivery when TunisieSMS is not configured.
- Add Development-only OTP logging for SMS.
- Add SMS provider options and a TunisieSMS sender abstraction.
- Keep the frontend SMS tab and make it behave like a real send path.
- Preserve the existing email OTP flow.
- Preserve password login fallback.
- Preserve no-account-enumeration behavior for phone lookups.

Out of scope:

- Adding an `sms_outbox` table.
- General marketing/notification SMS.
- Delivery retry queues.
- Provider delivery receipt webhooks.
- Phone number change workflows.
- Removing email OTP or password login.
- Committing TunisieSMS credentials to tracked config.

## Backend API Contract

### Request OTP

Endpoint:

```http
POST /api/v1/Auth/login/otp/request
```

Email request:

```json
{
  "channel": "email",
  "email": "mehdimseddi8@gmail.com",
  "rememberMe": false,
  "deviceFingerprint": "dfp_..."
}
```

SMS request:

```json
{
  "channel": "sms",
  "phoneNumber": "+21655555555",
  "rememberMe": false,
  "deviceFingerprint": "dfp_..."
}
```

Response:

```json
{
  "challengeId": "25747378-f17e-41dd-a3e4-83161ccb02c5",
  "channel": "sms",
  "maskedDestination": "+216 ** *** 555",
  "expiresIn": 300,
  "resendAvailableIn": 60
}
```

The response should not reveal whether the phone number exists. If the phone is unknown or ineligible, return a generic response as with email OTP.

### Verify OTP

Endpoint:

```http
POST /api/v1/Auth/login/otp/verify
```

Request:

```json
{
  "challengeId": "25747378-f17e-41dd-a3e4-83161ccb02c5",
  "code": "228090",
  "rememberMe": false,
  "deviceFingerprint": "dfp_..."
}
```

Response remains the existing `LoginResponse` shape.

## Phone Normalization

The backend should normalize SMS phone numbers before lookup or hashing.

Accepted user input examples:

- `+21655555555`
- `0021655555555`
- `55555555`
- `55 555 555`

Normalization output:

```text
+216XXXXXXXX
```

Canonical rule: the stored and hashed normalized value must be exactly one plus sign, country code `216`, and eight national digits.

Invalid examples:

- numbers not reducible to Tunisia `+216` format,
- fewer or more than eight national digits,
- non-Tunisia country codes for this first slice.

Validation messages can be user-friendly, but missing-user responses must stay generic.

## Data Model

Reuse `login_otp_challenges`.

For SMS rows:

```text
channel = sms
destination_hash = HMAC(normalizedPhone)
code_hash = HMAC(challengeId + otp)
expires_at = now + expiration window
consumed_at = null until verify or superseded
failed_attempts = 0
last_sent_at = now when a real SMS is sent OR when simulated send is accepted
```

No plaintext OTP should be stored in this table.

No `sms_outbox` table should be added in this slice.

## Provider Configuration

Committed config may include placeholders only:

```json
"Sms": {
  "Provider": "TunisieSMS",
  "Enabled": false,
  "ApiUrl": "",
  "ClientId": "",
  "ApiKey": "",
  "SenderName": "SANAD",
  "DefaultCountryCode": "TN",
  "LogOtpInDevelopment": true
}
```

Real values must be supplied via .NET user-secrets, environment variables, or production secret storage.

Do not commit TunisieSMS credentials.

## Backend Components

Add options:

- `SmsOptions`

Add service abstractions:

- `ISmsSender`
- `TunisieSmsSender`
- optional `NoopSmsSender` or provider-disabled branch

Add helper:

- `ITunisiaPhoneNumberNormalizer`

Update existing OTP request handler:

- Accept `channel = sms`.
- Read `PhoneNumber` when SMS is selected.
- Normalize and hash the destination.
- Lookup user by normalized phone number.
- Consume existing active SMS challenges for the same user.
- Generate and hash OTP.
- Insert `LoginOtpChallenge`.
- If user is eligible and SMS provider is enabled, send via `ISmsSender`.
- If user is eligible and SMS provider is disabled, skip delivery and log OTP only in Development.
- Return the same "sent" response either way.

Update existing OTP verify handler:

- It should continue to verify by `challengeId`, code hash, expiry, consumption, failed attempts, and account eligibility.
- No separate SMS verify endpoint is needed.

## Development-Only Logging

When `Sms:Enabled = false`, `Sms:LogOtpInDevelopment = true`, and the app environment is Development, log:

```text
[DEV-ONLY SMS OTP] Challenge {ChallengeId} for {MaskedPhone}: {Otp}
```

Rules:

- Only log for real, existing eligible users.
- Mask the phone number.
- Never log SMS OTP in Production.
- Never return `debugCode` in API responses.
- Keep email OTP logging unchanged: production email OTP should never be logged.

## Frontend Behavior

The SMS tab should stop being a disabled preview.

Identifier step:

- Email tab asks for email.
- SMS tab asks for Tunisia phone number.
- Continue button is enabled for valid phone input.
- Submit calls `requestLoginOtp({ channel: "sms", phoneNumber })`.

After successful SMS request:

- Always move to OTP code screen.
- Show masked phone destination.
- Use the same OTP input and verify button.
- Do not display "provider not configured" to the user.

This intentionally makes the UI future-proof. When TunisieSMS credentials are configured later, the frontend behavior stays the same.

## No Account Enumeration

SMS OTP must follow the same rule as email OTP:

- Unknown phone number should receive a generic success-like response.
- Ineligible users should receive generic messaging unless the user is already authenticated and performing phone verification.
- Verify step should return generic "invalid or expired code" for invalid challenge/code.

Do not return:

```text
Phone number not found
This phone is not linked to an account
```

## Error Handling

Provider disabled:

- Save the challenge.
- Return normal sent response.
- Dev-only log the OTP.

Provider configured but TunisieSMS fails:

- Prefer not to crash with `500`.
- Log provider failure with structured metadata.
- Do not expose provider credentials, raw secrets, or full recipient phone.
- Decide implementation behavior:
  - if provider failure occurs after challenge creation, consume the challenge or keep it based on retry strategy;
  - for this slice, consuming the failed challenge is safer because the user did not receive the code.

TunisieSMS error mapping should be internal. Public response should remain generic.

## Security

- OTP length: reuse current login OTP length, currently 6 digits.
- Expiry: reuse current login OTP expiry, currently 5 minutes.
- Failed attempts: reuse current max attempts.
- Resend cooldown: reuse current cooldown.
- Store only hashes for OTP codes and destinations.
- Use HMAC for destination hash and code hash as email OTP already does.
- Redact OTP code, phone number, device fingerprint, tokens, and refresh tokens from request/response logs before production.
- SMS is vulnerable to SIM swap, so keep email/password fallback and avoid using SMS as the only high-assurance factor.

## Verification Plan

Backend:

- `dotnet build "Sanad Platform Official.sln"`
- Request SMS OTP with provider disabled and existing phone.
- Confirm `login_otp_challenges` row is created with `channel = sms`.
- Confirm dev-only log shows the OTP in Development only.
- Verify with logged OTP returns `LoginResponse`.
- Request SMS OTP with unknown phone and confirm generic response.
- Verify unknown/fake challenge fails generically.

Frontend:

- `npm run type-check`
- `npm run lint`
- `npm run build`
- Exercise `/auth/login` SMS tab.
- Confirm SMS request moves to OTP code screen.
- Confirm OTP verify logs in when using dev-only logged code.
- Confirm email OTP still works.
- Confirm password fallback still works.

## Future TunisieSMS Enablement

When TunisieSMS is purchased:

1. Put credentials in user-secrets or production secrets.
2. Set `Sms:Enabled = true`.
3. Set `Sms:ApiUrl`, `Sms:ClientId`, `Sms:ApiKey`, and `Sms:SenderName`.
4. Keep frontend unchanged.
5. Run a live SMS test on Tunisia networks.
6. Turn off development OTP logging outside Development.

## Spec Self-Review

- Placeholder scan: no implementation placeholders remain; credential values are intentionally empty placeholders because real secrets must not be committed.
- Consistency check: SMS uses the same OTP endpoints and `login_otp_challenges` table throughout; no `sms_outbox` appears in the design.
- Scope check: focused on SMS OTP readiness for login with TunisieSMS, not general notification delivery.
- Ambiguity check: user-facing behavior is explicit: SMS appears sent whether provider is configured or not; Development logging is the test path until provider purchase.
