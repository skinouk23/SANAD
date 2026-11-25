import type { ComponentType } from 'react';
import type { LoaderFunction, RouteObject } from 'react-router-dom';

import type { RouteHandle } from '@/types/router.types';

export const h = (
  parent: RouteHandle['parent'],
  routeHandle: Omit<RouteHandle, 'parent'> = {},
): { handle: RouteHandle } => ({
  handle: { parent, ...routeHandle },
});

export const routeHandle = (handle: RouteHandle): { handle: RouteHandle } => ({ handle });

export const L = (
  factory: () => Promise<Record<string, unknown>>,
  name: string,
): { lazy: NonNullable<RouteObject['lazy']> } => ({
  lazy: async () => {
    const module = await factory();
    const routeModule: {
      Component: ComponentType;
      loader?: LoaderFunction;
    } = {
      Component: module[name] as ComponentType,
    };

    if (typeof module.loader === 'function') {
      routeModule.loader = module.loader as LoaderFunction;
    }

    return routeModule;
  },
});
