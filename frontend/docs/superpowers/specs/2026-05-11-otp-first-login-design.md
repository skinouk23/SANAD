# OTP-First Login Design

## Status

Ready for user review. The approved direction is Option A: add a dedicated email OTP login path for both patient and professional accounts, keep password login intact as a fallback, and leave SMS as a visible future option.

This document records the design only. It does not authorize implementation until the written spec is reviewed and approved.

## Goal

Make OTP the primary login experience while preserving the existing password authentication work in the backend and frontend.

The first production-ready channel is email OTP. The UI will show Email and SMS tabs to match the supplied screenshots, but SMS will not send a code until an SMS provider is configured in a later slice.

## Approved Direction

Use a dedicated login OTP system beside the existing password login.

The backend keeps `POST /api/v1/Auth/login` as the password endpoint. It adds two anonymous OTP endpoints:

- `POST /api/v1/Auth/login/otp/request`
- `POST /api/v1/Auth/login/otp/verify`

OTP verification returns the existing `LoginResponse` shape. That lets the frontend reuse the current token, refresh-token, session restore, role routing, query-cache clearing, and secure storage behavior.

Patients and professionals can both use OTP login. Professional OTP login must enforce the same provider approval, suspension, active-account, and profile-existence checks as password login.

## Current Context

The backend Authentication feature is a vertical slice under `Sanad CareAtHome Backend/BackEnd/SanadPlatform.API/Features/Authentication`.

The existing password login endpoint is `POST /api/v1/Auth/login` in `AuthController.cs`. It delegates to `LoginUserCommand` and `LoginUserHandler`. That handler currently:

- normalizes email lookup through `IUserRepository.GetByEmailWithProfilesAsync`,
- enforces account lockout,
- verifies the bcrypt password hash,
- blocks inactive, suspended, pending-provider, and rejected-provider accounts,
- creates a `UserSession`,
- generates JWT and refresh tokens,
- returns `LoginResponse`.

The `User` entity already has fields such as `EmailVerified`, `PhoneVerified`, `TwoFactorEnabled`, and token navigation collections, but there are no login OTP endpoints or sender services today.

`PasswordResetToken` and `EmailVerificationToken` tables exist, but they are not a good fit for login OTP because they lack login-specific channel, resend, attempt, and consumption semantics.

The frontend login route is `/auth/login`. `LoginScreen.tsx` owns the current login wizard with two steps: account selection and password login. `LoginFormStep.tsx` owns the email/password fallback form. `AuthContext.tsx` owns session persistence after a `LoginResponse`.

The frontend is configured for shadcn/Radix Nova through `components.json`:

- framework: Vite
- base: Radix
- style: `radix-nova`
- icon library: lucide
- UI alias: `@/shared/ui/primitives`
- Tailwind CSS v4

The project has shadcn `tabs`, `toggle-group`, `field`, `input`, `input-group`, `button`, and `spinner` primitives installed. It does not have `input-otp` installed yet.

## Scope

In scope:

- Email OTP login for patient accounts.
- Email OTP login for professional accounts.
- A complete frontend OTP-first login flow.
- SMS tab visible in the segmented selector, but unavailable for sending.
- Password login preserved as a fallback path.
- Dedicated OTP backend endpoints, commands, validators, entity, repository, and migration.
- SMTP email sender abstraction and configuration.
- shadcn `InputOTP` primitive for the 6-digit code screen.
- French-first UI copy with translations added for all existing locales.
- Development-only MSW support for the OTP flow when mock mode is explicitly enabled.
- Verification with backend build and frontend lint, type-check, and build.

Out of scope:

- Real SMS delivery.
- Removing password login.
- Removing password change, account deletion password confirmation, lockout, refresh-token rotation, or session revocation.
- Converting the app to passwordless registration.
- Replacing the auth shell, router, or role policy.
- Adding unit tests by default. Tests are added only if explicitly requested.
- Committing real SMTP, Gmail, JWT, database, or encryption secrets.

## Secret Handling

The implementation must not commit real Gmail app passwords or other credentials to `appsettings.json`, `appsettings.Development.json`, `.env`, or any tracked file.

The committed config may include only a shape or placeholder values, for example:

```json
"Email": {
  "SmtpServer": "smtp.gmail.com",
  "SmtpPort": 587,
  "SenderEmail": "",
  "SenderPassword": ""
}
```

Development secrets come from .NET user-secrets or environment variables. Production secrets come from environment variables or a secret store.

## User Experience

The OTP login remains inside the existing auth route and account-type flow.

For a normal patient login:

```text
/auth/login
  -> choose Patient
  -> OTP identifier screen
  -> OTP code screen
  -> authenticated patient route
```

