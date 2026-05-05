/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Shield, 
  LayoutDashboard, 
  CreditCard, 
  AlertCircle, 
  Sliders, 
  Lock, 
  UserCircle,
  Search,
  Bell,
  Menu,
  X,
  Eye,
  EyeOff,
  UserCheck,
  UserX,
  FileKey
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole, TransactionStatus } from './types';
import { MOCK_USERS, MOCK_TRANSACTIONS } from './mockData';
import { cn } from './lib/utils';

// Views
import { Overview } from './components/Overview';
import { TransactionQueue } from './components/TransactionQueue';
import { CaseManager } from './components/CaseManager';
import { ModelAuthoring } from './components/ModelAuthoring';
import { PrivacyCenter } from './components/PrivacyCenter';

export default function App() {
  const [currentUser, setCurrentUser] = useState(MOCK_USERS[0]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [privacyMode, setPrivacyMode] = useState(true);
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, roles: [UserRole.ADMIN, UserRole.ANALYST, UserRole.VIEWER] },
    { id: 'transactions', name: 'Fraud Queue', icon: CreditCard, roles: [UserRole.ADMIN, UserRole.ANALYST] },
    { id: 'cases', name: 'Case Management', icon: AlertCircle, roles: [UserRole.ADMIN, UserRole.ANALYST] },
    { id: 'modeling', name: 'Decision Modeler', icon: Sliders, roles: [UserRole.ADMIN] },
    { id: 'privacy', name: 'Privacy & GDPR', icon: Lock, roles: [UserRole.ADMIN] },
  ];

  const handleAction = (txId: string, newStatus: TransactionStatus) => {
    setTransactions(prev => prev.map(tx => 
      tx.id === txId ? { ...tx, status: newStatus } : tx
    ));
  };

  const filteredNavigation = useMemo(() => 
    navigation.filter(item => item.roles.includes(currentUser.role)),
  [currentUser.role]);

  return (
    <div className="flex h-screen bg-[#F1F5F9] text-slate-900 font-sans overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 256 : 80 }}
        className="bg-[#0F172A] text-slate-300 flex flex-col relative z-50 border-r border-slate-800 shadow-xl"
      >
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="bg-indigo-600 p-2 rounded-lg shadow-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          {isSidebarOpen && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-bold text-xl tracking-tight text-white"
            >
              GuardianX
            </motion.span>
          )}
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {filteredNavigation.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                activeTab === item.id 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon className={cn("w-5 h-5 shrink-0", activeTab === item.id ? "text-white" : "group-hover:text-indigo-400")} />
              {isSidebarOpen && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-medium whitespace-nowrap"
                >
                  {item.name}
                </motion.span>
              )}
            </button>
          ))}
        </nav>

        <div className={cn("p-4 border-t border-slate-800 bg-slate-900/50", isSidebarOpen ? "" : "items-center flex flex-col")}>
          {isSidebarOpen && 
            <div className="mb-4">
              <p className="text-[10px] uppercase font-bold text-slate-500 mb-2 tracking-widest">Demo Presence</p>
              <select 
                value={currentUser.id}
                onChange={(e) => setCurrentUser(MOCK_USERS.find(u => u.id === e.target.value) || MOCK_USERS[0])}
                className="bg-slate-800 text-[10px] text-white border-none rounded p-1.5 focus:ring-1 focus:ring-indigo-500 w-full outline-none"
              >
                {MOCK_USERS.map(u => (
                  <option key={u.id} value={u.id}>{u.role}</option>
                ))}
              </select>
            </div>
          }
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">GDPR COMPLIANT</span>
          </div>
        </div>
        
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3 top-20 bg-slate-800 border border-slate-700 rounded-full p-1 hover:bg-emerald-500 transition-colors"
        >
          {isSidebarOpen ? <X size={14} /> : <Menu size={14} />}
        </button>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shadow-sm relative z-10">
          <div className="flex items-center gap-8">
            <h1 className="text-lg font-bold text-slate-800 tracking-tight">
              {navigation.find(n => n.id === activeTab)?.name} Scrutiny
            </h1>
            <div className="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-1.5 gap-2 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <span className="text-slate-400">Latency Average:</span>
              <span className="text-indigo-600">242ms</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-4 py-1.5 shadow-inner">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Privacy Mode</span>
              <button 
                onClick={() => setPrivacyMode(!privacyMode)}
                className={cn(
                  "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500",
                  privacyMode ? "bg-indigo-600" : "bg-slate-300"
                )}
              >
                <span className={cn(
                  "pointer-events-none block h-3.5 w-3.5 rounded-full bg-white shadow-sm ring-0 transition-all",
                  privacyMode ? "translate-x-4.5" : "translate-x-1"
                )} />
              </button>
            </div>

            <div className="h-8 w-px bg-slate-200 mx-1" />
            
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{currentUser.name}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">ABAC Level: {currentUser.role}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-indigo-600 font-bold shadow-sm group-hover:border-indigo-300 transition-all">
                {currentUser.name.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* View Container */}
        <div className="flex-1 overflow-y-auto p-8 bg-[#F1F5F9]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="max-w-7xl mx-auto"
            >
              {activeTab === 'dashboard' && <Overview privacyMode={privacyMode} transactions={transactions} />}
              {activeTab === 'transactions' && <TransactionQueue privacyMode={privacyMode} transactions={transactions} onAction={handleAction} />}
              {activeTab === 'cases' && <CaseManager privacyMode={privacyMode} transactions={transactions} onAction={handleAction} />}
              {activeTab === 'modeling' && <ModelAuthoring />}
              {activeTab === 'privacy' && <PrivacyCenter currentUser={currentUser} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Real-time Indicator Overlay */}
        <div className="absolute bottom-6 right-6 pointer-events-none">
          <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-slate-200 p-4 flex flex-col gap-1 items-end">
             <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[0, 1, 2, 3].map(i => (
                    <motion.div 
                      key={i}
                      animate={{ height: [10, 20, 10] }}
                      transition={{ repeat: Infinity, duration: 1, delay: i * 0.15 }}
                      className="w-1 bg-emerald-500 rounded-full"
                    />
                  ))}
                </div>
                <span className="text-[10px] font-bold text-slate-600 uppercase">Latency: 142ms</span>
             </div>
             <span className="text-[8px] text-slate-400 uppercase">Guardian Engine v2.4.1</span>
          </div>
        </div>
      </main>
    </div>
  );
}

