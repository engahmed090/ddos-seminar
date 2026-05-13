"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Shield,
  Activity,
  Fingerprint,
  Network,
  Brain,
  Play,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Server,
  MonitorSmartphone,
  Zap,
  Cloud,
  Router,
  Layers,
  Globe,
  Cpu,
  Filter,
  XCircle,
  Check,
  ArrowRight
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

/* --- MOCK DATA FOR TAB 1 --- */
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

const AI_FEATURES = [
  "Packet Rate", "Request Interval", "Click Speed", "Session Pattern",
  "URL Repetition", "L7 Behavior", "User-Agent", "IP Reputation"
];

export default function MasterDefenseSuite() {
  // Navigation Tabs: 'detection' | 'mitigation'
  const [activeTab, setActiveTab] = useState<"detection" | "mitigation">("detection");

  // --- TAB 1 STATES (Detection Engine) ---
  const [activeScen, setActiveScen] = useState(1);
  const [simStep, setSimStep] = useState(0); 
  const [scanTime, setScanTime] = useState(0);
  const [chartData, setChartData] = useState(BASE_TRAFFIC);
  const [synCount, setSynCount] = useState(0);
  const [flowLines, setFlowLines] = useState<{ id: number, type: "normal" | "attack", step: number }[]>([]);
  const [aiScores, setAiScores] = useState({ human: 95, bot: 5, conf: 40 });
  const [activeFeat, setActiveFeat] = useState(-1);

  // --- TAB 2 STATES (Mitigation Lab) ---
  const [activeMitScen, setActiveMitScen] = useState(1);
  const [defenseActive, setDefenseActive] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset Tab 1
  const resetDetection = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSimStep(0);
    setScanTime(0);
    setChartData(BASE_TRAFFIC);
    setSynCount(0);
    setFlowLines([]);
    setAiScores({ human: 95, bot: 5, conf: 40 });
    setActiveFeat(-1);
  };

  const changeDetectionScen = (id: number) => {
    if (simStep > 0 && simStep < 4) return;
    setActiveScen(id);
    resetDetection();
  };

  const runDetectionSim = () => {
    if (simStep !== 0) return;
    let currentStep = 1;
    setSimStep(1);
    const nextStep = () => {
      currentStep++;
      if (currentStep <= 4) setSimStep(currentStep);
    };

    if (activeScen === 1) {
      setTimeout(nextStep, 600);
      setTimeout(nextStep, 1200);
      let t = 0;
      timerRef.current = setInterval(() => {
        t += 0.5;
        setScanTime(t);
        if (t >= 4.5) {
          clearInterval(timerRef.current!);
          setSimStep(4);
        }
      }, 500);
    } else if (activeScen === 2) {
      setTimeout(nextStep, 800);
      setTimeout(nextStep, 1600);
      let point = 12;
      timerRef.current = setInterval(() => {
        setChartData(prev => [...prev, SPIKE_TRAFFIC[point]]);
        point++;
        if (point >= 15) {
          clearInterval(timerRef.current!);
          setSimStep(4);
        }
      }, 600);
    } else if (activeScen === 3) {
      setTimeout(nextStep, 800);
      setTimeout(nextStep, 1600);
      let count = 0;
      let tick = 0;
      timerRef.current = setInterval(() => {
        tick++;
        if (tick < 3) {
          setFlowLines(p => [...p, { id: tick, type: "normal", step: tick }]);
        } else {
          setFlowLines(p => [...p, { id: tick, type: "attack", step: tick }]);
          count += 124;
          setSynCount(count);
        }
        if (count > 500) {
          clearInterval(timerRef.current!);
          setSimStep(4);
        }
      }, 400);
    } else if (activeScen === 4) {
      setTimeout(nextStep, 600);
      setTimeout(nextStep, 1800);
      let f = -1;
      timerRef.current = setInterval(() => {
        f++;
        setActiveFeat(f);
        setAiScores({
          human: Math.max(2, 95 - f * 11),
          bot: Math.min(98, 5 + f * 11),
          conf: Math.min(99, 40 + f * 7),
        });
        if (f >= AI_FEATURES.length - 1) {
          clearInterval(timerRef.current!);
          setSimStep(4);
        }
      }, 400);
    }
  };

  const steps = ["Monitoring", "Extracting Signals", "Analyzing", "Decision"];
  
  const getDetectionResult = () => {
    if (activeScen === 1) return { title: "Attack Detected", reason: "Known signature matched." };
    if (activeScen === 2) return { title: "Anomaly Detected", reason: "Traffic exceeded baseline." };
    if (activeScen === 3) return { title: "Protocol Abuse", reason: "Too many incomplete handshakes." };
    return { title: "Bot-like L7 Pattern", reason: "Behavior does not match human traffic." };
  };

  // Switch mitigation labs cleanly
  const handleMitigationChange = (id: number) => {
    setActiveMitScen(id);
    setDefenseActive(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-100 flex flex-col pb-12">
      
      {/* HEADER */}
      <header className="pt-8 pb-2 px-6 text-center shrink-0 w-full max-w-[98%] mx-auto">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-[1.5rem] shadow-sm border border-slate-100 mb-3">
          <Shield className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-1">
          AI-Driven Cyber Defense Suites
        </h1>
        <p className="text-sm font-semibold text-slate-500 max-w-xl mx-auto">
          Stage 4 Telecommunications Engineering Interactive Lab
        </p>
      </header>

      {/* MASSIVE PREMIUM TAB SWITCHER */}
      <div className="w-full max-w-[98%] mx-auto my-6 z-30 relative flex justify-center items-center gap-6 px-4">
        <button
          onClick={() => { setActiveTab("detection"); }}
          className={`flex items-center gap-4 px-12 py-5 rounded-[2.5rem] border-2 transition-all duration-300 ${
            activeTab === "detection"
              ? "bg-blue-600 border-blue-600 text-white shadow-[0_12px_30px_rgba(37,99,235,0.35)] scale-105 font-black"
              : "bg-white/90 border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-bold"
          }`}
        >
          <Brain className="w-7 h-7" />
          <span className="text-xl tracking-tight">Detection Engine</span>
        </button>

        <button
          onClick={() => { setActiveTab("mitigation"); }}
          className={`flex items-center gap-4 px-12 py-5 rounded-[2.5rem] border-2 transition-all duration-300 ${
            activeTab === "mitigation"
              ? "bg-emerald-600 border-emerald-600 text-white shadow-[0_12px_30px_rgba(5,150,105,0.35)] scale-105 font-black"
              : "bg-white/90 border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-bold"
          }`}
        >
          <Router className="w-7 h-7" />
          <span className="text-xl tracking-tight">Mitigation Lab</span>
        </button>
      </div>

      {/* ========================================== */}
      {/* TAB 1: DETECTION ENGINE                    */}
      {/* ========================================== */}
      {activeTab === "detection" && (
        <main className="flex-1 w-full max-w-[98%] mx-auto px-4 flex flex-col animate-[fadeIn_0.4s_ease-out]">
          <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-[0_15px_50px_rgb(0,0,0,0.06)] flex-1 flex flex-col overflow-hidden relative">
            
            {/* Top Bar: Progress Timeline */}
            <div className="p-8 border-b border-slate-50 flex items-center justify-center bg-white/50 backdrop-blur-md z-20">
              <div className="flex flex-wrap items-center justify-center w-full gap-4 text-base font-black tracking-wide">
                {steps.map((s, i) => {
                  const isActive = simStep === i + 1;
                  const isPast = simStep > i + 1 || simStep === 4;
                  return (
                    <React.Fragment key={s}>
                      <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all duration-300 ${isActive ? "bg-blue-50 text-blue-700 border-2 border-blue-100 scale-110" : isPast ? "text-slate-500" : "text-slate-300"}`}>
                        {isPast ? <CheckCircle className="w-6 h-6" /> : isActive ? <Zap className="w-6 h-6 animate-pulse" /> : <div className="w-6 h-6 rounded-full border-4 border-current opacity-30" />}
                        <span className="hidden md:inline">{s}</span>
                      </div>
                      {i < 3 && <div className={`w-12 h-1.5 rounded-full ${isPast ? "bg-blue-200" : "bg-slate-100"}`} />}
                    </React.Fragment>
                  )
                })}
              </div>
            </div>

            {/* Stage */}
            <div className="flex-1 p-8 flex items-center justify-center relative min-h-[550px] bg-slate-50/40 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.03)_0%,transparent_70%)] pointer-events-none" />
              
              {/* Scenario 1 */}
              {activeScen === 1 && (
                <div className="w-full max-w-5xl flex flex-col items-center relative z-10 scale-125">
                  <div className="w-full h-72 relative flex items-center justify-center">
                    <div className="absolute left-1/2 -translate-x-1/2 w-48 h-72 bg-white/90 backdrop-blur-xl border border-slate-100 rounded-[3rem] shadow-2xl z-20 flex flex-col items-center justify-center">
                      <Fingerprint className={`w-20 h-20 transition-colors duration-500 ${simStep === 4 ? "text-red-500" : "text-blue-500"}`} />
                      {simStep > 0 && simStep < 4 && <div className="absolute inset-x-8 top-8 h-2 bg-blue-400 blur-[2px] animate-[scanBeam_1.5s_ease-in-out_infinite]" />}
                    </div>
                    <div className="absolute inset-x-0 h-1.5 bg-slate-200 border-t-2 border-dashed border-slate-300" />
                    {SIGNATURES.map((pkt) => {
                      const progress = Math.max(0, scanTime - pkt.delay);
                      let xPos = progress * 240;
                      let status = (xPos > 480 && !pkt.bad) ? "passed" : (pkt.bad && xPos >= 360) ? (simStep === 4 ? "caught" : "scanning") : "approaching";
                      if (pkt.bad && xPos >= 360) xPos = 360;
                      return (
                        <div key={pkt.id} className={`absolute left-0 w-24 h-32 rounded-[2rem] border-4 flex items-center justify-center font-mono text-xl font-black transition-all duration-300 ease-linear shadow-md ${status === "caught" ? "bg-red-50 border-red-300 text-red-600 scale-110 z-30 shadow-red-100 animate-[shake_0.5s_ease-in-out]" : status === "scanning" ? "bg-white border-blue-300 text-blue-500 z-30 scale-105" : status === "passed" ? "bg-white border-emerald-200 text-emerald-400 opacity-0" : "bg-white border-slate-200 text-slate-400 z-10"}`} style={{ transform: `translateX(${xPos}px) translateY(-50%)`, top: '50%' }}>
                          {pkt.type}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Scenario 2 */}
              {activeScen === 2 && (
                <div className="w-full max-w-6xl h-full flex flex-col justify-center relative z-10 scale-110">
                  <div className="h-[450px] w-full relative bg-white/90 p-8 rounded-[4rem] border border-slate-100 shadow-2xl">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 30, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="normalGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3}/><stop offset="100%" stopColor="#3B82F6" stopOpacity={0}/></linearGradient>
                          <linearGradient id="dangerGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#EF4444" stopOpacity={0.6}/><stop offset="100%" stopColor="#EF4444" stopOpacity={0}/></linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#E2E8F0" />
                        <XAxis dataKey="t" hide />
                        <YAxis stroke="#94A3B8" fontSize={16} fontWeight="bold" tickLine={false} axisLine={false} />
                        {/* @ts-ignore */}
                        <Tooltip contentStyle={{ borderRadius: '25px', border: 'none', boxShadow: '0 20px 40px -10px rgb(0 0 0 / 0.15)', padding: '20px' }} />
                        <ReferenceLine y={70} stroke="#EF4444" strokeDasharray="8 8" strokeWidth={3} />
                        <Area type="monotone" dataKey="v" stroke={simStep === 4 ? "#EF4444" : "#3B82F6"} strokeWidth={6} fill={simStep === 4 ? "url(#dangerGrad)" : "url(#normalGrad)"} />
                      </AreaChart>
                    </ResponsiveContainer>
                    <div className="absolute top-12 left-12 text-xs font-black text-red-500 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100">Safe Threshold</div>
                  </div>
                </div>
              )}

              {/* Scenario 3 */}
              {activeScen === 3 && (
                <div className="w-full max-w-6xl flex items-center justify-between px-16 relative z-10 scale-110">
                  <div className="flex flex-col items-center gap-8">
                    <div className="w-36 h-36 bg-white border-2 border-slate-100 rounded-[3rem] shadow-xl flex items-center justify-center"><MonitorSmartphone className="w-16 h-16 text-slate-400" /></div>
                    <span className="text-lg font-black text-slate-400 uppercase tracking-widest bg-white px-6 py-2 rounded-full border border-slate-100">Client</span>
                  </div>
                  <div className="flex-1 h-80 relative mx-20">
                    <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center w-56 h-56 rounded-[4rem] bg-white/95 backdrop-blur-2xl shadow-2xl transition-all z-30 border-[10px] ${simStep === 4 ? 'border-red-100 scale-110' : 'border-slate-50'}`}>
                      <span className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Half-Open</span>
                      <span className={`text-7xl font-black font-mono ${simStep === 4 ? 'text-red-500' : 'text-slate-800'}`}>{synCount}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-8">
                    <div className={`w-36 h-36 rounded-[3rem] flex items-center justify-center border-4 ${simStep === 4 ? 'bg-red-50 border-red-200 shadow-[0_0_80px_rgba(239,68,68,0.4)]' : 'bg-blue-50 border-blue-100 shadow-xl'}`}><Server className={`w-16 h-16 ${simStep === 4 ? 'text-red-500' : 'text-blue-600'}`} /></div>
                    <span className="text-lg font-black text-slate-400 uppercase tracking-widest bg-white px-6 py-2 rounded-full border border-slate-100">Server</span>
                  </div>
                </div>
              )}

              {/* Scenario 4 */}
              {activeScen === 4 && (
                <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-24 relative z-10 scale-105">
                  <div className="flex flex-col gap-6 w-80">
                    {AI_FEATURES.map((feat, i) => (
                      <div key={feat} className={`text-sm font-black uppercase tracking-widest px-8 py-5 rounded-[2rem] border-4 transition-all flex items-center gap-5 ${activeFeat === i ? "bg-white border-blue-400 text-blue-600 shadow-2xl scale-110" : activeFeat > i ? "bg-slate-50 border-slate-100 text-slate-400" : "bg-transparent border-transparent text-slate-300"}`}>{feat}</div>
                    ))}
                  </div>
                  <div className={`w-80 h-80 rounded-[4.5rem] border-[12px] bg-white/95 backdrop-blur-3xl flex flex-col items-center justify-center shadow-2xl transition-all ${simStep === 4 ? 'border-red-100 scale-110' : 'border-blue-50'}`}>
                    <Brain className={`w-28 h-28 mb-6 ${simStep === 4 ? 'text-red-500' : 'text-blue-600'}`} />
                    <span className="text-lg font-black text-slate-400 tracking-widest uppercase">AI Engine</span>
                  </div>
                  <div className="w-96 flex flex-col gap-10 bg-white/80 p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl">
                    {[{label: "Human Prob", val: aiScores.human, color: "bg-emerald-400"}, {label: "Bot Prob", val: aiScores.bot, color: "bg-red-400"}, {label: "AI Confidence", val: aiScores.conf, color: "bg-blue-500"}].map((bar) => (
                      <div key={bar.label}>
                        <div className="flex justify-between text-sm font-black uppercase tracking-widest mb-4"><span className="text-slate-400">{bar.label}</span><span className="text-slate-800">{bar.val}%</span></div>
                        <div className="h-5 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full ${bar.color} transition-all`} style={{ width: `${bar.val}%` }} /></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Fixed Bottom-Right Action Buttons */}
              <div className="absolute bottom-12 right-12 z-50 flex items-center gap-6">
                <button onClick={resetDetection} disabled={simStep === 0} className="w-20 h-20 bg-white text-slate-600 border-2 border-slate-100 rounded-[2rem] hover:bg-slate-50 shadow-xl flex items-center justify-center disabled:opacity-30">
                  <RotateCcw className="w-10 h-10" />
                </button>
                <button onClick={runDetectionSim} disabled={simStep !== 0} className="h-20 px-12 bg-blue-600 text-white rounded-[2rem] font-black text-2xl hover:bg-blue-700 hover:scale-105 transition-all shadow-[0_20px_50px_rgba(37,99,235,0.4)] flex items-center gap-4 disabled:opacity-30 disabled:scale-100 disabled:shadow-none">
                  <Play className="w-8 h-8 fill-current" /> Run Simulation
                </button>
              </div>

              {/* Results Overlay */}
              <div className={`absolute bottom-16 left-1/2 -translate-x-1/2 transition-all duration-500 z-50 ${simStep === 4 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-90 pointer-events-none'}`}>
                <div className="px-10 py-8 rounded-[3.5rem] bg-white/95 backdrop-blur-3xl border-2 border-red-100 shadow-[0_30px_100px_rgba(239,68,68,0.3)] flex items-center gap-8">
                  <div className="w-16 h-16 rounded-3xl bg-red-50 flex items-center justify-center shrink-0 border border-red-100"><AlertTriangle className="w-8 h-8 text-red-500" /></div>
                  <div><h4 className="text-2xl font-black text-slate-900 mb-2 leading-none">{getDetectionResult().title}</h4><p className="text-lg font-bold text-slate-500">{getDetectionResult().reason}</p></div>
                </div>
              </div>

            </div>
          </div>

          {/* Bottom Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
            {[
              {id: 1, title: "Signature", icon: Fingerprint, desc: "Known patterns detection."},
              {id: 2, title: "Anomaly", icon: Activity, desc: "Learned baseline detection."},
              {id: 3, title: "Protocol", icon: Network, desc: "TCP/UDP state inspection."},
              {id: 4, title: "AI Core", icon: Brain, desc: "L7 Behavioral analysis."}
            ].map((scen) => (
              <button key={scen.id} onClick={() => changeDetectionScen(scen.id)} className={`text-left p-10 rounded-[3.5rem] border-4 transition-all duration-300 group ${activeScen === scen.id ? 'bg-white border-blue-400 shadow-[0_30px_60px_rgba(37,99,235,0.15)] ring-8 ring-blue-50 -translate-y-4' : 'bg-white/60 border-slate-100 hover:bg-white hover:border-slate-300 shadow-lg hover:-translate-y-2'}`}>
                <div className={`w-20 h-20 rounded-[2.5rem] flex items-center justify-center mb-8 transition-all ${activeScen === scen.id ? 'bg-blue-600 text-white scale-110 shadow-xl' : 'bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500'}`}><scen.icon className="w-10 h-10" /></div>
                <h3 className={`font-black text-2xl mb-3 tracking-tight ${activeScen === scen.id ? 'text-slate-900' : 'text-slate-700'}`}>{scen.title}</h3>
                <p className="text-lg font-bold text-slate-400 line-clamp-2 leading-relaxed">{scen.desc}</p>
              </button>
            ))}
          </div>
        </main>
      )}

      {/* ========================================== */}
      {/* TAB 2: MITIGATION LAB (Cisco Network Style)*/}
      {/* ========================================== */}
      {activeTab === "mitigation" && (
        <main className="flex-1 w-full max-w-[98%] mx-auto px-4 flex flex-col animate-[fadeIn_0.4s_ease-out]">
          
          {/* Main Network Stage Area */}
          <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-[0_15px_50px_rgb(0,0,0,0.06)] flex-1 flex flex-col overflow-hidden relative min-h-[600px]">
            
            {/* Top Mit Switcher Row inside stage */}
            <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between px-10">
              <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
                {[
                  { id: 1, label: "1. Scrubbing" },
                  { id: 2, label: "2. CDN Anycast" },
                  { id: 3, label: "3. Rate Limiting" },
                  { id: 4, label: "4. WAF Filter" },
                  { id: 5, label: "5. Auto-Scaling" },
                  { id: 6, label: "6. Perimeter ACL" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleMitigationChange(tab.id)}
                    className={`px-6 py-3 rounded-2xl font-black text-sm transition-all whitespace-nowrap border-2 ${
                      activeMitScen === tab.id 
                      ? "bg-emerald-50 border-emerald-300 text-emerald-700 shadow-sm scale-105" 
                      : "bg-white border-slate-100 text-slate-400 hover:text-slate-700"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Master Defense Toggle Switch */}
              <div className="shrink-0 pl-4 hidden xl:block">
                <button
                  onClick={() => setDefenseActive(!defenseActive)}
                  className={`flex items-center gap-4 px-8 py-4 rounded-2xl font-black text-base transition-all border-2 ${
                    defenseActive
                    ? "bg-emerald-600 border-emerald-500 text-white shadow-[0_10px_25px_rgba(5,150,105,0.4)]"
                    : "bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100"
                  }`}
                >
                  <Filter className="w-5 h-5" />
                  <span>{defenseActive ? "Mitigation Active (Protected)" : "Attack Flowing (Bypassed)"}</span>
                </button>
              </div>
            </div>

            {/* Topology Area */}
            <div className="flex-1 p-8 flex items-center justify-center relative bg-slate-50/20 overflow-hidden">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '40px 40px' }} />

              {/* SCENARIO 1: DDoS Scrubbing Service */}
              {activeMitScen === 1 && (
                <div className="w-full max-w-6xl flex items-center justify-between relative z-10 px-8 scale-105">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-28 h-28 bg-rose-50 border-4 border-rose-300 rounded-3xl flex items-center justify-center shadow-lg animate-pulse">
                      <Cloud className="w-14 h-14 text-rose-500" />
                    </div>
                    <span className="font-black text-sm text-rose-600 bg-white px-4 py-1.5 rounded-full border border-rose-100 shadow-sm">Attacker Botnet</span>
                  </div>

                  {/* Flow Pipe */}
                  <div className="flex-1 h-48 relative mx-10 flex items-center">
                    <div className="absolute inset-x-0 h-4 bg-slate-200 rounded-full overflow-hidden flex items-center border-y border-slate-300">
                      <div className={`h-full w-full animate-[slideRight_1s_linear_infinite] ${defenseActive ? 'bg-gradient-to-r from-rose-400 via-emerald-400 to-emerald-500' : 'bg-rose-500'}`} />
                    </div>

                    {/* Scrubber Node in middle */}
                    <div className={`absolute left-1/2 -translate-x-1/2 flex flex-col items-center justify-center w-48 h-48 rounded-[2.5rem] transition-all border-4 shadow-2xl z-20 ${defenseActive ? 'bg-emerald-600 border-emerald-400 text-white scale-110 shadow-emerald-200' : 'bg-white border-slate-200 text-slate-400 opacity-60'}`}>
                      <Layers className="w-16 h-16 mb-2" />
                      <span className="font-black tracking-widest text-xs uppercase">Scrubbing Center</span>
                      <span className="text-[10px] font-bold opacity-80">{defenseActive ? "Filtering 100Gbps" : "Offline"}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-4">
                    <div className={`w-28 h-28 rounded-3xl flex items-center justify-center border-4 transition-all ${defenseActive ? 'bg-emerald-50 border-emerald-300 text-emerald-600 shadow-xl' : 'bg-rose-50 border-rose-300 text-rose-600 shadow-[0_0_50px_rgba(244,63,94,0.4)]'}`}>
                      <Server className="w-14 h-14" />
                    </div>
                    <span className={`font-black text-sm bg-white px-4 py-1.5 rounded-full border shadow-sm ${defenseActive ? 'text-emerald-600 border-emerald-100' : 'text-rose-600 border-rose-100'}`}>Target Server</span>
                  </div>
                </div>
              )}

              {/* SCENARIO 2: CDN & Anycast Network */}
              {activeMitScen === 2 && (
                <div className="w-full max-w-6xl flex flex-col items-center justify-center gap-12 relative z-10 scale-105">
                  {/* Attackers top */}
                  <div className="flex justify-around w-full px-20">
                    {[1,2,3].map((i) => (
                      <div key={i} className="flex flex-col items-center gap-2">
                        <div className="w-16 h-16 bg-rose-50 border-2 border-rose-300 rounded-2xl flex items-center justify-center text-rose-500 animate-bounce"><Cloud className="w-8 h-8" /></div>
                        <span className="text-[10px] font-bold text-rose-500">Flood {i}</span>
                      </div>
                    ))}
                  </div>

                  {/* CDN Edge nodes grid */}
                  <div className="flex justify-between w-full px-12 relative z-20">
                    <div className="absolute inset-x-20 top-1/2 h-1 bg-slate-200 -z-10" />
                    {[ "Edge Tokyo", "Edge Frankfurt", "Edge London", "Edge NY" ].map((node, i) => (
                      <div key={node} className={`flex flex-col items-center justify-center w-40 h-32 rounded-3xl border-4 transition-all bg-white shadow-xl ${defenseActive ? 'border-emerald-400 text-emerald-600' : 'border-rose-300 text-rose-500'}`}>
                        <Globe className="w-10 h-10 mb-2" />
                        <span className="font-black text-xs">{node}</span>
                        <span className="text-[9px] font-bold text-slate-400">{defenseActive ? "Absorbed Locally" : "Overloaded"}</span>
                      </div>
                    ))}
                  </div>

                  {/* Core Origin Server */}
                  <div className={`flex items-center gap-4 px-10 py-5 rounded-[2.5rem] border-4 shadow-2xl transition-all ${defenseActive ? 'bg-emerald-50 border-emerald-400 text-emerald-700' : 'bg-rose-50 border-rose-400 text-rose-700 animate-pulse'}`}>
                    <Server className="w-10 h-10" />
                    <div>
                      <h4 className="font-black text-lg leading-none">Origin Backend Server</h4>
                      <p className="text-xs font-bold opacity-75">{defenseActive ? "100% Green / Unscathed" : "Critical Latency Spikes"}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* SCENARIO 3: Rate Limiting */}
              {activeMitScen === 3 && (
                <div className="w-full max-w-5xl flex items-center justify-between relative z-10 px-12 scale-110">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-28 h-28 bg-slate-50 border-4 border-slate-200 rounded-3xl flex items-center justify-center"><MonitorSmartphone className="w-14 h-14 text-slate-500" /></div>
                    <span className="font-black text-sm text-slate-600 bg-white px-4 py-1.5 rounded-full border shadow-sm">API Gateway Input</span>
                  </div>

                  <div className="flex-1 flex flex-col items-center justify-center gap-4 mx-16 relative">
                    {/* Visual Meter */}
                    <div className="w-full bg-slate-100 h-8 rounded-2xl p-1.5 border border-slate-200 flex items-center overflow-hidden relative">
                      <div className={`h-full rounded-xl transition-all duration-500 ${defenseActive ? 'w-1/3 bg-emerald-500' : 'w-full bg-rose-500 animate-pulse'}`} />
                      <span className="absolute left-1/2 -translate-x-1/2 text-xs font-black text-slate-800 drop-shadow-sm">
                        {defenseActive ? "Strict Quota: 50 Req/s" : "Uncapped Flood: 9,500 Req/s"}
                      </span>
                    </div>

                    <div className="flex gap-4">
                      <span className={`px-4 py-2 rounded-xl text-xs font-black border flex items-center gap-2 ${defenseActive ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'opacity-40'}`}><Check className="w-4 h-4" /> Passed</span>
                      <span className={`px-4 py-2 rounded-xl text-xs font-black border flex items-center gap-2 ${defenseActive ? 'bg-rose-50 text-rose-600 border-rose-200 animate-bounce' : 'opacity-40'}`}><XCircle className="w-4 h-4" /> Dropped Over-limit</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-4">
                    <div className="w-28 h-28 bg-blue-50 border-4 border-blue-200 rounded-3xl flex items-center justify-center text-blue-600"><Cpu className="w-14 h-14" /></div>
                    <span className="font-black text-sm text-blue-600 bg-white px-4 py-1.5 rounded-full border shadow-sm">Database Endpoint</span>
                  </div>
                </div>
              )}

              {/* SCENARIO 4: Web Application Firewall (WAF) */}
              {activeMitScen === 4 && (
                <div className="w-full max-w-5xl flex items-center justify-between relative z-10 px-12 scale-110">
                  <div className="flex flex-col gap-3 w-64">
                    {[
                      { t: "GET /index.html", bot: false },
                      { t: "POST /login (SQLi)", bot: true },
                      { t: "GET / HTTP/1.1 (User-Agent: nil)", bot: true },
                    ].map((req, idx) => (
                      <div key={idx} className={`p-4 rounded-2xl border-2 font-mono text-xs font-bold flex items-center justify-between ${req.bot ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                        <span className="truncate">{req.t}</span>
                        {req.bot ? <XCircle className="w-4 h-4 text-rose-500 shrink-0" /> : <Check className="w-4 h-4 text-emerald-500 shrink-0" />}
                      </div>
                    ))}
                  </div>

                  {/* L7 WAF Node */}
                  <div className={`w-64 h-64 rounded-[3rem] border-8 flex flex-col items-center justify-center shadow-2xl transition-all relative z-20 ${defenseActive ? 'bg-emerald-600 border-emerald-400 text-white scale-110' : 'bg-white border-slate-200 text-slate-400'}`}>
                    <Shield className="w-20 h-20 mb-3" />
                    <span className="font-black text-base tracking-widest uppercase">Layer 7 WAF</span>
                    <span className="text-xs font-bold opacity-80 mt-1">{defenseActive ? "Deep Packet Inspection" : "Bypass Mode"}</span>
                  </div>

                  <div className="flex flex-col items-center gap-4">
                    <div className={`w-28 h-28 rounded-3xl flex items-center justify-center border-4 transition-all ${defenseActive ? 'bg-emerald-50 border-emerald-300 text-emerald-600' : 'bg-rose-50 border-rose-300 text-rose-600 animate-pulse'}`}><Server className="w-14 h-14" /></div>
                    <span className="font-black text-sm bg-white px-4 py-1.5 rounded-full border shadow-sm text-slate-700">App Server Core</span>
                  </div>
                </div>
              )}

              {/* SCENARIO 5: Auto-Scaling */}
              {activeMitScen === 5 && (
                <div className="w-full max-w-6xl flex items-center justify-between relative z-10 px-12 scale-105">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-24 h-24 bg-blue-600 text-white rounded-3xl flex items-center justify-center shadow-xl"><Router className="w-12 h-12" /></div>
                    <span className="font-black text-xs uppercase tracking-wider text-slate-500">Load Balancer</span>
                  </div>

                  {/* Connecting lines array */}
                  <div className="flex-1 flex flex-col gap-6 items-center justify-center mx-12">
                    <div className="w-full flex items-center justify-around gap-4">
                      {[1, 2, 3, 4].map((srv) => {
                        const isExtra = srv > 2;
                        const isVisible = !isExtra || defenseActive;
                        return (
                          <div key={srv} className={`flex flex-col items-center justify-center w-36 h-40 rounded-3xl border-4 transition-all duration-500 ${isVisible ? 'bg-white border-emerald-400 shadow-xl scale-100 opacity-100' : 'border-dashed border-slate-200 bg-slate-50 scale-90 opacity-40'}`}>
                            <Server className={`w-10 h-10 mb-2 ${isVisible ? 'text-emerald-600' : 'text-slate-300'}`} />
                            <span className="font-black text-xs text-slate-700">Instance {srv}</span>
                            <span className={`text-[10px] font-bold mt-1 px-2 py-0.5 rounded-md ${isVisible ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>{isVisible ? "Active (35% CPU)" : "Standby"}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* SCENARIO 6: Geo/IP Filtering */}
              {activeMitScen === 6 && (
                <div className="w-full max-w-5xl flex items-center justify-between relative z-10 px-12 scale-110">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-28 h-28 bg-rose-50 border-4 border-rose-300 rounded-3xl flex items-center justify-center text-rose-500 shadow-md"><Globe className="w-14 h-14" /></div>
                    <span className="font-black text-sm text-rose-600 bg-white px-4 py-1.5 rounded-full border shadow-sm">Flagged Geo Origin</span>
                  </div>

                  {/* Perimeter ACL barrier */}
                  <div className={`flex flex-col items-center justify-center w-64 h-64 rounded-[3rem] border-8 transition-all shadow-2xl relative z-20 ${defenseActive ? 'bg-slate-900 border-rose-500 text-white scale-110' : 'bg-white border-slate-200 text-slate-400'}`}>
                    <Filter className="w-20 h-20 mb-3 text-rose-500 animate-pulse" />
                    <span className="font-black text-base tracking-widest uppercase">Perimeter ACL</span>
                    <span className="text-xs font-bold opacity-80 mt-1">{defenseActive ? "IP Subnets Dropped" : "Permit Any Any"}</span>
                  </div>

                  <div className="flex flex-col items-center gap-4">
                    <div className="w-28 h-28 bg-emerald-50 border-4 border-emerald-300 rounded-3xl flex items-center justify-center text-emerald-600 shadow-md"><Server className="w-14 h-14" /></div>
                    <span className="font-black text-sm text-emerald-600 bg-white px-4 py-1.5 rounded-full border shadow-sm">Protected Infra</span>
                  </div>
                </div>
              )}

              {/* Visible toggle button for screens < xl */}
              <div className="absolute bottom-8 right-8 z-40 block xl:hidden">
                <button
                  onClick={() => setDefenseActive(!defenseActive)}
                  className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-sm transition-all border-2 shadow-xl ${
                    defenseActive
                    ? "bg-emerald-600 border-emerald-500 text-white"
                    : "bg-rose-600 border-rose-500 text-white animate-pulse"
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  <span>{defenseActive ? "Defended" : "Bypassed"}</span>
                </button>
              </div>

            </div>

            {/* Bottom Descriptions Grid */}
            <div className="p-8 border-t border-slate-50 bg-slate-50/40">
              <div className="max-w-4xl mx-auto text-center">
                <h4 className="text-lg font-black text-slate-900 mb-2">
                  {activeMitScen === 1 && "DDoS Scrubbing & Volumetric Filtering Center"}
                  {activeMitScen === 2 && "Global Content Delivery Network (CDN) & Anycast Routing"}
                  {activeMitScen === 3 && "Granular Endpoint Rate Limiting & Quota Management"}
                  {activeMitScen === 4 && "Layer 7 Web Application Firewall (WAF) Deep Packet Inspection"}
                  {activeMitScen === 5 && "Elastic Load Balancing & Autonomous Horizontal Scaling"}
                  {activeMitScen === 6 && "Hardware Perimeter ACLs & IP Reputation / Geo-Blocking"}
                </h4>
                <p className="text-sm font-semibold text-slate-500 leading-relaxed">
                  {activeMitScen === 1 && "ترافیکی قەبارە گەورە (Volumetric Flood) پێش ئەوەی بگاتە سێرڤەرەکان، بەناو خزمەتگوزاری پاککردنەوەدا دەڕوات تا ترافیکە گومانلێکراوەکە بە تەواوی فلتەر بکرێت."}
                  {activeMitScen === 2 && "ترافیکەکە بەسەر چەندین نۆدی جیاوازی Anycast دا دابەش دەبێت، ئەمەش وا دەکات هێرشبەر نەتوانێت تەنها یەک سێرڤەر نیشانە بگرێت و بیکوژێنێتەوە."}
                  {activeMitScen === 3 && "سنووردارکردنی ژمارەی داواکارییەکان لە چرکەیەدا بۆ هەر IP یان Sessionێک بۆ ڕێگریکردن لە هێرشی L7 HTTP Flood بەبێ بلۆککردنی مرۆڤ."}
                  {activeMitScen === 4 && "شیکردنەوەی قووڵی هێدەر و ڕەفتاری پاکێتەکان لەسەر ئاستی ئەپڵیکەیشن (Layer 7) بۆ ڕەتکردنەوەی واژۆی بۆتەکان و قبوڵکردنی ترافیکی ئاسایی."}
                  {activeMitScen === 5 && "دابەشکردنی ئۆتۆماتیکی فشارەکە بەسەر چەندین سێرڤەردا. هەرکاتێک ترافیک لەناکاو زیاد بێت، سێرڤەری نوێ (Instance) بە شێوەی ئۆتۆماتیکی هەڵدەبێت."}
                  {activeMitScen === 6 && "ڕێساکانی فایەروۆڵ و ACL ڕاستەوخۆ پاکێتەکانی ئەو ناوچانە یان IPیانە فڕێ دەدەن کە ناوبانگیان خراپە، ئەمەش لەسەر دەروازەی چوونەژوورەوە ڕوودەدات."}
                </p>
              </div>
            </div>

          </div>
        </main>
      )}

      {/* KEYFRAMES */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scanBeam { 0%, 100% { top: 10%; } 50% { top: 90%; } }
        @keyframes slideRight { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shake { 0%, 100% { transform: translateX(360px) translateY(-50%) rotate(0deg); } 25% { transform: translateX(350px) translateY(-50%) rotate(-4deg); } 50% { transform: translateX(370px) translateY(-50%) rotate(4deg); } 75% { transform: translateX(350px) translateY(-50%) rotate(-4deg); } }
      `}} />
    </div>
  );
}
