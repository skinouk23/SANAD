import React, { useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  UserSquare2,
  UserCheck,
  Wallet,
  CreditCard,
  Ban,
  Settings,
  FileText,
  BarChart3,
  ChevronLeft,
  ShieldCheck
} from 'lucide-react';
import { clsx } from 'clsx';

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  pendingApprovalsCount?: number;
}

type NavItem = {
  path: string;
  icon: React.ElementType;
  label: string;
  badge?: number;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

export function AdminSidebar({
  collapsed,
  onToggle,
  pendingApprovalsCount = 0
}: AdminSidebarProps) {
  const location = useLocation();

  const navSections = useMemo<NavSection[]>(() => [
    {
      title: 'Principal',
      items: [
        {
          path: '/admin/dashboard',
          icon: LayoutDashboard,
          label: 'Dashboard'
        }
      ]
    },
    {
      title: 'Gestion',
      items: [
        {
          path: '/admin/professionals',
          icon: UserSquare2,
          label: 'Professionals'
        },
        {
          path: '/admin/patients',
          icon: Users,
          label: 'Patients'
        },
        {
          path: '/admin/pending',
          icon: UserCheck,
          label: 'Pending Approvals',
          badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined
        }
      ]
    },
    {
      title: 'Finance',
      items: [
        {
          path: '/admin/finance',
          icon: Wallet,
          label: 'Finance Console'
        },
        {
          path: '/admin/wallets',
          icon: CreditCard,
          label: 'Provider Wallets'
        },
        {
          path: '/admin/transactions',
          icon: FileText,
          label: 'Transactions'
        }
      ]
    },
    {
      title: 'OpÃ©rations',
      items: [
        {
          path: '/admin/cancellations',
          icon: Ban,
          label: 'Cancellations',
          badge: 3
        },
        {
          path: '/admin/reports',
          icon: BarChart3,
          label: 'Reports'
        },
        {
          path: '/admin/audit',
          icon: ShieldCheck,
          label: 'Audit Logs'
        }
      ]
    },
    {
      title: 'SystÃ¨me',
      items: [
        {
          path: '/admin/settings',
          icon: Settings,
          label: 'Settings'
        }
      ]
    }
  ], [pendingApprovalsCount]);

  return (
    <motion.aside
      initial={false}
      animate={{
        width: collapsed ? 72 : 260
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30
      }}
      className="bg-slate-950 text-slate-300 flex flex-col border-r border-slate-800/60 relative z-20 overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-teal-900/20 to-transparent pointer-events-none" />

      <div className="h-16 flex items-center justify-center px-4 border-b border-slate-800/60 relative z-10">
        <AnimatePresence mode="wait">
          {!collapsed ? (
            <motion.div
              key="full-logo"
              initial={{
                opacity: 0,
                x: -10
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              exit={{
                opacity: 0,
                x: -10
              }}
              transition={{
                duration: 0.2
              }}
              className="flex items-center gap-2 w-full"
            >
              <img
                src="/Sanad.png"
                alt="Sanad"
                className="w-8 h-8 rounded-lg object-contain"
              />

              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 text-lg tracking-tight truncate">
                Sanad
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="icon-logo"
              initial={{
                opacity: 0,
                scale: 0.8
              }}
              animate={{
                opacity: 1,
                scale: 1
              }}
              exit={{
                opacity: 0,
                scale: 0.8
              }}
              transition={{
                duration: 0.2
              }}
            >
              <img
                src="/Sanad.png"
                alt="Sanad"
                className="w-10 h-10 rounded-xl object-contain"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1 overflow-y-auto py-4 scrollbar-none relative z-10">
        <nav className="space-y-6 px-3">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {!collapsed && (
                <motion.div
                  initial={{
                    opacity: 0
                  }}
                  animate={{
                    opacity: 1
                  }}
                  className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500"
                >
                  {section.title}
                </motion.div>
              )}
              {section.items.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    title={collapsed ? item.label : undefined}
                    className="relative block"
                  >
                    <motion.div
                      whileHover={{
                        scale: 1.02,
                        backgroundColor: 'rgba(30, 41, 59, 0.5)'
                      }}
                      whileTap={{
                        scale: 0.98
                      }}
                      className={clsx(
                        'flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors relative z-10',
                        isActive
                          ? 'text-teal-400 bg-teal-950/30'
                          : 'text-slate-400 hover:text-slate-200'
                      )}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <item.icon
                          className={clsx(
                            'w-5 h-5 shrink-0 transition-colors',
                            isActive ? 'text-teal-400' : 'text-slate-500'
                          )}
                        />

                        {!collapsed && (
                          <span className="text-sm font-medium truncate">
                            {item.label}
                          </span>
                        )}
                      </div>

                      {item.badge ? (
                        <div
                          className={clsx(
                            'flex items-center justify-center rounded-full text-[10px] font-bold',
                            collapsed
                              ? 'absolute top-1 right-1 w-4 h-4 bg-teal-500 text-white'
                              : 'px-2 py-0.5 bg-teal-500/20 text-teal-400'
                          )}
                        >
                          {collapsed ? '' : item.badge}
                        </div>
                      ) : null}
                    </motion.div>

                    {isActive ? (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute left-0 top-1 bottom-1 w-1 bg-teal-500 rounded-r-full shadow-[0_0_10px_rgba(20,184,166,0.5)]"
                        initial={false}
                        transition={{
                          type: 'spring',
                          stiffness: 300,
                          damping: 30
                        }}
                      />
                    ) : null}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      <div className="p-3 border-t border-slate-800/60 bg-slate-950/50 backdrop-blur-md relative z-10">
        <div
          className={clsx(
            'flex items-center gap-3 mb-3 p-2 rounded-lg hover:bg-slate-800/50 transition-colors cursor-pointer',
            collapsed ? 'justify-center' : ''
          )}
        >
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 overflow-hidden">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin&backgroundColor=0f172a"
              alt="Admin"
              className="w-full h-full object-cover"
            />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                Admin User
              </p>
              <p className="text-xs text-slate-500 truncate">
                admin@careathome.tn
              </p>
            </div>
          )}
        </div>

        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-all group"
        >
          <motion.div
            animate={{
              rotate: collapsed ? 180 : 0
            }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 20
            }}
          >
            <ChevronLeft className="w-4 h-4" />
          </motion.div>
        </button>
      </div>
    </motion.aside>
  );
}