For a professional login:

```text
/auth/login?type=professional
  -> choose professional service category
  -> OTP identifier screen
  -> OTP code screen
  -> authenticated provider route
```

The selected professional service category is carried through the OTP flow so the authenticated frontend user keeps the same `serviceType` context used by the current password login path.

The fallback path remains:

```text
OTP identifier screen
  -> "Se connecter avec mot de passe"
  -> existing password LoginFormStep
```

## Visual Design

The OTP identifier screen should match the supplied screenshots closely while still using the project primitives and tokens.

The first OTP screen uses:

- compact white panel with soft shadow and rounded corners,
- centered title `Connexion sécurisée`,
- two-segment Email/SMS selector,
- Email active by default,
- SMS visible as a selectable tab marked `Bientôt disponible`,
- uppercase cyan label `ADRESSE EMAIL`,
- large rounded email input with mail icon,
- full-width cyan-to-blue gradient `Continuer` button with `ArrowRight`,
- footer text `Connexion sécurisée avec authentification à deux facteurs`,
- green lock line `Chiffrement SSL`.

When the SMS tab is selected, the UI does not call a backend endpoint. It shows a clear unavailable state, renders the phone input in a disabled preview state, disables the continue button for SMS, and offers Email as the working option.

The OTP code screen uses the same panel and visual language:

- title `Code de vérification`,
- helper text `Nous avons envoyé un code à <masked email>`,
- six-digit shadcn `InputOTP`,
- primary `Vérifier` button,
- resend action with cooldown,
- back action to change the email,
- password fallback link.

The UI should remain responsive and stable on mobile. Fixed-format elements such as the segmented selector, input, button, and OTP slots must have stable heights so labels, loading states, and errors do not shift the layout.

## Frontend Architecture

`LoginScreen.tsx` expands from two steps to four:

```text
select
otpIdentifier
otpCode
passwordLogin
```

`LoginFormStep.tsx` remains the password fallback and should not be deleted.

New feature-owned components:

- `src/features/auth/screens/login/LoginOtpIdentifierStep.tsx`
- `src/features/auth/screens/login/LoginOtpCodeStep.tsx`

The identifier step owns:

- email/SMS selector state,
- email input,
- disabled SMS/phone presentation,
- request OTP submit,
- password fallback action.

The code step owns:

- 6-digit code input,
- verify submit,
- resend cooldown,
- masked destination display,
- back-to-email action,
- password fallback action.

Shared primitives and shadcn composition:

- use `ToggleGroup` for the Email/SMS selector,
- use `AuthInputField` for the email input,
- use `Button` with lucide icons marked by `data-icon`,
- use `InputOTP`, `InputOTPGroup`, and `InputOTPSlot` for the code,
- use `Spinner` inside buttons for loading states.

The shadcn primitive should be added during implementation with:

```bash
npx shadcn@latest add input-otp
```

Expected result:

- `src/shared/ui/primitives/input-otp.tsx` is added,
- the `input-otp` dependency is added to `package.json`,
- imports use `@/shared/ui/primitives/input-otp`.

## Frontend Data Layer

Add schemas to `src/features/auth/schema.ts`:

- `RequestLoginOtpRequestSchema`
- `RequestLoginOtpResponseSchema`
- `VerifyLoginOtpRequestSchema`
- `OtpChannelSchema`
- `OtpCodeFormSchema`

Add service functions to `src/features/auth/service.ts`:

- `requestLoginOtp`
- `verifyLoginOtp`

The service layer should add `deviceFingerprint` the same way `login` and `register` do today.

Add AuthContext support without weakening the existing password login signature. A small internal helper applies an OTP `LoginResponse` through the existing `applyAuthenticatedState` path. The context exposes these methods:

- `requestLoginOtp(...)`
- `verifyLoginOtp(...)`

`LoginOtpIdentifierStep` calls `requestLoginOtp`. `LoginOtpCodeStep` calls `verifyLoginOtp`. The context handles token persistence after successful verification, so token storage is not duplicated in screen components.

## Backend API Contracts

### Request Email OTP

Endpoint:

```http
POST /api/v1/Auth/login/otp/request
```

Request:

```json
{
  "channel": "email",
  "email": "user@example.com",
  "rememberMe": false,
  "deviceFingerprint": "optional-device-id"
}
```

Response:

```json
{
  "challengeId": "4a1d40be-1e6c-4d9c-b36c-ffed60fd1d7a",
  "channel": "email",
  "maskedDestination": "u***@example.com",
  "expiresIn": 300,
  "resendAvailableIn": 60
}
```

