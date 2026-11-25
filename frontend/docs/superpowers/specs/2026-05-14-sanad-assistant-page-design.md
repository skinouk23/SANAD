# Sanad Assistant Page Design

Date: 2026-05-14
Project: CareAtHomeFinal frontend
Status: Awaiting user review

## Goal

Move the Sanad Assistant chatbot from a floating screen button and pop-up into a normal app page. Users should open it from the top bar, next to the existing location button. The change should preserve the current assistant features and role-aware behavior.

## Current Context

The frontend is a React, TypeScript, Vite app. The global authenticated shell lives in `src/app/layouts/AppLayout.tsx`. The current top bar already renders `ProfileLocationButton` for authenticated patients and providers.

The chatbot currently lives in `src/features/assistant/chatbot/`:

- `ChatbotAssistant.tsx` renders the floating bottom-right button and lazy-loads the dialog.
- `ChatbotAssistantDialog.tsx` owns the conversation state, quick replies, role-aware navigation shortcuts, provider finance queries, message list, input form, and pop-up chrome.
- `AssistantDock.tsx` renders both `ChatbotAssistant` and `VoiceAssistant` as global overlays.

Routing is split under `src/app/router/routes/`. Shared authenticated routes such as `messages` and `aide` use `PatientProviderRoute`, which matches the desired access model for `/assistant`.

## Decisions

- The assistant page URL will be `/assistant`.
- Both patients and providers can access the assistant page.
- The page will keep the existing chatbot features. This is a location and layout change, not a feature redesign.
- The top-bar assistant button will be a highlighted compact icon button next to the location button.
- The assistant page will not include an internal close or back button. Users leave with the existing app top-bar back button.
- The floating chatbot button and pop-up should be removed from the global dock.
- `VoiceAssistant` should remain unchanged.

## Chosen Approach

Extract the chat experience into a reusable page-sized component, then render it from a new `/assistant` route.

This approach is better than wrapping the existing dialog permanently because the dialog uses fixed pop-up positioning, an `isOpen` prop, and close behavior that do not fit a page. It is also better than a full redesign because the requested change is focused: move the assistant into the top bar and open it as a page.

## Architecture

### Route

Add a shared authenticated route:

- Path: `/assistant`
- Guard: `PatientProviderRoute`
- Route handle: history-first back behavior
- Patient fallback: `/patient-dashboard`
- Provider fallback: `/provider-dashboard`

The route should lazy-load a page module, following existing router patterns.

### Top-Bar Entry Point

Add an `AssistantTopBarButton` near the app layout code. It should:

- Render only when authenticated actions are shown, same as `ProfileLocationButton`.
- Link to `/assistant`.
- Use the same compact dimensions as the location button.
- Use a highlighted cyan/blue assistant style that visually differs from the neutral location button while keeping the same button size.
- Use an accessible label such as “Open Sanad Assistant”.
- Sit next to `ProfileLocationButton` in the existing bordered action group.

### Assistant Page

Add `src/pages/assistant/AssistantPage.tsx`. It should:

- Render inside the existing `AppLayout` main area.
- Provide a compact heading with “Sanad Assistant” and the existing online/status language used by the current chatbot header.
- Render the chat panel as the primary page content.
- Avoid any internal close, dismiss, or back button.
- Let the app top-bar back button handle exit.

### Chat Panel

Refactor `ChatbotAssistantDialog.tsx` into a page-first `ChatbotAssistantPanel` so the conversation UI can run without dialog state.

`ChatbotAssistantPanel` owns:

- Initial welcome flow.
- Message state.
- Typing state.
- Text input state.
- Quick replies.
- Role-aware account shortcuts.
- Existing navigation actions.
- Provider finance snapshot queries.

The panel should use normal layout classes instead of fixed pop-up classes. It should fill a large portion of the available page height, keep messages scrollable, and keep the input attached to the bottom of the panel.

The old floating dialog entry point should stop being part of the active app shell. Tests that currently import `ChatbotAssistantDialog` should move to the new panel or page-facing component API.

## Data Flow

1. Authenticated user clicks the highlighted assistant button in the top bar.
2. React Router navigates to `/assistant`.
3. `PatientProviderRoute` allows patients and providers and blocks unauthenticated users through the existing guard behavior.
4. `AssistantPage` mounts `ChatbotAssistantPanel`.
5. The panel starts the existing welcome flow on mount.
6. User quick replies and text input use the existing assistant handlers.
7. Assistant navigation actions use `useNavigate()` and route the user to the same destinations as before.
8. Provider finance data loads only for authenticated provider users while the page is mounted.

## Error Handling

- Unauthenticated access is handled by the existing shared authenticated route guard.
- Unsupported runtime roles should keep the existing assistant behavior: omit role-dependent account shortcuts while preserving safe generic actions.
- Provider finance data remains optional. Loading and no-data fallbacks should preserve the current copy and behavior.
- Failed assistant-related navigation should not add local try/catch blocks. Navigation should follow existing React Router behavior.
- The location button logic is untouched.

## UI Behavior

Desktop:

- The chat panel is centered and constrained to a readable max width.
- The panel has a clear header, scrollable message area, and sticky or attached input area.
- The top-bar assistant button visually stands out but still fits with existing shell controls.

Mobile:

- The chat panel uses most of the available height between the app header and bottom navigation.
- The message list scrolls inside the panel.
- The input stays reachable at the bottom of the panel.
- The compact top-bar icon avoids crowding the header.

## Testing And Verification

Update existing assistant tests if the component API changes. Coverage should confirm that role-aware account shortcuts still route correctly after the dialog-to-panel refactor.

Recommended verification commands from `CareAtHomeFinal/`:

```bash
npm run lint
npm run type-check
```

Because this change affects routing and shared app shell layout, also run:

```bash
npm run build
```

Manual smoke checks:

- Patient can open `/assistant` from the top bar.
- Provider can open `/assistant` from the top bar.
- The top-bar back button leaves the assistant page and falls back to the correct dashboard when needed.
- The floating chatbot button no longer appears.
- The voice assistant still behaves as before.
- Existing assistant shortcuts navigate to their previous destinations.

## Out Of Scope

- Backend changes.
- New chatbot intelligence or new assistant flows.
- Conversation persistence across page visits.
- Redesigning the voice assistant.
- Changing the location button behavior.
- Adding new tests beyond updates needed for the refactor.
