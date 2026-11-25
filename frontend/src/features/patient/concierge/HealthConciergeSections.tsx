import { CheckCircle2, Clock, Send, Zap } from 'lucide-react';
import { type NavigateFunction } from 'react-router-dom';

import { EmptyState } from '@/shared/ui/composites/empty-state';
import { Button } from '@/shared/ui/primitives/button';

import {
  conciergeTabs,
  conciergeTeam,
  healthConciergeStats,
  quickActions,
  recentRequests,
  type HealthConciergeTab,
} from './healthConcierge.data';

function getStatusColor(status: string) {
  switch (status) {
    case 'completed':
      return 'border-green-200 bg-green-100 text-green-700 dark:border-green-500/30 dark:bg-green-500/20 dark:text-green-400';
    case 'in-progress':
      return 'border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/20 dark:text-blue-400';
    default:
      return 'border-gray-200 bg-gray-100 text-gray-700 dark:border-slate-500/30 dark:bg-slate-500/20 dark:text-slate-400';
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'completed':
      return 'Terminé';
    case 'in-progress':
      return 'En cours';
    default:
      return 'En attente';
  }
}

export function HealthConciergeStats() {
  return (
    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
      {healthConciergeStats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm backdrop-blur-sm transition-all hover:scale-105 dark:border-slate-700/50 dark:bg-slate-800/50"
        >
          <div className="mb-4 flex items-center justify-between">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}
            >
              <stat.icon className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="mb-1 text-sm font-medium text-gray-600 dark:text-slate-400">{stat.label}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
          <p className="mt-1 text-xs text-gray-500 dark:text-slate-500">{stat.subtitle}</p>
        </div>
      ))}
    </div>
  );
}

export function HealthConciergePrimaryPanel({
  activeTab,
  handleSendMessage,
  messageInput,
  messages,
  navigate,
  onMessageInputChange,
  onTabChange,
}: {
  activeTab: HealthConciergeTab;
  handleSendMessage: () => void;
  messageInput: string;
  messages: Array<{
    id: number;
    sender: 'concierge' | 'user';
    name?: string;
    text: string;
    time: string;
    avatar?: string;
  }>;
  navigate: NavigateFunction;
  onMessageInputChange: (value: string) => void;
  onTabChange: (tab: HealthConciergeTab) => void;
}) {
  return (
    <div className="space-y-6 lg:col-span-2">
      <div>
        <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Actions rapides</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {quickActions.map((action) => (
            <div
              key={action.title}
              onClick={() => navigate(action.path)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:scale-105 hover:border-slate-300 hover:shadow-lg dark:border-slate-700/50 dark:bg-slate-800/50 dark:hover:border-slate-600"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 transition-opacity group-hover:opacity-10`}
              />
              <div className="relative flex items-start gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${action.gradient} shadow-lg transition-transform group-hover:scale-110`}
                >
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-1 font-bold text-gray-900 dark:text-white">{action.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-slate-400">{action.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50">
        <div className="flex border-b border-gray-200 dark:border-slate-700">
          {conciergeTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex-1 px-6 py-4 font-semibold transition-all ${activeTab === tab.id ? 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-700/50 dark:hover:text-slate-300'}`}
            >
              <tab.icon className="mr-2 inline-block h-5 w-5" />
              {tab.label}
              {activeTab === tab.id ? (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500" />
              ) : null}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'chat' ? (
            <div>
              <div className="mb-6 max-h-96 space-y-4 overflow-y-auto">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex animate-in slide-in-from-bottom-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.sender === 'concierge' ? (
                      <div className="mr-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 text-lg dark:bg-purple-500/20">
                        {message.avatar}
                      </div>
                    ) : null}

                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-3 ${message.sender === 'user' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30' : 'bg-gray-100 text-gray-900 dark:bg-slate-700 dark:text-white'}`}
                    >
                      {message.sender === 'concierge' ? (
                        <p className="mb-1 text-xs font-semibold opacity-75">{message.name}</p>
                      ) : null}
                      <p className="text-sm">{message.text}</p>
                      <p
                        className={`mt-1 text-xs ${message.sender === 'user' ? 'text-purple-200' : 'text-gray-500 dark:text-slate-400'}`}
                      >
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(event) => onMessageInputChange(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      handleSendMessage();
                    }
                  }}
                  placeholder="Écrivez votre message..."
                  className="flex-1 rounded-full border border-gray-200 bg-white px-4 py-3 text-gray-900 transition-all placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-purple-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-400 dark:focus:border-purple-500 dark:focus:ring-purple-500/20"
                />

                <Button
                  onClick={handleSendMessage}
                  className="rounded-full border-0 bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-500/30 hover:from-purple-700 hover:to-pink-700"
                  aria-label="Envoyer le message"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : null}

          {activeTab === 'requests' ? (
            recentRequests.length > 0 ? (
              <div className="space-y-4">
                {recentRequests.map((request) => (
                  <div
                    key={request.id}
                    className="rounded-xl border border-gray-200 bg-gray-50 p-4 transition-all hover:scale-[1.02] dark:border-slate-600 dark:bg-slate-700/50"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">
                          {request.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-slate-400">
                          {request.description}
                        </p>
                      </div>
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-bold ${getStatusColor(request.status)}`}
                      >
                        {getStatusLabel(request.status)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-slate-500">{request.date}</p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="Aucune demande récente"
                description="Vos demandes de coordination apparaîtront ici."
                icon={<Clock className="h-5 w-5" />}
              />
            )
          ) : null}

          {activeTab === 'history' ? (
            <EmptyState
              title="Historique complet disponible prochainement"
              description="Nous préparons une vue détaillée de vos échanges concierge."
              icon={<Clock className="h-5 w-5" />}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function HealthConciergeSidebar() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50">
        <h3 className="mb-4 font-bold text-gray-900 dark:text-white">Votre équipe dédiée</h3>
        <div className="space-y-4">
          {conciergeTeam.map((member) => (
            <div key={member.name} className="flex items-start gap-3">
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-pink-100 text-2xl dark:from-purple-900/40 dark:to-pink-900/40">
                  {member.avatar}
                </div>
                {member.available ? (
                  <div className="absolute bottom-0 right-0 h-3 w-3 animate-pulse rounded-full border-2 border-white bg-green-500 dark:border-slate-800" />
                ) : null}
              </div>

              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white">{member.name}</h4>
                <p className="mb-2 text-xs text-gray-600 dark:text-slate-400">{member.role}</p>
                <div className="flex flex-wrap gap-1">
                  {member.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-700 dark:bg-purple-500/20 dark:text-purple-400"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6 shadow-sm backdrop-blur-sm dark:border-green-500/30 dark:from-green-900/40 dark:to-emerald-900/40">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-200 dark:bg-green-500/20">
            <Zap className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">Disponibilité 24/7</h3>
            <p className="mb-3 text-sm text-gray-700 dark:text-green-300">
              Notre équipe est disponible à tout moment pour vous assister.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
              <span className="font-semibold text-green-700 dark:text-green-400">
                En ligne maintenant
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-sm backdrop-blur-sm dark:border-blue-500/30 dark:from-blue-900/40 dark:to-indigo-900/40">
        <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">💡 Comment ça marche ?</h3>
        <ul className="space-y-2 text-sm">
          {[
            'Posez votre question par chat, téléphone ou vidéo',
            'Réponse garantie sous 1h (souvent bien plus rapide)',
            'Nous gérons tout pour vous de A à Z',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
              <span className="text-gray-700 dark:text-blue-300">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
