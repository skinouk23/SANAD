import type { KeyboardEvent } from 'react';
import { useId, useRef } from 'react';
import type { LucideIcon } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import { getPanelId, getTabButtonId } from '@/shared/ui/composites/profile-tabs.ids';

export interface ProfileTabItem<TTabId extends string = string> {
  id: TTabId;
  label: string;
  icon: LucideIcon;
  panelId?: string;
  disabled?: boolean;
}

interface ProfileTabBarProps<TTabId extends string = string> {
  tabs: ProfileTabItem<TTabId>[];
  activeTab: TTabId;
  ariaLabel: string;
  onChange: (tab: TTabId) => void;
  idBase?: string;
}

export function ProfileTabBar<TTabId extends string>({
  tabs,
  activeTab,
  ariaLabel,
  onChange,
  idBase,
}: ProfileTabBarProps<TTabId>) {
  const reactId = useId();
  const resolvedIdBase = idBase ?? `profile-tab-bar-${reactId.replace(/:/g, '')}`;
  const tabRefs = useRef(new Map<TTabId, HTMLButtonElement>());

  const enabledTabs = tabs.filter((tab) => !tab.disabled);

  const getTabButtonIdForTab = (tabId: TTabId) => getTabButtonId(resolvedIdBase, tabId as string);
  const getPanelIdForTab = (tab: ProfileTabItem<TTabId>) =>
    tab.panelId ?? getPanelId(resolvedIdBase, tab.id as string);

  const moveToTab = (currentTabId: TTabId, nextTabId: TTabId) => {
    if (currentTabId === nextTabId) {
      return;
    }

    tabRefs.current.get(nextTabId)?.focus();
    onChange(nextTabId);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, currentTabId: TTabId) => {
    if (enabledTabs.length === 0) {
      return;
    }

    const currentEnabledTabIndex = enabledTabs.findIndex((tab) => tab.id === currentTabId);
    if (currentEnabledTabIndex === -1) {
      return;
    }

    switch (event.key) {
      case 'ArrowRight': {
        event.preventDefault();
        const nextTab = enabledTabs[(currentEnabledTabIndex + 1) % enabledTabs.length];
        moveToTab(currentTabId, nextTab.id);
        break;
      }
      case 'ArrowLeft': {
        event.preventDefault();
        const nextTab =
          enabledTabs[(currentEnabledTabIndex - 1 + enabledTabs.length) % enabledTabs.length];
        moveToTab(currentTabId, nextTab.id);
        break;
      }
      case 'Home': {
        event.preventDefault();
        moveToTab(currentTabId, enabledTabs[0].id);
        break;
      }
      case 'End': {
        event.preventDefault();
        moveToTab(currentTabId, enabledTabs[enabledTabs.length - 1].id);
        break;
      }
      default:
        break;
    }
  };

  return (
    <div
      aria-label={ariaLabel}
      aria-orientation="horizontal"
      className="mb-6 flex gap-2 overflow-x-auto pb-1 custom-scrollbar"
      role="tablist"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = tab.id === activeTab;

        return (
          <button
            key={tab.id}
            aria-controls={getPanelIdForTab(tab)}
            aria-selected={isActive}
            className={cn(
              'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl border px-4 py-2 text-sm font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
              isActive
                ? 'border-transparent bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:border-transparent dark:bg-slate-800/50 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white',
            )}
            data-state={isActive ? 'active' : 'inactive'}
            disabled={tab.disabled}
            id={getTabButtonIdForTab(tab.id)}
            onClick={() => onChange(tab.id)}
            onKeyDown={(event) => handleKeyDown(event, tab.id)}
            ref={(element) => {
              if (element) {
                tabRefs.current.set(tab.id, element);
                return;
              }

              tabRefs.current.delete(tab.id);
            }}
            role="tab"
            tabIndex={isActive ? 0 : -1}
            type="button"
          >
            <Icon aria-hidden="true" className="h-4 w-4" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
