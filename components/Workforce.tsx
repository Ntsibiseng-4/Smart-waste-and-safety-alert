
import React from 'react';
import { Worker } from '../types';
import { UserCheck, Clock, MapPin, Briefcase } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const workers: Worker[] = [
  { id: '1', name: 'Thabo M.', role: 'IoT Installer', status: 'active', location: 'Zone A - North' },
  { id: '2', name: 'Lerato K.', role: 'Monitor', status: 'active', location: 'Zone B - Central' },
  { id: '3', name: 'Sipho Z.', role: 'Data Asst.', status: 'on-break', location: 'HQ' },
  { id: '4', name: 'Nandi P.', role: 'Maintenance', status: 'active', location: 'Zone A - South' },
  { id: '5', name: 'David L.', role: 'IoT Installer', status: 'offline', location: 'Zone C' },
];

const jobGrowthData = [
  { month: 'Jan', jobs: 5 },
  { month: 'Feb', jobs: 8 },
  { month: 'Mar', jobs: 12 },
  { month: 'Apr', jobs: 18 },
  { month: 'May', jobs: 24 },
  { month: 'Jun', jobs: 32 },
];

const Workforce: React.FC = () => {
  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      <header>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Community Workforce</h2>
        <p className="text-slate-500">
          Empowering youth through technology roles. Integrated Safety Alerts job creation program.
        </p>
      </header>

      {/* Impact Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-gradient-to-br from-brand-primary to-emerald-600 p-8 rounded-3xl shadow-lg text-white">
          <div className="flex items-center gap-4 mb-6">
             <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                <Briefcase size={32} className="text-white" />
             </div>
             <div>
               <h3 className="text-4xl font-bold">32</h3>
               <p className="text-emerald-100 font-medium">Jobs Created</p>
             </div>
          </div>
          <p className="text-emerald-100/80 text-sm">Roles include IoT Installers, Data Monitors, and Support Staff.</p>
        </div>

        <div className="md:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
           <h3 className="text-lg font-bold text-slate-800 mb-6">Employment Growth</h3>
           <div className="h-40">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={jobGrowthData}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                 <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                 <Tooltip 
                    cursor={{fill: '#F8FAFC'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                 />
                 <Bar dataKey="jobs" fill="#10B981" radius={[6, 6, 0, 0]} barSize={40} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>

      {/* Active Personnel List */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-800">Active Personnel</h3>
        </div>
        <div className="divide-y divide-slate-50">
          {workers.map((worker) => (
            <div key={worker.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-lg">
                  {worker.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{worker.name}</h4>
                  <p className="text-sm text-slate-500 font-medium">{worker.role}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-8 text-sm">
                <div className="flex items-center gap-2 text-slate-500">
                  <MapPin size={16} />
                  <span>{worker.location}</span>
                </div>
                <div className="w-24">
                  {worker.status === 'active' && (
                    <span className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-3 py-1.5 rounded-lg">
                      <UserCheck size={16} /> Active
                    </span>
                  )}
                  {worker.status === 'on-break' && (
                    <span className="flex items-center gap-2 text-orange-500 font-bold bg-orange-50 px-3 py-1.5 rounded-lg">
                      <Clock size={16} /> Break
                    </span>
                  )}
                  {worker.status === 'offline' && (
                    <span className="flex items-center gap-2 text-slate-400 font-bold bg-slate-100 px-3 py-1.5 rounded-lg">
                      <UserCheck size={16} /> Offline
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Workforce;
