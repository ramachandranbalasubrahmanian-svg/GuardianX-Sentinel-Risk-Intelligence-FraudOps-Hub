/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { ReactNode, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { TrendingUp, AlertTriangle, CheckCircle, ShieldCheck, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Transaction, TransactionStatus } from '../types';

const fraudTrends = [
  { time: '00:00', score: 12 },
  { time: '04:00', score: 8 },
  { time: '08:00', score: 25 },
  { time: '12:00', score: 45 },
  { time: '16:00', score: 32 },
  { time: '20:00', score: 18 },
  { time: '23:59', score: 14 },
];

const categoryData = [
  { name: 'Retail', value: 400, color: '#10b981' },
  { name: 'Travel', value: 300, color: '#06b6d4' },
  { name: 'Crypto', value: 200, color: '#6366f1' },
  { name: 'Cash', value: 100, color: '#f59e0b' },
];

interface StatsCardProps {
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  icon: ReactNode;
}

function StatCard({ title, value, change, isPositive, icon }: StatsCardProps) {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="flex justify-between items-start mb-3">
        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-wider rounded-full px-2.5 py-0.5 ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {change}
        </div>
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
      </div>
    </div>
  );
}

export function Overview({ privacyMode, transactions }: { privacyMode: boolean, transactions: Transaction[] }) {
  const stats = useMemo(() => {
    const total = transactions.length;
    const fraudPrevented = transactions
      .filter(tx => tx.status === TransactionStatus.REJECTED)
      .reduce((acc, tx) => acc + tx.amount, 0);
    const avgScore = transactions.reduce((acc, tx) => acc + tx.fraudScore, 0) / total;
    
    const decisions = transactions.filter(tx => tx.status === TransactionStatus.APPROVED || tx.status === TransactionStatus.REJECTED).length;
    const approvedFlagged = transactions.filter(tx => tx.status === TransactionStatus.APPROVED && tx.fraudScore > 50).length;
    const fpr = decisions > 0 ? (approvedFlagged / decisions) * 100 : 0;

    return { total, fraudPrevented, avgScore, fpr };
  }, [transactions]);

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Analyzed" 
          value={stats.total} 
          change="+12%" 
          isPositive={true} 
          icon={<ShieldCheck className="w-5 h-5 text-indigo-600" />} 
        />
        <StatCard 
          title="Fraud Prevented" 
          value={`$${stats.fraudPrevented.toLocaleString()}`} 
          change="+8.2%" 
          isPositive={true} 
          icon={<AlertTriangle className="w-5 h-5 text-amber-600" />} 
        />
        <StatCard 
          title="Avg. Scrutiny Score" 
          value={stats.avgScore.toFixed(1)} 
          change="-3.1%" 
          isPositive={false} 
          icon={<TrendingUp className="w-5 h-5 text-indigo-600" />} 
        />
        <StatCard 
          title="False Positive Rate" 
          value={`${stats.fpr.toFixed(2)}%`} 
          change="-0.05%" 
          isPositive={false} 
          icon={<CheckCircle className="w-5 h-5 text-indigo-600" />} 
        />
      </div>


      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-50">
            <div>
              <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider">Transaction Scrutiny Flow</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Real-time threat level monitoring</p>
            </div>
            <div className="flex gap-4">
              <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                Normal
              </span>
              <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Aggression
              </span>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={fraudTrends}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="time" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} 
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#6366f1" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#colorScore)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider mb-1">High Risk Vertical Distribution</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mb-8">Volume by sector</p>
          <div className="flex-1 min-h-[200px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-2xl font-black text-slate-800 tracking-tighter">4.2M</p>
                <p className="text-[9px] uppercase font-bold text-slate-400 tracking-widest leading-none">Scrutinized</p>
              </div>
            </div>
          </div>
          <div className="space-y-4 mt-6 pt-6 border-t border-slate-50">
            {categoryData.map(item => (
              <div key={item.name} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.name}</span>
                </div>
                <span className="text-xs font-black text-slate-900">{(item.value / 10).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#0F172A] p-10 rounded-2xl text-white overflow-hidden relative group border border-slate-800">
        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-3 mb-6">
             <div className="bg-indigo-500 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
                <ShieldCheck className="w-6 h-6 text-white" />
             </div>
             <div>
                <h3 className="text-xl font-bold tracking-tight">Consortium Intelligence Active</h3>
                <p className="text-xs text-indigo-400 font-bold uppercase tracking-widest">Ensemble Model v2.4.1</p>
             </div>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed mb-8 font-medium">
            GuardianX is currently synchronizing with global fraud lists. 
            Real-time scrutiny is active across 124 regions with an average latency of <span className="text-white font-bold">142ms</span>.
          </p>
          <div className="flex gap-4">
            <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-3 px-8 rounded-xl transition-all shadow-xl shadow-indigo-600/20 active:scale-95">
              Initiate Risk Sweep
            </button>
            <button className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-3 px-8 rounded-xl transition-all border border-slate-700">
              System Audit Logs
            </button>
          </div>
        </div>
        {/* Decorative Grid Effect */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
      </div>
    </div>
  );
}
