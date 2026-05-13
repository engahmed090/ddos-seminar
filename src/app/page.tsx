"use client";

import React, { useState, useRef } from "react";
import {
  Shield, Activity, Fingerprint, Network, Brain, Play, RotateCcw,
  CheckCircle, AlertTriangle, Server, MonitorSmartphone, Zap, Cloud,
  Router, Layers, Globe, Cpu, Filter, XCircle, Check, Map, Database, HardDrive
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";

/* --- MOCK DATA FOR DETECTION --- */
const BASE_TRAFFIC = [
  { t: "0s", v: 32 }, { t: "1s", v: 35 }, { t: "2s", v: 31 }, { t: "3s", v: 36 },
  { t: "4s", v: 34 }, { t: "5s", v: 38 }, { t: "6s", v: 33 }, { t: "7s", v: 35 },
  { t: "8s", v: 32 }, { t: "9s", v: 36 }, { t: "10s", v: 34 }, { t: "11s", v: 37 },
];
const SPIKE_TRAFFIC = [
  ...BASE_TRAFFIC,
  { t: "12s", v: 85 }, { t: "13s", v: 125 }, { t: "14s", v: 140 }, { t: "15s", v: 135 },
  { t: "16s", v: 110 }, { t: "17s", v: 95 }, { t: "18s", v: 45 }, { t: "19s", v: 35 },
];

const SIGNATURES = [
  { id: 1, type: "GET", bad: false, delay: 0 },
  { id: 2, type: "SYN", bad: false, delay: 1 },
  { id: 3, type: "POST", bad: false, delay: 2 },
  { id: 4, type: "SYN", bad: true, delay: 3 }, 
  { id: 5, type: "ACK", bad: false, delay: 4 },
];

const AI_FEATURES = ["Packet Rate", "Request Interval", "Click Speed", "Session Pattern", "L7 Behavior"];

export default function MasterDefenseSuite() {
  const [activeTab, setActiveTab] = useState<"detection" | "mitigation" | "datasets">("detection");

  // Detection State
  const [activeScen, setActiveScen] = useState(1);
  const [simStep, setSimStep] = useState(0); 
  const [scanTime, setScanTime] = useState(0);
  const [chartData, setChartData] = useState(BASE_TRAFFIC);
  const [synCount, setSynCount] = useState(0);
  const [aiScores, setAiScores] = useState({ human: 95, bot: 5, conf: 40 });
  const [activeFeat, setActiveFeat] = useState(-1);

  // Mitigation State
  const [activeMitScen, setActiveMitScen] = useState(1);
  const [mitStep, setMitStep] = useState(0);
  const [mitCounter, setMitCounter] = useState(0);

  // Datasets State
  const [activeDataset, setActiveDataset] = useState(1);
  const [dataStep, setDataStep] = useState(0);
  const [dataStats, setDataStats] = useState({ pps: 0, rows: 0, accuracy: 0 });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clearSims = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const resetDetection = () => {
    clearSims();
    setSimStep(0);
    setScanTime(0);
    setChartData(BASE_TRAFFIC);
    setSynCount(0);
    setAiScores({ human: 95, bot: 5, conf: 40 });
    setActiveFeat(-1);
  };

  const resetMitigation = () => {
    clearSims();
    setMitStep(0);
    setMitCounter(0);
  };

  const resetDatasets = () => {
    clearSims();
    setDataStep(0);
    setDataStats({ pps: 0, rows: 0, accuracy: 0 });
  };

  const switchTab = (tab: "detection" | "mitigation" | "datasets") => {
    if (activeTab === tab) return;
    setActiveTab(tab);
    resetDetection();
    resetMitigation();
    resetDatasets();
  };

  const changeDetectionScen = (id: number) => {
    if (simStep > 0 && simStep < 4) return;
    setActiveScen(id);
    resetDetection();
  };

  const changeMitigationScen = (id: number) => {
    if (mitStep > 0 && mitStep < 4) return;
    setActiveMitScen(id);
    resetMitigation();
  };

  const changeDatasetScen = (id: number) => {
    if (dataStep > 0 && dataStep < 4) return;
    setActiveDataset(id);
    resetDatasets();
  };

  const runDetectionSim = () => {
    if (simStep !== 0) return;
    let currentStep = 1;
    setSimStep(1);
    const nextStep = () => { currentStep++; if (currentStep <= 4) setSimStep(currentStep); };

    if (activeScen === 1) {
      setTimeout(nextStep, 600); setTimeout(nextStep, 1200);
      let t = 0;
      timerRef.current = setInterval(() => { t += 0.5; setScanTime(t); if (t >= 4.5) { clearInterval(timerRef.current!); setSimStep(4); } }, 500);
    } else if (activeScen === 2) {
      setTimeout(nextStep, 800); setTimeout(nextStep, 1600);
      let point = 12;
      timerRef.current = setInterval(() => { setChartData(prev => [...prev, SPIKE_TRAFFIC[point]]); point++; if (point >= 15) { clearInterval(timerRef.current!); setSimStep(4); } }, 600);
    } else if (activeScen === 3) {
      setTimeout(nextStep, 1000); 
      setTimeout(() => {
        nextStep(); 
        let count = 0;
        timerRef.current = setInterval(() => { 
            count += Math.floor(Math.random() * 800 + 400); 
            setSynCount(count); 
            if (count > 6000) { 
                clearInterval(timerRef.current!); 
                setSimStep(4); 
            } 
        }, 150);
      }, 2000);
    } else if (activeScen === 4) {
      setTimeout(nextStep, 600); setTimeout(nextStep, 1800);
      let f = -1;
      timerRef.current = setInterval(() => { f++; setActiveFeat(f); setAiScores({ human: Math.max(2, 95 - f * 15), bot: Math.min(98, 5 + f * 15), conf: Math.min(99, 40 + f * 10) }); if (f >= AI_FEATURES.length - 1) { clearInterval(timerRef.current!); setSimStep(4); } }, 500);
    }
  };

  const runMitigationSim = () => {
    if (mitStep !== 0) return;
    let currentStep = 1;
    setMitStep(1);
    const nextStep = () => { currentStep++; if (currentStep <= 4) setMitStep(currentStep); };
    setTimeout(nextStep, 800); setTimeout(nextStep, 1600);
    let c = 0;
    timerRef.current = setInterval(() => { c++; setMitCounter(c); if (c >= 10) { clearInterval(timerRef.current!); setMitStep(4); } }, 400);
  };

  const runDatasetSim = () => {
    if (dataStep !== 0) return;
    let currentStep = 1;
    setDataStep(1);
    const nextStep = () => { currentStep++; if (currentStep <= 4) setDataStep(currentStep); };
    setTimeout(nextStep, 800); setTimeout(nextStep, 1600);
    let c = 0;
    timerRef.current = setInterval(() => { 
        c++; 
        setDataStats(prev => ({
            pps: prev.pps + Math.floor(Math.random() * 8000) + 12000,
            rows: prev.rows + Math.floor(Math.random() * 80) + 20,
            accuracy: Math.min(99.8, prev.accuracy + Math.random() * 5 + 4)
        }));
        if (c >= 20) { 
            clearInterval(timerRef.current!); 
            setDataStep(4); 
        } 
    }, 250);
  };

  const detStepsArr = ["Monitoring", "Extracting Signals", "Analyzing", "Decision"];
  const mitStepsArr = ["Idle Topology", "Traffic Flow Starts", "Defenses Engaging", "Mitigation Complete"];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col pb-12 overflow-x-hidden selection:bg-emerald-500/30">
      
      {/* HEADER */}
      <header className="pt-10 pb-4 px-6 text-center w-full mx-auto relative z-40">
        <h1 className="text-5xl font-black text-white tracking-tight mb-3">
          Cisco Packet Tracer Lab
        </h1>
        <p className="text-sm font-bold text-emerald-500 uppercase tracking-widest">Interactive Network Topology Simulation</p>
      </header>

      {/* MASSIVE 3-TAB SWITCHER - GUARANTEED NO OVERLAP */}
      <div className="w-full flex justify-center items-center gap-6 my-12 mb-16 z-40 relative px-4">
        <button onClick={() => switchTab("detection")} className={`flex items-center justify-center gap-4 px-8 py-5 rounded-[2rem] border-4 transition-all duration-300 flex-1 max-w-[22rem] ${activeTab === "detection" ? "bg-blue-600 border-blue-500 text-white shadow-[0_15px_40px_rgba(37,99,235,0.4)] scale-105 font-black" : "bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white font-bold"}`}>
          <Brain className="w-8 h-8 flex-shrink-0" />
          <span className="text-xl lg:text-2xl tracking-tight truncate">Detection Engine</span>
        </button>
        <button onClick={() => switchTab("mitigation")} className={`flex items-center justify-center gap-4 px-8 py-5 rounded-[2rem] border-4 transition-all duration-300 flex-1 max-w-[22rem] ${activeTab === "mitigation" ? "bg-emerald-600 border-emerald-500 text-white shadow-[0_15px_40px_rgba(5,150,105,0.4)] scale-105 font-black" : "bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white font-bold"}`}>
          <Router className="w-8 h-8 flex-shrink-0" />
          <span className="text-xl lg:text-2xl tracking-tight truncate">Mitigation Lab</span>
        </button>
        <button onClick={() => switchTab("datasets")} className={`flex items-center justify-center gap-4 px-8 py-5 rounded-[2rem] border-4 transition-all duration-300 flex-1 max-w-[22rem] ${activeTab === "datasets" ? "bg-purple-600 border-purple-500 text-white shadow-[0_15px_40px_rgba(168,85,247,0.4)] scale-105 font-black" : "bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white font-bold"}`}>
          <Database className="w-8 h-8 flex-shrink-0" />
          <span className="text-xl lg:text-2xl tracking-tight truncate">Dataset Replay</span>
        </button>
      </div>

      {/* --- TAB 1: DETECTION ENGINE --- */}
      {activeTab === "detection" && (
        <main className="flex-1 w-full max-w-[98%] mx-auto px-4 flex flex-col z-10 relative">
          <div className="bg-slate-900 rounded-[3.5rem] border-4 border-slate-800 shadow-[0_30px_80px_rgb(0,0,0,0.6)] flex-1 flex flex-col overflow-hidden relative min-h-[650px]">
            
            {/* Grid Background */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)] pointer-events-none" />

            <div className="p-6 border-b border-slate-800 flex items-center justify-center bg-slate-900/80 backdrop-blur-md z-20">
              <div className="flex flex-wrap items-center justify-center w-full gap-4 text-sm font-black tracking-widest uppercase text-blue-400">
                {detStepsArr.map((s, i) => {
                  const isActive = simStep === i + 1;
                  const isPast = simStep > i + 1 || simStep === 4;
                  return (
                    <React.Fragment key={s}>
                      <div className={`px-5 py-2.5 rounded-xl transition-all duration-300 ${isActive ? "bg-blue-900/50 border border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)] text-white scale-105" : isPast ? "text-blue-500" : "text-slate-600"}`}>
                        {s}
                      </div>
                      {i < 3 && <div className={`w-10 h-1 rounded-full ${isPast ? "bg-blue-800" : "bg-slate-800"}`} />}
                    </React.Fragment>
                  )
                })}
              </div>
            </div>
            
            <div className="flex-1 p-8 flex items-center justify-center relative z-10 overflow-hidden">

              {/* Det Scen 1 */}
              {activeScen === 1 && (
                <div className="w-full max-w-5xl flex flex-col items-center relative scale-125">
                  <div className="w-full h-72 relative flex items-center justify-center">
                    <div className="absolute left-1/2 -translate-x-1/2 w-48 h-72 bg-slate-800/95 backdrop-blur-xl border border-slate-600 rounded-[3rem] shadow-2xl z-20 flex flex-col items-center justify-center">
                      <Fingerprint className={`w-20 h-20 transition-colors duration-500 ${simStep === 4 ? "text-rose-500" : "text-blue-500"}`} />
                      {simStep > 0 && simStep < 4 && <div className="absolute inset-x-8 top-8 h-2 bg-blue-400 blur-[2px] animate-[scanBeam_1.5s_ease-in-out_infinite]" />}
                    </div>
                    <div className="absolute inset-x-0 h-1.5 bg-slate-800 border-t-2 border-dashed border-slate-600" />
                    {SIGNATURES.map((pkt) => {
                      const progress = Math.max(0, scanTime - pkt.delay);
                      let xPos = progress * 240;
                      let status = (xPos > 480 && !pkt.bad) ? "passed" : (pkt.bad && xPos >= 360) ? (simStep === 4 ? "caught" : "scanning") : "approaching";
                      if (pkt.bad && xPos >= 360) xPos = 360;
                      return (
                        <div key={pkt.id} className={`absolute left-0 w-24 h-32 rounded-[2rem] border-4 flex items-center justify-center font-mono text-xl font-black transition-all duration-300 ease-linear shadow-md ${status === "caught" ? "bg-rose-900 border-rose-500 text-rose-300 scale-110 z-30 shadow-[0_0_30px_rgba(244,63,94,0.4)] animate-[shake_0.5s_ease-in-out]" : status === "scanning" ? "bg-slate-800 border-blue-500 text-blue-400 z-30 scale-105" : status === "passed" ? "bg-slate-800 border-emerald-500 text-emerald-400 opacity-0" : "bg-slate-800 border-slate-600 text-slate-400 z-10"}`} style={{ transform: `translateX(${xPos}px) translateY(-50%)`, top: '50%' }}>{pkt.type}</div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Det Scen 2 */}
              {activeScen === 2 && (
                <div className="w-full max-w-6xl h-full flex flex-col justify-center relative scale-110">
                  <div className="h-[450px] w-full relative bg-slate-900 p-8 rounded-[4rem] border border-slate-700 shadow-2xl">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 30, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="normalGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3B82F6" stopOpacity={0.4}/><stop offset="100%" stopColor="#3B82F6" stopOpacity={0}/></linearGradient>
                          <linearGradient id="dangerGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#F43F5E" stopOpacity={0.6}/><stop offset="100%" stopColor="#F43F5E" stopOpacity={0}/></linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#334155" />
                        <XAxis dataKey="t" hide />
                        <YAxis stroke="#94A3B8" fontSize={16} fontWeight="bold" tickLine={false} axisLine={false} />
                        {/* @ts-ignore */}
                        <Tooltip contentStyle={{ borderRadius: '25px', backgroundColor: '#1e293b', border: '1px solid #475569', boxShadow: '0 20px 40px -10px rgb(0 0 0 / 0.5)', padding: '20px', color: '#f8fafc' }} />
                        <ReferenceLine y={70} stroke="#F43F5E" strokeDasharray="8 8" strokeWidth={3} />
                        <Area type="monotone" dataKey="v" stroke={simStep === 4 ? "#F43F5E" : "#3B82F6"} strokeWidth={6} fill={simStep === 4 ? "url(#dangerGrad)" : "url(#normalGrad)"} />
                      </AreaChart>
                    </ResponsiveContainer>
                    <div className="absolute top-12 left-12 text-xs font-black text-rose-400 bg-rose-950/50 px-4 py-2 rounded-lg border border-rose-800">Safe Threshold</div>
                  </div>
                </div>
              )}

              {/* Det Scen 3 (Dynamic 3-Way Handshake) */}
              {activeScen === 3 && (
                <div className="w-full max-w-6xl flex items-center justify-between px-16 relative scale-110">
                  <div className="flex flex-col items-center gap-6 z-20">
                    <div className="w-32 h-32 bg-slate-800 border-4 border-slate-600 rounded-3xl shadow-xl flex items-center justify-center"><MonitorSmartphone className="w-14 h-14 text-slate-400" /></div>
                    <span className="font-mono text-sm font-black text-slate-400 uppercase tracking-widest">Client</span>
                  </div>
                  
                  <div className="flex-1 h-3 bg-slate-800 mx-8 relative flex items-center z-10 rounded-full border border-slate-700 overflow-hidden">
                     {simStep === 1 && <div className="absolute top-1/2 -translate-y-1/2 px-3 py-1 bg-slate-800 border border-blue-500 text-blue-400 text-[10px] font-mono font-bold rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)] animate-[slideRightFull_1s_linear_forwards] whitespace-nowrap">[SYN]</div>}
                     {simStep === 2 && <div className="absolute top-1/2 -translate-y-1/2 px-3 py-1 bg-slate-800 border border-emerald-500 text-emerald-400 text-[10px] font-mono font-bold rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)] animate-[slideLeftFull_1s_linear_forwards] whitespace-nowrap">[SYN-ACK]</div>}
                     {(simStep === 3 || simStep === 4) && (
                         <>
                             <div className="absolute top-1/2 -translate-y-1/2 px-3 py-1 bg-slate-900 border border-rose-500 text-rose-500 text-[10px] font-mono font-bold rounded-full shadow-[0_0_15px_rgba(244,63,94,0.6)] animate-[slideRightFull_0.3s_linear_infinite] whitespace-nowrap">[SYN]</div>
                             <div className="absolute top-1/2 -translate-y-1/2 px-3 py-1 bg-slate-900 border border-rose-500 text-rose-500 text-[10px] font-mono font-bold rounded-full shadow-[0_0_15px_rgba(244,63,94,0.6)] animate-[slideRightFull_0.4s_linear_infinite] delay-75 whitespace-nowrap" style={{ marginTop: '-20px' }}>[SYN]</div>
                             <div className="absolute top-1/2 -translate-y-1/2 px-3 py-1 bg-slate-900 border border-rose-500 text-rose-500 text-[10px] font-mono font-bold rounded-full shadow-[0_0_15px_rgba(244,63,94,0.6)] animate-[slideRightFull_0.2s_linear_infinite] delay-150 whitespace-nowrap" style={{ marginTop: '20px' }}>[SYN]</div>
                         </>
                     )}
                  </div>
                  
                  <div className="flex flex-col items-center gap-6 z-20">
                    <div className={`w-40 h-40 rounded-3xl flex flex-col items-center justify-center border-4 relative transition-all duration-300 ${simStep >= 3 ? 'bg-rose-950/80 border-rose-500 shadow-[0_0_60px_rgba(244,63,94,0.6)] scale-110' : 'bg-slate-800 border-blue-500 shadow-xl'}`}>
                      <Server className={`w-14 h-14 ${simStep >= 3 ? 'text-rose-500 animate-pulse mb-1' : 'text-blue-500 mb-0'}`} />
                      {simStep >= 3 && <div className="text-[10px] text-rose-300 font-mono font-bold text-center leading-tight absolute bottom-4 animate-[fadeIn_0.2s_ease-out] w-full px-2">Conns: {synCount.toLocaleString()}<br/>(Resource Exhausted)</div>}
                    </div>
                    <span className="font-mono text-sm font-black text-slate-400 uppercase tracking-widest">Server</span>
                  </div>
                </div>
              )}

              {/* Det Scen 4 */}
              {activeScen === 4 && (
                <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-24 relative scale-105">
                  <div className="flex flex-col gap-5 w-80">
                    {AI_FEATURES.map((feat, i) => (
                      <div key={feat} className={`text-sm font-black uppercase tracking-widest px-8 py-4 rounded-2xl border-4 transition-all flex items-center gap-5 ${activeFeat === i ? "bg-slate-800 border-blue-500 text-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.3)] scale-110" : activeFeat > i ? "bg-slate-900 border-slate-700 text-slate-500" : "bg-transparent border-slate-800 text-slate-600"}`}>{feat}</div>
                    ))}
                  </div>
                  <div className={`w-80 h-80 rounded-[4rem] border-[10px] bg-slate-900 flex flex-col items-center justify-center shadow-2xl transition-all ${simStep === 4 ? 'border-rose-500 scale-110 shadow-[0_0_60px_rgba(244,63,94,0.4)]' : 'border-blue-900'}`}>
                    <Brain className={`w-28 h-28 mb-6 ${simStep === 4 ? 'text-rose-500' : 'text-blue-500'}`} />
                    <span className="text-lg font-black text-slate-500 tracking-widest uppercase">AI Engine</span>
                  </div>
                  <div className="w-96 flex flex-col gap-10 bg-slate-800 p-10 rounded-[3rem] border-4 border-slate-700 shadow-2xl">
                    {[{label: "Human Prob", val: aiScores.human, color: "bg-emerald-500"}, {label: "Bot Prob", val: aiScores.bot, color: "bg-rose-500"}, {label: "AI Confidence", val: aiScores.conf, color: "bg-blue-500"}].map((bar) => (
                      <div key={bar.label}>
                        <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-3"><span className="text-slate-400">{bar.label}</span><span className="text-white">{bar.val}%</span></div>
                        <div className="h-4 bg-slate-900 rounded-full overflow-hidden border border-slate-700"><div className={`h-full ${bar.color} transition-all`} style={{ width: `${bar.val}%` }} /></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* RUN CONTROLS NATIVELY EMBEDDED BOTTOM-RIGHT */}
              <div className="absolute bottom-10 right-10 z-50 flex items-center gap-6">
                <button onClick={resetDetection} disabled={simStep === 0} className="w-20 h-20 bg-slate-800 border-2 border-slate-600 text-slate-400 rounded-3xl hover:bg-slate-700 hover:text-white transition-all shadow-2xl flex items-center justify-center disabled:opacity-30 disabled:hover:bg-slate-800">
                  <RotateCcw className="w-8 h-8" />
                </button>
                <button onClick={runDetectionSim} disabled={simStep !== 0} className="h-20 px-12 bg-blue-600 text-white rounded-3xl font-black text-2xl hover:bg-blue-500 transition-all shadow-[0_15px_40px_rgba(37,99,235,0.4)] flex items-center gap-4 disabled:opacity-30 disabled:shadow-none">
                  <Play className="w-8 h-8 fill-current" /> Run Simulation
                </button>
              </div>

            </div>
          </div>

          {/* LARGE BOTTOM SCENARIO SELECTORS */}
          <div className="flex flex-wrap gap-6 mt-8 justify-center pb-4 z-40 relative">
            {[
              {id: 1, title: "Signature Filter"},
              {id: 2, title: "Anomaly Chart"},
              {id: 3, title: "Protocol State"},
              {id: 4, title: "AI/ML Behavior"}
            ].map(scen => (
              <button key={scen.id} onClick={() => changeDetectionScen(scen.id)} className={`px-10 py-5 rounded-[2rem] font-black text-lg transition-all border-[3px] shadow-lg ${activeScen === scen.id ? 'bg-slate-800 border-blue-500 text-blue-400 scale-105' : 'bg-slate-900 border-slate-700 text-slate-500 hover:bg-slate-800 hover:text-slate-300'}`}>
                {scen.title}
              </button>
            ))}
          </div>
        </main>
      )}

      {/* --- TAB 2: MITIGATION LAB (PURE CISCO PACKET TRACER THEME) --- */}
      {activeTab === "mitigation" && (
        <main className="flex-1 w-full max-w-[98%] mx-auto px-4 flex flex-col z-10 relative animate-[fadeIn_0.4s_ease-out]">
          
          <div className="bg-slate-900 rounded-[3.5rem] border-4 border-slate-800 shadow-[0_30px_80px_rgb(0,0,0,0.6)] flex-1 flex flex-col overflow-hidden relative min-h-[650px]">
            
            {/* Grid Background */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.1)_0%,transparent_70%)] pointer-events-none" />

            {/* Top Indicator */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-center bg-slate-900/80 backdrop-blur-md z-20">
              <div className="flex flex-wrap items-center justify-center w-full gap-4 text-sm font-black tracking-widest uppercase text-emerald-400">
                {mitStepsArr.map((s, i) => (
                  <React.Fragment key={s}>
                    <div className={`px-5 py-2.5 rounded-xl transition-all duration-300 ${mitStep === i + 1 ? "bg-emerald-900/50 border border-emerald-500 shadow-[0_0_15px_rgba(52,211,153,0.3)] text-white scale-105" : mitStep > i + 1 || mitStep === 4 ? "text-emerald-500" : "text-slate-600"}`}>
                      {s}
                    </div>
                    {i < 3 && <div className="w-10 h-1 rounded-full bg-slate-800" />}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* CISCO STAGE */}
            <div className="flex-1 p-8 flex items-center justify-center relative z-10 overflow-hidden">
              
              {/* Mit Scen 1: Scrubbing (Live IP Traffic Filtering) */}
              {activeMitScen === 1 && (
                <div className="w-full max-w-6xl flex items-center justify-between px-10 scale-110">
                  <div className="flex flex-col items-center gap-4 z-20">
                    <div className={`w-32 h-32 rounded-2xl flex items-center justify-center border-4 bg-slate-800 shadow-2xl relative ${mitStep > 0 ? 'border-rose-500 text-rose-500' : 'border-slate-700 text-slate-500'}`}>
                      <Cloud className="w-16 h-16" />
                      {mitStep > 0 && <div className="absolute inset-0 rounded-xl bg-rose-500/20 animate-pulse" />}
                    </div>
                    <span className="font-mono font-bold text-slate-400 uppercase text-xs">Attacker Net</span>
                  </div>

                  <div className="flex-1 h-3 bg-slate-800 mx-8 relative flex items-center overflow-hidden rounded-full border border-slate-700 z-10">
                    {mitStep > 0 && mitStep < 4 && (
                        <>
                           <div className="absolute top-1/2 -translate-y-1/2 px-3 py-1 bg-slate-900 border border-rose-500 text-rose-400 text-[10px] font-mono font-bold rounded-full animate-[slideRightFull_1.5s_linear_infinite] whitespace-nowrap" style={{ marginTop: '-20px' }}>[IP: 185.220.101.5 - Payload: UDP Flood]</div>
                           <div className="absolute top-1/2 -translate-y-1/2 px-3 py-1 bg-slate-900 border border-emerald-500 text-emerald-400 text-[10px] font-mono font-bold rounded-full animate-[slideRightFull_2s_linear_infinite] whitespace-nowrap delay-300" style={{ marginTop: '20px' }}>[IP: 194.12.87.12 - Payload: GET /]</div>
                           <div className="absolute top-1/2 -translate-y-1/2 px-3 py-1 bg-slate-900 border border-rose-500 text-rose-400 text-[10px] font-mono font-bold rounded-full animate-[slideRightFull_1.2s_linear_infinite] whitespace-nowrap delay-700" style={{ marginTop: '0px' }}>[IP: 211.14.8.99 - Payload: UDP Flood]</div>
                        </>
                    )}
                    {mitStep === 4 && (
                        <>
                           <div className="absolute top-1/2 -translate-y-1/2 px-3 py-1 bg-slate-900 border border-rose-500 text-rose-400 text-[10px] font-mono font-bold rounded-full animate-[slideRightHalfAndDrop_1.5s_linear_infinite] whitespace-nowrap z-20" style={{ marginTop: '-20px' }}>[IP: 185.220.101.5]</div>
                           <div className="absolute top-1/2 -translate-y-1/2 px-3 py-1 bg-slate-900 border border-emerald-500 text-emerald-400 text-[10px] font-mono font-bold rounded-full animate-[slideRightFull_2s_linear_infinite] whitespace-nowrap delay-300 z-10" style={{ marginTop: '20px' }}>[IP: 194.12.87.12 - Payload: GET /]</div>
                           <div className="absolute top-1/2 -translate-y-1/2 px-3 py-1 bg-slate-900 border border-rose-500 text-rose-400 text-[10px] font-mono font-bold rounded-full animate-[slideRightHalfAndDrop_1.2s_linear_infinite] whitespace-nowrap delay-700 z-20" style={{ marginTop: '0px' }}>[IP: 211.14.8.99]</div>
                           <div className="absolute left-[45%] top-[25%] text-rose-500 text-xs font-black animate-[dropPulse_0.5s_linear_infinite] z-30">[DROPPED]</div>
                        </>
                    )}
                  </div>

                  <div className={`w-48 h-48 rounded-[2rem] flex flex-col items-center justify-center border-[6px] shadow-2xl transition-all z-20 ${mitStep === 4 ? 'bg-slate-800 border-emerald-500 text-emerald-400 shadow-[0_0_40px_rgba(52,211,153,0.3)] scale-110' : 'bg-slate-800 border-slate-700 text-slate-600'}`}>
                    <Layers className="w-16 h-16 mb-4" />
                    <span className="font-mono font-bold text-xs uppercase tracking-widest text-center">Scrubbing<br/>Center</span>
                  </div>

                  <div className="flex-1 h-3 bg-slate-800 mx-8 relative flex items-center overflow-hidden rounded-full border border-slate-700 z-10">
                    {mitStep === 4 && (
                        <div className="absolute top-1/2 -translate-y-1/2 px-3 py-1 bg-slate-900 border border-emerald-500 text-emerald-400 text-[10px] font-mono font-bold rounded-full animate-[slideRightFull_2s_linear_infinite] whitespace-nowrap delay-300" style={{ marginTop: '0px' }}>[IP: 194.12.87.12 - Payload: GET /]</div>
                    )}
                  </div>

                  <div className="flex flex-col items-center gap-4 z-20">
                    <div className={`w-32 h-32 rounded-2xl flex items-center justify-center border-4 shadow-2xl bg-slate-800 transition-all ${mitStep === 4 ? 'border-emerald-500 text-emerald-400' : 'border-slate-700 text-slate-600'}`}><Server className="w-16 h-16" /></div>
                    <span className="font-mono font-bold text-slate-400 uppercase text-xs">Core Switch</span>
                  </div>
                </div>
              )}

              {/* Mit Scen 2: Anycast (Edge Polishing) */}
              {activeMitScen === 2 && (
                <div className="w-full max-w-6xl flex flex-col items-center justify-center gap-16 scale-110 relative">
                  <div className="flex justify-around w-full px-32 relative z-30">
                    {[1,2,3].map((i) => (
                      <div key={i} className={`w-20 h-20 rounded-2xl flex items-center justify-center border-4 bg-slate-800 transition-all ${mitStep > 0 ? 'border-rose-500 text-rose-500 animate-pulse shadow-[0_0_20px_rgba(244,63,94,0.4)]' : 'border-slate-700 text-slate-600'}`}><Cloud className="w-10 h-10" /></div>
                    ))}
                  </div>

                  {mitStep > 0 && (
                    <div className="absolute top-[80px] inset-x-0 h-32 pointer-events-none z-10 flex justify-center opacity-80">
                      <div className="w-full max-w-3xl flex justify-between px-16 relative">
                         {[1,2,3,4].map(b => (
                           <div key={b} className="relative h-full w-0.5 bg-rose-500/20 overflow-visible flex flex-col items-center">
                               <div className="absolute w-1 h-1/2 bg-gradient-to-b from-transparent to-rose-500 animate-[downBeam_0.8s_linear_infinite]" style={{ animationDelay: `${b * 0.15}s` }} />
                               <div className="absolute top-1/2 -translate-y-1/2 bg-rose-950 border border-rose-500 text-rose-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow-[0_0_10px_rgba(244,63,94,0.6)] whitespace-nowrap -ml-0 z-20">40 Gbps</div>
                           </div>
                         ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between w-full px-12 relative z-20">
                    <div className="absolute inset-x-20 top-1/2 h-2 bg-slate-800 -z-10 rounded-full" />
                    {[ "N1", "N2", "N3", "N4" ].map((node) => (
                      <div key={node} className={`flex flex-col items-center justify-center w-36 h-36 rounded-3xl border-4 transition-all bg-slate-800 shadow-2xl relative ${mitStep === 4 ? 'border-emerald-500 text-emerald-400 shadow-[0_0_40px_rgba(52,211,153,0.4)] scale-110' : mitStep > 0 ? 'border-rose-500 text-rose-400 shadow-[0_0_30px_rgba(244,63,94,0.3)]' : 'border-slate-700 text-slate-600'}`}>
                        <Globe className="w-12 h-12 mb-2" />
                        <span className="font-mono font-black text-sm">{node} Anycast</span>
                        {mitStep === 4 && <span className="absolute -bottom-6 font-mono font-bold text-[10px] bg-emerald-900/80 border border-emerald-500/50 px-2 py-1 rounded text-emerald-300 shadow-md whitespace-nowrap animate-[fadeIn_0.3s_ease-out]">Absorbing</span>}
                      </div>
                    ))}
                  </div>

                  <div className={`flex items-center gap-6 px-12 py-6 rounded-[2rem] border-4 shadow-2xl transition-all z-20 ${mitStep === 4 ? 'bg-slate-800 border-emerald-500 text-emerald-400' : mitStep > 0 ? 'bg-slate-800 border-emerald-500/50 text-emerald-400/50' : 'bg-slate-800 border-slate-700 text-slate-600'}`}>
                    <Server className="w-12 h-12" />
                    <h4 className="font-mono font-black text-xl uppercase">Datacenter Origin</h4>
                  </div>
                </div>
              )}

              {/* Mit Scen 3: Rate Limiting */}
              {activeMitScen === 3 && (
                <div className="w-full max-w-5xl flex items-center justify-between px-16 scale-110">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-32 h-32 rounded-2xl border-4 border-slate-700 bg-slate-800 flex items-center justify-center text-slate-500"><MonitorSmartphone className="w-16 h-16" /></div>
                    <span className="font-mono font-bold text-slate-400 text-xs">Gateway IN</span>
                  </div>

                  <div className="flex-1 flex flex-col items-center justify-center gap-6 mx-20">
                    <div className="w-full bg-slate-800 h-10 rounded-2xl p-1.5 border-4 border-slate-700 flex items-center overflow-hidden relative">
                      {mitStep > 0 && <div className={`h-full rounded-xl transition-all duration-500 ${mitStep === 4 ? 'w-1/3 bg-emerald-500' : 'w-full bg-rose-500'}`} />}
                      <span className="absolute left-1/2 -translate-x-1/2 font-mono text-sm font-black text-white">{mitStep === 4 ? "50/s (CAPPED)" : mitStep > 0 ? "9999/s (FLOOD)" : "0/s (IDLE)"}</span>
                    </div>
                    {mitStep === 4 && (
                      <div className="flex gap-6">
                        <span className="font-mono font-black text-emerald-400 flex items-center gap-2 bg-emerald-900/30 px-4 py-2 rounded-lg border border-emerald-500/50"><Check className="w-5 h-5" /> PASS</span>
                        <span className="font-mono font-black text-rose-400 flex items-center gap-2 bg-rose-900/30 px-4 py-2 rounded-lg border border-rose-500/50"><XCircle className="w-5 h-5" /> DROP</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-center gap-4">
                    <div className="w-32 h-32 rounded-2xl border-4 border-slate-700 bg-slate-800 flex items-center justify-center text-slate-500"><Cpu className="w-16 h-16" /></div>
                    <span className="font-mono font-bold text-slate-400 text-xs">DB Engine</span>
                  </div>
                </div>
              )}

              {/* Mit Scen 4: WAF Filter */}
              {activeMitScen === 4 && (
                <div className="w-full max-w-5xl flex items-center justify-between px-16 scale-110">
                  <div className="flex flex-col gap-4 w-72">
                    {[
                      { t: "GET /index.html", bot: false },
                      { t: "POST /login (SQLi)", bot: true },
                      { t: "GET / HTTP/1.1", bot: true },
                    ].map((req, idx) => (
                      <div key={idx} className={`p-4 rounded-xl border-2 font-mono text-xs font-bold flex items-center justify-between ${mitStep > 0 && req.bot ? 'bg-rose-900/30 border-rose-500 text-rose-400' : mitStep > 0 && !req.bot ? 'bg-emerald-900/30 border-emerald-500 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                        <span className="truncate">{req.t}</span>
                      </div>
                    ))}
                  </div>

                  <div className={`w-72 h-72 rounded-[3rem] border-8 flex flex-col items-center justify-center shadow-2xl transition-all z-20 ${mitStep === 4 ? 'bg-slate-800 border-blue-500 text-blue-400 shadow-[0_0_60px_rgba(59,130,246,0.4)] scale-110' : 'bg-slate-800 border-slate-700 text-slate-600'}`}>
                    <Shield className="w-24 h-24 mb-4" />
                    <span className="font-mono font-black text-xl uppercase tracking-widest">L7 WAF</span>
                  </div>

                  <div className="flex flex-col items-center gap-4">
                    <div className={`w-32 h-32 rounded-2xl border-4 flex items-center justify-center transition-all bg-slate-800 ${mitStep === 4 ? 'border-emerald-500 text-emerald-400' : mitStep > 0 ? 'border-rose-500 text-rose-500' : 'border-slate-700 text-slate-600'}`}><Server className="w-16 h-16" /></div>
                    <span className="font-mono font-bold text-slate-400 text-xs">App Server</span>
                  </div>
                </div>
              )}

              {/* Mit Scen 5: Auto-Scaling */}
              {activeMitScen === 5 && (
                <div className="w-full max-w-6xl flex items-center justify-between px-16 scale-110">
                  <div className="w-40 h-40 rounded-full border-8 border-slate-700 bg-slate-800 flex flex-col items-center justify-center shadow-2xl text-slate-500">
                    <Router className="w-14 h-14 mb-2" />
                    <span className="font-mono font-black text-sm uppercase">LB Core</span>
                  </div>

                  <div className="flex-1 flex flex-col gap-8 items-center justify-center mx-16">
                    <div className="w-full flex items-center justify-around gap-6">
                      {[1, 2, 3, 4].map((srv) => {
                        const isVisible = srv <= 2 || mitStep === 4;
                        return (
                          <div key={srv} className={`flex flex-col items-center justify-center w-36 h-40 rounded-3xl border-4 transition-all duration-500 ${isVisible ? 'bg-slate-800 border-emerald-500 shadow-2xl text-emerald-400 scale-100' : 'border-dashed border-slate-700 bg-slate-900/50 text-slate-700 opacity-40 scale-90'}`}>
                            <Server className="w-12 h-12 mb-3" />
                            <span className="font-mono font-black text-sm">INST {srv}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Mit Scen 6: Geo/IP Filtering */}
              {activeMitScen === 6 && (
                <div className="w-full max-w-5xl flex items-center justify-between px-16 scale-110">
                  <div className="flex flex-col items-center gap-4">
                    <div className={`w-32 h-32 rounded-2xl border-4 bg-slate-800 flex items-center justify-center shadow-md ${mitStep > 0 ? 'border-rose-500 text-rose-500' : 'border-slate-700 text-slate-600'}`}><Map className="w-16 h-16" /></div>
                    <span className="font-mono font-bold text-slate-400 text-xs">Bad Subnet</span>
                  </div>

                  <div className={`flex flex-col items-center justify-center w-72 h-72 rounded-[3rem] border-8 transition-all shadow-2xl relative z-20 ${mitStep === 4 ? 'bg-slate-900 border-rose-500 text-rose-400 shadow-[0_0_60px_rgba(244,63,94,0.3)] scale-110' : 'bg-slate-800 border-slate-700 text-slate-600'}`}>
                    <Filter className="w-24 h-24 mb-4" />
                    <span className="font-mono font-black text-xl uppercase tracking-widest">Router ACL</span>
                  </div>

                  <div className="flex flex-col items-center gap-4">
                    <div className="w-32 h-32 rounded-2xl border-4 border-slate-700 bg-slate-800 flex items-center justify-center text-slate-600 shadow-md"><Server className="w-16 h-16" /></div>
                    <span className="font-mono font-bold text-slate-400 text-xs">Internal LAN</span>
                  </div>
                </div>
              )}

              {/* RUN CONTROLS NATIVELY EMBEDDED BOTTOM-RIGHT */}
              <div className="absolute bottom-10 right-10 z-50 flex items-center gap-6">
                <button onClick={resetMitigation} disabled={mitStep === 0} className="w-20 h-20 bg-slate-800 border-2 border-slate-600 text-slate-400 rounded-3xl hover:bg-slate-700 hover:text-white transition-all shadow-2xl flex items-center justify-center disabled:opacity-30 disabled:hover:bg-slate-800">
                  <RotateCcw className="w-8 h-8" />
                </button>
                <button onClick={runMitigationSim} disabled={mitStep !== 0} className="h-20 px-12 bg-emerald-600 text-white rounded-3xl font-black text-2xl hover:bg-emerald-500 transition-all shadow-[0_15px_40px_rgba(5,150,105,0.4)] flex items-center gap-4 disabled:opacity-30 disabled:shadow-none">
                  <Play className="w-8 h-8 fill-current" /> Run Simulation
                </button>
              </div>

            </div>
          </div>

          {/* LARGE BOTTOM SCENARIO SELECTORS - ZERO DESCRIPTIVE TEXT */}
          <div className="flex flex-wrap gap-6 mt-8 justify-center pb-4 z-40 relative">
            {[
              { id: 1, label: "Scrubbing Core" },
              { id: 2, label: "Anycast Edge" },
              { id: 3, label: "Rate Limit Quota" },
              { id: 4, label: "WAF Proxy" },
              { id: 5, label: "Elastic LB" },
              { id: 6, label: "Hardware ACL" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => changeMitigationScen(tab.id)}
                className={`px-10 py-5 rounded-[2rem] font-black text-lg transition-all border-[3px] shadow-lg ${
                  activeMitScen === tab.id 
                  ? "bg-slate-800 border-emerald-500 text-emerald-400 scale-105" 
                  : "bg-slate-900 border-slate-700 text-slate-500 hover:bg-slate-800 hover:text-slate-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

        </main>
      )}

      {/* --- TAB 3: DATASET REPLAY LAB --- */}
      {activeTab === "datasets" && (
        <main className="flex-1 w-full max-w-[98%] mx-auto px-4 flex flex-col z-10 relative animate-[fadeIn_0.4s_ease-out]">
          <div className="bg-slate-900 rounded-[3.5rem] border-4 border-slate-800 shadow-[0_30px_80px_rgb(0,0,0,0.6)] flex-1 flex flex-col overflow-hidden relative min-h-[650px]">
            
            {/* Grid Background */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.1)_0%,transparent_70%)] pointer-events-none" />

            {/* Dataset Selector (Top Inside Stage) */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-center bg-slate-900/80 backdrop-blur-md z-20">
              <div className="flex flex-wrap gap-4 justify-center">
                {[
                  { id: 1, label: "CICIDS2017 - Friday DDoS Flow" },
                  { id: 2, label: "CAIDA 2007 - Volumetric Trace" },
                  { id: 3, label: "UNSW-NB15 - Behavioral Botnet" }
                ].map(ds => (
                  <button key={ds.id} onClick={() => changeDatasetScen(ds.id)} className={`px-6 py-3 rounded-2xl text-sm font-black transition-all border-2 ${activeDataset === ds.id ? "bg-purple-900/50 border-purple-500 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)] scale-105" : "border-slate-700 text-slate-500 hover:bg-slate-800 hover:text-slate-300"}`}>
                    {ds.label}
                  </button>
                ))}
              </div>
            </div>

            {/* CISCO STAGE */}
            <div className="flex-1 p-8 flex items-center justify-center relative z-10 overflow-hidden">
              <div className="w-full max-w-5xl flex items-center justify-between px-16 scale-110">
                
                <div className="flex flex-col items-center gap-4">
                  <div className={`w-36 h-36 rounded-[2rem] border-[6px] shadow-2xl flex items-center justify-center transition-all bg-slate-800 ${dataStep > 0 ? "border-purple-500 text-purple-400 shadow-[0_0_40px_rgba(168,85,247,0.4)]" : "border-slate-700 text-slate-600"}`}>
                    <HardDrive className="w-16 h-16" />
                  </div>
                  <span className="font-mono font-black text-sm uppercase tracking-widest text-slate-300">Academic Log Injector</span>
                </div>

                <div className="flex-1 h-3 bg-slate-800 mx-10 relative flex items-center overflow-hidden rounded-full border border-slate-700">
                  {dataStep > 0 && <div className="absolute inset-0 bg-purple-500/80 w-full animate-[slideRight_0.5s_linear_infinite]" />}
                </div>

                <div className={`w-64 h-64 rounded-[3rem] border-8 shadow-2xl flex flex-col items-center justify-center transition-all z-20 ${dataStep === 4 ? "bg-slate-900 border-blue-500 text-blue-400 shadow-[0_0_60px_rgba(59,130,246,0.4)] scale-110" : "bg-slate-800 border-slate-700 text-slate-600"}`}>
                  <Brain className="w-20 h-20 mb-4" />
                  <span className="font-mono font-black text-lg uppercase tracking-widest text-center">AI Decision<br/>Classifier</span>
                </div>

              </div>

              {/* Dynamic Telemetry inside the stage at the top corner */}
              <div className="absolute top-8 left-8 flex flex-col gap-4">
                <div className="bg-slate-900/90 border-2 border-slate-700 p-6 rounded-3xl shadow-2xl backdrop-blur-xl">
                  <h4 className="font-mono font-black text-slate-400 text-xs uppercase mb-4 tracking-widest">Live Telemetry</h4>
                  <div className="flex flex-col gap-4 font-mono">
                    <div className="flex justify-between gap-12"><span className="text-slate-500">Inject Rate:</span><span className="text-purple-400 font-bold">{dataStats.pps.toLocaleString()} pps</span></div>
                    <div className="flex justify-between gap-12"><span className="text-slate-500">Rows Parsed:</span><span className="text-blue-400 font-bold">{dataStats.rows.toLocaleString()}</span></div>
                    <div className="flex justify-between gap-12"><span className="text-slate-500">Accuracy:</span><span className="text-emerald-400 font-bold">{dataStats.accuracy.toFixed(2)}%</span></div>
                  </div>
                </div>
              </div>

              {/* RUN CONTROLS NATIVELY EMBEDDED BOTTOM-RIGHT */}
              <div className="absolute bottom-10 right-10 z-50 flex items-center gap-6">
                <button onClick={resetDatasets} disabled={dataStep === 0} className="w-20 h-20 bg-slate-800 border-2 border-slate-600 text-slate-400 rounded-3xl hover:bg-slate-700 hover:text-white transition-all shadow-2xl flex items-center justify-center disabled:opacity-30 disabled:hover:bg-slate-800">
                  <RotateCcw className="w-8 h-8" />
                </button>
                <button onClick={runDatasetSim} disabled={dataStep !== 0} className="h-20 px-12 bg-purple-600 text-white rounded-3xl font-black text-2xl hover:bg-purple-500 transition-all shadow-[0_15px_40px_rgba(168,85,247,0.4)] flex items-center gap-4 disabled:opacity-30 disabled:shadow-none">
                  <Play className="w-8 h-8 fill-current" /> Replay Trace
                </button>
              </div>

            </div>
          </div>
        </main>
      )}

      {/* KEYFRAMES */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scanBeam { 0%, 100% { top: 10%; } 50% { top: 90%; } }
        @keyframes slideRight { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
        @keyframes slideRightFull { 0% { left: 0%; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { left: 90%; opacity: 0; } }
        @keyframes slideLeftFull { 0% { right: 0%; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { right: 90%; opacity: 0; } }
        @keyframes slideRightHalfAndDrop { 0% { left: 0%; opacity: 0; transform: scale(1); } 10% { opacity: 1; } 40% { left: 45%; opacity: 1; transform: scale(1); color: #F43F5E; } 50% { left: 48%; opacity: 0; transform: scale(1.5); } 100% { left: 50%; opacity: 0; } }
        @keyframes dropPulse { 0%, 100% { opacity: 0.2; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.2); } }
        @keyframes downBeam { 0% { top: -100%; opacity: 0; } 50% { opacity: 1; } 100% { top: 100%; opacity: 0; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shake { 0%, 100% { transform: translateX(360px) translateY(-50%) rotate(0deg); } 25% { transform: translateX(350px) translateY(-50%) rotate(-4deg); } 50% { transform: translateX(370px) translateY(-50%) rotate(4deg); } 75% { transform: translateX(350px) translateY(-50%) rotate(-4deg); } }
      `}} />
    </div>
  );
}
