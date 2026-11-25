/**
 * Services Index
 * Central export point for all API services
 */

// ============================================
// PROVIDERS SERVICE
// ============================================
export {
  providersService,
  getProviders,
  getProvidersPaginated,
  getProviderById,
  getProvidersByServiceType,
  searchProviders,
  getAvailableProviders,
  getTopRatedProviders,
  getNearbyProviders,
  updateProviderAvailability,
  getProviderSchedule } from
'./providers.service';

// ============================================
// USERS SERVICE
// ============================================
export {
  usersService,
  getPatients,
  getPatientsPaginated,
  getPatientById,
  getCurrentPatient,
  updatePatient,
  getProvidersList,
  getProvidersPaginatedList,
  getProviderByIdFromService,
  getCurrentProvider,
  updateProvider,
  updateProviderAvailabilityStatus,
  getAllUsers,
  getUsersPaginated,
  suspendUser,
  activateUser } from
'./users.service';
export type { UserFilters, ProviderFilters } from './users.service';

// ============================================
// APPOINTMENTS SERVICE
// ============================================
export {
  appointmentsService,
  getAppointments,
  getAppointmentsPaginated,
  getAppointmentById,
  getUpcomingAppointments,
  getTodayAppointments,
  getPastAppointments,
  createAppointment,
  updateAppointment,
  confirmAppointment,
  startAppointment,
  completeAppointment,
  cancelAppointment,
  rateAppointment,
  getAppointmentStats } from
'./appointments.service';
export type {
  AppointmentFilters,
  AppointmentStats } from
'./appointments.service';

// ============================================
// TRANSACTIONS SERVICE
// ============================================
export {
  transactionsService,
  getTransactions,
  getTransactionsPaginated,
  getTransactionById,
  getProviderTransactions,
  getPatientTransactions,
  createTransaction,
  processTransaction,
  refundTransaction,
  getTransactionStats,
  getProviderBalance,
  requestPayout } from
'./transactions.service';
export type {
  TransactionFilters,
  TransactionStats,
  ProviderBalance } from
'./transactions.service';

// ============================================
// ADMIN SERVICE
// ============================================
export {
  adminService,
  getAdminStats,
  getRevenueStats,
  getUserGrowthStats,
  getSystemHealth,
  getSystemMetrics,
  getAuditLogs,
  getAuditLogsPaginated,
  getFraudAlerts,
  getFraudAlertsPaginated,
  updateFraudAlert,
  getFraudStats,
  getSupportTickets,
  getSupportTicketsPaginated,
  updateSupportTicket,
  getSupportStats } from
'./admin.service';
export type {
  AuditLogFilters,
  FraudAlertFilters,
  SupportTicketFilters } from
'./admin.service';

// ============================================
// MESSAGES SERVICE
// ============================================
export {
  messagesService,
  getConversations,
  getConversationById,
  getUnreadCount,
  getMessages,
  sendMessage,
  markAsRead,
  createConversation } from
'./messages.service';
export type { ConversationFilters } from './messages.service';

// ============================================
// EQUIPMENT SERVICE
// ============================================
export {
  equipmentService,
  getEquipmentList,
  getEquipmentPaginated,
  getEquipmentById,
  getEquipmentCategories,
  getFeaturedEquipment,
  getEquipmentBookings,
  createEquipmentBooking,
  updateEquipmentBooking,
  cancelEquipmentBooking } from
'./equipment.service';
export type { EquipmentFilters, BookingFilters } from './equipment.service';

// ============================================
// DEFAULT EXPORTS
// ============================================
export { default as providersServiceDefault } from './providers.service';
export { default as usersServiceDefault } from './users.service';
export { default as appointmentsServiceDefault } from './appointments.service';
export { default as transactionsServiceDefault } from './transactions.service';
export { default as messagesServiceDefault } from './messages.service';
export { default as equipmentServiceDefault } from './equipment.service';