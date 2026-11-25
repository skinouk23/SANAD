import { afterEach, describe, expect, it, vi } from 'vitest';

import { api } from '@/api/client';
import {
  ProviderScheduleIntervalSchema,
  ProviderUnavailabilityResponseSchema,
} from '@/features/providers/schema';
import {
  createMyProviderUnavailability,
  replaceMyProviderSchedules,
} from '@/features/providers/service';

const VALID_SCHEDULE_RESPONSE = [
  {
    id: '0e000000-0000-0000-0000-000000000001',
    dayOfWeek: 1,
    serviceId: null,
    startTime: '08:00:00',
    endTime: '12:00:00',
  },
] as const;

const VALID_UNAVAILABILITY_RESPONSE = {
  id: 'c652fe05-fbc6-4fc8-9080-00408e1afcdd',
  startDatetime: '2026-04-17T08:00:00',
  endDatetime: '2026-04-17T09:00:00',
  isAllDay: false,
  isRecurring: false,
  recurrenceRule: null,
  reason: 'Slot blocked',
  notes: null,
} as const;

afterEach(() => {
  vi.restoreAllMocks();
});

describe('providers service contract', () => {
  it('serializes weekly schedule mutations with TimeOnly values in HH:mm:ss format', async () => {
    const apiPutSpy = vi.spyOn(api, 'put').mockResolvedValueOnce(VALID_SCHEDULE_RESPONSE);

    await expect(
      replaceMyProviderSchedules([
        {
          id: '0e000000-0000-0000-0000-000000000001',
          dayOfWeek: 1,
          serviceId: null,
          startTime: '08:00',
          endTime: '12:00',
        },
      ]),
    ).resolves.toEqual(
      VALID_SCHEDULE_RESPONSE.map((item) => ProviderScheduleIntervalSchema.parse(item)),
    );

    expect(apiPutSpy).toHaveBeenCalledWith(
      '/providers/me/schedules',
      [
        {
          id: '0e000000-0000-0000-0000-000000000001',
          dayOfWeek: 1,
          serviceId: null,
          startTime: '08:00:00',
          endTime: '12:00:00',
        },
      ],
      expect.objectContaining({ _silentError: true }),
    );
  });

  it('accepts provider-local unavailability datetimes without timezone offsets', async () => {
    const payload = {
      startDatetime: '2026-04-17T08:00:00',
      endDatetime: '2026-04-17T09:00:00',
      isAllDay: false,
      isRecurring: false,
      recurrenceRule: null,
      reason: 'Slot blocked',
      notes: null,
    };
    const apiPostSpy = vi.spyOn(api, 'post').mockResolvedValueOnce(VALID_UNAVAILABILITY_RESPONSE);

    await expect(createMyProviderUnavailability(payload)).resolves.toEqual(
      ProviderUnavailabilityResponseSchema.parse(VALID_UNAVAILABILITY_RESPONSE),
    );

    expect(apiPostSpy).toHaveBeenCalledWith(
      '/providers/me/unavailabilities',
      payload,
      expect.objectContaining({ _silentError: true }),
    );
  });
});