The endpoint returns a generic success response shape. It must not reveal whether the email exists. If the email does not match an eligible user, the backend should not send an email, but it should still respond in a way that does not disclose account existence.

### Verify Email OTP

Endpoint:

```http
POST /api/v1/Auth/login/otp/verify
```

Request:

```json
{
  "challengeId": "4a1d40be-1e6c-4d9c-b36c-ffed60fd1d7a",
  "code": "123456",
  "rememberMe": false,
  "deviceFingerprint": "optional-device-id"
}
```

Response:

```json
{
  "user": {
    "id": "...",
    "email": "user@example.com",
    "name": "User Name",
    "role": "patient",
    "phone": "+216...",
    "avatar": null,
    "countryCode": "TN",
    "createdAt": "2026-05-11T10:00:00Z"
  },
  "token": "...",
  "refreshToken": "...",
  "expiresIn": 900
}
```

This response is the existing `LoginResponse`.

## Backend Data Model

Add a dedicated `LoginOtpChallenge` entity under the Authentication feature.

Fields:

- `Id`
- `UserId`
- `Channel`
- `DestinationHash`
- `CodeHash`
- `ExpiresAt`
- `ConsumedAt`
- `FailedAttempts`
- `LastSentAt`
- `IpAddress`
- `UserAgent`
- `DeviceFingerprint`
- `CreatedAt`

Indexes:

- `UserId`
- `ExpiresAt`
- `ConsumedAt`
- composite index for active lookup by `Id`, `ConsumedAt`, and `ExpiresAt`

The code should be generated with `RandomNumberGenerator`, not `Random`.

The code is stored as an HMAC or other keyed hash using a server-side secret, not as plaintext and not as plain SHA-256. This matters because a six-digit code is easy to brute-force if the database leaks.

Default policy:

- code length: 6 digits,
- expiry: 5 minutes,
- resend cooldown: 60 seconds,
- max failed verify attempts: 5,
- consume challenge after successful verification,
- reject consumed or expired challenges,
- do not allow double-use.

## Backend Services

Add authentication-owned OTP services:

- `ILoginOtpChallengeRepository`
- `LoginOtpChallengeRepository`
- `ILoginOtpCodeHasher`
- `LoginOtpCodeHasher`
- `ILoginOtpCodeGenerator`
- `LoginOtpCodeGenerator`

Add email infrastructure:

- `EmailOptions`
- `IEmailSender`
- `SmtpEmailSender`

`SmtpEmailSender` uses MailKit. It logs delivery success/failure with structured logging, never logs OTP codes or SMTP passwords, and accepts `CancellationToken`.

Add `LoginOtpSettings` options:

- `CodeLength`
- `ExpirationSeconds`
- `ResendCooldownSeconds`
- `MaxFailedAttempts`
- `CodeHashSecret`

Validate options on startup in `Program.cs` the same way `JwtSettings` and `SecuritySettings` are validated.

Register authentication-owned services through `AuthenticationServiceExtensions.cs`. Register and validate `LoginOtpSettings` and `EmailOptions` in `Program.cs`.

## Backend Command Flow

### RequestLoginOtpCommand

The handler should:

1. Normalize the email.
2. Look up the user with profile data.
3. Return a generic response if the user is missing.
4. Return a generic response if the user is inactive, suspended, or a provider account not approved.
5. For eligible users, generate a six-digit code.
6. Hash the code.
7. Store a new `LoginOtpChallenge`.
8. Send the email.
9. Return `RequestLoginOtpResponse`.

The response is generic enough to avoid account enumeration. Logs may state that an OTP request was processed, but they must not log the code or reveal sensitive destination details.

### VerifyLoginOtpCommand

The handler should:

1. Load the challenge and user.
2. Reject expired or consumed challenges.
3. Enforce max failed attempts.
4. Compare the submitted code through the OTP hasher.
5. Increment failed attempts on invalid code.
6. Re-check user active, suspended, and provider approval state.
7. Mark the challenge consumed.
8. Create a `UserSession`.
9. Generate JWT and refresh token.
10. Return `LoginResponse`.

The final session issuance should match password login behavior, including refresh-token hashing, session id claim, device-fingerprint session revocation, avatar URL resolution, and role-specific name construction.

To reduce risk, the first implementation should preserve `LoginUserHandler` behavior. Shared session issuance can be extracted only if it is small, mechanical, and keeps the password endpoint behavior identical.

## Email Template

The first template is French and branded for Sanad.

Content:

- subject: `Sanad - Votre code de connexion`
- greeting,
- large six-digit code,
- expiry text,
- warning not to share the code,
- support hint if the user did not request the code,
- footer with Sanad branding.

