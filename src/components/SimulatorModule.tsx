"use client";
import { useState, useEffect, useRef } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Play, Square, Wifi, AlertTriangle, Activity } from "lucide-react";

type Mode     = "dos" | "ddos";
type Protocol = "TCP SYN Flood" | "UDP Flood" | "HTTP GET Flood";
type Status   = "optimal" | "stressed" | "critical";
interface Pt   { t: string; cpu: number; bw: number; }

const genPt = (rps: number, running: boolean, prev?: Pt): Pt => {
  const target = running ? Math.min(97, (rps / 10000) * 93 + 4) : 4;
  const lastCpu = prev?.cpu ?? 4;
  const cpu = Math.max(0, Math.min(100, lastCpu * 0.6 + target * 0.4 + (Math.random() - 0.5) * 4));
  const bw  = running ? +((rps / 10000) * 9.4 + (Math.random() - 0.5) * 0.3).toFixed(2) : 0.02;
  return { t: new Date().toLocaleTimeString("en-US", { hour12: false }), cpu: +cpu.toFixed(1), bw: Math.max(0, bw) };
};

export default function SimulatorModule() {
  const [mode, setMode]     = useState<Mode>("dos");
  const [rps,  setRps]      = useState(0);
  const [proto,setProto]    = useState<Protocol>("TCP SYN Flood");
  const [running, setRunning] = useState(false);
  const [data, setData]     = useState<Pt[]>(() =>
    Array.from({ length: 20 }, () => ({ t: "--:--:--", cpu: 4, bw: 0.02 }))
  );

  const rpsRef     = useRef(rps);
  const runningRef = useRef(running);
  useEffect(() => { rpsRef.current = rps; },     [rps]);
  useEffect(() => { runningRef.current = running; }, [running]);

  useEffect(() => {
    const id = setInterval(() => {
      setData(prev => {
        const last = prev[prev.length - 1];
        return [...prev.slice(-29), genPt(rpsRef.current, runningRef.current, last)];
      });
    }, 800);
    return () => clearInterval(id);
  }, []);

  const status: Status = running && rps > 5000 ? "critical" : running && rps > 1000 ? "stressed" : "optimal";

  const statusCfg = {
    optimal:  { label: "OPERATIONAL",           ring: "ring-emerald-500", bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400", icon: "🖥️",  pulse: "animate-pulse-green" },
    stressed: { label: "OVERLOADED / LAGGING",  ring: "ring-yellow-500",  bg: "bg-yellow-500/10",  text: "text-yellow-400",  dot: "bg-yellow-400",  icon: "⚠️",  pulse: "animate-pulse" },
    critical: { label: "DOWN — 503 ERROR",      ring: "ring-rose-500",    bg: "bg-rose-500/10",    text: "text-rose-400",    dot: "bg-rose-500",    icon: "💀",  pulse: "animate-pulse-red" },
  };
  const sc = statusCfg[status];

  const stop = () => { setRunning(false); setRps(0); };

  return (
    <div className="space-y-6">
      {/* ── Title row ── */}
      <div>
        <h2 className="text-2xl font-black text-white">
          <span className="text-cyan-400">Live</span> Attack Simulator
        </h2>
        <p className="text-slate-500 text-sm mt-1">Gamified real-time DoS / DDoS demonstration against a virtual server</p>
      </div>

      {/* ── Mode toggle ── */}
      <div className="flex gap-2">
        {(["dos", "ddos"] as Mode[]).map(m => (
          <button key={m} onClick={() => setMode(m)}
            className={`px-5 py-2.5 rounded-lg font-bold text-sm border transition-all duration-200
              ${mode === m
                ? "bg-cyan-500/20 border-cyan-500/60 text-cyan-300"
                : "bg-slate-900 border-slate-700 text-slate-500 hover:text-slate-300"}`}>
            {m === "dos" ? "⚡ DoS — Single Source" : "🌐 DDoS — Distributed Botnet"}
          </button>
        ))}
      </div>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Controls ── */}
        <div className="glass-panel p-6 flex flex-col gap-5">
          <h3 className="text-cyan-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            <Wifi className="w-4 h-4" /> Attack Controls
          </h3>

          {/* RPS Slider */}
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-slate-400">Requests / Second</span>
              <span className="font-mono font-bold text-cyan-300">{rps.toLocaleString()} req/s</span>
            </div>
            <input type="range" min={0} max={10000} step={100} value={rps}
              onChange={e => setRps(+e.target.value)} className="w-full accent-cyan-400" />
            <div className="mt-2 h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${(rps / 10000) * 100}%`, background: rps > 5000 ? "#f43f5e" : rps > 1000 ? "#fbbf24" : "#22d3ee" }} />
            </div>
          </div>

          {/* Protocol */}
          <div>
            <label className="text-slate-400 text-xs block mb-1.5">Attack Protocol</label>
            <select value={proto} onChange={e => setProto(e.target.value as Protocol)}
              className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500">
              <option>TCP SYN Flood</option>
              <option>UDP Flood</option>
              <option>HTTP GET Flood</option>
            </select>
            <p className="text-slate-600 text-xs mt-2 leading-relaxed">
              {proto === "TCP SYN Flood" && "Exploits TCP handshake — half-open connection exhaustion."}
              {proto === "UDP Flood"     && "Stateless UDP packets overwhelm server reply buffers."}
              {proto === "HTTP GET Flood"&& "Layer-7 valid requests exhaust web-server thread pools."}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-auto">
            <button onClick={() => setRunning(true)} disabled={running}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold
                bg-rose-500/20 border border-rose-500/50 text-rose-300 hover:bg-rose-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              <Play className="w-4 h-4" /> Launch
            </button>
            <button onClick={stop}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold
                bg-slate-700/50 border border-slate-600 text-slate-300 hover:bg-slate-600/50 transition-all">
              <Square className="w-4 h-4" /> Cease
            </button>
          </div>
        </div>

        {/* ── Server Status ── */}
        <div className={`glass-panel p-6 flex flex-col items-center gap-4 justify-center ${status === "critical" ? "animate-critical" : ""}`}>
          <h3 className="text-cyan-400 text-xs font-bold uppercase tracking-widest self-start">Target Server</h3>

          {/* Source nodes for mode */}
          <div className="w-full">
            {mode === "dos" ? (
              <div className="flex justify-center mb-3">
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-lg
                  ${running ? "border-rose-500 bg-rose-500/20 animate-pulse-red" : "border-slate-600 bg-slate-800"}`}>👤</div>
              </div>
            ) : (
              <div className="grid grid-cols-5 gap-1 justify-items-center mb-3">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className={`w-7 h-7 rounded border flex items-center justify-center text-xs
                    ${running ? "border-rose-500/60 bg-rose-500/10 text-rose-400" : "border-slate-700 bg-slate-800 text-slate-600"}`}
                    style={{ animationDelay: `${i * 0.15}s` }}>🖥</div>
                ))}
              </div>
            )}
            {running && <div className="text-center text-xs text-rose-400 font-mono mb-2 animate-pulse">▼ FLOOD ▼</div>}
          </div>

          {/* Server icon */}
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl ring-2 ${sc.ring} ${sc.bg}`}>
            {sc.icon}
          </div>

          <div className={`px-4 py-1.5 rounded-full border text-xs font-bold ${sc.text} border-current`}>
            {sc.label}
          </div>

          {/* KPIs */}
          <div className="w-full grid grid-cols-2 gap-2 text-xs">
            {[
              { label: "CPU Load",   value: `${data[data.length-1]?.cpu.toFixed(0) ?? 0}%`,  alert: (data[data.length-1]?.cpu ?? 0) > 80 },
              { label: "Bandwidth",  value: `${data[data.length-1]?.bw.toFixed(2) ?? 0} Gbps`, alert: (data[data.length-1]?.bw ?? 0) > 5 },
              { label: "RPS",        value: running ? rps.toLocaleString() : "0",              alert: rps > 5000 },
              { label: "Status",     value: status.toUpperCase(),                               alert: status !== "optimal" },
            ].map(k => (
              <div key={k.label} className={`rounded-lg p-2 border ${k.alert ? "bg-rose-500/10 border-rose-500/30 text-rose-300" : "bg-slate-800/60 border-slate-700 text-slate-300"}`}>
                <div className="text-slate-500 mb-0.5">{k.label}</div>
                <div className="font-mono font-bold">{k.value}</div>
              </div>
            ))}
          </div>

          {status === "critical" && (
            <div className="w-full flex items-center gap-2 p-2 rounded-lg bg-rose-500/20 border border-rose-500/40">
              <AlertTriangle className="w-3 h-3 text-rose-400 flex-shrink-0" />
              <span className="text-rose-300 text-xs font-bold">HTTP 503 — Service Unavailable</span>
            </div>
          )}
        </div>

        {/* ── Live Chart ── */}
        <div className="glass-panel p-6 flex flex-col gap-3">
          <h3 className="text-cyan-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            <Activity className="w-4 h-4" /> Live Telemetry
          </h3>
          <div className="flex gap-4 text-xs">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />CPU %</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-400 inline-block" />BW Gbps</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="gCpu" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#22d3ee" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gBw" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#f43f5e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="t" tick={{ fill: "#475569", fontSize: 9 }} interval={4} />
              <YAxis tick={{ fill: "#475569", fontSize: 10 }} domain={[0, 100]} />
              {/* @ts-ignore */}
              <Tooltip
                contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, fontSize: 11 }}
                formatter={(value: any) => [typeof value === "number" ? value.toFixed(1) : value]}
              />
              <Area type="monotone" dataKey="cpu" stroke="#22d3ee" strokeWidth={2} fill="url(#gCpu)" dot={false} isAnimationActive={false} />
              <Area type="monotone" dataKey="bw"  stroke="#f43f5e" strokeWidth={2} fill="url(#gBw)"  dot={false} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
          <p className="text-slate-600 text-xs text-center">Refreshes every 800ms · Last 30 samples</p>
        </div>
      </div>
    </div>
  );
}
