# API Integration Guide

This document provides a comprehensive guide for integrating APIs into all pages of the Sanad application.

> Status: archival reference for the pre-feature-slice API integration plan.
> Unless a section says otherwise, the checklists and examples below describe the older `services/` plus `hooks/` migration path and are not the current source of truth for Block 12 completion.

## Current Block 12 Reality

- Admin dashboard, system health, fraud, audit, support, and related route entry modules now compose from `src/features/admin`.
- Provider operations screens such as approvals, document verification, provider lifecycle, and provider admin now compose from `src/features/admin/provider-operations`, with thin route entry modules in `src/pages/admin/`.
- Provider finance screens such as provider balances, transaction payment hub, transaction management, commission cancellations, and provider history now compose from `src/features/admin/provider-finance`, with thin route entry modules in `src/pages/admin/`.
- Treat any unchecked admin or provider checklist items later in this document as historical migration notes, not current pending Block 12 work.

## ✅ Completed Infrastructure

### Services Created
- `services/users.service.ts` - Patient & Provider CRUD operations
- `services/appointments.service.ts` - Appointment management
- `services/transactions.service.ts` - Payment & balance operations
- `services/admin.service.ts` - Analytics, audit logs, fraud detection, support tickets
- `services/messages.service.ts` - Conversations and messaging
- `services/equipment.service.ts` - Equipment rental management

### Hooks Created
- `hooks/useApi.ts` - Generic hooks (useApi, usePaginatedApi, useMutation, usePolling)
- `hooks/useAppointments.ts` - Appointment-specific hooks
- `hooks/useTransactions.ts` - Transaction-specific hooks
- `hooks/useAdmin.ts` - Admin dashboard hooks
- `hooks/useMessages.ts` - Messaging hooks
- `hooks/useEquipment.ts` - Equipment rental hooks

### Types Created
- `types/api.types.ts` - Comprehensive type definitions for all entities

### Mock Data
- `data/mock/generators.ts` - Realistic Tunisian data generators

## ✅ Pages Already Integrated

### Patient Pages
- `CyberPatientDashboard.tsx` - ✅ Integrated with useUpcomingAppointments, useApi

### Provider Pages
- `CyberProviderDashboard.tsx` - ✅ Integrated with useTodayAppointments, useProviderBalance, useTransactionStats
- `CyberTransactionHistory.tsx` - ✅ Integrated with usePaginatedTransactions, useTransactionStats

### Admin Pages
- `AnalyticsDashboard.tsx` - ✅ Integrated with useAdminStats, useSystemHealth, useRevenueStats
- `UserManagement.tsx` - ✅ Integrated with useAdminStats, usePaginatedApi for users

## 📋 Integration Pattern

### Step 1: Import Required Hooks and Services

```typescript
import { useApi, usePaginatedApi, useMutation } from '../hooks/useApi'
import { useAppointments, useAppointmentStatus } from '../hooks/useAppointments'
import { appointmentsService } from '../services/appointments.service'
import type { Appointment } from '../types/api.types'
```

### Step 2: Replace Hardcoded Data with API Calls

**Before (hardcoded):**
```typescript
const appointments = [
  { id: 1, name: 'Dr. Ahmed', time: '10:00', status: 'confirmed' },
  { id: 2, name: 'Dr. Sara', time: '14:00', status: 'pending' },
]
```

**After (API integrated):**
```typescript
const { data: appointments, loading, error, refetch } = useAppointments({
  status: ['confirmed', 'pending'],
  upcoming: true,
})
```

### Step 3: Add Loading States

```typescript
if (loading) {
  return <LoadingSkeleton />
}

if (error) {
  return <ErrorMessage error={error} onRetry={refetch} />
}

return (
  <div>
    {appointments?.map(apt => (
      <AppointmentCard key={apt.id} appointment={apt} />
    ))}
  </div>
)
```

### Step 4: Use Mutation Hooks for Actions

