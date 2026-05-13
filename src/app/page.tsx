"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Shield, Activity, Fingerprint, Network, Brain, Play, RotateCcw, CheckCircle,
  AlertTriangle, Server, MonitorSmartphone, Zap, CloudLightning, Globe, 
  ShieldAlert, Filter, ArrowRightLeft, Map, XCircle, CloudRain
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from "recharts";

/* --- DETERMINISTIC MOCK DATA (DETECTION) --- */
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
const AI_FEATURES = ["Packet Rate", "Request Interval", "Session Pattern", "L7 Behavior"];

/* --- MAIN PAGE --- */
export default function CyberSuites() {
  const [mainTab, setMainTab] = useState<"detection" | "mitigation">("detection");
  
  // Detection State
  const [activeDetScen, setActiveDetScen] = useState(1);
  const [detStep, setDetStep] = useState(0); 
  const [scanTime, setScanTime] = useState(0);
  const [chartData, setChartData] = useState(BASE_TRAFFIC);
  const [synCount, setSynCount] = useState(0);
  const [flowLines, setFlowLines] = useState<{ id: number, type: "normal" | "attack", step: number }[]>([]);
  const [aiScores, setAiScores] = useState({ human: 95, bot: 5, conf: 40 });
  const [activeFeat, setActiveFeat] = useState(-1);

  // Mitigation State
  const [activeMitScen, setActiveMitScen] = useState(1);
  const [mitStep, setMitStep] = useState(0);
  const [mitCounter, setMitCounter] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetAll = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setDetStep(0);
    setScanTime(0);
    setChartData(BASE_TRAFFIC);
    setSynCount(0);
    setFlowLines([]);
    setAiScores({ human: 95, bot: 5, conf: 40 });
    setActiveFeat(-1);
    setMitStep(0);
    setMitCounter(0);
  };

  const changeMainTab = (tab: "detection" | "mitigation") => {
    if (detStep > 0 && detStep < 4) return;
    if (mitStep > 0 && mitStep < 4) return;
    setMainTab(tab);
    resetAll();
  };

  const changeDetScen = (id: number) => {
    if (detStep > 0 && detStep < 4) return;
    setActiveDetScen(id);
    resetAll();
  };

  const changeMitScen = (id: number) => {
    if (mitStep > 0 && mitStep < 4) return;
    setActiveMitScen(id);
    resetAll();
  };

  /* --- RUN DETECTION SIMULATION --- */
  const runDetectionSim = () => {
    if (detStep !== 0) return;
    let currentStep = 1;
    setDetStep(1);
    const nextStep = () => { currentStep++; if (currentStep <= 4) setDetStep(currentStep); };

    if (activeDetScen === 1) {
      setTimeout(nextStep, 600); setTimeout(nextStep, 1200);
      let t = 0;
      timerRef.current = setInterval(() => {
        t += 0.5; setScanTime(t);
        if (t >= 4.5) { clearInterval(timerRef.current!); setDetStep(4); }
      }, 500);
    } else if (activeDetScen === 2) {
      setTimeout(nextStep, 800); setTimeout(nextStep, 1600);
      let point = 12;
      timerRef.current = setInterval(() => {
        setChartData(prev => [...prev, SPIKE_TRAFFIC[point]]);
        point++;
        if (point >= 15) { clearInterval(timerRef.current!); setDetStep(4); }
      }, 600);
    } else if (activeDetScen === 3) {
      setTimeout(nextStep, 800); setTimeout(nextStep, 1600);
      let count = 0, tick = 0;
      timerRef.current = setInterval(() => {
        tick++;
        if (tick < 3) { setFlowLines(p => [...p, { id: tick, type: "normal", step: tick }]); } 
        else { setFlowLines(p => [...p, { id: tick, type: "attack", step: tick }]); count += 124; setSynCount(count); }
        if (count > 500) { clearInterval(timerRef.current!); setDetStep(4); }
      }, 400);
    } else if (activeDetScen === 4) {
      setTimeout(nextStep, 600); setTimeout(nextStep, 1800);
      let f = -1;
      timerRef.current = setInterval(() => {
        f++; setActiveFeat(f);
        setAiScores({
          human: Math.max(2, 95 - f * 20),
          bot: Math.min(98, 5 + f * 20),
          conf: Math.min(99, 40 + f * 15),
        });
        if (f >= AI_FEATURES.length - 1) { clearInterval(timerRef.current!); setDetStep(4); }
      }, 600);
    }
  };

  /* --- RUN MITIGATION SIMULATION --- */
  const runMitigationSim = () => {
    if (mitStep !== 0) return;
    let currentStep = 1;
    setMitStep(1);
    const nextStep = () => { currentStep++; if (currentStep <= 4) setMitStep(currentStep); };

    setTimeout(nextStep, 800); setTimeout(nextStep, 1600);
    
    let c = 0;
    timerRef.current = setInterval(() => {
      c++; setMitCounter(c);
      if (c >= 10) { clearInterval(timerRef.current!); setMitStep(4); }
    }, 400);
  };

  const stepsDet = ["Monitoring", "Extracting Signals", "Analyzing", "Decision"];
  const stepsMit = ["Monitoring Traffic", "Identifying Threat", "Applying Defense", "Mitigation Active"];

  const getDetResult = () => {
    if (activeDetScen === 1) return { title: "Attack Detected", reason: "Known signature matched." };
    if (activeDetScen === 2) return { title: "Anomaly Detected", reason: "Traffic exceeded baseline." };
    if (activeDetScen === 3) return { title: "Protocol Abuse", reason: "Too many incomplete handshakes." };
    return { title: "Bot-like L7 Pattern", reason: "Behavior does not match human traffic." };
  };

  const getMitResult = () => {
    if (activeMitScen === 1) return { title: "Traffic Scrubbed", reason: "Volumetric attack dropped at cloud edge." };
    if (activeMitScen === 2) return { title: "Load Distributed", reason: "Anycast absorbed the DDoS traffic globally." };
    if (activeMitScen === 3) return { title: "Rate Limit Enforced", reason: "Excessive requests dropped automatically." };
    if (activeMitScen === 4) return { title: "Malicious Payloads Blocked", reason: "WAF identified and dropped bot signatures." };
    if (activeMitScen === 5) return { title: "Auto-Scaled Successfully", reason: "New instances spun up to handle traffic spike." };
    return { title: "Region Blocked", reason: "Traffic from blacklisted geolocation dropped." };
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-100 flex flex-col pb-12 overflow-x-hidden">
      
      {/* HEADER & TAB SWITCHER */}
      <header className="pt-8 px-6 text-center shrink-0 w-full max-w-[98%] mx-auto">
        <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-8">
          Cyber-Defense Simulation Suites
        </h1>
        
        {/* Massive Tab Switcher */}
        <div className="flex justify-center items-center gap-6 my-8 mb-12 z-30 relative">
          <button 
            onClick={() => changeMainTab("detection")} 
            className={`flex items-center gap-3 px-12 py-5 rounded-[2rem] text-2xl font-black tracking-tight transition-all duration-300 ${
              mainTab === "detection" 
                ? "bg-blue-600 text-white shadow-[0_10px_30px_rgba(37,99,235,0.3)] scale-105" 
                : "bg-white/80 text-slate-500 border-2 border-slate-200 hover:bg-slate-50 hover:text-slate-800"
            }`}
          >
            <Shield className="w-8 h-8" />
            Detection Engine
          </button>
          
          <button 
            onClick={() => changeMainTab("mitigation")} 
            className={`flex items-center gap-3 px-12 py-5 rounded-[2rem] text-2xl font-black tracking-tight transition-all duration-300 ${
              mainTab === "mitigation" 
                ? "bg-emerald-600 text-white shadow-[0_10px_30px_rgba(52,211,153,0.3)] scale-105" 
                : "bg-white/80 text-slate-500 border-2 border-slate-200 hover:bg-slate-50 hover:text-slate-800"
            }`}
          >
            <Server className="w-8 h-8" />
            Mitigation Lab
          </button>
        </div>
      </header>

      {/* MAIN SIMULATION STAGE */}
      <main className="flex-1 w-full max-w-[98%] mx-auto px-4 xl:px-8 flex flex-col min-h-[85vh]">
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-[0_12px_40px_rgb(0,0,0,0.06)] flex-1 flex flex-col overflow-hidden relative">
          
          {/* Top Bar: Progress Timeline Centered */}
          <div className="p-6 border-b border-slate-50 flex items-center justify-center bg-white/50 backdrop-blur-md z-20">
            <div className="flex flex-wrap items-center justify-center w-full gap-2 text-sm font-bold tracking-wide">
              {(mainTab === "detection" ? stepsDet : stepsMit).map((s, i) => {
                const isActive = (mainTab === "detection" ? detStep : mitStep) === i + 1;
                const isPast = (mainTab === "detection" ? detStep : mitStep) > i + 1 || (mainTab === "detection" ? detStep : mitStep) === 4;
                const colorTheme = mainTab === "detection" ? "blue" : "emerald";
                return (
                  <React.Fragment key={s}>
                    <div className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl transition-all duration-300
                      ${isActive ? `bg-${colorTheme}-50 text-${colorTheme}-700 shadow-sm border border-${colorTheme}-100 scale-105` : isPast ? "text-slate-500" : "text-slate-300"}
                    `}>
                      {isPast ? <CheckCircle className="w-5 h-5" /> : isActive ? <Zap className="w-5 h-5 animate-pulse" /> : <div className="w-5 h-5 rounded-full border-4 border-current opacity-30" />}
                      <span className="hidden sm:inline">{s}</span>
                    </div>
                    {i < 3 && <div className={`w-8 h-1 rounded-full ${isPast ? `bg-${colorTheme}-200` : "bg-slate-100"}`} />}
                  </React.Fragment>
                )
              })}
            </div>
          </div>

          {/* VISUAL MODEL STAGE */}
          <div className="flex-1 p-8 flex items-center justify-center relative min-h-[500px] lg:min-h-[600px] bg-slate-50/30 overflow-hidden">
            {/* Background Details */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.03)_0%,transparent_70%)] pointer-events-none" />
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

            {/* --- DETECTION TAB CONTENT --- */}
            {mainTab === "detection" && (
              <>
                {/* 1. Signature Match */}
                {activeDetScen === 1 && (
                  <div className="w-full max-w-4xl flex flex-col items-center relative z-10 scale-110">
                    <div className="w-full h-64 relative flex items-center justify-center">
                      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-40 h-64 bg-white/90 backdrop-blur-xl border border-slate-100 rounded-[2.5rem] shadow-2xl z-20 flex flex-col items-center justify-center">
                        <Fingerprint className={`w-14 h-14 transition-colors duration-500 ${detStep === 4 ? "text-red-500" : "text-blue-500"}`} />
                        {detStep > 0 && detStep < 4 && <div className="absolute inset-x-6 top-6 h-1.5 bg-blue-400 blur-[2px] animate-[scanBeam_1.5s_ease-in-out_infinite]" />}
                      </div>
                      <div className="absolute inset-x-0 h-1 bg-slate-200 border-t-[2px] border-dashed border-slate-300 rounded-full" />
                      {SIGNATURES.map((pkt) => {
                        const progress = Math.max(0, scanTime - pkt.delay);
                        let xPos = progress * 240; 
                        let status = "approaching";
                        if (xPos > 480 && !pkt.bad) status = "passed";
                        else if (pkt.bad && xPos >= 360) { xPos = 360; status = detStep === 4 ? "caught" : "scanning"; }
                        return (
                          <div key={pkt.id} className={`absolute left-0 w-20 h-28 rounded-3xl border-2 flex items-center justify-center font-mono text-lg font-bold transition-all duration-300 ease-linear shadow-sm ${status === "caught" ? "bg-red-50 border-red-300 text-red-600 scale-110 z-30 shadow-red-100 animate-[shake_0.5s_ease-in-out]" : status === "scanning" ? "bg-white border-blue-300 text-blue-500 z-30 scale-105" : status === "passed" ? "bg-white border-emerald-200 text-emerald-400 opacity-0" : "bg-white border-slate-200 text-slate-400 z-10"}`} style={{ transform: `translateX(${xPos}px) translateY(-50%)`, top: '50%' }}>
                            {pkt.type}
                            {status === "caught" && <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-red-500 text-white text-xs font-black px-4 py-2 rounded-full shadow-xl shadow-red-200 animate-bounce">Signature Match</div>}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* 2. Anomaly Baseline */}
                {activeDetScen === 2 && (
                  <div className="w-full max-w-5xl h-full flex flex-col justify-center relative z-10 scale-110">
                    <div className="h-96 w-full relative bg-white/80 backdrop-blur-md p-8 rounded-[3rem] border border-slate-100 shadow-xl">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 30, right: 0, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="normalGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3B82F6" stopOpacity={0.25}/><stop offset="100%" stopColor="#3B82F6" stopOpacity={0}/></linearGradient>
                            <linearGradient id="dangerGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#EF4444" stopOpacity={0.5}/><stop offset="100%" stopColor="#EF4444" stopOpacity={0}/></linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#E2E8F0" />
                          <XAxis dataKey="t" hide />
                          <YAxis stroke="#94A3B8" fontSize={13} tickLine={false} axisLine={false} />
                          {/* @ts-ignore */}
                          <Tooltip contentStyle={{ borderRadius: '20px', border: '1px solid #E2E8F0', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px 20px', fontSize: '14px', fontWeight: 'bold' }} formatter={(v: any) => [v, "Mbps"]} />
                          <ReferenceLine y={70} stroke="#EF4444" strokeDasharray="6 6" strokeWidth={2} />
                          <Area type="monotone" dataKey="v" stroke={detStep === 4 ? "#EF4444" : "#3B82F6"} strokeWidth={4} fill={detStep === 4 ? "url(#dangerGrad)" : "url(#normalGrad)"} isAnimationActive={true} animationDuration={400} />
                        </AreaChart>
                      </ResponsiveContainer>
                      <div className="absolute top-[100px] left-12 text-xs font-black text-red-500 bg-red-50/90 px-3 py-1.5 rounded-lg border border-red-100 shadow-sm">Safe Threshold</div>
                      {detStep === 4 && <div className="absolute top-10 right-[30%] bg-red-500 text-white text-sm font-black px-5 py-2.5 rounded-full shadow-xl shadow-red-200 animate-bounce z-20">Threshold Exceeded</div>}
                    </div>
                  </div>
                )}

                {/* 3. Protocol Analysis */}
                {activeDetScen === 3 && (
                  <div className="w-full max-w-5xl flex items-center justify-between px-12 relative z-10 scale-110">
                    <div className="flex flex-col items-center gap-6 z-20">
                      <div className="w-28 h-28 bg-white border border-slate-200 rounded-[2.5rem] shadow-xl flex items-center justify-center"><MonitorSmartphone className="w-14 h-14 text-slate-400" /></div>
                      <span className="text-sm font-black text-slate-400 uppercase tracking-widest bg-white px-4 py-1.5 rounded-full shadow-sm border border-slate-100">Client</span>
                    </div>
                    <div className="flex-1 h-64 relative mx-16">
                      {flowLines.map((line) => {
                        const isNormal = line.type === 'normal';
                        return (
                          <div key={line.id} className="absolute inset-0 flex items-center justify-center">
                            {isNormal ? (
                              <div className="w-full relative h-20 flex flex-col justify-between opacity-0 animate-[fadeInOut_1.5s_ease-in-out_forwards]">
                                <div className="h-1 bg-blue-300 w-full relative"><div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-y-[6px] border-y-transparent border-l-[10px] border-l-blue-300" /><span className="absolute left-1/2 -top-6 -translate-x-1/2 text-xs text-blue-500 font-black">SYN</span></div>
                                <div className="h-1 bg-emerald-300 w-full relative"><div className="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-0 border-y-[6px] border-y-transparent border-r-[10px] border-r-emerald-300" /><span className="absolute left-1/2 top-2 -translate-x-1/2 text-xs text-emerald-500 font-black">SYN/ACK</span></div>
                                <div className="h-1 bg-blue-300 w-full relative"><div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-y-[6px] border-y-transparent border-l-[10px] border-l-blue-300" /><span className="absolute left-1/2 -top-6 -translate-x-1/2 text-xs text-blue-500 font-black">ACK</span></div>
                              </div>
                            ) : (
                              <div className="w-full relative h-1 bg-red-300 opacity-0 animate-[slideRight_0.4s_ease-out_forwards]" style={{ top: `${(line.id % 6) * 16 - 40}px` }}>
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-y-[6px] border-y-transparent border-l-[10px] border-l-red-300" />
                              </div>
                            )}
                          </div>
                        )
                      })}
                      <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center w-40 h-40 rounded-[3rem] bg-white/95 backdrop-blur-xl shadow-2xl transition-all duration-500 z-30 border-[6px] ${detStep === 4 ? 'border-red-100 scale-110 shadow-red-200' : 'border-slate-50'}`}>
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Half-Open</span>
                        <span className={`text-5xl font-black font-mono transition-colors ${detStep === 4 ? 'text-red-500' : 'text-slate-800'}`}>{synCount}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-6 z-20 relative">
                      <div className={`w-28 h-28 rounded-[2.5rem] flex items-center justify-center transition-all duration-500 border-4 relative ${detStep === 4 ? 'bg-red-50 border-red-200 shadow-[0_0_60px_rgba(239,68,68,0.4)]' : 'bg-blue-50 border-blue-100 shadow-xl'}`}>
                        <Server className={`w-14 h-14 ${detStep === 4 ? 'text-red-500' : 'text-blue-600'}`} />
                        {synCount > 0 && <div className="absolute -left-8 top-2 bottom-2 w-6 flex flex-col-reverse flex-wrap gap-1.5 content-start overflow-hidden">{Array.from({length: Math.min(40, Math.floor(synCount / 10))}).map((_,i) => (<div key={i} className="w-2 h-2 bg-red-400 rounded-full animate-[popIn_0.2s_ease-out]" />))}</div>}
                      </div>
                      <span className="text-sm font-black text-slate-400 uppercase tracking-widest bg-white px-4 py-1.5 rounded-full shadow-sm border border-slate-100">Server</span>
                    </div>
                  </div>
                )}

                {/* 4. AI & ML */}
                {activeDetScen === 4 && (
                  <div className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-center gap-20 relative z-10 scale-105">
                    <div className="flex flex-col gap-4 w-64 relative z-20">
                      {AI_FEATURES.map((feat, i) => {
                        const isActive = activeFeat === i;
                        const isDone = activeFeat > i;
                        return (
                          <div key={feat} className="relative">
                            <div className={`text-xs font-black uppercase tracking-widest px-5 py-3 rounded-2xl border-2 transition-all duration-300 flex items-center gap-4 relative z-10 ${isActive ? "bg-white border-blue-300 text-blue-600 shadow-xl scale-110" : isDone ? "bg-slate-50 border-slate-100 text-slate-400" : "bg-transparent border-transparent text-slate-300"}`}>
                              <div className={`w-2.5 h-2.5 rounded-full ${isActive ? "bg-blue-500 animate-ping" : isDone ? "bg-slate-300" : "bg-slate-200"}`} />{feat}
                            </div>
                            {isDone && <div className="absolute top-1/2 left-full w-32 h-1 bg-slate-200 -z-10 rounded-r-full" />}
                            {isActive && <div className="absolute top-1/2 left-full w-32 h-1 bg-gradient-to-r from-blue-400 to-transparent -z-10 rounded-r-full" />}
                          </div>
                        )
                      })}
                    </div>
                    <div className="relative z-20 flex-shrink-0 mx-10">
                      <div className={`w-64 h-64 rounded-[3.5rem] border-[10px] bg-white/95 backdrop-blur-2xl flex flex-col items-center justify-center shadow-2xl transition-all duration-700 relative z-20 ${detStep === 4 ? 'border-red-100 shadow-[0_0_80px_rgba(239,68,68,0.3)] scale-110' : 'border-blue-50 shadow-[0_0_60px_rgba(37,99,235,0.2)]'}`}>
                        <Brain className={`w-20 h-20 mb-4 transition-colors duration-700 ${detStep === 4 ? 'text-red-500' : 'text-blue-600'}`} />
                        <span className="text-sm font-black text-slate-400 uppercase tracking-widest">AI Core</span>
                      </div>
                      {detStep > 0 && detStep < 4 && <><div className="absolute inset-0 rounded-[3.5rem] border-4 border-blue-400 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite] opacity-30 z-10" /><div className="absolute inset-0 rounded-[3.5rem] border-4 border-blue-400 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] opacity-10 z-10" /></>}
                    </div>
                    <div className="w-80 flex flex-col gap-8 z-20 bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-100 shadow-xl">
                      <div>
                        <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-3"><span className="text-slate-400">Human Prob</span><span className="text-slate-700">{aiScores.human}%</span></div>
                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-400 transition-all duration-300" style={{ width: `${aiScores.human}%` }} /></div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-3"><span className="text-slate-400">Bot Prob</span><span className="text-slate-700">{aiScores.bot}%</span></div>
                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-red-400 transition-all duration-300" style={{ width: `${aiScores.bot}%` }} /></div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-3"><span className="text-slate-400">AI Confidence</span><span className="text-blue-600">{aiScores.conf}%</span></div>
                        <div className="h-3 bg-blue-100 rounded-full overflow-hidden"><div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${aiScores.conf}%` }} /></div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* --- MITIGATION TAB CONTENT --- */}
            {mainTab === "mitigation" && (
              <div className="w-full max-w-5xl h-full flex flex-col justify-center items-center relative z-10">
                
                {/* 1. Scrubbing Service */}
                {activeMitScen === 1 && (
                  <div className="flex items-center gap-12 w-full justify-center">
                    <div className="flex flex-col items-center">
                      <div className="w-32 h-32 rounded-3xl bg-red-50 border-4 border-red-200 flex items-center justify-center relative">
                        <CloudRain className="w-16 h-16 text-red-500" />
                        {mitStep > 0 && mitStep < 4 && <div className="absolute inset-0 bg-red-500 opacity-20 animate-pulse rounded-2xl" />}
                      </div>
                      <span className="mt-4 font-black text-slate-500 text-sm tracking-widest uppercase">Dirty Traffic</span>
                    </div>

                    {/* Flow */}
                    <div className="flex-1 max-w-xs h-2 bg-slate-100 rounded-full relative overflow-hidden">
                      {mitStep > 0 && <div className="absolute inset-0 bg-red-400 w-1/2 animate-[slideRight_1s_infinite_linear]" />}
                    </div>

                    <div className={`w-40 h-40 rounded-full border-[8px] flex items-center justify-center transition-all duration-500 shadow-2xl relative z-10 ${mitStep === 4 ? 'bg-emerald-50 border-emerald-400' : 'bg-white border-blue-200'}`}>
                      <CloudLightning className={`w-16 h-16 ${mitStep === 4 ? 'text-emerald-500' : 'text-blue-500'}`} />
                      {mitStep > 0 && mitStep < 4 && <div className="absolute inset-0 rounded-full border-4 border-blue-400 animate-[ping_1.5s_infinite] opacity-50" />}
                      <span className="absolute -bottom-10 font-black text-slate-700 text-sm tracking-widest uppercase whitespace-nowrap">Cloud Scrubber</span>
                    </div>

                    {/* Flow */}
                    <div className="flex-1 max-w-xs h-2 bg-slate-100 rounded-full relative overflow-hidden">
                      {mitStep === 4 && <div className="absolute inset-0 bg-emerald-400 w-1/2 animate-[slideRight_1s_infinite_linear]" />}
                    </div>

                    <div className="flex flex-col items-center">
                      <div className={`w-32 h-32 rounded-3xl border-4 flex items-center justify-center transition-all duration-500 ${mitStep === 4 ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                        <Server className={`w-16 h-16 ${mitStep === 4 ? 'text-emerald-500' : 'text-slate-400'}`} />
                      </div>
                      <span className="mt-4 font-black text-slate-500 text-sm tracking-widest uppercase">Main Server</span>
                    </div>
                  </div>
                )}

                {/* 2. CDN & Anycast */}
                {activeMitScen === 2 && (
                  <div className="flex items-center gap-16 w-full justify-center">
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 rounded-3xl bg-red-50 border-2 border-red-200 flex items-center justify-center shadow-md">
                        <AlertTriangle className="w-12 h-12 text-red-500" />
                      </div>
                      <span className="mt-3 font-black text-slate-500 text-xs tracking-widest uppercase">DDoS Attack</span>
                    </div>

                    <div className="relative w-64 h-64">
                      {/* Lines */}
                      <svg className="absolute inset-0 w-full h-full -z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M 0,50 Q 50,0 100,20" fill="none" stroke={mitStep > 0 ? "#3B82F6" : "#E2E8F0"} strokeWidth="2" strokeDasharray={mitStep > 0 ? "4 4" : "0"} className={mitStep > 0 ? "animate-[dash_1s_linear_infinite]" : ""} />
                        <path d="M 0,50 Q 50,25 100,40" fill="none" stroke={mitStep > 0 ? "#3B82F6" : "#E2E8F0"} strokeWidth="2" strokeDasharray={mitStep > 0 ? "4 4" : "0"} className={mitStep > 0 ? "animate-[dash_1s_linear_infinite]" : ""} />
                        <path d="M 0,50 Q 50,75 100,60" fill="none" stroke={mitStep > 0 ? "#3B82F6" : "#E2E8F0"} strokeWidth="2" strokeDasharray={mitStep > 0 ? "4 4" : "0"} className={mitStep > 0 ? "animate-[dash_1s_linear_infinite]" : ""} />
                        <path d="M 0,50 Q 50,100 100,80" fill="none" stroke={mitStep > 0 ? "#3B82F6" : "#E2E8F0"} strokeWidth="2" strokeDasharray={mitStep > 0 ? "4 4" : "0"} className={mitStep > 0 ? "animate-[dash_1s_linear_infinite]" : ""} />
                      </svg>
                      {/* Anycast Nodes */}
                      <div className={`absolute right-0 top-[10%] w-16 h-16 rounded-2xl border-2 flex items-center justify-center transition-all duration-500 bg-white ${mitStep === 4 ? 'border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.4)]' : 'border-slate-200'}`}><Globe className={`w-8 h-8 ${mitStep === 4 ? 'text-emerald-500' : 'text-slate-400'}`} /></div>
                      <div className={`absolute right-0 top-[35%] w-16 h-16 rounded-2xl border-2 flex items-center justify-center transition-all duration-500 bg-white ${mitStep === 4 ? 'border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.4)]' : 'border-slate-200'}`}><Globe className={`w-8 h-8 ${mitStep === 4 ? 'text-emerald-500' : 'text-slate-400'}`} /></div>
                      <div className={`absolute right-0 top-[60%] w-16 h-16 rounded-2xl border-2 flex items-center justify-center transition-all duration-500 bg-white ${mitStep === 4 ? 'border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.4)]' : 'border-slate-200'}`}><Globe className={`w-8 h-8 ${mitStep === 4 ? 'text-emerald-500' : 'text-slate-400'}`} /></div>
                      <div className={`absolute right-0 top-[85%] w-16 h-16 rounded-2xl border-2 flex items-center justify-center transition-all duration-500 bg-white ${mitStep === 4 ? 'border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.4)]' : 'border-slate-200'}`}><Globe className={`w-8 h-8 ${mitStep === 4 ? 'text-emerald-500' : 'text-slate-400'}`} /></div>
                    </div>
                  </div>
                )}

                {/* 3. Rate Limiting */}
                {activeMitScen === 3 && (
                  <div className="flex flex-col items-center gap-8 w-full">
                    <div className="flex items-center gap-12">
                      <div className="w-24 h-24 bg-white rounded-[2rem] border-2 border-slate-200 flex items-center justify-center"><Network className="w-10 h-10 text-slate-400" /></div>
                      <div className="w-48 h-2 bg-slate-100 rounded-full relative">
                        {mitStep > 0 && <div className="absolute inset-0 bg-red-400 w-full animate-[slideRight_0.5s_infinite_linear]" />}
                      </div>
                      <div className={`w-32 h-32 rounded-[2rem] border-4 flex flex-col items-center justify-center shadow-xl transition-all duration-500 ${mitStep === 4 ? 'bg-amber-50 border-amber-400' : 'bg-white border-blue-200'}`}>
                        <ShieldAlert className={`w-12 h-12 mb-2 ${mitStep === 4 ? 'text-amber-500' : 'text-blue-500'}`} />
                        <span className="text-xl font-black font-mono">{mitCounter * 1000}/s</span>
                      </div>
                    </div>
                    {mitStep === 4 && (
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-red-50 border-2 border-red-200 rounded-xl flex items-center justify-center text-red-500 font-bold animate-bounce"><XCircle className="w-6 h-6"/></div>
                        <div className="w-12 h-12 bg-red-50 border-2 border-red-200 rounded-xl flex items-center justify-center text-red-500 font-bold animate-bounce delay-75"><XCircle className="w-6 h-6"/></div>
                        <div className="w-12 h-12 bg-emerald-50 border-2 border-emerald-200 rounded-xl flex items-center justify-center text-emerald-500 font-bold"><CheckCircle className="w-6 h-6"/></div>
                      </div>
                    )}
                  </div>
                )}

                {/* 4. WAF Filtering */}
                {activeMitScen === 4 && (
                  <div className="flex items-center gap-12 w-full justify-center">
                    <div className="flex flex-col gap-3">
                      <div className={`w-20 h-12 rounded-xl border-2 flex items-center justify-center font-mono font-bold text-sm ${mitStep > 0 ? 'bg-red-50 border-red-300 text-red-500 translate-x-24 opacity-0 transition-all duration-[1s]' : 'bg-white border-slate-200'}`}>User-Agent: Bot</div>
                      <div className={`w-20 h-12 rounded-xl border-2 flex items-center justify-center font-mono font-bold text-sm ${mitStep > 0 ? 'bg-emerald-50 border-emerald-300 text-emerald-500 translate-x-48 transition-all duration-[1.5s]' : 'bg-white border-slate-200'}`}>Valid HTTP</div>
                      <div className={`w-20 h-12 rounded-xl border-2 flex items-center justify-center font-mono font-bold text-sm ${mitStep > 0 ? 'bg-red-50 border-red-300 text-red-500 translate-x-24 opacity-0 transition-all duration-[1.2s]' : 'bg-white border-slate-200'}`}>SQLi</div>
                    </div>
                    
                    <div className={`w-40 h-56 rounded-3xl border-[6px] flex flex-col items-center justify-center shadow-2xl transition-all duration-500 z-20 ${mitStep === 4 ? 'bg-blue-50 border-blue-400' : 'bg-white border-slate-200'}`}>
                      <Filter className={`w-16 h-16 mb-2 ${mitStep === 4 ? 'text-blue-500' : 'text-slate-400'}`} />
                      <span className="font-black text-sm uppercase tracking-widest text-slate-600">WAF</span>
                    </div>

                    <div className={`w-32 h-32 rounded-[2rem] border-4 flex items-center justify-center transition-all duration-500 ${mitStep === 4 ? 'bg-emerald-50 border-emerald-400 shadow-[0_0_40px_rgba(52,211,153,0.3)]' : 'bg-slate-50 border-slate-200'}`}>
                      <Server className={`w-14 h-14 ${mitStep === 4 ? 'text-emerald-500' : 'text-slate-400'}`} />
                    </div>
                  </div>
                )}

                {/* 5. Auto-Scaling */}
                {activeMitScen === 5 && (
                  <div className="flex items-center gap-16 w-full justify-center">
                    <div className="w-32 h-32 rounded-full border-4 border-blue-300 bg-white flex flex-col items-center justify-center shadow-xl">
                      <ArrowRightLeft className="w-10 h-10 text-blue-500 mb-1" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Load Balancer</span>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="w-24 h-24 bg-emerald-50 border-2 border-emerald-300 rounded-2xl flex items-center justify-center shadow-md"><Server className="w-10 h-10 text-emerald-500"/></div>
                      <div className="w-24 h-24 bg-emerald-50 border-2 border-emerald-300 rounded-2xl flex items-center justify-center shadow-md"><Server className="w-10 h-10 text-emerald-500"/></div>
                      <div className="w-24 h-24 bg-emerald-50 border-2 border-emerald-300 rounded-2xl flex items-center justify-center shadow-md"><Server className="w-10 h-10 text-emerald-500"/></div>
                      {mitStep === 4 && (
                        <div className="w-24 h-24 bg-emerald-50 border-2 border-emerald-300 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(52,211,153,0.5)] animate-[popIn_0.5s_ease-out] relative">
                          <Server className="w-10 h-10 text-emerald-500"/>
                          <div className="absolute -top-3 -right-3 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-bounce">NEW</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 6. Geo-Filtering */}
                {activeMitScen === 6 && (
                  <div className="flex flex-col items-center gap-8 w-full">
                    <div className={`w-[600px] h-64 rounded-[3rem] border-4 flex items-center justify-center relative overflow-hidden transition-all duration-500 ${mitStep === 4 ? 'bg-slate-50 border-emerald-200' : 'bg-white border-slate-100'}`}>
                      <Map className="absolute inset-0 w-full h-full text-slate-100 p-8" strokeWidth={0.5} />
                      <div className="absolute left-1/4 top-1/2 w-8 h-8 bg-emerald-400 rounded-full animate-ping opacity-50" />
                      <div className="absolute left-1/4 top-1/2 w-4 h-4 bg-emerald-500 rounded-full" />
                      
                      {mitStep > 0 && (
                        <>
                          <div className="absolute right-1/4 top-1/3 w-16 h-16 bg-red-400 rounded-full animate-pulse opacity-50 flex items-center justify-center">
                            {mitStep === 4 && <XCircle className="w-8 h-8 text-white" />}
                          </div>
                          <div className="absolute right-1/4 top-1/3 w-4 h-4 bg-red-600 rounded-full" />
                          
                          {/* Attack paths */}
                          {mitStep < 4 && (
                            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 256">
                              <path d="M 450,85 Q 300,128 150,128" fill="none" stroke="#EF4444" strokeWidth="3" strokeDasharray="6 6" className="animate-[dash_1s_linear_infinite]" />
                            </svg>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* ACTION BUTTONS (Floating Bottom Right inside stage) */}
            <div className="absolute bottom-10 right-10 z-50 flex items-center gap-6">
              <button onClick={resetAll} disabled={(mainTab === "detection" ? detStep : mitStep) === 0} className="flex items-center justify-center w-20 h-20 bg-white/95 backdrop-blur text-slate-600 border-2 border-slate-200 rounded-[2rem] hover:bg-slate-50 hover:shadow-xl transition-all shadow-lg disabled:opacity-50 disabled:hover:shadow-lg" title="Reset Simulation">
                <RotateCcw className="w-8 h-8" />
              </button>
              <button onClick={mainTab === "detection" ? runDetectionSim : runMitigationSim} disabled={(mainTab === "detection" ? detStep : mitStep) !== 0} className={`flex items-center justify-center gap-4 text-white px-12 py-6 rounded-[2rem] font-black text-2xl transition-all disabled:opacity-50 disabled:shadow-none ${mainTab === "detection" ? "bg-blue-600 hover:bg-blue-700 shadow-[0_12px_40px_0_rgba(37,99,235,0.4)]" : "bg-emerald-600 hover:bg-emerald-700 shadow-[0_12px_40px_0_rgba(52,211,153,0.4)]"}`}>
                <Play className="w-8 h-8 fill-current" /> Run Simulation
              </button>
            </div>

            {/* Bottom Result Pill */}
            <div className={`absolute bottom-12 left-1/2 -translate-x-1/2 transition-all duration-500 z-50 ${(mainTab === "detection" ? detStep : mitStep) === 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
              <div className={`px-10 py-6 rounded-[3rem] bg-white/95 backdrop-blur-2xl border-2 shadow-[0_25px_60px_rgba(0,0,0,0.15)] flex items-center gap-6 ${mainTab === "detection" ? "border-red-100" : "border-emerald-100"}`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${mainTab === "detection" ? "bg-red-50 border-red-100" : "bg-emerald-50 border-emerald-100"}`}>
                  {mainTab === "detection" ? <AlertTriangle className="w-8 h-8 text-red-500" /> : <Shield className="w-8 h-8 text-emerald-500" />}
                </div>
                <div>
                  <h4 className="text-2xl font-black text-slate-900 leading-none mb-2">{mainTab === "detection" ? getDetResult().title : getMitResult().title}</h4>
                  <p className="text-base font-bold text-slate-500">{mainTab === "detection" ? getDetResult().reason : getMitResult().reason}</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* SCENARIO CARDS (Bottom Row) */}
        <div className={`grid gap-6 mt-8 pb-12 ${mainTab === "detection" ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-3 lg:grid-cols-6"}`}>
          
          {mainTab === "detection" && (
            <>
              {[{id: 1, i: Fingerprint, t: "Signature Match", d: "Detecting known attack patterns."}, {id: 2, i: Activity, t: "Anomaly Baseline", d: "Identifying volumetric spikes."}, {id: 3, i: Network, t: "Protocol Analysis", d: "Analyzing TCP connection abuse."}, {id: 4, i: Brain, t: "AI & ML Engine", d: "Behavioral classification of bots."}].map(s => (
                <button key={s.id} onClick={() => changeDetScen(s.id)} className={`text-left p-8 rounded-[2.5rem] border-[3px] transition-all duration-300 group ${activeDetScen === s.id ? 'bg-white border-blue-300 shadow-2xl shadow-blue-100/60 ring-4 ring-blue-50 -translate-y-2' : 'bg-white/60 border-slate-100 hover:bg-white hover:border-slate-200 shadow-md hover:shadow-2xl hover:-translate-y-2'}`}>
                  <div className={`w-16 h-16 rounded-[2rem] flex items-center justify-center mb-6 transition-colors duration-300 ${activeDetScen === s.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' : 'bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500'}`}><s.i className="w-8 h-8" /></div>
                  <h3 className={`font-black text-xl mb-2 tracking-tight ${activeDetScen === s.id ? 'text-slate-900' : 'text-slate-700'}`}>{s.t}</h3>
                  <p className="text-sm font-semibold text-slate-400 line-clamp-2 leading-relaxed">{s.d}</p>
                </button>
              ))}
            </>
          )}

          {mainTab === "mitigation" && (
            <>
              {[{id: 1, i: CloudLightning, t: "Scrubbing Center"}, {id: 2, i: Globe, t: "CDN & Anycast"}, {id: 3, i: ShieldAlert, t: "Rate Limiting"}, {id: 4, i: Filter, t: "WAF Filtering"}, {id: 5, i: ArrowRightLeft, t: "Auto-Scaling"}, {id: 6, i: Map, t: "Geo-Filtering"}].map(s => (
                <button key={s.id} onClick={() => changeMitScen(s.id)} className={`text-left p-6 rounded-[2rem] border-2 transition-all duration-300 group ${activeMitScen === s.id ? 'bg-white border-emerald-300 shadow-xl shadow-emerald-100/60 ring-4 ring-emerald-50 -translate-y-2' : 'bg-white/60 border-slate-100 hover:bg-white hover:border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1'}`}>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors duration-300 ${activeMitScen === s.id ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-slate-50 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500'}`}><s.i className="w-6 h-6" /></div>
                  <h3 className={`font-black text-base tracking-tight leading-tight ${activeMitScen === s.id ? 'text-slate-900' : 'text-slate-700'}`}>{s.t}</h3>
                </button>
              ))}
            </>
          )}

        </div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scanBeam { 0%, 100% { top: 10%; } 50% { top: 90%; } }
        @keyframes slideRight { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
        @keyframes dash { to { stroke-dashoffset: -8; } }
        @keyframes fadeInOut { 0% { opacity: 0; } 20% { opacity: 1; } 80% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes shake { 0%, 100% { transform: translateX(360px) translateY(-50%) rotate(0deg); } 25% { transform: translateX(355px) translateY(-50%) rotate(-3deg); } 50% { transform: translateX(365px) translateY(-50%) rotate(3deg); } 75% { transform: translateX(355px) translateY(-50%) rotate(-3deg); } }
        @keyframes popIn { 0% { transform: scale(0); opacity: 0; } 70% { transform: scale(1.3); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
      `}} />
    </div>
  );
}
