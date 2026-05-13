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
  Bot,
  Zap,
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

/* --- DETERMINISTIC MOCK DATA --- */
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
  { id: 4, type: "SYN", bad: true, delay: 3 }, // Malicious
  { id: 5, type: "ACK", bad: false, delay: 4 },
];

const AI_FEATURES = [
  "Packet Rate", "Request Interval", "Click Speed", "Session Pattern",
  "URL Repetition", "L7 Behavior", "User-Agent", "IP Reputation"
];

/* --- MAIN PAGE --- */
export default function SimulationPage() {
  const [activeScen, setActiveScen] = useState(1);
  const [simStep, setSimStep] = useState(0); // 0: Idle, 1: Monitor, 2: Extract, 3: Analyze, 4: Decision
  
  // Scen 1
  const [scanTime, setScanTime] = useState(0);
  
  // Scen 2
  const [chartData, setChartData] = useState(BASE_TRAFFIC);
  
  // Scen 3
  const [synCount, setSynCount] = useState(0);
  const [flowLines, setFlowLines] = useState<{ id: number, type: "normal" | "attack", step: number }[]>([]);
  
  // Scen 4
  const [aiScores, setAiScores] = useState({ human: 95, bot: 5, conf: 40 });
  const [activeFeat, setActiveFeat] = useState(-1);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetAll = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSimStep(0);
    setScanTime(0);
    setChartData(BASE_TRAFFIC);
    setSynCount(0);
    setFlowLines([]);
    setAiScores({ human: 95, bot: 5, conf: 40 });
    setActiveFeat(-1);
  };

  const changeScen = (id: number) => {
    if (simStep > 0 && simStep < 4) return;
    setActiveScen(id);
    resetAll();
  };

  const runSim = () => {
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
        if (t >= 4.5) { // Malicious packet caught at time 3.5, wait 1s
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
  
  const getResult = () => {
    if (activeScen === 1) return { title: "Attack Detected", reason: "Known signature matched." };
    if (activeScen === 2) return { title: "Anomaly Detected", reason: "Traffic exceeded baseline." };
    if (activeScen === 3) return { title: "Protocol Abuse", reason: "Too many incomplete handshakes." };
    return { title: "Bot-like L7 Pattern", reason: "Behavior does not match human traffic." };
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-100 flex flex-col pb-12">
      
      {/* HERO SECTION */}
      <header className="pt-10 pb-6 px-6 text-center shrink-0 w-full max-w-[98%] mx-auto">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-3xl shadow-sm border border-slate-100 mb-4">
          <Shield className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-4">
          AI-Driven Cyber Defense
        </h1>
        <p className="text-lg font-medium text-slate-500 max-w-xl mx-auto">
          Interactive simulation of signature, anomaly, protocol, and behavioral AI detection engines.
        </p>
      </header>

      {/* SIMULATION STAGE */}
      <main className="flex-1 w-full max-w-[98%] mx-auto px-4 xl:px-12 flex flex-col">
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-[0_12px_40px_rgb(0,0,0,0.06)] flex-1 flex flex-col overflow-hidden relative">
          
          {/* Top Bar: Progress Timeline Centered */}
          <div className="p-6 border-b border-slate-50 flex items-center justify-center bg-white/50 backdrop-blur-md z-20">
            <div className="flex flex-wrap items-center justify-center w-full gap-2 text-base font-bold tracking-wide">
              {steps.map((s, i) => {
                const isActive = simStep === i + 1;
                const isPast = simStep > i + 1 || simStep === 4;
                return (
                  <React.Fragment key={s}>
                    <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all duration-300
                      ${isActive ? "bg-blue-50 text-blue-700 shadow-sm border border-blue-100 scale-105" : isPast ? "text-slate-500" : "text-slate-300"}
                    `}>
                      {isPast ? <CheckCircle className="w-6 h-6" /> : isActive ? <Zap className="w-6 h-6 animate-pulse" /> : <div className="w-6 h-6 rounded-full border-4 border-current opacity-30" />}
                      <span className="hidden sm:inline">{s}</span>
                    </div>
                    {i < 3 && <div className={`w-10 h-1.5 rounded-full ${isPast ? "bg-blue-200" : "bg-slate-100"}`} />}
                  </React.Fragment>
                )
              })}
            </div>
          </div>

          {/* Center: Visual Model */}
          <div className="flex-1 p-8 flex items-center justify-center relative min-h-[600px] xl:min-h-[700px] bg-slate-50/30 overflow-hidden">
            
            {/* Stage Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.03)_0%,transparent_70%)] pointer-events-none" />
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

            {/* SCENARIO 1: SIGNATURE */}
            {activeScen === 1 && (
              <div className="w-full max-w-4xl flex flex-col items-center relative z-10">
                <div className="w-full h-80 relative flex items-center justify-center scale-110">
                  
                  {/* Scanner Gate */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-48 h-80 bg-white/90 backdrop-blur-xl border border-slate-100 rounded-[3rem] shadow-2xl z-20 flex flex-col items-center justify-center">
                    <Fingerprint className={`w-20 h-20 transition-colors duration-500 ${simStep === 4 ? "text-red-500" : "text-blue-500"}`} />
                    {/* Scanning Beam */}
                    {simStep > 0 && simStep < 4 && (
                      <div className="absolute inset-x-8 top-8 h-2 bg-blue-400 blur-[2px] animate-[scanBeam_1.5s_ease-in-out_infinite]" />
                    )}
                  </div>

                  {/* Packet Track */}
                  <div className="absolute inset-x-0 h-1 bg-slate-200 border-t-[3px] border-dashed border-slate-300 rounded-full" />

                  {/* Packets */}
                  {SIGNATURES.map((pkt) => {
                    const progress = Math.max(0, scanTime - pkt.delay);
                    let xPos = progress * 240; // Move right faster due to wider stage
                    let status = "approaching";
                    
                    if (xPos > 480 && !pkt.bad) {
                      status = "passed";
                    } else if (pkt.bad && xPos >= 360) {
                      xPos = 360; // Stop inside scanner
                      status = simStep === 4 ? "caught" : "scanning";
                    }

                    return (
                      <div 
                        key={pkt.id} 
                        className={`absolute left-0 w-24 h-32 rounded-[2rem] border-4 flex items-center justify-center font-mono text-2xl font-black transition-all duration-300 ease-linear shadow-md
                          ${status === "caught" ? "bg-red-50 border-red-300 text-red-600 scale-110 z-30 shadow-red-100 animate-[shake_0.5s_ease-in-out]" : status === "scanning" ? "bg-white border-blue-300 text-blue-500 z-30 scale-105" : status === "passed" ? "bg-white border-emerald-200 text-emerald-400 opacity-0" : "bg-white border-slate-200 text-slate-400 z-10"}
                        `}
                        style={{ transform: `translateX(${xPos}px) translateY(-50%)`, top: '50%' }}
                      >
                        {pkt.type}
                        
                        {status === "caught" && (
                          <div className="absolute -top-16 left-1/2 -translate-x-1/2 whitespace-nowrap bg-red-500 text-white text-base font-black px-6 py-3 rounded-full shadow-2xl shadow-red-200 animate-bounce">
                            Signature Match
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* SCENARIO 2: ANOMALY */}
            {activeScen === 2 && (
              <div className="w-full max-w-6xl h-full flex flex-col justify-center relative z-10 scale-110">
                <div className="h-[450px] w-full relative bg-white/80 backdrop-blur-md p-10 rounded-[3rem] border border-slate-100 shadow-2xl">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 30, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="normalGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.25}/>
                          <stop offset="100%" stopColor="#3B82F6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="dangerGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#EF4444" stopOpacity={0.5}/>
                          <stop offset="100%" stopColor="#EF4444" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="t" hide />
                      <YAxis stroke="#94A3B8" fontSize={16} tickLine={false} axisLine={false} />
                      {/* @ts-ignore */}
                      <Tooltip contentStyle={{ borderRadius: '24px', border: '2px solid #E2E8F0', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px 24px', fontSize: '18px', fontWeight: 'bold' }} formatter={(v: any) => [v, "Mbps"]} />
                      
                      <ReferenceLine y={70} stroke="#EF4444" strokeDasharray="8 8" strokeWidth={3} />
                      
                      <Area 
                        type="monotone" 
                        dataKey="v" 
                        stroke={simStep === 4 ? "#EF4444" : "#3B82F6"} 
                        strokeWidth={6} 
                        fill={simStep === 4 ? "url(#dangerGrad)" : "url(#normalGrad)"} 
                        isAnimationActive={true} 
                        animationDuration={400} 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                  
                  {/* Floating Labels */}
                  <div className="absolute top-[130px] left-16 text-sm font-black text-red-500 bg-red-50/90 px-4 py-2 rounded-xl border border-red-100 shadow-md">
                    Safe Threshold
                  </div>
                  
                  {simStep === 4 && (
                    <div className="absolute top-16 right-[30%] bg-red-500 text-white text-lg font-black px-8 py-4 rounded-full shadow-2xl shadow-red-200 animate-bounce z-20">
                      Threshold Exceeded
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SCENARIO 3: PROTOCOL */}
            {activeScen === 3 && (
              <div className="w-full max-w-6xl flex items-center justify-between px-16 relative z-10 scale-110">
                {/* Client */}
                <div className="flex flex-col items-center gap-8 z-20">
                  <div className="w-40 h-40 bg-white border border-slate-200 rounded-[3rem] shadow-2xl flex items-center justify-center">
                    <MonitorSmartphone className="w-20 h-20 text-slate-400" />
                  </div>
                  <span className="text-lg font-black text-slate-400 uppercase tracking-widest bg-white px-6 py-2 rounded-full shadow-sm border border-slate-100">Client</span>
                </div>

                {/* Animated Flow Area */}
                <div className="flex-1 h-80 relative mx-20">
                  {flowLines.map((line) => {
                    const isNormal = line.type === 'normal';
                    return (
                      <div key={line.id} className="absolute inset-0 flex items-center justify-center">
                        {isNormal ? (
                          <div className="w-full relative h-32 flex flex-col justify-between opacity-0 animate-[fadeInOut_1.5s_ease-in-out_forwards]">
                            <div className="h-1.5 bg-blue-300 w-full relative"><div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-y-[8px] border-y-transparent border-l-[12px] border-l-blue-300" /><span className="absolute left-1/2 -top-8 -translate-x-1/2 text-sm text-blue-500 font-black">SYN</span></div>
                            <div className="h-1.5 bg-emerald-300 w-full relative"><div className="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-0 border-y-[8px] border-y-transparent border-r-[12px] border-r-emerald-300" /><span className="absolute left-1/2 top-4 -translate-x-1/2 text-sm text-emerald-500 font-black">SYN/ACK</span></div>
                            <div className="h-1.5 bg-blue-300 w-full relative"><div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-y-[8px] border-y-transparent border-l-[12px] border-l-blue-300" /><span className="absolute left-1/2 -top-8 -translate-x-1/2 text-sm text-blue-500 font-black">ACK</span></div>
                          </div>
                        ) : (
                          <div className="w-full relative h-1.5 bg-red-300 opacity-0 animate-[slideRight_0.4s_ease-out_forwards]" style={{ top: `${(line.id % 8) * 20 - 60}px` }}>
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-y-[8px] border-y-transparent border-l-[12px] border-l-red-300" />
                          </div>
                        )}
                      </div>
                    )
                  })}
                  
                  {/* Half-open counter bubble */}
                  <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center w-56 h-56 rounded-[4rem] bg-white/95 backdrop-blur-xl shadow-2xl transition-all duration-500 z-30 border-[8px]
                    ${simStep === 4 ? 'border-red-100 scale-110 shadow-red-200' : 'border-slate-50'}
                  `}>
                    <span className="text-base font-black text-slate-400 uppercase tracking-widest mb-2">Half-Open</span>
                    <span className={`text-7xl font-black font-mono transition-colors ${simStep === 4 ? 'text-red-500' : 'text-slate-800'}`}>{synCount}</span>
                  </div>
                </div>

                {/* Server */}
                <div className="flex flex-col items-center gap-8 z-20 relative">
                  <div className={`w-40 h-40 rounded-[3rem] flex items-center justify-center transition-all duration-500 border-4 relative
                    ${simStep === 4 ? 'bg-red-50 border-red-200 shadow-[0_0_80px_rgba(239,68,68,0.4)]' : 'bg-blue-50 border-blue-100 shadow-2xl'}
                  `}>
                    <Server className={`w-20 h-20 ${simStep === 4 ? 'text-red-500' : 'text-blue-600'}`} />
                    
                    {/* Stacked connection dots */}
                    {synCount > 0 && (
                      <div className="absolute -left-10 top-4 bottom-4 w-8 flex flex-col-reverse flex-wrap gap-2 content-start overflow-hidden">
                        {Array.from({length: Math.min(50, Math.floor(synCount / 10))}).map((_,i) => (
                          <div key={i} className="w-3 h-3 bg-red-400 rounded-full animate-[popIn_0.2s_ease-out]" />
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-lg font-black text-slate-400 uppercase tracking-widest bg-white px-6 py-2 rounded-full shadow-sm border border-slate-100">Server</span>
                </div>
              </div>
            )}

            {/* SCENARIO 4: AI */}
            {activeScen === 4 && (
              <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-center gap-24 relative z-10 scale-110">
                
                {/* Feature Pipeline */}
                <div className="flex flex-col gap-6 w-80 relative z-20">
                  {AI_FEATURES.map((feat, i) => {
                    const isActive = activeFeat === i;
                    const isDone = activeFeat > i;
                    return (
                      <div key={feat} className="relative">
                        <div className={`text-sm font-black uppercase tracking-widest px-6 py-4 rounded-2xl border-2 transition-all duration-300 flex items-center gap-4 relative z-10
                          ${isActive ? "bg-white border-blue-300 text-blue-600 shadow-xl scale-110" : isDone ? "bg-slate-50 border-slate-100 text-slate-400" : "bg-transparent border-transparent text-slate-300"}
                        `}>
                          <div className={`w-3 h-3 rounded-full ${isActive ? "bg-blue-500 animate-ping" : isDone ? "bg-slate-300" : "bg-slate-200"}`} />
                          {feat}
                        </div>
                        {/* Connecting Line */}
                        {isDone && (
                          <div className="absolute top-1/2 left-full w-40 h-1.5 bg-slate-200 -z-10 rounded-r-full" />
                        )}
                        {isActive && (
                          <div className="absolute top-1/2 left-full w-40 h-1.5 bg-gradient-to-r from-blue-400 to-transparent -z-10 rounded-r-full" />
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* AI Core */}
                <div className="relative z-20 flex-shrink-0 mx-12">
                  <div className={`w-80 h-80 rounded-[4rem] border-[12px] bg-white/95 backdrop-blur-2xl flex flex-col items-center justify-center shadow-2xl transition-all duration-700 relative z-20
                    ${simStep === 4 ? 'border-red-100 shadow-[0_0_100px_rgba(239,68,68,0.3)] scale-110' : 'border-blue-50 shadow-[0_0_80px_rgba(37,99,235,0.2)]'}
                  `}>
                    <Brain className={`w-28 h-28 mb-6 transition-colors duration-700 ${simStep === 4 ? 'text-red-500' : 'text-blue-600'}`} />
                    <span className="text-lg font-black text-slate-400 uppercase tracking-widest">AI Core</span>
                  </div>
                  {/* Pulse rings */}
                  {simStep > 0 && simStep < 4 && (
                    <>
                      <div className="absolute inset-0 rounded-[4rem] border-[6px] border-blue-400 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite] opacity-30 z-10" />
                      <div className="absolute inset-0 rounded-[4rem] border-[6px] border-blue-400 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] opacity-10 z-10" />
                    </>
                  )}
                </div>

                {/* Probability Bars */}
                <div className="w-96 flex flex-col gap-10 z-20 bg-white/90 backdrop-blur-xl p-10 rounded-[3rem] border border-slate-100 shadow-2xl">
                  <div>
                    <div className="flex justify-between text-sm font-black uppercase tracking-widest mb-4">
                      <span className="text-slate-400">Human Prob</span>
                      <span className="text-slate-700">{aiScores.human}%</span>
                    </div>
                    <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400 transition-all duration-300" style={{ width: `${aiScores.human}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm font-black uppercase tracking-widest mb-4">
                      <span className="text-slate-400">Bot Prob</span>
                      <span className="text-slate-700">{aiScores.bot}%</span>
                    </div>
                    <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-red-400 transition-all duration-300" style={{ width: `${aiScores.bot}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm font-black uppercase tracking-widest mb-4">
                      <span className="text-slate-400">AI Confidence</span>
                      <span className="text-blue-600">{aiScores.conf}%</span>
                    </div>
                    <div className="h-4 bg-blue-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${aiScores.conf}%` }} />
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ACTION BUTTONS (Floating Bottom Right inside stage) */}
            <div className="absolute bottom-10 right-10 z-50 flex items-center gap-6">
              <button 
                onClick={resetAll} 
                disabled={simStep === 0} 
                className="flex items-center justify-center w-20 h-20 bg-white/95 backdrop-blur text-slate-600 border-2 border-slate-200 rounded-[2rem] hover:bg-slate-50 hover:shadow-xl transition-all shadow-lg disabled:opacity-50 disabled:hover:shadow-lg"
                title="Reset Simulation"
              >
                <RotateCcw className="w-8 h-8" />
              </button>
              <button 
                onClick={runSim} 
                disabled={simStep !== 0} 
                className="flex items-center justify-center gap-4 bg-blue-600 text-white px-12 py-6 rounded-[2rem] font-black text-2xl hover:bg-blue-700 transition-all shadow-[0_12px_40px_0_rgba(37,99,235,0.4)] disabled:opacity-50 disabled:shadow-none"
              >
                <Play className="w-8 h-8 fill-current" /> Run Simulation
              </button>
            </div>

            {/* Bottom Result Pill (Floating over stage center) */}
            <div className={`absolute bottom-12 left-1/2 -translate-x-1/2 transition-all duration-500 z-50
              ${simStep === 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}
            `}>
              <div className="px-10 py-6 rounded-[3rem] bg-white/95 backdrop-blur-2xl border-2 border-red-100 shadow-[0_25px_60px_rgba(239,68,68,0.25)] flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center shrink-0 border border-red-100">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                <div>
                  <h4 className="text-2xl font-black text-slate-900 leading-none mb-2">{getResult().title}</h4>
                  <p className="text-base font-bold text-slate-500">{getResult().reason}</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* SCENARIO CARDS (Bottom Row) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-10 pb-12">
          
          <button onClick={() => changeScen(1)} className={`text-left p-10 lg:p-12 rounded-[3rem] border-[3px] transition-all duration-300 group
            ${activeScen === 1 ? 'bg-white border-blue-300 shadow-2xl shadow-blue-100/60 ring-4 ring-blue-50 -translate-y-2' : 'bg-white/60 border-slate-100 hover:bg-white hover:border-slate-200 shadow-md hover:shadow-2xl hover:-translate-y-2'}
          `}>
            <div className={`w-20 h-20 rounded-[2.5rem] flex items-center justify-center mb-8 transition-colors duration-300
              ${activeScen === 1 ? 'bg-blue-600 text-white shadow-2xl shadow-blue-200' : 'bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500'}
            `}>
              <Fingerprint className="w-10 h-10" />
            </div>
            <h3 className={`font-black text-2xl mb-3 tracking-tight ${activeScen === 1 ? 'text-slate-900' : 'text-slate-700'}`}>Signature Match</h3>
            <p className="text-base font-semibold text-slate-400 line-clamp-2 leading-relaxed">Detecting known attack patterns and static fingerprints.</p>
          </button>

          <button onClick={() => changeScen(2)} className={`text-left p-10 lg:p-12 rounded-[3rem] border-[3px] transition-all duration-300 group
            ${activeScen === 2 ? 'bg-white border-blue-300 shadow-2xl shadow-blue-100/60 ring-4 ring-blue-50 -translate-y-2' : 'bg-white/60 border-slate-100 hover:bg-white hover:border-slate-200 shadow-md hover:shadow-2xl hover:-translate-y-2'}
          `}>
            <div className={`w-20 h-20 rounded-[2.5rem] flex items-center justify-center mb-8 transition-colors duration-300
              ${activeScen === 2 ? 'bg-blue-600 text-white shadow-2xl shadow-blue-200' : 'bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500'}
            `}>
              <Activity className="w-10 h-10" />
            </div>
            <h3 className={`font-black text-2xl mb-3 tracking-tight ${activeScen === 2 ? 'text-slate-900' : 'text-slate-700'}`}>Anomaly Baseline</h3>
            <p className="text-base font-semibold text-slate-400 line-clamp-2 leading-relaxed">Identifying volumetric spikes above learned safe traffic levels.</p>
          </button>

          <button onClick={() => changeScen(3)} className={`text-left p-10 lg:p-12 rounded-[3rem] border-[3px] transition-all duration-300 group
            ${activeScen === 3 ? 'bg-white border-blue-300 shadow-2xl shadow-blue-100/60 ring-4 ring-blue-50 -translate-y-2' : 'bg-white/60 border-slate-100 hover:bg-white hover:border-slate-200 shadow-md hover:shadow-2xl hover:-translate-y-2'}
          `}>
            <div className={`w-20 h-20 rounded-[2.5rem] flex items-center justify-center mb-8 transition-colors duration-300
              ${activeScen === 3 ? 'bg-blue-600 text-white shadow-2xl shadow-blue-200' : 'bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500'}
            `}>
              <Network className="w-10 h-10" />
            </div>
            <h3 className={`font-black text-2xl mb-3 tracking-tight ${activeScen === 3 ? 'text-slate-900' : 'text-slate-700'}`}>Protocol Analysis</h3>
            <p className="text-base font-semibold text-slate-400 line-clamp-2 leading-relaxed">Analyzing incomplete handshakes and TCP connection abuse.</p>
          </button>

          <button onClick={() => changeScen(4)} className={`text-left p-10 lg:p-12 rounded-[3rem] border-[3px] transition-all duration-300 group
            ${activeScen === 4 ? 'bg-white border-blue-300 shadow-2xl shadow-blue-100/60 ring-4 ring-blue-50 -translate-y-2' : 'bg-white/60 border-slate-100 hover:bg-white hover:border-slate-200 shadow-md hover:shadow-2xl hover:-translate-y-2'}
          `}>
            <div className={`w-20 h-20 rounded-[2.5rem] flex items-center justify-center mb-8 transition-colors duration-300
              ${activeScen === 4 ? 'bg-blue-600 text-white shadow-2xl shadow-blue-200' : 'bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500'}
            `}>
              <Brain className="w-10 h-10" />
            </div>
            <h3 className={`font-black text-2xl mb-3 tracking-tight ${activeScen === 4 ? 'text-slate-900' : 'text-slate-700'}`}>AI & ML Engine</h3>
            <p className="text-base font-semibold text-slate-400 line-clamp-2 leading-relaxed">Behavioral classification to distinguish bots from human users.</p>
          </button>

        </div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scanBeam {
          0%, 100% { top: 10%; }
          50% { top: 90%; }
        }
        @keyframes slideRight {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
        @keyframes fadeInOut {
          0% { opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(360px) translateY(-50%) rotate(0deg); }
          25% { transform: translateX(355px) translateY(-50%) rotate(-3deg); }
          50% { transform: translateX(365px) translateY(-50%) rotate(3deg); }
          75% { transform: translateX(355px) translateY(-50%) rotate(-3deg); }
        }
        @keyframes popIn {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.3); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}} />
    </div>
  );
}
