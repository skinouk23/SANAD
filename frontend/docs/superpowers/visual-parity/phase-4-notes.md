# Phase 4 Notes

## Shell Profile Action

Phase 4 keeps the current top-bar profile/avatar action. Visual parity work should not remove, hide, or replace this action because it does not appear the same way in the legacy shell.

Restyle the action as a cyber-compatible shell control that fits the current frontend control family. The profile/avatar action should preserve its current behavior while aligning its shell treatment with the surrounding current controls.

## Compact Bottom Navigation Labels

Phase 4 keeps compact bottom-nav labels. This includes the current compact `Guide` behavior.

Do not force the full legacy `Comment ça marche` label everywhere. The full legacy label may remain useful as visual reference where there is space, but compact navigation can keep the shorter current label treatment.

## Auth Page Bottom Navigation

Phase 4 keeps current auth page bottom-navigation behavior.

Do not force `/auth/login` or other auth pages to always show bottom navigation like legacy. If the current frontend varies bottom-navigation visibility or treatment by state, theme, or route, preserve that current behavior unless a later user-approved decision changes it.

## Theme And Language Controls

Phase 4 keeps theme and language control background treatment like the current frontend.

Do not hardcode legacy `bg-slate-800/80` control backgrounds for theme or language controls during Phase 4. Preserve the current frontend treatment for these controls unless a later user-approved decision changes that direction.

## Shell Background Gradients

Phase 4 shell background gradients now use the exact legacy CyberLayout values: `bg-gradient-to-br from-slate-50 via-white to-slate-100` in light mode and `bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900` in dark mode.

## Light Shell Backdrop Fix

Phase 4 keeps the current light theme and language control backgrounds. Only the shell backdrop grid and orbs were corrected for this light-mode pass.

The grid overlay now uses the legacy CyberLayout line strengths with a 50px grid: `rgba(6,182,212,0.05)` in light mode and `rgba(6,182,212,0.03)` in dark mode. The lighter direct line colors replace the previous stronger graph-paper effect.

The shell orbs now align to the legacy fixed geometry: cyan at `top-0 left-1/4` and purple at `bottom-0 right-1/4`, both `w-96 h-96`, with 5% opacity in light mode and 10% opacity in dark mode. The purple orb keeps the legacy `delay-1000` pulse offset.

## Implementation Summary

Phase 4 shell parity restored the app shell cyber backdrop, including theme-aware gradients, a fixed theme-aware grid overlay, and cyan/purple blurred orb layers behind shell content.

The app header now uses translucent backdrop blur and token-based shell controls. The profile/avatar action remains in place and now matches the current control family with a square rounded token surface.

The bottom navigation keeps compact labels and existing route/logout behavior while restoring legacy-style role-aware gradients, active icon glow treatment, the top accent line, and the bottom background glow.
