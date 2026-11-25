import React from 'react';
import {
  Users,
  UserCheck,
  Wallet,
  Ban,
  Activity,
  TrendingUp } from
'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer } from
'recharts';
import { StatCard } from '../../components/admin/shared/StatCard';
import { mockAuditLogs } from '../../data/mock/adminMockData';
import { StatusBadge } from '../../components/admin/shared/StatusBadge';
import { useNavigate } from 'react-router-dom';
const revenueData = [
{
  name: 'Jan',
  revenue: 4000
},
{
  name: 'Feb',
  revenue: 3000
},
{
  name: 'Mar',
  revenue: 5000
},
{
  name: 'Apr',
  revenue: 4500
},
{
  name: 'May',
  revenue: 6000
},
{
  name: 'Jun',
  revenue: 5500
},
{
  name: 'Jul',
  revenue: 7000
},
{
  name: 'Aug',
  revenue: 8500
},
{
  name: 'Sep',
  revenue: 7500
},
{
  name: 'Oct',
  revenue: 9000
},
{
  name: 'Nov',
  revenue: 11000
},
{
  name: 'Dec',
  revenue: 12500
}];

export function AdminDashboard() {
  const navigate = useNavigate();
  const recentActivity = mockAuditLogs.slice(0, 8);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Platform overview and key metrics
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/admin/pending')}
            className="px-3 py-1.5 text-sm font-medium bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 rounded-md hover:bg-teal-100 dark:hover:bg-teal-900/50 transition-colors">
            
            Review Pending (15)
          </button>
          <button
            onClick={() => navigate('/admin/settings')}
            className="px-3 py-1.5 text-sm font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            
            Settings
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Providers"
          value="1,245"
          icon={UserCheck}
          trend={{
            value: 12,
            isPositive: true
          }} />
        
        <StatCard
          title="Total Patients"
          value="8,432"
          icon={Users}
          trend={{
            value: 8,
            isPositive: true
          }} />
        
        <StatCard
          title="Pending Approvals"
          value="15"
          icon={Activity}
          description="Requires attention" />
        
        <StatCard
          title="Monthly Revenue"
          value="12.5k TND"
          icon={Wallet}
          trend={{
            value: 15,
            isPositive: true
          }} />
        
        <StatCard
          title="Active Subs"
          value="450"
          icon={TrendingUp}
          trend={{
            value: 5,
            isPositive: true
          }} />
        
        <StatCard
          title="Cancellation Rate"
          value="4.2%"
          icon={Ban}
          trend={{
            value: 1.1,
            isPositive: false
          }} />
        
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">
            Revenue Overview (12 Months)
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={revenueData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 0
                }}>
                
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#334155"
                  opacity={0.2} />
                
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12,
                    fill: '#64748b'
                  }}
                  dy={10} />
                
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12,
                    fill: '#64748b'
                  }}
                  dx={-10}
                  tickFormatter={(val) => `${val / 1000}k`} />
                
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '12px'
                  }}
                  itemStyle={{
                    color: '#2dd4bf'
                  }}
                  formatter={(value: number) => [`${value} TND`, 'Revenue']} />
                
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0d9488"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)" />
                
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Recent Activity
            </h3>
            <button
              onClick={() => navigate('/admin/audit')}
              className="text-xs text-teal-600 dark:text-teal-400 hover:underline">
              
              View All
            </button>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {recentActivity.map((log) =>
            <div key={log.id} className="flex gap-3 items-start">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-teal-500 shrink-0" />
                <div>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    <span className="font-medium">
                      {log.user.split('@')[0]}
                    </span>{' '}
                    {log.actionType.toLowerCase().replace('_', ' ')}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-slate-500 dark:text-slate-500">
                      {new Date(log.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                    </span>
                    <StatusBadge
                    status={log.severity}
                    className="text-[10px] px-1.5 py-0" />
                  
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>);

}