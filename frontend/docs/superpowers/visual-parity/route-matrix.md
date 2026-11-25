# Visual Parity Route Matrix

## Purpose

This matrix enumerates current non-admin routes for Slice 1 visual parity planning. It maps each current route to its current module, auth state, likely legacy counterpart, visual family, and decision notes.

The running legacy app is still the visual source of truth. Legacy counterparts in this matrix are capture targets to verify at runtime, not final implementation instructions.

## Matrix Rules

| Rule | Value |
| --- | --- |
| Source app | `http://localhost:5174/` |
| Target app | `http://localhost:5173/` |
| Admin | Out of scope. Do not add or audit admin routes. |
| First language | French |
| RTL check | Arabic smoke checks on layout-sensitive routes |
| Themes | Dark and light |
| Viewports | 1440x900, 1024x768, 390x844, 360x800 |
| Passwords | Never store passwords or reusable credentials in this matrix or evidence |
| Conflicts | Ask immediately |
| Assistant/dock | Route-specific per VP-D019: capture current assistant/dock presence first; ask before adding missing legacy chatbot, voice assistant, or dock behavior to any route. |

Auth state values:

| Auth state | Meaning |
| --- | --- |
| Public | Anonymous user can reach the route in the current router |
| Patient | Current route is behind the patient guard |
| Provider | Current route is behind the provider guard |
| Patient or provider | Current route is behind the shared patient/provider guard |
| Needs decision | Route/state needs user confirmation before parity work |

## Public/Auth

| Current path | Current module | Auth state | Legacy counterpart | Visual family | Decision notes |
| --- | --- | --- | --- | --- | --- |
| `/` | `LandingPage` | Public | Legacy `/` | Cyber public landing | Capture hero, fixed header, service/category cards, CTAs, background orbs/grid, light and dark. |
| `/services` | `ServiceSelectionPage` | Public | Legacy `/services` | Cyber service discovery | Capture service category grid, icon gradients, cards, search/filter if present. |
| `/how-it-works` | `HowItWorksPage` | Public | Legacy `/how-it-works` | Cyber public explainer | Capture section rhythm, step cards, CTA blocks, timeline/number styling. |
| `/subscriptions` | `SubscriptionsPage` | Public | Legacy `/subscriptions` | Cyber pricing/subscription | Capture pricing cards, badges, comparison surfaces, CTA buttons. |
| `/auth/onboarding` | `OnboardingPage` | Public | Legacy `/auth/onboarding` | Cyber auth/onboarding | Verify whether authenticated users can still access; capture mobile onboarding layout. |
| `/auth/login` | `LoginPage` | Public | Legacy `/auth/login` | Cyber auth form | Capture form chrome without passwords; include empty, invalid, loading, and provider-button states where safe. |
| `/auth/signup` | `SignUpPage` | Public | Legacy `/auth/signup` | Cyber auth form | Capture role choice, form controls, terms/consent text, validation styles. |
| `/auth/signup/professional` | `ProfessionalSignUpPage` | Public | Legacy `/auth/signup/professional` | Cyber provider signup | Capture long form, role-specific fields, upload/dropzone if present. |
| `/auth/signup/equipment` | `EquipmentSignUpPage` | Public | Legacy `/auth/signup/equipment` | Cyber provider signup | Confirm exact legacy route and visual variant for equipment providers. |
| `/auth/signup/laboratory` | `LaboratorySignUpPage` | Public | Legacy `/auth/signup/laboratory` | Cyber provider signup | Confirm exact legacy route and visual variant for laboratory providers. |
| `/auth/signup/radiology` | `RadiologySignUpPage` | Public | Legacy `/auth/signup/radiology` | Cyber provider signup | Confirm exact legacy route and visual variant for radiology providers. |
| `/auth/signup/pharmacy` | `PharmacySignUpPage` | Public | Legacy `/auth/signup/pharmacy` | Cyber provider signup | Confirm exact legacy route and visual variant for pharmacy providers. |
| `/auth/signup/funeral` | `FuneralSignUpPage` | Public | Legacy `/auth/signup/funeral` | Cyber provider signup | Confirm exact legacy route and visual variant for funeral providers. |
| `/auth/signup/veterinary` | `VeterinarySignUpPage` | Public | Legacy `/auth/signup/veterinary` | Cyber provider signup | Confirm exact legacy route and visual variant for veterinary providers. |
| `/auth/signup/gym` | `GymSignUpPage` | Public | Legacy `/auth/signup/gym` | Cyber provider signup | Confirm exact legacy route and visual variant for gym providers. |

## Services/Bookings

