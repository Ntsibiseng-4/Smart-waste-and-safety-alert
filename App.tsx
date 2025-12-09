
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Analysis from './components/Analysis';
import Workforce from './components/Workforce';
import Security from './components/Security';
import Login from './components/Login';
import EvidenceLocker from './components/EvidenceLocker';
import { ViewState, Alert, EvidenceItem } from './types';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  
  // App State persistence
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 'init-1',
      type: 'waste',
      severity: 'medium',
      message: 'Bin overflow detected near School Zone',
      location: 'Camera 04 - School St',
      timestamp: '08:30 AM'
    },
    {
      id: 'init-2',
      type: 'road',
      severity: 'high',
      message: 'Blocked pathway reported',
      location: 'Sector 7 Access Road',
      timestamp: '09:15 AM'
    }
  ]);

  // Evidence State
  const [evidenceStore, setEvidenceStore] = useState<EvidenceItem[]>([]);

  const handleNewAlert = (alert: Alert) => {
    setAlerts(prev => [alert, ...prev]);
  };

  const handleEvidenceCaptured = (item: EvidenceItem) => {
      setEvidenceStore(prev => [item, ...prev]);
  };

  const handleRequestAccess = (id: string, requester: string, reason: string) => {
    setEvidenceStore(prev => prev.map(e => e.id === id ? { 
        ...e, 
        status: 'REQUESTED',
        requesterName: requester,
        requestReason: reason
    } : e));
  };

  const handleApproveAccess = (id: string, admin: string) => {
    setEvidenceStore(prev => prev.map(e => e.id === id ? { ...e, status: 'APPROVED' } : e));
  };

  const handleDenyAccess = (id: string, admin: string) => {
    setEvidenceStore(prev => prev.map(e => e.id === id ? { ...e, status: 'DENIED' } : e));
  };

  const handleUnlockEvidence = (id: string) => {
      setEvidenceStore(prev => prev.map(e => e.id === id ? { ...e, status: 'UNLOCKED' } : e));
  };

  const handleVerifyIntegrity = (id: string) => {
    setEvidenceStore(prev => prev.map(e => e.id === id ? { ...e, integrityStatus: 'verified' } : e));
  };

  const handleRevokeAccess = (id: string) => {
    setEvidenceStore(prev => prev.map(e => e.id === id ? { ...e, status: 'LOCKED', decryptionKey: undefined } : e));
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-brand-background text-brand-dark font-sans overflow-hidden">
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        onLogout={handleLogout}
      />
      
      <main className="flex-1 h-full overflow-hidden relative flex flex-col">
        {/* Top Bar / Header could go here if needed, but sidebar covers it for this design */}
        <div className="flex-1 overflow-y-auto relative p-2">
          {currentView === ViewState.DASHBOARD && (
            <Dashboard recentAlerts={alerts} />
          )}
          {currentView === ViewState.ANALYSIS && (
            <Analysis onNewAlert={handleNewAlert} onEvidenceCaptured={handleEvidenceCaptured} />
          )}
          {currentView === ViewState.EVIDENCE_LOCKER && (
            <EvidenceLocker 
                evidenceList={evidenceStore}
                onRequestAccess={handleRequestAccess}
                onApproveAccess={handleApproveAccess}
                onDenyAccess={handleDenyAccess}
                onUnlock={handleUnlockEvidence}
                onVerifyIntegrity={handleVerifyIntegrity}
                onRevokeAccess={handleRevokeAccess}
            />
          )}
          {currentView === ViewState.SECURITY && (
            <Security />
          )}
          {currentView === ViewState.WORKFORCE && (
            <Workforce />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
