import { describe, expect, it } from 'vitest';

import { sanitizeHtml } from '@/utils/security';

describe('sanitizeHtml', () => {
  it('escapes HTML entities for safe rendering', () => {
    expect(sanitizeHtml('<script>alert(1)</script>')).toBe(
      '&lt;script&gt;alert(1)&lt;&#x2F;script&gt;',
    );
  });
});
