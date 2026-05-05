/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Lock, Eye, FileText, Shield, UserCheck, Scale, Database, Clock, Loader2, AlertCircle, CheckCircle2, ShieldAlert, FileKey } from 'lucide-react';
import { cn } from '../lib/utils';
import { UserProfile, UserRole } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface PrivacyCenterProps {
  currentUser: UserProfile;
}

export function PrivacyCenter({ currentUser }: PrivacyCenterProps) {
  const [sovereignUid, setSovereignUid] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [requestStatus, setRequestStatus] = useState<'IDLE' | 'PENDING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [errorMsg, setErrorMsg] = useState('');

  const isAdmin = currentUser.role === UserRole.ADMIN;

  const handleProcessDeletion = () => {
    if (!isAdmin) {
      setErrorMsg('UNAUTHORIZED: Sovereign Data Purge requires Tier-1 Admin clearance.');
      setRequestStatus('ERROR');
      return;
    }

    if (!sovereignUid.trim()) {
      setErrorMsg('INVALID IDENTITY: Sovereign UID cannot be empty.');
      setRequestStatus('ERROR');
      return;
    }

    setIsProcessing(true);
    setRequestStatus('PENDING');
    
    // Simulate complex sovereign deletion across clusters
    setTimeout(() => {
      setIsProcessing(false);
      setRequestStatus('SUCCESS');
      setSovereignUid('');
      setTimeout(() => setRequestStatus('IDLE'), 5000);
    }, 2500);
  };

  const [controls, setControls] = useState([
    { 
      id: 'pii-masking', 
      label: 'Automatic PII Masking', 
      desc: 'Mask sensitive fields (emails, phones) from analytics and human review interfaces.', 
      details: 'Utilizes AES-GCM encryption with dynamic salting. Masked data is only accessible via temporary cryptographic key-grants approved by the Privacy Office.',
      active: true 
    },
    { 
      id: 'anon-exports', 
      label: 'Anonymized Exports', 
      desc: 'Automatically remove subject-specific keys from all CSV/JSON export artifacts.', 
      details: 'Enforces k-anonymity (k=10) on all data dumps to ensure individual subjects cannot be re-identified through linkage attacks.',
      active: true 
    },
    { 
      id: 'geo-fence', 
      label: 'Geo-Fenced Storage', 
      desc: 'Limit metadata persistence to EU-West verified datacenters to meet regional mandates.', 
      details: 'Restricts S3-compatible object storage to eu-central-1 and eu-west-1 regions. Prevents any data residency leakage to non-compliant jurisdictions.',
      active: false 
    },
    { 
      id: 'encryption', 
      label: 'Encryption at Rest', 
      desc: 'FIPS 140-2 Level 3 qualified hardware encryption for all data blocks.', 
      details: 'All underlying disk volumes are encrypted with envelope encryption. Master keys are rotated every 24 hours via Hardware Security Modules (HSM).',
      active: true 
    },
  ]);

  const toggleControl = (id: string) => {
    if (!isAdmin) {
      alert("UNAUTHORIZED: Toggle restricted to Root Admin.");
      return;
    }
    setControls(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c));
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-[#0F172A] p-10 rounded-2xl text-white relative overflow-hidden border border-slate-800 shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Shield size={24} />
            </div>
            <h2 className="text-3xl font-black tracking-tighter">Privacy Governance Hub</h2>
          </div>
          <p className="text-slate-400 mb-8 leading-relaxed text-sm font-medium">
            GuardianX Sentinel provides a sovereign data stewardship layer. We enforce total compliance with GDPR, CCPA, and APPI 
            through advanced cryptographic primitives, real-time access scrutiny, and hardware-secured audit trails.
          </p>
          <div className="flex flex-wrap gap-4">
             <div className="flex items-center gap-2 bg-indigo-500/10 px-4 py-2 rounded-lg border border-indigo-500/20 backdrop-blur-sm">
                <Shield className="text-indigo-400" size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">GDPR COMPLIANT (Article 17/32)</span>
             </div>
             <div className="flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-lg border border-emerald-500/20 backdrop-blur-sm">
                <Lock className="text-emerald-400" size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">TLS 1.3 + AES-256-GCM SECURED</span>
             </div>
          </div>
        </div>
        <div className="absolute -top-10 -right-10 opacity-[0.03] pointer-events-none">
           <Shield size={400} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg">
               <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <UserCheck size={16} className="text-indigo-500" />
                    <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.1em]">Access Scrutiny Logs</h3>
                  </div>
                  <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700 transition-colors bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">Export Compliance Bundle</button>
               </div>
               <div className="p-0">
                  {[
                    { action: 'View PII', user: 'Alex Rivera (Admin)', time: '2m ago', result: 'AUTHORIZED', detail: 'Sovereign ID lookup' },
                    { action: 'Modify Weight', user: 'Sam Chen (Analyst)', time: '15m ago', result: 'DENIED', detail: 'Requires Tier-1 clearance' },
                    { action: 'Score Transaction', user: 'System (Engine)', time: '1s ago', result: 'AUTHORIZED', detail: 'Automated ensemble run' },
                    { action: 'Export Data', user: 'Jordan Taylor (Viewer)', time: '1h ago', result: 'DENIED', detail: 'Bulk export lock' },
                  ].map((log, i) => (
                    <div key={i} className="flex items-center justify-between px-8 py-5 border-b last:border-none border-slate-50 hover:bg-slate-50 transition-all group">
                       <div className="flex items-center gap-5">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center border-2 shadow-sm transition-transform group-hover:scale-105",
                            log.result === 'AUTHORIZED' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
                          )}>
                             {log.result === 'AUTHORIZED' ? <UserCheck size={18} /> : <Lock size={18} />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{log.action}</p>
                              <span className="text-[8px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded uppercase">{log.detail}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest leading-none mt-1.5">{log.user}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className={cn(
                            "text-[10px] font-black px-3 py-1 rounded-lg inline-block mb-2 uppercase tracking-widest border shadow-sm",
                            log.result === 'AUTHORIZED' ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-rose-500 text-white border-rose-600'
                          )}>
                            {log.result}
                          </p>
                          <p className="text-[10px] text-slate-400 font-black flex items-center gap-1.5 justify-end uppercase tracking-tighter">
                            <Clock size={12} className="text-slate-300" /> {log.time}
                          </p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg relative group overflow-hidden">
                   <div className="flex items-center gap-4 mb-6">
                      <div className="p-3 bg-indigo-50 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                         <Database className="text-indigo-600 group-hover:text-white" size={20} />
                      </div>
                      <h4 className="text-[12px] font-black text-slate-700 uppercase tracking-widest leading-none">Retention Policies</h4>
                   </div>
                   <p className="text-xs text-slate-500 mb-8 font-medium leading-relaxed">
                     Automated archival engine performs daily sweeps to prune non-essential metadata and PII after 90 days. This ensures our "Right to be Forgotten" obligation is met at a hardware level without manual oversight.
                   </p>
                   <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100 group-hover:border-indigo-200 transition-colors">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Purge Cycle</span>
                      <span className="text-[14px] font-black text-indigo-600">Q_90_RETENTION</span>
                   </div>
                </div>
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg relative group overflow-hidden">
                   <div className="flex items-center gap-4 mb-6">
                      <div className="p-3 bg-amber-50 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-all duration-300">
                         <Scale className="text-amber-600 group-hover:text-white" size={20} />
                      </div>
                      <h4 className="text-[12px] font-black text-slate-700 uppercase tracking-widest leading-none">Compliance Audit</h4>
                   </div>
                   <p className="text-xs text-slate-500 mb-8 font-medium leading-relaxed">
                     GuardianX undergoes semi-annual SOC2 Type II and GDPR validation. Latest sweep verified zero leaks across 1.2M transactions. Audited by third-party Sentinel partners under hardware-witnessed conditions.
                   </p>
                   <div className="flex justify-between items-center bg-emerald-50 p-3 rounded-xl border border-emerald-100 group-hover:border-emerald-200 transition-colors">
                      <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Cert ID: SENT-2026-X4</span>
                      <Shield size={16} className="text-emerald-600" />
                   </div>
                </div>
            </div>
         </div>

         <div className="lg:col-span-4 space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg">
               <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                 <Lock size={16} className="text-indigo-500" />
                 Sovereign Controls
               </h4>
               <div className="space-y-4">
                  {controls.map(control => (
                    <div key={control.id} className="group">
                      <div className="p-4 bg-white hover:bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center transition-all cursor-help relative shadow-sm hover:shadow-md border-transparent hover:border-slate-200">
                        <div className="flex-1 min-w-0 pr-4">
                            <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight truncate">{control.label}</p>
                            <p className="text-[10px] text-slate-400 font-bold leading-tight mt-1">{control.desc}</p>
                        </div>
                        <button 
                          onClick={() => toggleControl(control.id)}
                          className={cn(
                            "w-8 h-4.5 rounded-full transition-all relative shrink-0",
                            control.active ? "bg-indigo-600 shadow-[0_0_12px_rgba(99,102,241,0.5)]" : "bg-slate-200"
                          )}
                        >
                            <div className={cn(
                              "absolute top-0.5 w-3.5 h-3.5 bg-white rounded-full transition-all shadow-sm",
                              control.active ? "right-0.5" : "left-0.5"
                            )} />
                        </button>
                      </div>
                      <div className="hidden group-hover:block mt-2 p-3 bg-indigo-900 rounded-lg text-white text-[10px] font-medium leading-relaxed shadow-xl border border-indigo-700 animate-in fade-in slide-in-from-top-1">
                        <div className="flex items-start gap-2">
                          <ShieldAlert size={14} className="text-indigo-400 shrink-0 mt-0.5" />
                          <span>{control.details}</span>
                        </div>
                      </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-slate-900 p-8 rounded-2xl text-white border border-slate-800 shadow-2xl flex flex-col justify-between h-[400px] relative overflow-hidden">
               <div className="relative z-10">
                  <h4 className="text-[11px] font-black text-indigo-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <FileText size={18} />
                    Forgot Request (DSR)
                  </h4>
                  <p className="text-[11px] font-medium text-slate-400 mb-8 leading-relaxed uppercase tracking-tight">
                    Submit a Data Subject Request (DSR). Entering a Sovereign UID will trigger an immediate ripple-purge across all Sentinel shards.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="relative">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Sovereign Identity Key</label>
                      <input 
                        type="text" 
                        value={sovereignUid}
                        onChange={(e) => setSovereignUid(e.target.value)}
                        placeholder="SENT-HASH-XXXXXXXX" 
                        disabled={isProcessing}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3.5 text-[11px] font-mono text-white placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      />
                    </div>

                    <AnimatePresence mode="wait">
                      {requestStatus === 'ERROR' && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-start gap-2 bg-rose-500/10 p-3 rounded-lg border border-rose-500/20"
                        >
                          <AlertCircle size={14} className="text-rose-400 shrink-0 mt-0.5" />
                          <p className="text-[9px] font-bold text-rose-300 leading-tight uppercase">{errorMsg}</p>
                        </motion.div>
                      )}

                      {requestStatus === 'SUCCESS' && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-start gap-2 bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20"
                        >
                          <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                          <p className="text-[9px] font-bold text-emerald-300 leading-tight uppercase tracking-tight">
                            DATA PURGE INITIALIZED. Sovereign subject successfully scrubbed from 12 global regions.
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
               </div>

               <div className="space-y-3 relative z-10">
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest text-center italic">
                    Action requires Tier-1 Admin Clearance
                  </p>
                  <button 
                    onClick={handleProcessDeletion}
                    disabled={isProcessing}
                    className={cn(
                      "w-full text-[11px] font-black uppercase tracking-[0.2em] py-4 rounded-xl transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2",
                      isProcessing ? "bg-slate-700 text-slate-400" : "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/40"
                    )}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        PURGING CLUSTERS...
                      </>
                    ) : (
                      'Initialize Global Purge'
                    )}
                  </button>
               </div>

               <div className="absolute -bottom-10 -left-10 opacity-[0.02] pointer-events-none">
                  <FileKey size={250} />
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
