/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Transaction, TransactionStatus } from '../types';
import { cn } from '../lib/utils';
import { ShieldAlert, User, Calendar, ThumbsUp, ThumbsDown, Zap, Lock } from 'lucide-react';
import { motion } from 'motion/react';

export function CaseManager({ privacyMode, transactions, onAction }: { privacyMode: boolean, transactions: Transaction[], onAction: (id: string, status: TransactionStatus) => void }) {
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(
    transactions.find(tx => tx.status === TransactionStatus.FLAGGED)?.id || transactions[0]?.id || null
  );

  const selectedCase = transactions.find(tx => tx.id === selectedCaseId) || transactions[0];

  const maskData = (str: string) => {
    if (!privacyMode) return str;
    return str.replace(/.(?=.{4})/g, '*');
  };

  const processDecision = (status: TransactionStatus) => {
    if (!selectedCase) return;
    
    onAction(selectedCase.id, status);

    // Auto-advance to next flagged record
    const nextFlagged = transactions.find(tx => tx.status === TransactionStatus.FLAGGED && tx.id !== selectedCase.id);
    if (nextFlagged) {
      setTimeout(() => setSelectedCaseId(nextFlagged.id), 500);
    }
  };

  if (!selectedCase) return <div>No cases available for review.</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[700px]">
      {/* Priority Feed */}
      <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col shadow-sm">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
           <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Priority Queue</h3>
           <div className="flex items-center gap-1.5 bg-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              {transactions.filter(tx => tx.status === TransactionStatus.FLAGGED).length} CRITICAL
           </div>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
           {transactions.map(tx => (
             <button 
               key={tx.id}
               onClick={() => setSelectedCaseId(tx.id)}
               className={cn(
                 "w-full text-left p-4 hover:bg-slate-50 transition-all flex items-center gap-4 relative group",
                 selectedCaseId === tx.id ? "bg-indigo-50/50" : ""
               )}
             >
                {selectedCaseId === tx.id && (
                  <motion.div layoutId="activePointer" className="absolute left-0 top-0 w-1 h-full bg-indigo-600" />
                )}
                <div className={cn(
                  "p-2.5 rounded-lg border",
                  tx.fraudScore > 80 ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-slate-50 text-slate-400 border-slate-100"
                )}>
                  <ShieldAlert size={18} />
                </div>
                <div className="flex-1 min-w-0">
                   <p className="font-bold text-sm text-slate-900 truncate tracking-tight">{tx.merchant}</p>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">{tx.id}</p>
                </div>
                <div className="text-right">
                   <p className="text-xs font-black text-slate-900">${tx.amount}</p>
                   <div className={cn(
                    "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter mt-1",
                    tx.status === TransactionStatus.FLAGGED ? "bg-amber-100 text-amber-700" :
                    tx.status === TransactionStatus.APPROVED ? "bg-emerald-100 text-emerald-700" :
                    "bg-rose-100 text-rose-700"
                   )}>
                     {tx.status}
                   </div>
                </div>
             </button>
           ))}
        </div>
      </div>

      {/* Scrutiny Detail & Inspector */}
      <div className="lg:col-span-8 grid grid-rows-2 sm:grid-rows-1 sm:grid-cols-2 gap-6">
         {/* Detail View */}
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
               <div className="flex justify-between items-start">
                  <div>
                    <div className="bg-slate-100 text-[9px] font-black text-slate-500 px-2 py-0.5 rounded inline-block uppercase tracking-widest mb-2">
                       Event Meta
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{selectedCase.merchant}</h2>
                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest flex items-center gap-1">
                      <Calendar size={12} className="text-indigo-400" /> 
                      {new Date(selectedCase.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                     <p className="text-2xl font-black text-slate-900 tracking-tighter">${selectedCase.amount.toLocaleString()}</p>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1.5 py-0.5 bg-slate-50 rounded border border-slate-100">{selectedCase.currency}</p>
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-px bg-slate-100 flex-1" />
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Entity Investigation</span>
                    <div className="h-px bg-slate-100 flex-1" />
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                        <User size={18} className="text-indigo-500" />
                     </div>
                     <div className="flex-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5 leading-none">Scanned Subject</p>
                        <p className="text-sm font-black text-slate-800">{maskData(selectedCase.userId)}</p>
                        <p className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 rounded inline-block mt-1">Sovereign Tier</p>
                     </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Detection Signals</p>
                    {selectedCase.riskFactors.map(factor => (
                      <div key={factor} className="flex items-center gap-2 text-[11px] bg-rose-50 text-rose-700 px-3 py-2 rounded-lg font-black uppercase tracking-tighter border border-rose-100">
                        <ShieldAlert size={14} className="shrink-0" />
                        {factor}
                      </div>
                    ))}
                    {selectedCase.riskFactors.length === 0 && (
                      <div className="text-[11px] text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg font-black uppercase tracking-tighter border border-emerald-100">
                        Baseline Normalcy Detected
                      </div>
                    )}
                  </div>
               </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex flex-col gap-3">
               <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => processDecision(TransactionStatus.APPROVED)}
                    className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-widest py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                  >
                    <ThumbsUp size={16} />
                    ADJUDICATE GOOD
                  </button>
                  <button 
                    onClick={() => processDecision(TransactionStatus.REJECTED)}
                    className="flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-black uppercase tracking-widest py-3 rounded-xl transition-all shadow-lg shadow-rose-600/20 active:scale-95"
                  >
                    <ThumbsDown size={16} />
                    CONFIRM FRAUD
                  </button>
               </div>
            </div>
         </div>


         {/* Scrutiny Dashboard (Inspector) */}
         <div className="bg-[#0F172A] rounded-xl flex flex-col overflow-hidden shadow-xl border border-slate-800">
            <div className="p-5 border-b border-slate-800">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[11px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                     <Zap size={14} className="fill-indigo-400" />
                     Ensemble Analysis
                  </h3>
                  <div className="bg-rose-500/10 text-rose-500 text-[10px] font-black px-2 py-0.5 rounded border border-rose-500/20 uppercase tracking-widest">
                     Scrutiny v2
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mb-6">
                   <div className="text-6xl font-black text-indigo-400 tracking-tighter leading-none">{selectedCase.fraudScore}</div>
                   <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest vertical-bottom pb-1">Risk Composite</div>
                </div>

                <div className="space-y-3">
                   <div className="flex justify-between items-center text-[10px] font-bold">
                      <span className="text-slate-500 uppercase tracking-widest">Consortium Velocity</span>
                      <span className="text-rose-400">ABNORMAL (14x)</span>
                   </div>
                   <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500" style={{ width: '85%' }} />
                   </div>
                   
                   <div className="flex justify-between items-center text-[10px] font-bold">
                      <span className="text-slate-500 uppercase tracking-widest">Device Integrity</span>
                      <span className="text-amber-400">UNREGISTERED OS</span>
                   </div>
                   <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500" style={{ width: '40%' }} />
                   </div>
                </div>
            </div>

            <div className="p-5 flex-1 bg-slate-900/50 flex flex-col justify-between">
                <div>
                   <h4 className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-4">Explainable AI Stream</h4>
                   <div className="space-y-3 font-mono text-[10px] text-slate-500 leading-tight">
                      <p className="flex gap-2">
                        <span className="text-indigo-500/50">#</span>
                        <span className="italic">Checking distance jump... DX=12,400km</span>
                      </p>
                      <p className="flex gap-2">
                        <span className="text-emerald-500/50">&gt;</span>
                        <span className="text-emerald-400/80">Identity validated via 2FA history</span>
                      </p>
                      <p className="flex gap-2">
                        <span className="text-rose-500/50">!</span>
                        <span className="text-rose-400/80">Anomaly: Known crypto-leaking IP cluster</span>
                      </p>
                   </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-800">
                   <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      <span>Sub-Latency: 42ms</span>
                      <span className="flex items-center gap-1">
                        <Lock size={10} className="text-indigo-500" /> 
                        AES-256 Enabled
                      </span>
                   </div>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
}
