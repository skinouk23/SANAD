import React from 'react';
import {
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  RefreshCw } from
'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend } from
'recharts';
import { StatCard } from '../../components/admin/shared/StatCard';
const revenueByService = [
{
  name: 'Nursing',
  revenue: 45000
},
{
  name: 'Physio',
  revenue: 32000
},
{
  name: 'Laboratory',
  revenue: 28000
},
{
  name: 'Pharmacy',
  revenue: 15000
},
{
  name: 'Ambulance',
  revenue: 12000
}];

const monthlyTrend = [
{
  name: 'Jan',
  commission: 4000,
  subscription: 2000
},
{
  name: 'Feb',
  commission: 3000,
  subscription: 2200
},
{
  name: 'Mar',
  commission: 5000,
  subscription: 2500
},
{
  name: 'Apr',
  commission: 4500,
  subscription: 2800
},
{
  name: 'May',
  commission: 6000,
  subscription: 3000
},
{
  name: 'Jun',
  commission: 5500,
  subscription: 3200
}];

const revenueSplit = [
{
  name: 'Commissions',
  value: 65
},
{
  name: 'Subscriptions',
  value: 35
}];

const COLORS = ['#0d9488', '#3b82f6'];
export function FinanceDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Finance Console
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Platform revenue, payouts, and financial metrics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Revenue (YTD)"
          value="145.2k TND"
          icon={DollarSign}
          trend={{
            value: 18,
            isPositive: true
          }} />
        
        <StatCard
          title="Platform Commissions"
          value="42.5k TND"
          icon={ArrowDownRight}
          trend={{
            value: 12,
            isPositive: true
          }} />
        
        <StatCard
          title="Provider Payouts"
          value="98.4k TND"
          icon={ArrowUpRight} />
        
        <StatCard
          title="Pending Payouts"
          value="12.3k TND"
          icon={CreditCard}
          description="Awaiting transfer" />
        
        <StatCard
          title="Refunds"
          value="1.2k TND"
          icon={RefreshCw}
          trend={{
            value: 2,
            isPositive: false
          }} />
        
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">
            Revenue Trend (6 Months)
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={monthlyTrend}
                margin={{
                  top: 5,
                  right: 20,
                  left: 0,
                  bottom: 5
                }}>
                
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
                  }} />
                
                <Legend
                  iconType="circle"
                  wrapperStyle={{
                    fontSize: '12px'
                  }} />
                
                <Line
                  type="monotone"
                  dataKey="commission"
                  name="Commissions"
                  stroke="#0d9488"
                  strokeWidth={3}
                  dot={{
                    r: 4
                  }}
                  activeDot={{
                    r: 6
                  }} />
                
                <Line
                  type="monotone"
                  dataKey="subscription"
                  name="Subscriptions"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{
                    r: 4
                  }}
                  activeDot={{
                    r: 6
                  }} />
                
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue by Service */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">
            Revenue by Service Type
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={revenueByService}
                layout="vertical"
                margin={{
                  top: 5,
                  right: 20,
                  left: 20,
                  bottom: 5
                }}>
                
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="#334155"
                  opacity={0.2} />
                
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12,
                    fill: '#64748b'
                  }}
                  tickFormatter={(val) => `${val / 1000}k`} />
                
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12,
                    fill: '#64748b'
                  }}
                  width={80} />
                
                <Tooltip
                  cursor={{
                    fill: '#334155',
                    opacity: 0.1
                  }}
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '12px'
                  }}
                  formatter={(value: number) => [`${value} TND`, 'Revenue']} />
                
                <Bar
                  dataKey="revenue"
                  fill="#0d9488"
                  radius={[0, 4, 4, 0]}
                  barSize={24} />
                
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Split */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">
            Revenue Split
          </h3>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueSplit}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value">
                  
                  {revenueSplit.map((entry, index) =>
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]} />

                  )}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '12px'
                  }}
                  formatter={(value: number) => [`${value}%`, 'Share']} />
                
                <Legend
                  iconType="circle"
                  wrapperStyle={{
                    fontSize: '12px'
                  }} />
                
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Earners */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">
            Top Earning Providers
          </h3>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) =>
            <div
              key={i}
              className="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-900/50 rounded-md transition-colors">
              
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-500">
                    {i}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      Dr. Provider {i}
                    </p>
                    <p className="text-xs text-slate-500">Nursing</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {15000 - i * 1500} TND
                  </p>
                  <p className="text-xs text-teal-600 dark:text-teal-400">
                    {300 - i * 20} bookings
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>);

}