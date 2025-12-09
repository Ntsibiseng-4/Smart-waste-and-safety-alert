
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Loader2, Activity, Lock, Radio, ShieldAlert, X, EyeOff, Database, FileKey, ScanEye, Zap, CheckCircle2 } from 'lucide-react';
import { analyzeImage } from '../services/geminiService';
import { AnalysisResult, Alert, EvidenceItem } from '../types';
import { createBlurredPreview, encryptData } from '../services/cryptoService';

interface AnalysisProps {
  onNewAlert: (alert: Alert) => void;
  onEvidenceCaptured: (evidence: EvidenceItem) => void;
}

const Analysis: React.FC<AnalysisProps> = ({ onNewAlert, onEvidenceCaptured }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  
  // Auto-Sentry Mode State
  const [isAutoSentry, setIsAutoSentry] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Security State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authPin, setAuthPin] = useState('');
  const [authError, setAuthError] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  // Clock effect for CCTV overlay
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // AUTO SENTRY LOGIC
  useEffect(() => {
    if (isAutoSentry && isCameraActive && !isProcessing) {
        // Start the scanning loop
        intervalRef.current = setInterval(async () => {
            if (isProcessing) return; // Don't overlap
            
            setIsScanning(true);
            await new Promise(r => setTimeout(r, 1000));
            
            if (videoRef.current) {
                const canvas = document.createElement('canvas');
                canvas.width = videoRef.current.videoWidth;
                canvas.height = videoRef.current.videoHeight;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(videoRef.current, 0, 0);
                const frame = canvas.toDataURL('image/jpeg');
                
                try {
                    const aiData = await analyzeImage(frame);
                    if (aiData.isDumpingDetected) {
                        if (intervalRef.current) clearInterval(intervalRef.current);
                        setResult(aiData);
                        performSecureCapture(frame, aiData); 
                    }
                } catch (e) {
                    console.log("Auto-scan error", e);
                }
            }
            setIsScanning(false);
        }, 6000); 
    } else {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setIsScanning(false);
    }

    return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAutoSentry, isCameraActive, isProcessing]);


  const startCamera = async () => {
    setIsCameraActive(true);
    setImage(null);
    setResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      alert("Could not access camera. Please use upload.");
      setIsCameraActive(false);
    }
  };

  const requestStopCamera = () => {
    setShowAuthModal(true);
    setAuthPin('');
    setAuthError('');
  };

  const confirmStopCamera = (e: React.FormEvent) => {
    e.preventDefault();
    if (authPin === 'admin' || authPin === '1234') {
        const stream = videoRef.current?.srcObject as MediaStream;
        stream?.getTracks().forEach(track => track.stop());
        setIsCameraActive(false);
        setIsAutoSentry(false);
        setShowAuthModal(false);
        setImage(null);
    } else {
        setAuthError('Access Denied: Invalid Credentials');
    }
  };

  const performSecureCapture = async (frameOverride?: string, resultOverride?: AnalysisResult) => {
    let rawImage = frameOverride || image;

    if (!rawImage && isCameraActive && videoRef.current) {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(videoRef.current, 0, 0);
        rawImage = canvas.toDataURL('image/jpeg');
    }

    if (!rawImage) return;
    
    setIsProcessing(true);
    setResult(resultOverride || null); 

    try {
      let aiData = resultOverride;
      if (!aiData) {
        setProcessingStep('AI Sentry: Analyzing Scene Activity...');
        aiData = await analyzeImage(rawImage);
        setResult(aiData);
      }

      if (aiData && (aiData.isDumpingDetected || aiData.wasteLevel > 80)) {
          setProcessingStep('Edge Privacy: Generating Anonymized Layer...');
          await new Promise(r => setTimeout(r, 800)); 
          const blurredPreview = await createBlurredPreview(rawImage);

          setProcessingStep('Encryption: Applying AES-256 Protocol...');
          await new Promise(r => setTimeout(r, 800)); 
          const { encrypted } = encryptData(rawImage);

          setProcessingStep('Secure Vault: Transmitting Evidence...');
          const evidenceId = `EV-${Date.now().toString().slice(-6)}`;
          const evidenceItem: EvidenceItem = {
              id: evidenceId,
              timestamp: new Date().toISOString(),
              location: 'Camera 01 - Main St',
              encryptedData: encrypted, 
              originalData: rawImage, 
              blurredPreview: blurredPreview, 
              status: 'LOCKED',
              aiAnalysis: aiData
          };

          await new Promise(r => setTimeout(r, 500));
          
          onEvidenceCaptured(evidenceItem);
          
          if (aiData.isDumpingDetected) {
            onNewAlert({
              id: Date.now().toString(),
              type: 'waste',
              severity: 'high',
              message: `ALERT: Active Illegal Dumping Detected!`,
              location: 'Camera 01 - Main St',
              timestamp: new Date().toLocaleTimeString()
            });
          }
      }
      
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  const handleManualCapture = () => {
    performSecureCapture();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImage(base64);
        setResult(null);
        setIsCameraActive(false);
        setIsAutoSentry(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-8 h-full flex flex-col lg:flex-row gap-8 overflow-y-auto max-w-[1600px] mx-auto">
      
      {showAuthModal && (
        <div className="absolute inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-2xl animate-fade-in border border-slate-100">
                <div className="flex items-center gap-3 mb-6 text-slate-800">
                    <ShieldAlert size={32} className="text-red-500" />
                    <h3 className="text-xl font-bold">Security Authorization</h3>
                </div>
                <p className="text-slate-500 mb-6 text-sm">
                    Please enter administrator PIN to disable surveillance feed.
                </p>
                <form onSubmit={confirmStopCamera}>
                    <div className="mb-4">
                        <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Admin PIN</label>
                        <input 
                            type="password" 
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:border-green-500 focus:outline-none transition-colors"
                            placeholder="••••"
                            value={authPin}
                            onChange={(e) => setAuthPin(e.target.value)}
                            autoFocus
                        />
                        {authError && <p className="text-red-500 text-xs mt-2 font-medium">{authError}</p>}
                    </div>
                    <div className="flex gap-3">
                        <button 
                            type="button" 
                            onClick={() => setShowAuthModal(false)}
                            className="flex-1 py-3 bg-white border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50 font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors shadow-sm"
                        >
                            Confirm Stop
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* Left Panel: Input */}
      <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex flex-col">
        <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${isCameraActive ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></div>
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Live Surveillance Feed</h2>
                    <p className="text-xs text-slate-400">{isCameraActive ? 'Connected • Encrypted' : 'Standby Mode'}</p>
                </div>
            </div>
            {isCameraActive && isAutoSentry && (
                 <div className="px-3 py-1 bg-red-50 text-red-500 text-xs font-bold rounded-full animate-pulse flex items-center gap-2">
                     <Zap size={12} /> AUTO-GUARD ACTIVE
                 </div>
            )}
        </div>
        
        {/* Camera Viewport */}
        <div className="flex-1 bg-slate-900 rounded-2xl overflow-hidden relative min-h-[400px] shadow-inner group">
          
          {/* Processing HUD */}
          {isProcessing && (
              <div className="absolute top-4 right-4 z-40 bg-white/95 backdrop-blur border border-slate-100 p-4 rounded-2xl shadow-lg w-64 animate-in fade-in slide-in-from-top-2">
                  <div className="flex justify-between items-center mb-3 border-b border-slate-100 pb-2">
                      <h3 className="text-slate-800 font-bold text-xs uppercase tracking-wide">Secure Chain</h3>
                      <Loader2 className="animate-spin text-green-500" size={16} />
                  </div>
                  <div className="space-y-2">
                      <div className={`flex items-center gap-2 ${processingStep.includes('AI') ? 'text-green-600 font-medium' : 'text-slate-400'}`}>
                          <ScanEye size={14} />
                          <span className="text-xs">Threat Detection</span>
                      </div>
                      <div className={`flex items-center gap-2 ${processingStep.includes('Edge') ? 'text-green-600 font-medium' : 'text-slate-400'}`}>
                          <EyeOff size={14} />
                          <span className="text-xs">Privacy Blurring</span>
                      </div>
                      <div className={`flex items-center gap-2 ${processingStep.includes('Encrypting') ? 'text-green-600 font-medium' : 'text-slate-400'}`}>
                          <FileKey size={14} />
                          <span className="text-xs">AES-256 Encryption</span>
                      </div>
                      <div className={`flex items-center gap-2 ${processingStep.includes('Vault') ? 'text-green-600 font-medium' : 'text-slate-400'}`}>
                          <Database size={14} />
                          <span className="text-xs">Vault Storage</span>
                      </div>
                  </div>
              </div>
          )}

          {isCameraActive ? (
            <>
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover opacity-90" />
                
                {isScanning && !isProcessing && (
                    <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center">
                        <div className="bg-white/90 text-slate-800 font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                            <Loader2 className="animate-spin" size={16} /> Scanning...
                        </div>
                    </div>
                )}

                {/* CCTV Overlay UI */}
                <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between z-20">
                    <div className="flex justify-between items-start">
                        <div className="bg-black/60 backdrop-blur-sm px-3 py-1 rounded-md text-xs font-mono text-white flex items-center gap-2 border border-white/10">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            {isAutoSentry ? 'REC • AUTO' : 'REC • MANUAL'}
                        </div>
                        <div className="bg-black/60 backdrop-blur-sm px-3 py-1 rounded-md text-xs font-mono text-white/90 border border-white/10">
                            CAM-01 • 1080P • MAIN ST
                        </div>
                    </div>
                    
                    <div className="flex justify-between items-end">
                         <div className="text-xs font-mono text-white/80 bg-black/60 px-2 py-1 rounded border border-white/10">
                             lat: -25.7479 long: 28.2293
                         </div>
                         <div className="text-xl font-mono text-white font-bold drop-shadow-md tracking-widest">
                             {currentTime}
                         </div>
                    </div>
                </div>
            </>
          ) : image ? (
            <img src={image} alt="Analysis Target" className="w-full h-full object-contain bg-slate-100" />
          ) : (
            <div className="text-center p-8 flex flex-col items-center justify-center h-full text-slate-300">
              <div className="p-6 bg-slate-800 rounded-full mb-4">
                  <Camera size={48} />
              </div>
              <p className="font-medium text-slate-400">Camera Offline</p>
              <p className="text-sm">Initialize to start secure feed</p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="mt-6 flex gap-4">
            {isCameraActive ? (
                <>
                 <button 
                    onClick={() => setIsAutoSentry(!isAutoSentry)}
                    className={`flex-1 font-semibold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 border ${
                        isAutoSentry 
                        ? 'bg-red-50 text-red-600 border-red-200' 
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                 >
                   <Zap size={20} fill={isAutoSentry ? "currentColor" : "none"} />
                   {isAutoSentry ? 'Auto-Guard Active' : 'Enable Auto-Guard'}
                 </button>

                 <button 
                 onClick={requestStopCamera}
                 className="flex-1 bg-white border border-slate-200 text-slate-500 hover:text-red-500 hover:border-red-200 font-semibold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
               >
                 <X size={20} />
                 Stop Feed
               </button>
               </>
            ) : (
                <button 
                onClick={startCamera}
                className="flex-1 bg-brand-primary hover:bg-emerald-600 text-white font-semibold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-200"
              >
                <Radio size={20} />
                Start Live Feed
              </button>
            )}
          
          <label className={`flex-1 cursor-pointer bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 ${isCameraActive ? 'opacity-50 pointer-events-none' : ''}`}>
            <Upload size={20} />
            Upload Evidence
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" disabled={isCameraActive} />
          </label>
        </div>

        {/* Manual Capture Button */}
        {(image || (isCameraActive && !isAutoSentry)) && (
          <button 
            onClick={handleManualCapture}
            disabled={isProcessing}
            className="mt-4 w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? <Loader2 className="animate-spin" /> : <Activity />}
            {isProcessing ? 'Processing Chain...' : 'Capture & Secure Evidence'}
          </button>
        )}
      </div>

      {/* Right Panel: Results */}
      <div className="w-full lg:w-96 bg-white rounded-3xl shadow-sm border border-slate-100 p-6 h-fit">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Activity size={20} className="text-brand-primary" /> Analysis Log
        </h3>
        
        {result ? (
          <div className="space-y-6 animate-fade-in">
             {result.isDumpingDetected && (
                 <div className="p-4 bg-red-50 border border-red-100 rounded-2xl">
                     <div className="flex items-center gap-2 text-red-600 mb-2">
                         <ShieldAlert size={20} />
                         <span className="font-bold text-sm">ILLEGAL DUMPING</span>
                     </div>
                     <p className="text-xs text-slate-600 leading-relaxed">
                         Subject identified in act of disposal. Incident timestamped and evidence vaulted.
                     </p>
                 </div>
             )}

             <div className="p-4 bg-green-50 border border-green-100 rounded-2xl">
                 <div className="flex items-center gap-2 text-green-600 mb-2">
                     <CheckCircle2 size={18} />
                     <span className="font-bold text-sm">Evidence Secured</span>
                 </div>
                 <p className="text-xs text-slate-600 mb-2">
                     Data encrypted (AES-256) and stored off-chain.
                 </p>
             </div>

            {/* Waste Level Gauge */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex justify-between text-sm mb-2 text-slate-500 font-medium">
                <span>Waste Saturation</span>
                <span>{result.wasteLevel}%</span>
              </div>
              <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 rounded-full ${
                    result.wasteLevel > 80 ? 'bg-red-500' : 
                    result.wasteLevel > 50 ? 'bg-orange-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${result.wasteLevel}%` }}
                />
              </div>
            </div>

            {/* AI Summary */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-2 font-bold">AI Assessment</p>
              <p className="text-slate-700 leading-relaxed text-sm">
                {result.description}
              </p>
            </div>
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-100 rounded-2xl">
            <ScanEye size={48} className="mb-4 opacity-50" />
            <p className="text-center text-sm font-medium">Waiting for Analysis</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analysis;
