export interface NavigationLabels {
  day: string;
  month: string;
  next: string;
  previous: string;
  today: string;
  week: string;
}

export interface CalendarStateLabels {
  hours: string;
  loading: string;
  loadingError: string;
  noCalendarEvents: string;
  retry: string;
}

export interface SidebarLabels {
  addInterval: string;
  availabilityDayOff: string;
  blockReasonPlaceholder: string;
  blockSlot: string;
  blockThisSlot: string;
  blockedSlots: string;
  date: string;
  delete: string;
  endTime: string;
  legend: string;
  noBlockedSlots: string;
  noUpcomingProviderAppointments: string;
  quickActions: string;
  reasonOptional: string;
  removeInterval: string;
  saveAvailabilities: string;
  setAvailabilities: string;
  setAvailability: string;
  slotBlocked: string;
  startTime: string;
  to: string;
  upcomingAppointments: string;
}

export interface DialogLabels extends SidebarLabels {
  cancel: string;
  dayLabels: Record<number, string>;
  invalidTimeRange: string;
  loading: string;
  loadingError: string;
  retry: string;
}

export interface SelectedDayLabels {
  blockedSlots: string;
  noCalendarEvents: string;
}
