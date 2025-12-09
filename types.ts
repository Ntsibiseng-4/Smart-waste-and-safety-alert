
export interface AnalysisResult {
  wasteLevel: number; // 0-100
  hazards: string[];
  safetyScore: number; // 0-100
  description: string;
  isDumpingDetected: boolean; // New flag for active dumping
  timestamp: string;
}

export interface Alert {
  id: string;
  type: 'waste' | 'safety' | 'fire' | 'road';
  severity: 'low' | 'medium' | 'high';
  message: string;
  location: string;
  timestamp: string;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  ANALYSIS = 'ANALYSIS',
  EVIDENCE_LOCKER = 'EVIDENCE_LOCKER',
  WORKFORCE = 'WORKFORCE',
  SECURITY = 'SECURITY'
}

export interface Worker {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'offline' | 'on-break';
  location: string;
}

// --- SECURITY TYPES ---

export type EvidenceStatus = 'LOCKED' | 'REQUESTED' | 'APPROVED' | 'UNLOCKED' | 'DENIED';

export interface EvidenceItem {
  id: string;
  timestamp: string;
  location: string;
  encryptedData: string; // The "File" stored securely
  originalData?: string; // The decrypted raw image (for simulation purposes)
  blurredPreview: string; // Safe to view
  status: EvidenceStatus;
  decryptionKey?: string; // Only present if approved and unlocked
  aiAnalysis?: AnalysisResult;
  requesterName?: string;
  requestReason?: string;
  integrityStatus?: 'unchecked' | 'verified';
}

export interface BlockchainBlock {
  index: number;
  timestamp: string;
  action: string;
  actor: string;
  resourceId: string;
  previousHash: string;
  hash: string;
}