The template uses inline styles or a simple HTML layout compatible with email clients. It does not rely on external images, web fonts, or scripts.

## SMS Future Path

SMS is intentionally visible but not functional in this slice.

Frontend behavior:

- SMS tab is shown beside Email.
- It is selectable and shows an inline unavailable message.
- It does not submit an SMS OTP request.
- It does not require phone validation for this slice.

Backend behavior:

- Request DTO accepts only `channel: "email"` for now.
- If `channel: "sms"` is submitted, backend returns `400` with `ApiResponse<object>.ErrorResponse("SMS OTP is not configured yet.")`.

Future SMS work should add an `ISmsSender`, provider options, channel-specific destination validation, rate limits, and delivery/audit behavior.

## Localization And RTL

Add all new auth strings to every existing translation file:

- `fr`
- `en`
- `ar`
- `de`
- `nl`

Likely new keys:

- `auth.otp.emailAddress`
- `auth.otp.phoneNumber`
- `auth.otp.smsUnavailable`
- `auth.otp.continueWithEmail`
- `auth.otp.usePasswordInstead`
- `auth.otp.codeTitle`
- `auth.otp.codeSentTo`
- `auth.otp.verify`
- `auth.otp.resendCode`
- `auth.otp.resendAvailableIn`
- `auth.otp.changeEmail`
- `auth.otp.invalidCode`
- `auth.otp.expiredCode`

Arabic RTL must keep email addresses, phone numbers, and OTP codes readable left-to-right. Use `bdi` around those dynamic values, with `dir="ltr"` on OTP and email/code fragments when needed.

## Error Handling

Identifier step:

- invalid email: local validation error,
- request failed: generic retry message,
- SMS selected: unavailable message.

Code step:

- incomplete code: local validation error,
- invalid code: backend error mapped to `Code invalide ou expiré.`,
- expired challenge: ask user to request a new code,
- too many attempts: disable verify and ask user to request a new code,
- provider pending/rejected: reuse the current professional-account messaging pattern from password login.

The frontend does not expose raw backend stack traces or technical SMTP errors.

## Development Mocking

Real backend mode remains the default.

If mock mode is explicitly enabled through `VITE_ENABLE_MOCK_DATA=true`, MSW should support the OTP flow so the frontend can be exercised locally:

- request endpoint returns a fake challenge id and masked destination,
- verify endpoint accepts a documented dev-only code such as `123456`,
- verify endpoint returns the same mock `LoginResponse` shape as password login.

This mock must stay development-only.

## Verification Plan

Backend:

```bash
dotnet build "Sanad Platform Official.sln"
```

Frontend:

```bash
npm run lint
npm run type-check
npm run build
```

Manual smoke checks:

- patient can request email OTP,
- patient can verify OTP and lands on patient route,
- professional can request email OTP after selecting service,
- approved professional can verify OTP and lands on provider route,
- pending/rejected professional cannot login through OTP,
- invalid code shows error,
- expired code shows retry path,
- resend cooldown prevents immediate resend,
- SMS tab is visible but does not send,
- password fallback still logs in through the existing form,
- RTL layout keeps OTP and email values legible.

## Implementation Sequence

1. Add backend OTP settings and email settings with startup validation.
2. Add `LoginOtpChallenge` entity, configuration, DbSet, repository, and migration.
3. Add OTP generator and hasher services.
4. Add SMTP email sender abstraction and implementation.
5. Add request/verify DTOs, validators, commands, and controller endpoints.
6. Verify backend build.
7. Add shadcn `input-otp`.
8. Add frontend OTP schemas and service methods.
9. Add AuthContext support for applying OTP `LoginResponse`.
10. Add `LoginOtpIdentifierStep` matching the screenshot.
11. Add `LoginOtpCodeStep` using shadcn `InputOTP`.
12. Keep `LoginFormStep` as password fallback.
13. Add i18n keys in all locales.
14. Add MSW handlers for dev-only OTP mock mode.
15. Run frontend lint, type-check, and build.

## Acceptance Criteria

- Email OTP is the default login path after account selection.
- Password login remains available and unchanged as a fallback.
- Patients and approved professionals can log in with email OTP.
- Pending, rejected, inactive, or suspended accounts cannot bypass existing backend checks through OTP.
- SMS is visible in the UI but not functional.
- The OTP identifier screen visually matches the supplied screenshots.
- The OTP code screen uses shadcn `InputOTP`.
- The backend stores only hashed OTP codes.
- Real SMTP credentials are not committed.
- Existing `LoginResponse` and frontend session persistence continue to work.
