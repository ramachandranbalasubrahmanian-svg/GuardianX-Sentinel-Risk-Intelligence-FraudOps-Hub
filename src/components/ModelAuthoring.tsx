/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Settings, Play, Save, Plus, Trash2, Database, Network, Cpu, Code, Loader2, CheckCircle2, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

// Initialize AI helper lazily
const getAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    throw new Error("Gemini API key is not configured in environment variables.");
  }
  return new GoogleGenAI({ apiKey });
};

interface Rule {
  id: string;
  name: string;
  condition: string;
  action: string;
  weight: number;
}

export function ModelAuthoring() {
  const [rules, setRules] = useState<Rule[]>([
    { id: '1', name: 'High Value Jump', condition: 'amount > 5000 && distance > 500', action: 'FLAG', weight: 85 },
    { id: '2', name: 'Merchant Mismatch', condition: 'merchant_category != user_history', action: 'SCORE', weight: 15 },
    { id: '3', name: 'Velocity Check', condition: 'txn_count_1h > 5', action: 'REJECT', weight: 95 },
  ]);

  const [isDeploying, setIsDeploying] = useState(false);
  const [showDeploymentSuccess, setShowDeploymentSuccess] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isGeneratingRule, setIsGeneratingRule] = useState(false);
  const [simulationResult, setSimulationResult] = useState<{ score: number, trace: string[] } | null>(null);

  const handleSuggestRule = async () => {
    setIsGeneratingRule(true);
    try {
      const ai = getAIClient();
      const prompt = `You are a fraud risk expert. Suggest a realistic fraud detection rule for a modern fintech dashboard. 
      The rule should be in the format: { "name": "Name", "condition": "code-like condition", "action": "FLAG/SCORE/REJECT", "weight": number 0-100 }.
      Current rules are: ${JSON.stringify(rules)}.
      Return ONLY the JSON object.`;
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      });
      
      const text = response.text || "";
      // Simple parser for safety
      const jsonStr = text.match(/\{.*\}/s)?.[0];
      if (jsonStr) {
        const newRule = JSON.parse(jsonStr);
        setRules(prev => [...prev, { ...newRule, id: Math.random().toString(36).substr(2, 9) }]);
      }
    } catch (err) {
      console.error("AI Rule Suggestion failed:", err);
      // Fallback if key is missing or error occurs
      const fallbackRules = [
        { id: Date.now().toString(), name: 'Travel Anomaly', condition: 'travel_mode == true && last_tx_dist > 2000', action: 'FLAG', weight: 45 },
        { id: (Date.now() + 1).toString(), name: 'Midnight Spender', condition: 'hour >= 0 && hour <= 4 && amount > 1000', action: 'SCORE', weight: 30 }
      ];
      const randomFallback = fallbackRules[Math.floor(Math.random() * fallbackRules.length)];
      setRules(prev => [...prev, randomFallback]);
    } finally {
      setIsGeneratingRule(false);
    }
  };

  const handleSandboxRun = () => {
    setIsSimulating(true);
    setSimulationResult(null);
    
    // Simulate complex rule execution
    setTimeout(() => {
      const randomScore = Math.floor(Math.random() * 100);
      const trace = [
        "Initializing Model Sandbox v2.4...",
        "Fetching sample batch size: 1,000 txns",
        `Applying Rule #1 (${rules[0].name})... PASSED`,
        `Applying Rule #2 (${rules[1].name})... TRIGGERED (+12 to local score)`,
        `Applying Rule #3 (${rules[2].name})... SKIPPED (Threshold not met)`,
        "Compiling Ensemble Result...",
        `Simulation Complete: Composite Score ${randomScore}`
      ];
      setSimulationResult({ score: randomScore, trace });
      setIsSimulating(false);
    }, 2000);
  };

  const handleDeploy = () => {
    setIsDeploying(true);
    setShowDeploymentSuccess(false);

    // Simulate multi-region deployment
    setTimeout(() => {
      setIsDeploying(false);
      setShowDeploymentSuccess(true);
      setTimeout(() => setShowDeploymentSuccess(false), 4000);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
        {isDeploying && (
           <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 3, ease: 'linear', repeat: Infinity }}
            className="absolute bottom-0 left-0 h-1 w-full bg-indigo-500"
           />
        )}
        <div>
          <h2 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Decision Modeler Pro</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Configure real-time logic and ensemble weights</p>
        </div>
        <div className="flex gap-3 relative z-10">
          <button 
            onClick={handleSandboxRun}
            disabled={isSimulating || isDeploying}
            className={cn(
              "flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black uppercase tracking-widest px-4 py-2.5 rounded-lg transition-all border border-slate-200 disabled:opacity-50",
              isSimulating && "animate-pulse"
            )}
          >
            {isSimulating ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
            {isSimulating ? "Simulating..." : "Sandbox Run"}
          </button>
          <button 
            onClick={handleDeploy}
            disabled={isDeploying || isSimulating}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-widest px-4 py-2.5 rounded-lg transition-all shadow-lg shadow-indigo-600/20 active:scale-95 disabled:opacity-50"
          >
            {isDeploying ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {isDeploying ? "Propagating..." : "Deploy Logic"}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showDeploymentSuccess && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between shadow-sm overflow-hidden"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-emerald-500" size={20} />
              <div className="text-xs font-bold text-emerald-800 tracking-tight">
                LOGIC SUCCESSFULLY PROPAGATED TO 12 GLOBAL REGIONS
              </div>
            </div>
            <span className="text-[9px] font-black text-emerald-500 uppercase">Version 2.4.1 LIVE</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Toolbar */}
        <div className="lg:col-span-3 space-y-4">
           {simulationResult && (
             <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900 rounded-xl p-5 border border-indigo-500/30 shadow-xl"
             >
                <div className="flex justify-between items-center mb-4">
                   <h4 className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em]">Sandbox Output</h4>
                   <button onClick={() => setSimulationResult(null)} className="text-slate-500 hover:text-white transition-colors text-xs font-black">X</button>
                </div>
                <div className="mb-4">
                   <span className="text-4xl font-black text-white tracking-tighter">{simulationResult.score}</span>
                   <span className="text-[9px] text-slate-500 font-bold uppercase ml-2">Sim Score</span>
                </div>
                <div className="space-y-1.5 ">
                   {simulationResult.trace.map((line, i) => (
                     <div key={i} className="text-[9px] font-mono text-slate-400 border-l border-indigo-500/20 pl-2">
                        {line}
                     </div>
                   ))}
                </div>
             </motion.div>
           )}
           <h4 className="text-[9px] uppercase font-black text-slate-400 tracking-widest px-2">Consortium Drivers</h4>
           <div className="space-y-2">
              {[
                { name: 'Identity Engine', icon: Database, connected: true },
                { name: 'Consortium Data', icon: Network, connected: true },
                { name: 'ML Predictions', icon: Cpu, connected: true },
                { name: 'Legacy SQL', icon: Code, connected: false },
              ].map(source => (
                <div key={source.name} className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-sm transition-all hover:border-indigo-200">
                   <div className="flex items-center gap-3">
                      <div className={cn("p-1.5 rounded-md", source.connected ? "bg-indigo-50 text-indigo-600" : "bg-slate-50 text-slate-400")}>
                        <source.icon size={16} />
                      </div>
                      <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight">{source.name}</span>
                   </div>
                   <div className={cn("w-1.5 h-1.5 rounded-full", source.connected ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-slate-300")} />
                </div>
              ))}
           </div>
           <button 
             onClick={handleSuggestRule}
             disabled={isGeneratingRule}
             className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 p-4 rounded-xl hover:border-indigo-300 hover:bg-indigo-50/50 transition-all group overflow-hidden relative"
           >
              <AnimatePresence>
                {isGeneratingRule && (
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute inset-0 bg-indigo-600 flex items-center justify-center z-10"
                  >
                    <Loader2 size={18} className="text-white animate-spin" />
                  </motion.div>
                )}
              </AnimatePresence>
              <Sparkles size={18} className="text-indigo-400 group-hover:text-indigo-500" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-indigo-600 transition-colors">AI Suggester</span>
           </button>
           
           <button className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 p-4 rounded-xl hover:border-indigo-300 hover:bg-indigo-50/50 transition-all group">
              <Plus size={18} className="text-slate-400 group-hover:text-indigo-500" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-indigo-600 transition-colors">Connect Source</span>
           </button>
        </div>

        {/* Rule Builder */}
        <div className="lg:col-span-9 space-y-4">
           <div className="flex justify-between items-center px-2">
             <h4 className="text-[9px] uppercase font-black text-slate-400 tracking-widest">Active Rule Chain</h4>
             <span className="text-[9px] bg-emerald-500 text-white font-black px-2 py-0.5 rounded uppercase tracking-widest leading-none">ABAC Active</span>
           </div>
           
           <div className="space-y-3">
             {rules.map((rule, index) => (
               <motion.div 
                 key={rule.id}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: index * 0.05 }}
                 className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-6 group hover:border-indigo-200 transition-colors"
               >
                  <div className="bg-slate-50 w-8 h-8 rounded-lg flex items-center justify-center font-black text-slate-400 text-xs border border-slate-100">
                    {index + 1}
                  </div>
                  <div className="flex-1 space-y-1">
                     <p className="font-black text-slate-900 uppercase text-[11px] tracking-wider mb-0.5">{rule.name}</p>
                     <div className="flex gap-3 items-center">
                        <div className="text-[10px] bg-slate-900 px-2.5 py-1 rounded font-mono text-indigo-400 border border-slate-700 flex items-center gap-2">
                          <span className="text-slate-600">IF</span>
                          {rule.condition}
                        </div>
                        <span className="text-slate-300">→</span>
                        <div className={cn(
                          "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest",
                          rule.action === 'REJECT' ? "bg-rose-500 text-white" : "bg-amber-500 text-white"
                        )}>
                          {rule.action}
                        </div>
                     </div>
                  </div>
                  <div className="w-40 px-4 border-x border-slate-50">
                     <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[9px] uppercase font-black text-slate-400 tracking-widest">Weight</span>
                        <span className="text-[10px] font-black text-slate-900">{rule.weight}%</span>
                     </div>
                     <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.4)]" style={{ width: `${rule.weight}%` }} />
                     </div>
                  </div>
                  <button className="text-slate-300 hover:text-rose-500 transition-colors p-2 hover:bg-rose-50 rounded-lg">
                    <Trash2 size={16} />
                  </button>
               </motion.div>
             ))}
           </div>

           <button className="w-full flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-200 p-10 rounded-2xl hover:border-indigo-300 hover:bg-indigo-50/30 transition-all text-slate-400 hover:text-indigo-600 group bg-white/50">
              <div className="bg-white p-3 rounded-full shadow-lg border border-slate-100 group-hover:scale-110 transition-transform">
                <Plus size={20} className="text-indigo-600" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] mt-2">Add Scrutiny Logic Node</span>
           </button>
        </div>
      </div>
    </div>
  );
}