```typescript
const { mutate: cancelAppointment, loading: cancelling } = useCancelAppointment()

const handleCancel = async (appointmentId: string) => {
  try {
    await cancelAppointment({ id: appointmentId, reason: 'User requested' })
    refetch() // Refresh the list
  } catch (error) {
    // Handle error
  }
}
```

## 📋 Legacy Snapshot - Remaining Pages to Integrate

Historical checklist from the older page-by-page integration pass. It is retained for reference only.

### Admin Pages (High Priority)
- [ ] `SupportTickets.tsx` - Use `useSupportTickets`, `useSupportStats`
- [ ] `FraudDashboard.tsx` - Use `useFraudAlerts`, `useFraudStats`
- [ ] `AuditLogs.tsx` - Use `usePaginatedAuditLogs`
- [ ] `SystemHealth.tsx` - Use `useSystemHealth`, `useSystemMetrics`
- [ ] `TransactionManagement.tsx` - Use `usePaginatedTransactions`
- [ ] `ApprovalManagement.tsx` - Use providers service for pending approvals
- [ ] `DocumentVerification.tsx` - Use admin service
- [ ] `ProviderBalanceManagement.tsx` - Use `useProviderBalance`
- [ ] `SubscriptionManagement.tsx` - Create subscriptions service

### Provider Pages (High Priority)
- [ ] `CyberAnalytics.tsx` - Use `useTransactionStats`, `useAppointmentStats`
- [ ] `CyberBalanceManagement.tsx` - Use `useProviderBalance`, `useRequestPayout`
- [ ] `CyberScheduleManagement.tsx` - Use `useProviderSchedule`, appointments service
- [ ] `CyberServiceManagement.tsx` - Create services management service
- [ ] `CyberPharmacyOrders.tsx` - Create orders service

### Patient Pages (Medium Priority)
- [ ] `CyberMessages.tsx` - Use `useConversations`, `useUnreadCount`
- [ ] `CyberMessageChat.tsx` - Use `useChat`, `useMessages`
- [ ] `CyberMonEspace.tsx` - Use `useUpcomingAppointments`, `usePastAppointments`
- [ ] `CyberEquipmentCatalog.tsx` - Use `usePaginatedEquipment`, `useEquipmentCategories`
- [ ] `CyberEquipmentDetail.tsx` - Use `useEquipmentItem`, `useRentalPrice`
- [ ] `CyberEquipmentBooking.tsx` - Use `useCreateEquipmentBooking`

### Booking Pages (Medium Priority)
- [ ] `CyberCareBooking.tsx` - Use `useProviders`, `useCreateAppointment`
- [ ] `CyberLaboratoryBooking.tsx` - Use providers service
- [ ] `CyberRadiologyBooking.tsx` - Use providers service
- [ ] `CyberPharmacyBooking.tsx` - Use providers service
- [ ] `CyberNutritionBooking.tsx` - Use providers service
- [ ] `CyberAmbulanceBooking.tsx` - Use providers service

### Service Selection Pages (Completed)
- [x] `CyberServiceSelection.tsx` - ✅ Integrated with useServices
- [x] `CyberCareService.tsx` - ✅ Integrated with useCareProviders, useServiceByType
- [x] `CyberAmbulanceService.tsx` - ✅ Integrated with useAmbulanceProviders
- [x] `CyberNutritionProviders.tsx` - ✅ Integrated with useNutritionProviders
- [x] `CyberLaboratory.tsx` - ✅ Integrated with useLaboratories
- [x] `CyberRadiology.tsx` - ✅ Integrated with useRadiologyCenters
- [x] `CyberPharmacy.tsx` - ✅ Integrated with usePharmacies
- [x] `CyberFuneralServices.tsx` - ✅ Integrated with useFuneralServices
- [x] `Gym.tsx` - ✅ Integrated with useGyms

## 🔧 Quick Integration Examples

