
import React from 'react';
import { ShieldCheck, Lock, AlertOctagon, FileText, Server, Globe, Users, EyeOff, FileCheck, Shield, CheckCircle } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, Tooltip, XAxis } from 'recharts';

const trafficData = [
  { time: '00:00', traffic: 120, threats: 2 },
  { time: '04:00', traffic: 80, threats: 1 },
  { time: '08:00', traffic: 450, threats: 12 },
  { time: '12:00', traffic: 680, threats: 8 },
  { time: '16:00', traffic: 590, threats: 5 },
  { time: '20:00', traffic: 300, threats: 3 },
  { time: '23:59', traffic: 150, threats: 0 },
];

const Security: React.FC = () => {
  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
            <ShieldCheck className="text-brand-primary" size={32} />
            Security Operations
          </h2>
          <p className="text-slate-500 mt-1">Real-time threat monitoring and system integrity.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-xl">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-green-700 font-bold text-sm">SYSTEM SECURE</span>
        </div>
      </header>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Encryption Status */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <Lock size={120} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-6">Encryption Protocols</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-50">
              <span className="text-slate-500 text-sm font-medium">Data at Rest</span>
              <span className="text-green-600 font-mono text-sm bg-green-50 px-2 py-1 rounded">AES-256</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-50">
              <span className="text-slate-500 text-sm font-medium">Data in Transit</span>
              <span className="text-green-600 font-mono text-sm bg-green-50 px-2 py-1 rounded">TLS 1.3</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm font-medium">Key Rotation</span>
              <div className="flex items-center gap-1.5 text-green-600 font-bold text-xs">
                  <CheckCircle size={14} /> Active
              </div>
            </div>
          </div>
        </div>

        {/* Network Status */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Globe size={20} className="text-blue-500" /> Network Activity
          </h3>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData}>
                <defs>
                  <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="time" hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="traffic" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorTraffic)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

         {/* Threat Intelligence */}
         <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <AlertOctagon size={20} className="text-red-500" /> Active Threats
          </h3>
          <div className="flex flex-col items-center justify-center h-32">
             <div className="text-6xl font-black text-slate-800 mb-1">0</div>
             <p className="text-slate-400 text-sm font-medium">Intrusions Detected</p>
             <p className="text-xs text-green-500 mt-2 bg-green-50 px-2 py-1 rounded-full">Last scan: 1 min ago</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Device Integrity */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 bg-slate-50/50">
             <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
               <Server size={18} /> Device Integrity
             </h3>
          </div>
          <div className="p-4 space-y-3">
             {[
               { id: 'CAM-01', loc: 'Main St', status: 'Secure', ping: '12ms' },
               { id: 'CAM-04', loc: 'School Zone', status: 'Secure', ping: '15ms' },
               { id: 'SENS-88', loc: 'Market Sq', status: 'Secure', ping: '24ms' },
               { id: 'SENS-92', loc: 'Ind. Park', status: 'Secure', ping: '18ms' },
             ].map((device, i) => (
               <div key={i} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors shadow-sm">
                 <div className="flex items-center gap-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-sm shadow-green-200"></div>
                    <div>
                      <div className="text-sm font-bold text-slate-700">{device.id}</div>
                      <div className="text-xs text-slate-400">{device.loc}</div>
                    </div>
                 </div>
                 <div className="text-right">
                    <div className="text-xs text-green-600 bg-green-50 px-2.5 py-1 rounded-lg font-bold">{device.status}</div>
                    <div className="text-[10px] text-slate-400 mt-1">{device.ping}</div>
                 </div>
               </div>
             ))}
          </div>
        </div>

        {/* Audit Logs */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 bg-slate-50/50">
             <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
               <FileText size={18} /> Access Logs
             </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium">
                <tr>
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Event</th>
                  <th className="p-4">Source</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                 {[
                   { time: '10:42:15', event: 'API Handshake', src: '192.168.1.105', status: 'Success' },
                   { time: '10:40:22', event: 'User Login', src: 'Admin Console', status: 'Success' },
                   { time: '10:15:00', event: 'Firmware Update', src: 'OTA Server', status: 'Verified' },
                   { time: '09:55:12', event: 'Port Scan', src: '10.0.0.4', status: 'Blocked' },
                   { time: '09:30:45', event: 'Camera Feed', src: 'CAM-01', status: 'Encrypted' },
                 ].map((log, i) => (
                   <tr key={i} className="hover:bg-slate-50 transition-colors">
                     <td className="p-4 font-mono text-xs text-slate-500">{log.time}</td>
                     <td className="p-4 text-slate-700 font-medium">{log.event}</td>
                     <td className="p-4 text-slate-500">{log.src}</td>
                     <td className="p-4">
                       <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                         log.status === 'Blocked' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'
                       }`}>
                         {log.status}
                       </span>
                     </td>
                   </tr>
                 ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* DATA PROTECTION FRAMEWORK SECTION */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* WHO */}
            <div>
            <h4 className="text-lg font-bold text-slate-800 mb-8 flex items-center gap-2">
                <Users className="text-brand-primary" /> Who Protects the Data?
            </h4>
            <div className="space-y-6">
                <div className="flex gap-4 p-4 bg-slate-50 rounded-2xl">
                    <div className="mt-1">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                            <Server size={20} />
                        </div>
                    </div>
                    <div>
                        <h5 className="font-bold text-slate-800">1. Automated AI Guardians</h5>
                        <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                        The first line of defense. AI algorithms filter and anonymize data at the edge (on the camera) before it ever reaches the server.
                        </p>
                    </div>
                </div>
                <div className="flex gap-4 p-4 bg-slate-50 rounded-2xl">
                    <div className="mt-1">
                        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
                            <ShieldCheck size={20} />
                        </div>
                    </div>
                    <div>
                        <h5 className="font-bold text-slate-800">2. Security Administrators</h5>
                        <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                        Vetted personnel responsible for managing encryption keys and access requests.
                        </p>
                    </div>
                </div>
            </div>
            </div>

            {/* HOW */}
            <div>
            <h4 className="text-lg font-bold text-slate-800 mb-8 flex items-center gap-2">
                <Lock className="text-brand-primary" /> How is it Protected?
            </h4>
            <div className="space-y-4">
                {/* Protocol 1 */}
                <div className="group border border-slate-100 p-4 rounded-2xl hover:border-green-300 hover:shadow-sm transition-all bg-white">
                    <h5 className="font-bold text-slate-700 flex items-center gap-2 group-hover:text-green-600 transition-colors">
                        <EyeOff size={18} /> Privacy by Design (Edge Blurring)
                    </h5>
                    <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                        Personal identifiers (faces, license plates) are blurred instantly at the point of capture.
                    </p>
                </div>
                {/* Protocol 2 */}
                <div className="group border border-slate-100 p-4 rounded-2xl hover:border-green-300 hover:shadow-sm transition-all bg-white">
                    <h5 className="font-bold text-slate-700 flex items-center gap-2 group-hover:text-green-600 transition-colors">
                        <Lock size={18} /> Military-Grade Encryption
                    </h5>
                    <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                        All evidence is secured using AES-256. Unreadable without specific decryption keys.
                    </p>
                </div>
                {/* Protocol 3 */}
                <div className="group border border-slate-100 p-4 rounded-2xl hover:border-green-300 hover:shadow-sm transition-all bg-white">
                    <h5 className="font-bold text-slate-700 flex items-center gap-2 group-hover:text-green-600 transition-colors">
                        <FileCheck size={18} /> Immutable Audit Logs
                    </h5>
                    <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                        Every action—capture, request, approval, view—is permanently recorded.
                    </p>
                </div>
            </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Security;
