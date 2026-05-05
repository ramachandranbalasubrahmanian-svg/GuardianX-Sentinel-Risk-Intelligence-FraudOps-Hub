/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Filter, MoreVertical, ShieldAlert, ShieldCheck, Check, X, Info, Zap } from 'lucide-react';
import { Transaction, TransactionStatus } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export function TransactionQueue({ privacyMode, transactions, onAction }: { privacyMode: boolean, transactions: Transaction[], onAction: (id: string, status: TransactionStatus) => void }) {
  const [activeFilter, setActiveFilter] = useState<TransactionStatus | 'ALL'>('ALL');
  const [scoringTx, setScoringTx] = useState<string | null>(null);

  const filtered = transactions.filter(tx => 
    activeFilter === 'ALL' || tx.status === activeFilter
  );

  const maskData = (str: string) => {
    if (!privacyMode) return str;
    return str.replace(/.(?=.{4})/g, '*');
  };

  const simulateScoring = (id: string) => {
    setScoringTx(id);
    setTimeout(() => setScoringTx(null), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
          <input 
            type="text" 
            placeholder="Search by ID, Merchant or Card..." 
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400"
          />
        </div>
        <div className="flex items-center gap-1.5 p-1 bg-slate-50 rounded-lg border border-slate-100">
          {(['ALL', TransactionStatus.FLAGGED, TransactionStatus.APPROVED, TransactionStatus.REJECTED] as const).map(status => (
            <button
              key={status}
              onClick={() => setActiveFilter(status)}
              className={cn(
                "px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-wider transition-all",
                activeFilter === status 
                  ? "bg-white text-indigo-600 shadow-sm border border-slate-200" 
                  : "text-slate-500 hover:text-slate-800"
              )}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-[540px] flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10">
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Transaction ID</th>
                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Scrutiny Method</th>
                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Amount (USD)</th>
                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none text-center">Ensemble Score</th>
                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Risk Status</th>
                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Action Hub</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((tx) => (
                <tr key={tx.id} className={cn(
                  "hover:bg-slate-50/80 transition-colors group",
                  tx.status === TransactionStatus.REJECTED ? "bg-rose-50/20" : 
                  tx.status === TransactionStatus.FLAGGED ? "bg-amber-50/20" : ""
                )}>
                  <td className="px-6 py-4">
                    <span className="font-mono text-[10px] text-slate-400 font-bold uppercase tracking-widest">{tx.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{tx.merchant}</p>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">{tx.location}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-black text-slate-900">${tx.amount.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{maskData(tx.cardType)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-center gap-1.5">
                      {scoringTx === tx.id ? (
                        <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                      ) : (
                        <div className={cn(
                          "px-2 py-1 rounded text-[11px] font-black tracking-tighter",
                          tx.fraudScore > 80 ? "bg-rose-100 text-rose-700" : 
                          tx.fraudScore > 40 ? "bg-amber-100 text-amber-700" : 
                          "bg-emerald-100 text-emerald-700"
                        )}>
                          {tx.fraudScore < 100 ? `0${tx.fraudScore}`.slice(-3) : tx.fraudScore}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={cn(
                      "inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider",
                      tx.status === TransactionStatus.APPROVED ? "text-emerald-600" :
                      tx.status === TransactionStatus.FLAGGED ? "text-amber-500 italic underline" :
                      "text-rose-600 font-black"
                    )}>
                      {tx.status}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
                      <button 
                        onClick={() => simulateScoring(tx.id)}
                        className="bg-indigo-600 text-white p-1.5 rounded-lg shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all"
                      >
                        <Zap size={14} />
                      </button>
                      <button className="bg-slate-100 text-slate-500 p-1.5 rounded-lg hover:bg-slate-200 transition-all">
                        <MoreVertical size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
           <span>Showing {filtered.length} of 1.2M events</span>
           <span>Auto-refresh Active (2s)</span>
        </div>
      </div>
    </div>
  );
}