| Current path | Current module | Auth state | Legacy counterpart | Visual family | Decision notes |
| --- | --- | --- | --- | --- | --- |
| `/equipment` | `EquipmentCatalogPage` | Public | Legacy `/equipment` | Cyber equipment catalog | Capture catalog cards, filters, price/status chips, empty/loading states. |
| `/equipment/:id` | `EquipmentDetailPage` | Patient | Legacy `/equipment/:id` | Cyber equipment detail | Requires patient state; confirm legacy auth behavior and dynamic seeded ID. |
| `/laboratory` | `LaboratoryPage` | Public | Legacy `/laboratory` | Cyber service provider listing | Capture provider cards, metadata badges, actions, empty/loading states. |
| `/radiology` | `RadiologyPage` | Public | Legacy `/radiology` | Cyber service provider listing | Capture imaging-specific cards and booking CTAs. |
| `/pharmacy` | `PharmacyPage` | Public | Legacy `/pharmacy` | Cyber service provider listing | Capture pharmacy order/listing visuals and status chips. |
| `/funeral` | `FuneralServicesPage` | Public | Legacy `/funeral` | Cyber service provider listing | Capture sensitive-service visual tone and card hierarchy. |
| `/veterinary` | `VeterinaryPage` | Public | Legacy `/veterinary` | Cyber service provider listing | Capture provider cards and animal-service iconography. |
| `/nutrition-providers` | `NutritionProvidersPage` | Public | Legacy `/nutrition-providers` | Cyber service provider listing | Confirm whether legacy path matches or uses `/nutrition`. |
| `/ambulance` | `AmbulanceServicePage` | Public | Legacy `/ambulance` | Cyber urgent service listing | Capture urgency badges, CTA styling, emergency visual treatment. |
| `/care/:serviceId` | `CareServicePage` | Public | Legacy `/care/:serviceId` | Cyber care service detail/listing | Requires seeded service ID; confirm legacy service taxonomy and cards. |
| `/gym` | `Gym` | Public | Legacy `/gym` | Cyber service provider listing | Confirm legacy visual family for fitness/wellness providers. |
| `/equipment/booking/:equipmentId` | `EquipmentBookingPage` | Patient | Legacy `/equipment/booking/:equipmentId` | Cyber booking flow | Requires seeded equipment ID; capture steps, form controls, summary card, confirmation/error states. |
| `/laboratory/booking/:providerId` | `LaboratoryBookingPage` | Patient | Legacy `/laboratory/booking/:providerId` | Cyber booking flow | Requires seeded provider ID; capture date/time picker and service options. |
| `/radiology/booking/:providerId` | `RadiologyBookingPage` | Patient | Legacy `/radiology/booking/:providerId` | Cyber booking flow | Requires seeded provider ID; capture exam selection and schedule controls. |
| `/pharmacy/booking/:providerId` | `PharmacyBookingPage` | Patient | Legacy `/pharmacy/booking/:providerId` | Cyber booking/order flow | Confirm whether legacy is appointment booking or order flow. |
| `/funeral/booking/:providerId` | `FuneralBookingPage` | Patient | Legacy `/funeral/booking/:providerId` | Cyber booking flow | Capture long-form sensitive service fields; ask if tone differs. |
| `/veterinary/booking/:providerId` | `VeterinaryBookingPage` | Patient | Legacy `/veterinary/booking/:providerId` | Cyber booking flow | Capture pet details fields and provider summary. |
| `/nutrition/booking/:providerId` | `NutritionBookingPage` | Patient | Legacy `/nutrition/booking/:providerId` | Cyber booking flow | Current listing path is `/nutrition-providers`; confirm legacy path pair. |
| `/ambulance/booking/:providerId` | `AmbulanceBookingPage` | Patient | Legacy `/ambulance/booking/:providerId` | Cyber urgent booking flow | Capture emergency priority/urgent CTA treatment. |
| `/care/:serviceId/booking/:providerId` | `CareBookingPage` | Patient | Legacy `/care/:serviceId/booking/:providerId` | Cyber booking flow | Requires seeded service and provider IDs; confirm back-link behavior. |
| `/gym/booking/:providerId` | `GymBooking` | Patient | Legacy `/gym/booking/:providerId` | Cyber booking flow | Confirm exact legacy path and wellness-specific fields. |

## Patient

