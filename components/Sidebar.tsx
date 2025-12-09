
import React from 'react';
import { ViewState } from '../types';
import { LayoutDashboard, Users, LogOut, Trash2, ShieldCheck, FileKey, ScanEye } from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, onLogout }) => {
  const menuItems = [
    { id: ViewState.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: ViewState.ANALYSIS, label: 'AI Sentry', icon: ScanEye },
    { id: ViewState.EVIDENCE_LOCKER, label: 'Evidence Locker', icon: FileKey },
    { id: ViewState.SECURITY, label: 'Security Center', icon: ShieldCheck },
    { id: ViewState.WORKFORCE, label: 'Workforce', icon: Users },
  ];

  return (
    <div className="w-72 bg-white flex flex-col h-full border-r border-slate-200 shadow-sm z-20">
      {/* Header */}
      <div className="p-8 pb-4">
        <div className="flex items-center gap-3 mb-1">
           <div className="p-2 bg-green-50 rounded-lg text-brand-primary">
             <Trash2 size={24} strokeWidth={2.5} />
           </div>
           <div>
             <h1 className="text-xl font-bold text-slate-800 leading-none">Smart Waste</h1>
             <span className="text-xs font-medium text-slate-400">Safety & Alerts</span>
           </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 font-medium ${
                isActive 
                  ? 'bg-green-50 text-brand-primary shadow-sm border-l-4 border-brand-primary' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-slate-100">
        <div className="bg-slate-50 rounded-xl p-4 mb-4">
            <p className="text-xs font-semibold text-slate-500 uppercase mb-1">System Status</p>
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm font-medium text-slate-700">Online & Secure</span>
            </div>
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-2 text-slate-400 hover:text-red-500 transition-colors text-sm font-medium"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
