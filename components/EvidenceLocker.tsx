
import React, { useState } from 'react';
import { EvidenceItem } from '../types';
import { Lock, Unlock, Eye, FileText, Shield, User, FileKey, FileCheck, X, AlertOctagon, ShieldCheck, Binary, ArchiveRestore, Loader2 } from 'lucide-react';

interface EvidenceLockerProps {
  evidenceList: EvidenceItem[];
  onRequestAccess: (id: string, requester: string, reason: string) => void;
  onApproveAccess: (id: string, admin: string) => void;
  onDenyAccess: (id: string, admin: string) => void;
  onUnlock: (id: string) => void;
  onVerifyIntegrity: (id: string) => void;
  onRevokeAccess: (id: string) => void;
}

type UserRole = 'OFFICER' | 'ADMIN';

const EvidenceLocker: React.FC<EvidenceLockerProps> = ({ 
  evidenceList, 
  onRequestAccess, 
  onApproveAccess,
  onDenyAccess,
  onUnlock,
  onVerifyIntegrity,
  onRevokeAccess
}) => {
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('OFFICER');
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [inspectingItem, setInspectingItem] = useState<EvidenceItem | null>(null);

  // Request Access Modal State
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestTargetId, setRequestTargetId] = useState<string | null>(null);
  const [requesterName, setRequesterName] = useState('');
  const [requestReason, setRequestReason] = useState('');

  const selectedItem = evidenceList.find(e => e.id === selectedEvidenceId);

  const openRequestModal = (id: string) => {
      setRequestTargetId(id);
      setRequesterName('');
      setRequestReason('');
      setShowRequestModal(true);
  };

  const handleRequestSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (requestTargetId && requesterName && requestReason) {
          onRequestAccess(requestTargetId, requesterName, requestReason);
          setShowRequestModal(false);
          setRequestTargetId(null);
      }
  };

  const handleVerify = (id: string) => {
    setVerifyingId(id);
    setTimeout(() => {
        onVerifyIntegrity(id);
        setVerifyingId(null);
    }, 1500);
  };

  const getVisualEncryptedPayload = (shortData: string) => {
      let payload = shortData + " ";
      for(let i=0; i<20; i++) {
          payload += btoa(shortData + i).substring(0, 50);
      }
      return payload;
  };

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      
      {/* REQUEST ACCESS MODAL */}
      {showRequestModal && (
          <div className="absolute inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 animate-in fade-in zoom-in-95">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                          <FileText size={24} />
                      </div>
                      <div>
                          <h3 className="text-xl font-bold text-slate-800">Request Access</h3>
                          <p className="text-xs text-slate-500">Submit justification for decryption</p>
                      </div>
                  </div>
                  <form onSubmit={handleRequestSubmit} className="space-y-4">
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Officer Name / ID</label>
                          <input 
                              type="text" 
                              required
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-800 focus:outline-none focus:border-blue-500 transition-colors"
                              placeholder="e.g. Officer J. Doe (ID-774)"
                              value={requesterName}
                              onChange={e => setRequesterName(e.target.value)}
                          />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Reason for Access</label>
                          <textarea 
                              required
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-800 focus:outline-none focus:border-blue-500 h-24 resize-none transition-colors"
                              placeholder="Describe necessity..."
                              value={requestReason}
                              onChange={e => setRequestReason(e.target.value)}
                          />
                      </div>
                      <div className="flex gap-3 pt-4">
                          <button 
                              type="button" 
                              onClick={() => setShowRequestModal(false)}
                              className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium transition-colors"
                          >
                              Cancel
                          </button>
                          <button 
                              type="submit" 
                              className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-200 transition-colors"
                          >
                              Submit
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      {/* FORENSICS MODAL */}
      {inspectingItem && (
        <div className="absolute inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-6">
             <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl flex flex-col h-[80vh] overflow-hidden animate-in fade-in zoom-in-95">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm text-slate-700">
                             <Binary size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Forensics Inspection</h3>
                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                                <span className="font-mono">ID: {inspectingItem.id}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                <span>SHA-256 CHECK</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setInspectingItem(null)} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-colors"><X /></button>
                </div>
                
                <div className="flex-1 p-8 overflow-hidden flex flex-col gap-6 bg-slate-50/50">
                    <div className="grid grid-cols-3 gap-6">
                         <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                             <div className="text-xs font-bold text-slate-400 mb-2 uppercase">Protocol</div>
                             <div className="text-green-600 font-mono font-bold flex items-center gap-2">
                                 <Lock size={16} /> AES-256-GCM
                             </div>
                         </div>
                         <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                             <div className="text-xs font-bold text-slate-400 mb-2 uppercase">Signature</div>
                             <div className="text-blue-600 font-mono font-bold truncate">
                                 0x89 0x50 0x4E ...
                             </div>
                         </div>
                         <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                             <div className="text-xs font-bold text-slate-400 mb-2 uppercase">Status</div>
                             <div className="text-red-500 font-mono font-bold flex items-center gap-2">
                                 <Eye size={16} /> UNREADABLE
                             </div>
                         </div>
                    </div>

                    <div className="flex-1 bg-slate-900 rounded-2xl p-6 overflow-auto font-mono text-xs relative shadow-inner">
                        <div className="absolute top-4 right-4 px-2 py-1 bg-red-900/30 text-red-400 border border-red-500/30 rounded text-[10px] font-bold">
                            ENCRYPTED CONTENT
                        </div>
                        <div className="text-slate-500 break-all leading-relaxed">
                            {getVisualEncryptedPayload(inspectingItem.encryptedData)}
                            {getVisualEncryptedPayload(inspectingItem.encryptedData)}
                            {getVisualEncryptedPayload(inspectingItem.encryptedData)}
                        </div>
                    </div>

                    <div className="text-center text-xs text-slate-400">
                        Verification Complete: Data is strictly ciphertext.
                    </div>
                </div>
             </div>
        </div>
      )}

      {/* DECRYPTED VIEWER */}
      {selectedItem && (
          <div className="absolute inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6">
              <div className="w-full h-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
                  <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                      <div className="flex items-center gap-4">
                          <div className="bg-green-100 p-2 rounded-xl text-green-600">
                              <Unlock size={24} />
                          </div>
                          <div>
                              <h3 className="text-xl font-bold text-slate-800">Decrypted Evidence</h3>
                              <p className="text-xs text-green-600 font-medium">Secure Channel • {selectedItem.id}</p>
                          </div>
                      </div>
                      <button 
                          onClick={() => setSelectedEvidenceId(null)}
                          className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"
                      >
                          <X size={24} />
                      </button>
                  </div>

                  <div className="flex-1 flex overflow-hidden">
                      <div className="flex-1 bg-slate-100 relative flex items-center justify-center p-8">
                          <div className="relative w-full h-full shadow-lg rounded-xl overflow-hidden bg-black">
                             {selectedItem.originalData ? (
                                <img src={selectedItem.originalData} className="w-full h-full object-contain" alt="Evidence" />
                             ) : (
                                <div className="text-red-400 flex flex-col items-center justify-center h-full">
                                    <Lock size={48} />
                                    <span className="mt-2">Decryption Error</span>
                                </div>
                             )}
                          </div>
                          <div className="absolute bottom-6 right-6 px-3 py-1 bg-white/90 backdrop-blur rounded-lg text-xs font-mono text-green-600 font-bold shadow-sm">
                              AES-256 DECRYPTED
                          </div>
                      </div>

                      <div className="w-80 bg-white border-l border-slate-100 p-6 overflow-y-auto">
                          <h4 className="text-slate-800 font-bold mb-4 pb-2 border-b border-slate-100">Metadata</h4>
                          
                          <div className="space-y-6">
                              <div>
                                  <label className="text-xs text-slate-400 uppercase font-bold block mb-1">Timestamp</label>
                                  <span className="text-slate-700 font-mono text-sm">{selectedItem.timestamp}</span>
                              </div>
                              <div>
                                  <label className="text-xs text-slate-400 uppercase font-bold block mb-1">Location</label>
                                  <span className="text-slate-700 text-sm">{selectedItem.location}</span>
                              </div>
                              <div>
                                  <label className="text-xs text-slate-400 uppercase font-bold block mb-1">Hazards</label>
                                  <div className="flex flex-wrap gap-2 mt-1">
                                      {selectedItem.aiAnalysis?.hazards.map((h, i) => (
                                          <span key={i} className="px-2 py-1 bg-red-50 text-red-500 rounded-lg text-xs font-medium border border-red-100">{h}</span>
                                      ))}
                                      {selectedItem.aiAnalysis?.isDumpingDetected && (
                                          <span className="px-2 py-1 bg-red-600 text-white rounded-lg text-xs font-bold shadow-sm shadow-red-200">ILLEGAL DUMPING</span>
                                      )}
                                  </div>
                              </div>
                              <div className="bg-slate-50 p-4 rounded-xl">
                                  <label className="text-xs text-slate-400 uppercase font-bold block mb-2">AI Summary</label>
                                  <p className="text-slate-600 leading-relaxed text-sm">
                                      {selectedItem.aiAnalysis?.description}
                                  </p>
                              </div>
                              
                              <div className="pt-4 border-t border-slate-100">
                                  <div className="flex items-center gap-2 text-green-600 text-xs font-medium mb-2">
                                      <ShieldCheck size={14} />
                                      <span>Chain of Custody Verified</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-green-600 text-xs font-medium">
                                      <FileCheck size={14} />
                                      <span>Digital Signature Valid</span>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Evidence Vault</h2>
          <p className="text-slate-500 mt-1">
            Secure, encrypted storage repository with role-based access control.
          </p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
            <button 
                onClick={() => setCurrentUserRole('OFFICER')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentUserRole === 'OFFICER' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
                <User size={16} /> Officer View
            </button>
            <button 
                onClick={() => setCurrentUserRole('ADMIN')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentUserRole === 'ADMIN' ? 'bg-red-50 text-red-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
                <Shield size={16} /> Admin View
            </button>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto min-h-[500px]">
            {evidenceList.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-96 bg-white rounded-3xl border-2 border-dashed border-slate-100 text-slate-300">
                    <div className="p-6 bg-slate-50 rounded-full mb-4">
                         <Lock size={48} />
                    </div>
                    <p className="font-medium">Vault Empty</p>
                    <p className="text-sm">No incidents recorded yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {evidenceList.map(item => (
                        <div key={item.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col group">
                            {/* Card Header */}
                            <div className="p-4 border-b border-slate-50 flex justify-between items-center">
                                <span className="font-mono text-xs text-slate-400 font-medium">{item.id}</span>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${
                                    item.status === 'UNLOCKED' ? 'bg-green-50 text-green-600 border-green-100' :
                                    item.status === 'REQUESTED' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
                                    item.status === 'DENIED' ? 'bg-red-50 text-red-600 border-red-100' :
                                    'bg-slate-50 text-slate-500 border-slate-100'
                                }`}>
                                    {item.status}
                                </span>
                            </div>

                            {/* Preview Area */}
                            <div className="relative h-48 bg-slate-50 flex items-center justify-center overflow-hidden">
                                {item.status === 'UNLOCKED' ? (
                                    <>
                                        <img src={item.blurredPreview} alt="Evidence" className="w-full h-full object-cover grayscale opacity-60" /> 
                                        <div className="absolute inset-0 flex items-center justify-center bg-green-500/10 backdrop-blur-[1px]">
                                            <div className="bg-white/90 px-3 py-1 rounded shadow-sm text-green-600 font-bold text-xs tracking-widest border border-green-100">
                                                UNLOCKED
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <img src={item.blurredPreview} alt="Encrypted" className="w-full h-full object-cover opacity-30 blur-lg scale-110" />
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <div className={`p-3 rounded-full mb-2 ${item.status === 'DENIED' ? 'bg-red-100 text-red-500' : 'bg-slate-100 text-slate-400'}`}>
                                                 <Lock size={24} />
                                            </div>
                                            <span className={`font-bold text-xs tracking-wider ${item.status === 'DENIED' ? 'text-red-500' : 'text-slate-500'}`}>
                                                {item.status === 'DENIED' ? 'ACCESS DENIED' : 'ENCRYPTED'}
                                            </span>
                                            {item.status !== 'DENIED' && (
                                                <span className="text-slate-300 text-[10px] font-mono mt-1">AES-256</span>
                                            )}
                                        </div>
                                        {item.integrityStatus === 'verified' && (
                                            <div className="absolute top-3 right-3 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                                <ShieldCheck size={10} /> Verified
                                            </div>
                                        )}
                                        <button 
                                            onClick={() => setInspectingItem(item)}
                                            className="absolute bottom-3 right-3 text-[10px] font-bold bg-white/80 hover:bg-white text-slate-500 hover:text-blue-500 px-2 py-1 rounded border border-slate-200 shadow-sm flex items-center gap-1 transition-colors"
                                        >
                                            <Binary size={10} /> Inspect
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Card Body */}
                            <div className="p-5 flex-1 flex flex-col">
                                <p className="text-sm text-slate-700 font-medium mb-1 line-clamp-2">{item.aiAnalysis?.description}</p>
                                <div className="text-xs text-slate-400 mb-6">
                                    {item.location}
                                </div>
                                
                                <div className="mt-auto pt-4 border-t border-slate-50">
                                    {currentUserRole === 'OFFICER' && (
                                        <>
                                            {item.status === 'LOCKED' && (
                                                <button 
                                                    onClick={() => openRequestModal(item.id)}
                                                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm shadow-blue-200"
                                                >
                                                    <FileText size={16} /> Request Access
                                                </button>
                                            )}
                                            {item.status === 'REQUESTED' && (
                                                <button disabled className="w-full py-2.5 bg-slate-100 text-slate-400 rounded-xl text-sm font-medium cursor-not-allowed">
                                                    Pending Approval
                                                </button>
                                            )}
                                            {item.status === 'DENIED' && (
                                                <button disabled className="w-full py-2.5 bg-red-50 text-red-400 border border-red-100 rounded-xl text-sm font-medium flex items-center justify-center gap-2 cursor-not-allowed">
                                                    <AlertOctagon size={16} /> Rejected
                                                </button>
                                            )}
                                            {(item.status === 'APPROVED' || item.status === 'UNLOCKED') && (
                                                <button 
                                                    onClick={() => {
                                                        setSelectedEvidenceId(item.id);
                                                        if(item.status !== 'UNLOCKED') onUnlock(item.id);
                                                    }}
                                                    className="w-full py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm shadow-green-200"
                                                >
                                                    {item.status === 'UNLOCKED' ? <Eye size={16} /> : <Unlock size={16} />}
                                                    {item.status === 'UNLOCKED' ? 'View' : 'Decrypt'}
                                                </button>
                                            )}
                                        </>
                                    )}

                                    {currentUserRole === 'ADMIN' && (
                                        <div className="space-y-3">
                                            {item.status === 'REQUESTED' ? (
                                                <div className="flex flex-col gap-3">
                                                    <div className="bg-slate-50 p-3 rounded-xl text-xs border border-slate-100">
                                                        <div className="flex items-center gap-1.5 text-slate-800 font-bold mb-1">
                                                            <User size={12} />
                                                            <span>{item.requesterName}</span>
                                                        </div>
                                                        <p className="text-slate-500 italic">"{item.requestReason}"</p>
                                                    </div>
                                                    
                                                    <div className="flex gap-2">
                                                        <button 
                                                            onClick={() => onApproveAccess(item.id, 'Admin')}
                                                            className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-bold"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button 
                                                            onClick={() => onDenyAccess(item.id, 'Admin')}
                                                            className="px-4 py-2 bg-white border border-slate-200 hover:bg-red-50 hover:text-red-500 text-slate-500 rounded-lg text-xs font-bold transition-colors"
                                                        >
                                                            Deny
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                              <div className="flex gap-2">
                                                  <button 
                                                      onClick={() => handleVerify(item.id)}
                                                      disabled={item.integrityStatus === 'verified' || verifyingId === item.id}
                                                      className={`flex-1 py-2 border rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                                                          item.integrityStatus === 'verified' 
                                                          ? 'bg-green-50 border-green-200 text-green-600' 
                                                          : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                                                      }`}
                                                  >
                                                      {verifyingId === item.id ? <Loader2 size={12} className="animate-spin" /> : <ShieldCheck size={12} />}
                                                      {item.integrityStatus === 'verified' ? 'Verified' : 'Verify'}
                                                  </button>
                                                  
                                                  {item.status === 'UNLOCKED' && (
                                                    <button 
                                                        onClick={() => onRevokeAccess(item.id)}
                                                        className="px-3 py-2 bg-red-50 text-red-500 border border-red-100 rounded-lg hover:bg-red-100"
                                                        title="Revoke Access"
                                                    >
                                                        <ArchiveRestore size={14} />
                                                    </button>
                                                  )}
                                              </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
      </div>
    </div>
  );
};

export default EvidenceLocker;
