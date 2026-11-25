import type { RouteObject } from 'react-router-dom';

import { ProviderRoute } from '@/app/router/guards/ProviderRoute';
import { L, h } from '@/app/router/helpers';

export const providerRoutes: RouteObject = {
  element: <ProviderRoute />,
  children: [
    {
      path: 'provider-dashboard',
      ...L(() => import('@/pages/provider/ProviderDashboardPage'), 'ProviderDashboardPage'),
    },
    {
      path: 'provider/balance',
      ...L(() => import('@/pages/provider/BalanceManagementPage'), 'BalanceManagementPage'),
      ...h('/provider-dashboard'),
    },
    {
      path: 'provider/transactions',
      ...L(() => import('@/pages/provider/TransactionHistoryPage'), 'TransactionHistoryPage'),
      ...h('/provider-dashboard'),
    },
    {
      path: 'provider/analytics',
      ...L(() => import('@/pages/provider/AnalyticsPage'), 'AnalyticsPage'),
      ...h('/provider-dashboard'),
    },
    {
      path: 'provider/services',
      ...L(() => import('@/pages/provider/ServiceManagementPage'), 'ServiceManagementPage'),
      ...h('/provider-dashboard'),
    },
    {
      path: 'provider/profile',
      ...L(() => import('@/pages/provider/ProviderProfilePage'), 'ProviderProfilePage'),
      ...h('/provider-dashboard'),
    },
    {
      path: 'provider/services/new',
      ...L(() => import('@/pages/provider/NewServicePage'), 'NewServicePage'),
      ...h('/provider/services'),
    },
    {
      path: 'provider/pharmacy-orders',
      ...L(() => import('@/pages/provider/PharmacyOrdersPage'), 'PharmacyOrdersPage'),
      ...h('/provider-dashboard'),
    },
    {
      path: 'provider/schedule',
      ...L(() => import('@/pages/provider/ScheduleManagementPage'), 'ScheduleManagementPage'),
      ...h('/provider-dashboard'),
    },
    {
      path: 'provider/marketing',
      ...L(() => import('@/pages/provider/MarketingCampaigns'), 'MarketingCampaigns'),
      ...h('/provider-dashboard'),
    },
    {
      path: 'provider/marketing/new',
      ...L(() => import('@/pages/provider/NewCampaign'), 'NewCampaign'),
      ...h('/provider/marketing'),
    },
    {
      path: 'provider/marketing/:id',
      ...L(() => import('@/pages/provider/CampaignDetails'), 'CampaignDetails'),
      ...h('/provider/marketing'),
    },
    {
      path: 'provider/active-delivery/:sessionId',
      ...L(() => import('@/pages/provider/ActiveDeliveryPage'), 'ActiveDeliveryPage'),
      ...h('/provider-dashboard'),
    },
    {
      path: 'provider/insurance',
      ...L(() => import('@/pages/provider/Insurance'), 'Insurance'),
      ...h('/provider-dashboard'),
    },
    {
      path: 'provider/insurance/file-claim',
      ...L(() => import('@/pages/provider/FileClaim'), 'FileClaim'),
      ...h('/provider/insurance'),
    },
    {
      path: 'provider/billing',
      ...L(() => import('@/pages/provider/Billing'), 'Billing'),
      ...h('/provider-dashboard'),
    },
  ],
};