### For Provider List Pages

```typescript
import { useProvidersByServiceType } from '../hooks/useProviders'

export function CyberNutritionProviders() {
  const { data: providers, loading, error } = useProvidersByServiceType('nutritionist')
  
  if (loading) return <ProvidersSkeleton />
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {providers?.map(provider => (
        <ProviderCard key={provider.id} provider={provider} />
      ))}
    </div>
  )
}
```

### For Booking Pages

```typescript
import { useCreateAppointment } from '../hooks/useAppointments'
import { useProvider } from '../hooks/useProviders'

export function BookingPage({ providerId }: { providerId: string }) {
  const { data: provider } = useProvider(providerId)
  const { mutate: createAppointment, loading: booking } = useCreateAppointment()
  
  const handleBook = async (data: BookingFormData) => {
    const appointment = await createAppointment({
      providerId,
      patientId: currentUser.id,
      serviceId: data.serviceId,
      scheduledAt: data.dateTime,
      address: data.address,
    })
    
    if (appointment) {
      navigate(`/appointments/${appointment.id}`)
    }
  }
  
  return <BookingForm provider={provider} onSubmit={handleBook} loading={booking} />
}
```

### For Messages Pages

```typescript
import { useConversations, useChat } from '../hooks/useMessages'

export function MessagesPage() {
  const { data: conversations, loading } = useConversations()
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null)
  
  return (
    <div className="flex">
      <ConversationList 
        conversations={conversations} 
        loading={loading}
        onSelect={setSelectedConvId}
      />
      {selectedConvId && (
        <ChatPanel conversationId={selectedConvId} />
      )}
    </div>
  )
}

function ChatPanel({ conversationId }: { conversationId: string }) {
  const { messages, loading, send, sending } = useChat(conversationId, currentUserId)
  
  return (
    <div>
      <MessageList messages={messages} loading={loading} />
      <MessageInput onSend={send} disabled={sending} />
    </div>
  )
}
```

### For Equipment Pages

```typescript
import { usePaginatedEquipment, useEquipmentCategories } from '../hooks/useEquipment'

export function EquipmentCatalog() {
  const { data: categories } = useEquipmentCategories()
  const { 
    data: equipment, 
    loading, 
    pagination,
    filters,
    setFilters,
    nextPage,
    prevPage,
  } = usePaginatedEquipment({ page: 1, limit: 12 })
  
  return (
    <div>
      <CategoryFilter 
        categories={categories} 
        selected={filters.category}
        onSelect={(cat) => setFilters({ category: cat })}
      />
      <EquipmentGrid equipment={equipment} loading={loading} />
      <Pagination 
        pagination={pagination}
        onNext={nextPage}
        onPrev={prevPage}
      />
    </div>
  )
}
```

## 🎯 Best Practices

1. **Always handle loading states** - Show skeletons or spinners
2. **Always handle errors** - Display user-friendly error messages with retry options
3. **Use TypeScript types** - Import types from `types/api.types.ts`
4. **Refetch after mutations** - Call `refetch()` after create/update/delete operations
5. **Use pagination** - For lists with many items, use `usePaginatedApi`
6. **Debounce search** - Use `useDebouncedSearch` for search inputs
7. **Poll for real-time data** - Use `usePolling` for system health, notifications

## 🔄 Mock Data Mode

The services automatically use mock data when `ENABLE_MOCK_DATA=true` in `config/env.ts`. This allows development without a backend.

To switch to real API:
1. Set `ENABLE_MOCK_DATA=false` in `config/env.ts`
2. Set `API_BASE_URL` to your backend URL
3. Ensure your backend implements the expected endpoints

## 📝 Adding New Services

1. Create service file in `services/`
2. Create hooks file in `hooks/`
3. Export from `services/index.ts` and `hooks/index.ts`
4. Add types to `types/api.types.ts`
5. Add mock data generators to `data/mock/generators.ts`
