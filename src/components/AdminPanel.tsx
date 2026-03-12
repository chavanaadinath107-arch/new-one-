import React, { useState } from 'react';
import { 
  Settings, 
  Users, 
  Database, 
  ShieldAlert, 
  BarChart3, 
  RefreshCw, 
  CheckCircle2,
  AlertCircle,
  Activity
} from 'lucide-react';
import { cn } from '../utils';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Total Users', value: '1,284', change: '+12%', icon: Users, color: 'text-blue-500', bgColor: 'bg-blue-50' },
    { label: 'Active Sessions', value: '42', change: '-5%', icon: Activity, color: 'text-emerald-500', bgColor: 'bg-emerald-50' },
    { label: 'API Calls (24h)', value: '8,492', change: '+24%', icon: Database, color: 'text-purple-500', bgColor: 'bg-purple-50' },
    { label: 'System Health', value: '99.9%', change: 'Stable', icon: ShieldAlert, color: 'text-orange-500', bgColor: 'bg-orange-50' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
          <p className="text-zinc-500">Manage platform settings and monitor system performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-zinc-100 rounded-xl text-sm font-bold hover:bg-zinc-200 transition-all flex items-center gap-2">
            <RefreshCw size={16} />
            Refresh Data
          </button>
          <button className="px-4 py-2 bg-zinc-900 text-white rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all flex items-center gap-2">
            <Settings size={16} />
            Settings
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white border border-black/5 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stat.bgColor, stat.color)}>
                <stat.icon size={20} />
              </div>
              <span className={cn(
                "text-xs font-bold px-2 py-0.5 rounded-full",
                stat.change.startsWith('+') ? "bg-emerald-100 text-emerald-700" : 
                stat.change === 'Stable' ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"
              )}>
                {stat.change}
              </span>
            </div>
            <div>
              <div className="text-2xl font-mono font-bold">{stat.value}</div>
              <div className="text-xs text-zinc-400 font-medium uppercase tracking-wider">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* System Logs */}
        <div className="lg:col-span-2 bg-white border border-black/5 rounded-[2.5rem] overflow-hidden shadow-sm">
          <div className="p-6 border-b border-black/5 flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2">
              <BarChart3 size={18} className="text-zinc-400" />
              System Activity Logs
            </h3>
            <button className="text-xs font-bold text-emerald-600 hover:underline">View All</button>
          </div>
          <div className="divide-y divide-black/5">
            {[
              { event: 'AI Model Update', status: 'Success', time: '2 mins ago', icon: CheckCircle2, color: 'text-emerald-500' },
              { event: 'Database Backup', status: 'Success', time: '1 hour ago', icon: CheckCircle2, color: 'text-emerald-500' },
              { event: 'API Rate Limit Warning', status: 'Warning', time: '3 hours ago', icon: AlertCircle, color: 'text-orange-500' },
              { event: 'New User Registered', status: 'Info', time: '5 hours ago', icon: Users, color: 'text-blue-500' },
            ].map((log, i) => (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-zinc-50 transition-colors">
                <div className="flex items-center gap-4">
                  <log.icon size={18} className={log.color} />
                  <div>
                    <div className="text-sm font-bold text-zinc-800">{log.event}</div>
                    <div className="text-[10px] text-zinc-400 font-medium uppercase">{log.status}</div>
                  </div>
                </div>
                <div className="text-xs text-zinc-400 font-mono">{log.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-zinc-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-zinc-900/20 space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <ShieldAlert size={20} className="text-orange-400" />
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-sm font-bold transition-all text-left px-5">
                Clear System Cache
              </button>
              <button className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-sm font-bold transition-all text-left px-5">
                Re-index Search Engine
              </button>
              <button className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-sm font-bold transition-all text-left px-5">
                Generate Usage Report
              </button>
              <button className="w-full py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/20 rounded-2xl text-sm font-bold transition-all text-red-400 text-left px-5">
                Emergency System Halt
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
