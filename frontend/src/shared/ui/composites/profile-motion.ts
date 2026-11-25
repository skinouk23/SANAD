import type { Variants } from 'framer-motion';

export const profilePageVariants = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: 'easeOut',
      staggerChildren: 0.06,
      when: 'beforeChildren',
    },
  },
} satisfies Variants;

export const profileCardVariants = {
  hidden: {
    opacity: 0,
    scale: 0.98,
    y: 18,
  },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
} satisfies Variants;

export const profileTabListVariants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.28,
      ease: 'easeOut',
      staggerChildren: 0.035,
    },
  },
} satisfies Variants;

export const profileTabButtonVariants = {
  hidden: {
    opacity: 0,
    y: 8,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.22,
      ease: 'easeOut',
    },
  },
} satisfies Variants;

export const profileTabPanelVariants = {
  hidden: {
    opacity: 0,
    scale: 0.985,
    y: 12,
  },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.26,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    scale: 0.985,
    y: -8,
    transition: {
      duration: 0.16,
      ease: 'easeIn',
    },
  },
} satisfies Variants;

export const profileDialogChromeVariants = {
  hidden: {
    opacity: 0,
    scale: 0.96,
  },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.24,
      ease: 'easeOut',
    },
  },
} satisfies Variants;
