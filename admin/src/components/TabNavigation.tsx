import React from 'react';
interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}
interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
}
export function TabNavigation({
  tabs,
  activeTab,
  onChange
}: TabNavigationProps) {
  return (
    <div className="border-b border-gray-200 bg-white sticky top-20 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-8 overflow-x-auto" aria-label="Tabs">
          {tabs.map((tab) =>
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
                py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors
                ${activeTab === tab.id ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}>
            
              <span className="flex items-center gap-2">
                {tab.icon}
                {tab.label}
              </span>
            </button>
          )}
        </nav>
      </div>
    </div>);

}