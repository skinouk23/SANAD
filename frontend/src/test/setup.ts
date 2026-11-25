import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { MotionGlobalConfig } from 'framer-motion';
import { afterEach, beforeAll } from 'vitest';

// Skip framer-motion animations in tests so AnimatePresence mode="wait"
// mounts/unmounts content synchronously instead of waiting for exit animations.
MotionGlobalConfig.skipAnimations = true;

beforeAll(() => {
  class ResizeObserverMock {
    observe() {
      return undefined;
    }

    unobserve() {
      return undefined;
    }

    disconnect() {
      return undefined;
    }
  }

  Object.defineProperty(globalThis, 'ResizeObserver', {
    writable: true,
    value: ResizeObserverMock,
  });

  Object.defineProperty(window, 'ResizeObserver', {
    writable: true,
    value: ResizeObserverMock,
  });

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });

  Object.defineProperty(window, 'scrollTo', {
    writable: true,
    value: () => {},
  });

  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
    writable: true,
    value: () => {},
  });
});

afterEach(() => {
  cleanup();
  if (typeof localStorage?.clear === 'function') {
    localStorage.clear();
  }

  if (typeof sessionStorage?.clear === 'function') {
    sessionStorage.clear();
  }

  document.documentElement.className = '';
  document.documentElement.removeAttribute('dir');
  document.documentElement.removeAttribute('lang');
});