| Current path | Current module | Auth state | Legacy counterpart | Visual family | Decision notes |
| --- | --- | --- | --- | --- | --- |
| `/patient-dashboard` | `PatientDashboardPage` | Patient | Legacy `/patient-dashboard` | Cyber patient dashboard | Capture shell, stat cards, quick actions, appointment cards, bottom nav state. |
| `/patient/profile` | `PatientProfilePage` | Patient | Legacy `/patient-dashboard` chrome plus legacy auth/signup forms | Hybrid patient account/profile | Use patient dashboard cockpit chrome for profile container/summary sections; use legacy auth/signup form styling for editable profile/form sections. |
| `/mon-espace` | `PatientAppointmentsPage` | Patient | Legacy `/mon-espace` | Cyber patient appointments | Capture appointment list, status chips, tabs/filters, empty states. |
| `/medicaments` | `PatientMedicationsPage` | Patient | Legacy `/medicaments` | Cyber patient medications | Capture medication cards, schedule/status badges, donation CTA. |
| `/donation-medicaments` | `MedicationDonationPage` | Patient | Legacy `/donation-medicaments` | Cyber donation flow | Capture form, inventory cards, compliance messaging, success/error states. |
| `/tracking/:appointmentId` | `TrackingPage` | Patient | Legacy `/tracking/:appointmentId` | Cyber live tracking | Requires seeded appointment ID; capture map/timeline/status treatment if present. |
| `/health` | `HealthTracking` | Patient | Legacy `/health` | Cyber health dashboard | Capture metrics cards, charts/progress, health navigation. |
| `/health/activity` | `ActivityTracking` | Patient | Legacy `/health/activity` first | Hybrid-by-route health detail | VP-D018: capture the exact legacy route first; ask route by route if missing evidence or older/non-cyber styling conflicts with cyber consistency. |
| `/health/hydration` | `HydrationTracking` | Patient | Legacy `/health/hydration` first | Hybrid-by-route health detail | VP-D018: capture the exact legacy route first; ask route by route if missing evidence or older/non-cyber styling conflicts with cyber consistency. |
| `/health/nutrition` | `NutritionTracking` | Patient | Legacy `/health/nutrition` first | Hybrid-by-route health detail | VP-D018: capture the exact legacy route first; ask route by route if missing evidence or older/non-cyber styling conflicts with cyber consistency. |
| `/health/nutrition/profile` | `NutritionProfile` | Patient | Exact legacy nutrition profile first | Hybrid-by-route health form/profile | VP-D018: capture the exact legacy route/form first; ask route by route if missing evidence or older/non-cyber styling conflicts with cyber consistency. |
| `/health-concierge` | `HealthConcierge` | Patient | Legacy `/health-concierge` | Cyber concierge hub | Capture concierge cards, assistant-like affordances, CTAs. |
| `/concierge/coordinate-appointment` | `CoordinateAppointment` | Patient | Exact legacy concierge appointment flow first | Hybrid-by-route concierge form | VP-D018: capture the exact legacy flow first; ask route by route if missing evidence or older/non-cyber styling conflicts with cyber consistency. |
| `/concierge/manage-documents` | `ManageDocuments` | Patient | Exact legacy concierge documents flow first | Hybrid-by-route document manager | VP-D018: capture the exact legacy flow first, including upload/dropzone visuals; ask route by route if missing evidence or older/non-cyber styling conflicts with cyber consistency. |
| `/concierge/care-plan` | `CarePlan` | Patient | Exact legacy concierge care plan flow first | Hybrid-by-route care plan | VP-D018: capture the exact legacy flow first; ask route by route if missing evidence or older/non-cyber styling conflicts with cyber consistency. |
| `/concierge/emergency` | `EmergencyHealth` | Patient | Exact legacy concierge emergency flow first | Hybrid-by-route emergency/health flow | VP-D018: capture the exact legacy flow first; ask route by route when urgency styling, accessibility needs, or older/non-cyber styling conflict with cyber consistency. |

## Provider

