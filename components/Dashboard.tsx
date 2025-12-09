
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { AlertTriangle, TrendingUp, Activity, CheckCircle, Shield, Droplets, Thermometer, Wind, Sun } from 'lucide-react';
import { Alert } from '../types';

interface DashboardProps {
  recentAlerts: Alert[];
}

const data = [
  { name: 'Mon', waste: 40, safety: 90 },
  { name: 'Tue', waste: 30, safety: 92 },
  { name: 'Wed', waste: 65, safety: 85 },
  { name: 'Thu', waste: 45, safety: 88 },
  { name: 'Fri', waste: 80, safety: 70 },
  { name: 'Sat', waste: 55, safety: 85 },
  { name: 'Sun', waste: 35, safety: 95 },
];

const collectionData = [
  { name: 'Zone A', value: 85 },
  { name: 'Zone B', value: 45 },
  { name: 'Zone C', value: 92 },
  { name: 'Zone D', value: 30 },
];

const Dashboard: React.FC<DashboardProps> = ({ recentAlerts }) => {
  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      <header className="flex justify-between items-end">
        <div>
           <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Community Dashboard</h2>
           <p className="text-slate-500 mt-1">Real-time overview of waste levels and safety conditions</p>
        </div>
        <div className="text-right text-sm text-slate-400">
             {new Date().toLocaleDateString('en-ZA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Chart Section */}
          <div className="lg:col-span-2 space-y-8">
              {/* Trends Card */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Safety & Waste Trends</h3>
                        <p className="text-xs text-slate-400">Weekly analysis</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                            <span className="w-3 h-3 rounded-full bg-green-400"></span> Safety Score
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                             <span className="w-3 h-3 rounded-full bg-orange-400"></span> Waste Level
                        </div>
                    </div>
                </div>
                <div className="h-[320px]">
                    <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                        <linearGradient id="colorWaste" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#FB923C" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#FB923C" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorSafety" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#34D399" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#34D399" stopOpacity={0}/>
                        </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                        <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', border: 'none' }}
                        itemStyle={{ color: '#64748B' }}
                        />
                        <Area type="monotone" dataKey="waste" stroke="#FB923C" strokeWidth={3} fillOpacity={1} fill="url(#colorWaste)" />
                        <Area type="monotone" dataKey="safety" stroke="#34D399" strokeWidth={3} fillOpacity={1} fill="url(#colorSafety)" />
                    </AreaChart>
                    </ResponsiveContainer>
                </div>
              </div>

              {/* Status Grid (Reference Style) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: 'Active Alerts', value: recentAlerts.length.toString(), icon: AlertTriangle, color: 'bg-red-50 text-red-500', sub: 'Action Req.' },
                  { label: 'System Status', value: 'SECURE', icon: Shield, color: 'bg-green-50 text-green-500', sub: 'Encrypted' },
                  { label: 'Active Sensors', value: '143', icon: Activity, color: 'bg-blue-50 text-blue-500', sub: '98% Online' },
                  { label: 'Resolved', value: '12', icon: CheckCircle, color: 'bg-purple-50 text-purple-500', sub: 'Today' },
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between h-32">
                    <div className="flex justify-between items-start">
                        <div className={`p-2.5 rounded-xl ${stat.color}`}>
                            <stat.icon size={20} />
                        </div>
                        <span className="text-2xl font-bold text-slate-800">{stat.value}</span>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-600">{stat.label}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{stat.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
             {/* Zone Efficiency */}
             <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Zone Efficiency</h3>
                <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={collectionData} layout="vertical" barSize={20}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" stroke="#94A3B8" width={60} tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                        <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Bar dataKey="value" radius={[0, 10, 10, 0]}>
                            {collectionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.value < 50 ? '#F87171' : '#34D399'} />
                            ))}
                        </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
             </div>

             {/* Recent Alerts List */}
             <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex-1">
                <div className="flex justify-between items-center mb-4">
                     <h3 className="text-lg font-bold text-slate-800">Live Alerts</h3>
                     <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                </div>
                <div className="space-y-4">
                    {recentAlerts.slice(0, 4).map(alert => (
                        <div key={alert.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex gap-4 items-start">
                            <div className={`p-2 rounded-lg shrink-0 ${alert.severity === 'high' ? 'bg-red-100 text-red-500' : 'bg-orange-100 text-orange-500'}`}>
                                <AlertTriangle size={18} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-700">{alert.message}</h4>
                                <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                                    <span>{alert.location}</span>
                                    <span>•</span>
                                    <span>{alert.timestamp}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {recentAlerts.length === 0 && (
                        <p className="text-center text-slate-400 py-8 text-sm">No active alerts.</p>
                    )}
                </div>
             </div>
          </div>
      </div>
    </div>
  );
};

export default Dashboard;
