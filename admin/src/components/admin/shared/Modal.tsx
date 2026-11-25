import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '4xl';
}
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = 'md'
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '4xl': 'max-w-4xl'
  }[maxWidth];
  return (
    <AnimatePresence>
      {isOpen &&
      <motion.div
        initial={{
          opacity: 0
        }}
        animate={{
          opacity: 1
        }}
        exit={{
          opacity: 0
        }}
        className="fixed inset-0 z-50 flex items-center justify-center">
        
          {/* Backdrop */}
          <div
          className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
          onClick={onClose} />
        

          {/* Modal Panel */}
          <motion.div
          initial={{
            opacity: 0,
            scale: 0.95,
            y: 20
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0
          }}
          exit={{
            opacity: 0,
            scale: 0.95,
            y: 20
          }}
          className={`relative w-full ${maxWidthClass} mx-4 bg-white dark:bg-slate-800 rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]`}>
          
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                {title}
              </h2>
              <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto">{children}</div>
            {footer &&
          <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-2">
                {footer}
              </div>
          }
          </motion.div>
        </motion.div>
      }
    </AnimatePresence>);

}