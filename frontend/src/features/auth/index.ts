/**
 * Auth Feature — public API
 */

export {
  login,
  logout,
  register,
  refreshToken,
  getProfile,
  toAuthUser,
  authService,
  DEFAULT_PATIENT_ADDRESS,
} from './service';

export type {
  AuthUser,
  UserRole,
  UserAddress,
  LoginResponse,
  LoginUserResponse,
  LogoutRequest,
  ProviderRegistrationDocumentReference,
  RefreshTokenRequest,
  RegistrationResponse,
  RegisterUserRequest,
  RegisterUserRequestInput,
  UserResponse,
} from './service';

export { updateAccountProfile, accountService } from './account-service';
export type { UpdateAccountProfileRequest } from './account-service';
export {
  getSecurityOverview,
  changePassword,
  revokeSession,
  revokeOtherSessions,
  deleteAccount,
  securityService,
} from './security-service';
export { authKeys } from './keys';
export { authProfileOptions, authSecurityOptions } from './options';
export {
  AuthSelectField,
  AuthCheckboxField,
  AuthInputField,
  PasswordStrengthMeter,
  PasswordToggle,
} from './components/AuthFormControls';
export { AuthPanel, AuthShell } from './components/AuthShell';
export { AccountSecuritySection } from './components/AccountSecuritySection';
export {
  SpecializedProviderAccountSignUpPage,
  SpecializedReviewRequestPage,
} from './components/SpecializedSignUpFlows';
export { uploadProviderSignupDocuments } from './providerSignupDocuments';
export type {
  ProviderSignupDocumentUploadBatchResult,
  ProviderSignupDocumentUploadInput,
} from './providerSignupDocuments';
export { LoginScreen, LoginScreen as LoginPage } from './screens/LoginScreen';
export { OnboardingScreen, OnboardingScreen as OnboardingPage } from './screens/OnboardingScreen';
export { SignUpScreen, SignUpScreen as SignUpPage } from './screens/SignUpScreen';
export {
  ProfessionalSignUpScreen,
  ProfessionalSignUpScreen as ProfessionalSignUpPage,
} from './screens/ProfessionalSignUpScreen';
export {
  ProviderPendingApprovalScreen,
  ProviderPendingApprovalScreen as ProviderPendingApprovalPage,
} from './screens/ProviderPendingApprovalScreen';
export {
  useProfile,
  useLogin,
  useRegister,
  useRefreshToken,
  useUpdateAccountProfile,
  useAvatarUpload,
  useAccountSecurity,
  useChangePassword,
  useDeleteAccount,
  useRevokeSession,
  useRevokeOtherSessions,
} from './hooks';

export * from './schema';
