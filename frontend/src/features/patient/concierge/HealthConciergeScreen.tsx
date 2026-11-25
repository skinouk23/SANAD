import { Phone, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import {
  HealthConciergePrimaryPanel,
  HealthConciergeSidebar,
  HealthConciergeStats,
} from './HealthConciergeSections';
import { useHealthConciergeScreen } from './useHealthConciergeScreen';

export function HealthConciergeScreen() {
  const navigate = useNavigate();
  const screen = useHealthConciergeScreen();

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-50 transition-colors duration-300 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-10 top-20 h-72 w-72 rounded-full bg-purple-300/20 blur-3xl dark:bg-purple-500/20" />
        <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-cyan-300/20 blur-3xl dark:bg-cyan-500/20" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Concierge Santé
                </span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-slate-400">
                Votre assistant santé personnel disponible 24/7
              </p>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto">
              <button
                type="button"
                className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white p-3 text-slate-700 shadow-sm transition-colors hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-800 dark:text-yellow-400 dark:hover:bg-slate-700"
                aria-label="Demarrer un appel video"
              >
                <Video className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="inline-flex h-12 w-12 items-center justify-center rounded-xl border-0 bg-gradient-to-r from-purple-600 to-pink-600 p-3 text-white shadow-lg shadow-purple-500/30 transition-colors hover:from-purple-700 hover:to-pink-700"
                aria-label="Appeler le concierge sante"
              >
                <Phone className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <HealthConciergeStats />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <HealthConciergePrimaryPanel
            activeTab={screen.activeTab}
            handleSendMessage={screen.handleSendMessage}
            messageInput={screen.messageInput}
            messages={screen.messages}
            navigate={navigate}
            onMessageInputChange={screen.setMessageInput}
            onTabChange={screen.setActiveTab}
          />

          <HealthConciergeSidebar />
        </div>
      </div>
    </div>
  );
}
