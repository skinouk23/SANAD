/**
 * Hooks Index
 * Central export point for all custom React hooks
 */

// ============================================
// API HOOKS (Generic)
// ============================================
export {
  useApi,
  usePaginatedApi,
  useMutation,
  usePolling,
  useDebouncedSearch } from
'./useApi';

// ============================================
// PROVIDER HOOKS
// ============================================
export {
  useProviders,
  usePaginatedProviders,
  useProvider,
  useProvidersByServiceType,
  useProviderSearch,
  useAvailableProviders,
  useTopRatedProviders,
  useProviderAvailability,
  useProviderSchedule } from
'./useProviders';

// ============================================
// APPOINTMENT HOOKS
// ============================================
export {
  useAppointments,
  usePaginatedAppointments,
  useAppointment,
  useUpcomingAppointments,
  useTodayAppointments,
  usePastAppointments,
  useAppointmentStats,
  useCreateAppointment,
  useUpdateAppointment,
  useConfirmAppointment,
  useStartAppointment,
  useCompleteAppointment,
  useCancelAppointment,
  useRateAppointment,
  useAppointmentStatus,
  useAppointmentDateTime } from
'./useAppointments';

// ============================================
// TRANSACTION HOOKS
// ============================================
export {
  useTransactions,
  usePaginatedTransactions,
  useTransaction,
  useProviderTransactions,
  usePatientTransactions,
  useTransactionStats,
  useProviderBalance,
  useCreateTransaction,
  useProcessTransaction,
  useRefundTransaction,
  useRequestPayout,
  useTransactionStatus,
  usePaymentMethod,
  useFormatCurrency,
  useTransactionSummary } from
'./useTransactions';

// ============================================
// ADMIN HOOKS
// ============================================
export {
  useAdminStats,
  useRevenueStats,
  useUserGrowthStats,
  useSystemHealth,
  useSystemMetrics,
  useSystemStatus,
  useAuditLogs,
  usePaginatedAuditLogs,
  useAuditAction,
  useFraudAlerts,
  usePaginatedFraudAlerts,
  useFraudStats,
  useUpdateFraudAlert,
  useFraudSeverity,
  useFraudType,
  useSupportTickets,
  usePaginatedSupportTickets,
  useSupportStats,
  useUpdateSupportTicket,
  useTicketPriority,
  useTicketStatus,
  useTicketCategory } from
'./useAdmin';

// ============================================
// MESSAGE HOOKS
// ============================================
export {
  useConversations,
  useConversation,
  useUnreadCount,
  useMessages,
  useSendMessage,
  useMarkAsRead,
  useCreateConversation,
  useChat,
  useMessageTime,
  useGroupedMessages } from
'./useMessages';

// ============================================
// EQUIPMENT HOOKS
// ============================================
export {
  useEquipment,
  usePaginatedEquipment,
  useEquipmentItem,
  useEquipmentCategories,
  useFeaturedEquipment,
  useEquipmentSearch,
  useEquipmentBookings,
  usePatientEquipmentBookings,
  useCreateEquipmentBooking,
  useUpdateEquipmentBooking,
  useCancelEquipmentBooking,
  useRentalPrice,
  useEquipmentAvailability,
  useBookingStatus,
  useEquipmentCategoryIcon } from
'./useEquipment';

// ============================================
// UTILITY HOOKS
// ============================================
export { useCurrency } from './useCurrency';

// ============================================
// REWARDS HOOKS
// ============================================
export {
  useRewardsProfile,
  useRewardLevels,
  useRecentRewardActivity,
  useEarnPointsActions } from
'./useRewards';

// ============================================
// PHARMACY HOOKS
// ============================================
export { usePharmacyOrders, usePharmacyOrderStats } from './usePharmacy';

// ============================================
// MARKETING HOOKS
// ============================================
export {
  useMarketingCampaigns,
  useMarketingStats,
  useCampaignIdeas } from
'./useMarketing';

// ============================================
// INSURANCE HOOKS
// ============================================
export {
  useInsuranceCoverage,
  useInsuranceClaims,
  useInsuranceDocuments,
  useInsuranceStats } from
'./useInsurance';

// ============================================
// DELIVERY HOOKS
// ============================================
export { useServiceRequest } from './useDelivery';

// ============================================
// EQUIPMENT CATALOG HOOKS
// ============================================
export {
  useEquipmentCategories2,
  useEquipmentCities,
  useEquipmentProviderFilters,
  useCatalogEquipment,
  useEquipmentProviderInfo } from
'./useEquipmentCatalog';

// ============================================
// EQUIPMENT DETAIL HOOKS
// ============================================
export { useEquipmentDetailData } from './useEquipmentDetail';

// ============================================
// ADMIN DASHBOARD HOOKS
// ============================================
export {
  useAdminCountryData,
  useAdminPendingApprovals,
  useAdminRecentTransactions,
  useAdminCountryInstances,
  useAdminRecentActivity } from
'./useAdminDashboard';

// ============================================
// ANALYTICS HOOKS
// ============================================
export { useTopZones, useRevenueData } from './useAnalytics';

// ============================================
// FAMILY CIRCLE HOOKS
// ============================================
export { useFamilyCircle } from './useFamilyCircle';

// ============================================
// LABORATORY HOOKS
// ============================================
export { useLaboratoryList, usePopularTests } from './useLaboratory';

// ============================================
// NUTRITION HOOKS
// ============================================
export {
  useNutritionDietTypes,
  useNutritionZones,
  useNutritionProvidersList } from
'./useNutrition';

// ============================================
// CARE PLAN HOOKS
// ============================================
export {
  useChronicConditions,
  useMedications,
  useCarePlanAppointments,
  useDailyTasks } from
'./useCarePlan';

// ============================================
// NUTRITION TRACKING HOOKS
// ============================================
export {
  useNutritionUserProfile,
  useMealRecommendations,
  useFoodsToAvoid } from
'./useNutritionTracking';

// ============================================
// PATIENT DASHBOARD HOOKS
// ============================================
export {
  usePendingValidations,
  usePatientFamilyMembers } from
'./usePatientDashboard';

// ============================================
// PHARMACY ORDERS HOOKS (Provider)
// ============================================
export { usePharmacyOrdersList } from './usePharmacyOrders';

// ============================================
// CAMPAIGN DETAILS HOOKS
// ============================================
export {
  useCampaignDetail,
  useCampaignPerformance,
  useCampaignAudience } from
'./useCampaignDetails';

// ============================================
// SERVICE SELECTION HOOKS
// ============================================
export { useServicesList, useServiceFilters } from './useServiceSelection';

// ============================================
// ADMIN TRANSACTIONS HOOKS
// ============================================
export {
  useAdminTransactions,
  useTransactionSummary as useAdminTransactionSummary,
  useInitiateTransfer } from
'./useAdminTransactions';

// ============================================
// ADMIN SUBSCRIPTIONS HOOKS
// ============================================
export { useSubscriptionData } from './useAdminSubscriptions';

// ============================================
// ADMIN ACTIVITY HOOKS
// ============================================
export { useUpcomingActions, useRecentActivity } from './useAdminActivity';