| Current path | Current module | Auth state | Legacy counterpart | Visual family | Decision notes |
| --- | --- | --- | --- | --- | --- |
| `/provider-dashboard` | `ProviderDashboardPage` | Provider | Legacy `/provider-dashboard` | Cyber provider dashboard | Capture shell, stat cards, service cards, schedule/requests, bottom nav state. |
| `/provider/profile` | `ProviderProfilePage` | Provider | Legacy `/provider-dashboard` chrome plus legacy auth/signup forms | Hybrid provider account/profile | Use provider dashboard cockpit chrome for profile container/summary sections; use legacy auth/signup form styling for editable profile/form sections. |
| `/provider/services` | `ServiceManagementPage` | Provider | Legacy `/provider/services` | Cyber provider services | Capture management table/cards, status badges, actions, empty/loading states. |
| `/provider/services/new` | `NewServicePage` | Provider | Legacy `/provider/services/new` | Cyber provider service form | Capture form fields, validation, category chips, submit states. |
| `/provider/schedule` | `ScheduleManagementPage` | Provider | Legacy `/provider/schedule` | Cyber schedule/calendar | Capture calendar/list density, available/unavailable states, controls. |
| `/provider/balance` | `BalanceManagementPage` | Provider | Legacy `/provider/balance` | Cyber finance/balance | VP-D017 canonical finance source. Capture cards, wallet totals, payout controls, status badges. |
| `/provider/transactions` | `TransactionHistoryPage` | Provider | Legacy `/provider/transactions` | Cyber finance table/list | VP-D017 canonical finance source. Capture transaction table/list density, filters, status cells, and empty states. |
| `/provider/analytics` | `AnalyticsPage` | Provider | Legacy `/provider/analytics` | Cyber analytics | VP-D017 canonical finance source. Capture chart visual treatment, metric cards, legends, and filters. |
| `/provider/pharmacy-orders` | `PharmacyOrdersPage` | Provider | Legacy `/provider/pharmacy-orders` | Cyber provider operations | Capture order cards/table, statuses, action buttons. |
| `/provider/active-delivery/:appointmentId` | `ActiveDeliveryPage` | Provider | Legacy `/provider/active-delivery/:appointmentId` | Cyber delivery/tracking | Requires seeded appointment ID; capture status/timeline/map if present. |
| `/provider/marketing` | `MarketingCampaigns` | Provider | Legacy `/provider/marketing` | Cyber marketing list | Capture campaign cards, metrics, filters, CTA. |
| `/provider/marketing/new` | `NewCampaign` | Provider | Legacy `/provider/marketing/new` | Cyber marketing form | Capture form controls, preview panels, validation states. |
| `/provider/marketing/:id` | `CampaignDetails` | Provider | Legacy `/provider/marketing/:id` | Cyber marketing details | Requires seeded campaign ID; capture detail metrics and action surfaces. |
| `/provider/insurance` | `Insurance` | Provider | Legacy `/provider/insurance` | Cyber insurance hub | Capture policy/claim cards and status chips. |
| `/provider/insurance/file-claim` | `FileClaim` | Provider | Legacy `/provider/insurance/file-claim` | Cyber insurance form | Capture form, file upload, progress, validation states. |
| `/provider/billing` | `Billing` | Provider | Legacy `/provider/billing` | Cyber billing | Capture invoice/payment cards, tables, actions. |

## Shared/Messaging/Help

| Current path | Current module | Auth state | Legacy counterpart | Visual family | Decision notes |
| --- | --- | --- | --- | --- | --- |
| `/messages` | `MessagesPage` | Patient or provider | Legacy `/messages` | Cyber messaging inbox | Capture patient and provider variants if role changes visible content. |
| `/messages/:conversationId` | `MessageChatPage` | Patient or provider | Legacy `/messages/:conversationId` | Cyber chat | Requires seeded conversation ID; capture bubbles, composer, timestamps, unread state. |
| `/aide` | `HelpPage` | Patient or provider | Legacy `/aide` in authenticated patient/provider states | Guarded shared help/support | VP-D016: keep `/aide` guarded. Capture and match legacy help only for patient and provider authenticated states, not as public help. |

Removed route note: `/notifications` was removed from the active route matrix by VP-D033; notification API mocks and shared toast utilities may remain for non-route runtime support.

Shared overlay note: assistant, chatbot, voice assistant, and dock parity is not global shell parity by default. Record whether each route currently renders the assistant/dock and ask for route-level approval before introducing missing legacy assistant behavior.

## Unmatched/Needs Decision

| Current path or surface | Current module | Auth state | Legacy counterpart | Visual family | Decision notes |
| --- | --- | --- | --- | --- | --- |
| `*` | `NotFoundPage` | Public or authenticated, depending on attempted path | Legacy 404/not-found surface | Cyber error/fallback | Capture current unmatched route and legacy equivalent if present; confirm copy and visual tone. |
| Route error boundary | `RouteErrorPage` | Depends on failing route | Legacy route error/fallback surface | Cyber error/fallback | Needs induced error state only if safe; do not break implementation for capture. |
| App error fallback | `ErrorFallback` | Depends on failing app state | Legacy app error/fallback surface | Cyber error/fallback | Needs decision on whether runtime error surfaces are part of Slice 1 screenshots. |
| Public help | No current public route discovered | Out of current parity scope | None for Slice 1 | Not a public help target | Resolved by VP-D016: `/aide` remains guarded shared help. Do not capture or visually match public help unless a future product decision adds a public route. |
| Health detail subroutes | `ActivityTracking`, `HydrationTracking`, `NutritionTracking`, `NutritionProfile` | Patient | Exact legacy route first; nearest `/health` family only after per-route approval | Hybrid-by-route health detail | VP-D018: capture exact legacy first, then ask the user route by route when the exact route is missing or older/non-cyber styling conflicts with cyber consistency. |
| Concierge subroutes | `CoordinateAppointment`, `ManageDocuments`, `CarePlan`, `EmergencyHealth` | Patient | Exact legacy flow first; nearest `/health-concierge` family only after per-route approval | Hybrid-by-route concierge detail | VP-D018: capture exact legacy first, then ask the user route by route when the exact route is missing or older/non-cyber styling conflicts with cyber consistency. |
