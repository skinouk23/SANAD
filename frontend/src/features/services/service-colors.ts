/**
 * Service accent color utilities.
 *
 * Uses backend category.color values when available and falls back to stable
 * category-derived accents for runtime styling.
 */

import type { CSSProperties } from 'react';

export interface ServiceAccent {
  from: string;
  to: string;
}

export interface ServiceAccentStyles {
  conicBorder: CSSProperties;
  gradient: CSSProperties;
  softBackground: CSSProperties;
  border: CSSProperties;
  text: CSSProperties;
  shadow: CSSProperties;
}

interface RgbColor {
  r: number;
  g: number;
  b: number;
}

const HEX_COLOR_PATTERN = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

const DEFAULT_SERVICE_ACCENT: ServiceAccent = { from: '#06b6d4', to: '#3b82f6' };

const SERVICE_ACCENT_FALLBACKS: Record<string, ServiceAccent> = {
  laboratory: { from: '#3b82f6', to: '#6366f1' },
  radiology: { from: '#9333ea', to: '#8b5cf6' },
  pharmacy: { from: '#10b981', to: '#14b8a6' },
  funeral: { from: '#64748b', to: '#334155' },
  veterinary: { from: '#f97316', to: '#f59e0b' },
  nutrition: { from: '#f97316', to: '#f59e0b' },
  ambulance: { from: '#ef4444', to: '#f97316' },
  gym: { from: '#f59e0b', to: '#f97316' },
  equipment_rental: { from: '#06b6d4', to: '#10b981' },
  default: DEFAULT_SERVICE_ACCENT,
};

function normalizeHexColor(hex: string): string | null {
  const trimmedHex = hex.trim();

  if (!HEX_COLOR_PATTERN.test(trimmedHex)) {
    return null;
  }

  if (trimmedHex.length === 4) {
    const [, r, g, b] = trimmedHex;
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }

  return trimmedHex.toLowerCase();
}

function normalizeCategoryCode(categoryCode?: string | null): string {
  return (categoryCode ?? '')
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_');
}

function clampAlpha(alpha: number): number {
  if (Number.isNaN(alpha)) {
    return 1;
  }

  return Math.min(Math.max(alpha, 0), 1);
}

export function parseServiceAccent(color?: string | null): ServiceAccent | null {
  if (!color) {
    return null;
  }

  const colorStops = color.split(',').map((colorStop) => colorStop.trim());

  if (colorStops.length !== 2) {
    return null;
  }

  const from = normalizeHexColor(colorStops[0]);
  const to = normalizeHexColor(colorStops[1]);

  if (!from || !to) {
    return null;
  }

  return { from, to };
}

export function hexToRgb(hex: string): RgbColor | null {
  const normalizedHex = normalizeHexColor(hex);

  if (!normalizedHex) {
    return null;
  }

  const value = normalizedHex.slice(1);

  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16),
  };
}

export function toRgba(hex: string, alpha: number): string {
  const rgb = hexToRgb(hex) ?? hexToRgb(DEFAULT_SERVICE_ACCENT.from);
  const safeAlpha = clampAlpha(alpha);

  if (!rgb) {
    return `rgba(6, 182, 212, ${safeAlpha})`;
  }

  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${safeAlpha})`;
}

export function getFallbackServiceAccent(categoryCode?: string | null): ServiceAccent {
  const normalizedCode = normalizeCategoryCode(categoryCode);

  return SERVICE_ACCENT_FALLBACKS[normalizedCode] ?? SERVICE_ACCENT_FALLBACKS.default;
}

export function resolveServiceAccent(
  categoryColor?: string | null,
  categoryCode?: string | null,
): ServiceAccent {
  return parseServiceAccent(categoryColor) ?? getFallbackServiceAccent(categoryCode);
}

export function createServiceAccentStyles(accent: ServiceAccent): ServiceAccentStyles {
  return {
    conicBorder: {
      background: `conic-gradient(from 90deg at 50% 50%, transparent 50%, ${accent.from} 100%)`,
    },
    gradient: {
      background: `linear-gradient(135deg, ${accent.from} 0%, ${accent.to} 100%)`,
    },
    softBackground: {
      background: `linear-gradient(135deg, ${toRgba(accent.from, 0.14)} 0%, ${toRgba(
        accent.to,
        0.1,
      )} 100%)`,
    },
    border: {
      borderColor: toRgba(accent.from, 0.35),
    },
    text: {
      color: accent.from,
    },
    shadow: {
      boxShadow: `0 18px 45px ${toRgba(accent.from, 0.2)}`,
    },
  };
}

export function createServiceAccentVariables(accent: ServiceAccent): CSSProperties {
  return {
    '--service-accent-from': accent.from,
    '--service-accent-to': accent.to,
    '--service-accent-soft': toRgba(accent.from, 0.14),
    '--service-accent-hover': toRgba(accent.to, 0.18),
    '--service-accent-border': toRgba(accent.from, 0.35),
    '--service-accent-shadow': toRgba(accent.from, 0.2),
  } as CSSProperties;
}
