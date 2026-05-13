"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { Play, Square, AlertTriangle, Wifi } from "lucide-react";

type AttackType = "SYN Flood" | "UDP Flood" | "HTTP Flood";
type ServerStatus = "normal" | "overloaded" | "critical";

interface DataPoint {
  t: string;
  cpu: number;
  bw: number;
}

function genPoint(rps: number, running: boolean, prev: DataPoint | undefined): DataPoint {
  const base = running ? Math.min(100, (rps / 10000) * 100) : 5;
  const noise = () => (Math.random() - 0.5) * 8;
  const cpu = Math.max(0, Math.min(100, (prev ? prev.cpu * 0.7 + base * 0.3 : base) + noise()));
  const bw  = Math.max(0, Math.min(1000, (running ? (rps / 10000) * 980 : 10) + (Math.random() - 0.5) * 20));
  return { t: new Date().toLocaleTimeString("en-US", { hour12: false }), cpu: +cpu.toFixed(1), bw: +bw.toFixed(1) };
}

export default function SimulationModule() {
  const [rps, setRps] = useState(0);
  const [attackType, setAttackType] = useState<AttackType>("SYN Flood");
  const [running, setRunning] = useState(false);
  const [data, setData] = useState<DataPoint[]>(() =>
    Array.from({ length: 20 }, (_, i) => ({ t: `T-${20-i}`, cpu: 5, bw: 10 }))
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const status: ServerStatus = rps > 5000 && running ? "critical" : rps > 1000 && running ? "overloaded" : "normal";

  const tick = useCallback(() => {
    setData(prev => {
      const last = prev[prev.length - 1];
      const next = genPoint(rps, running, last);
      return [...prev.slice(-29), next];
    });
  }, [rps, running]);

  useEffect(() => {
    intervalRef.current = setInterval(tick, 800);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [tick]);

  const launch = () => setRunning(true);
  const stop = () => { setRunning(false); setRps(0); };

  const statusConfig = {
    normal:     { label: "OPERATIONAL",         badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40", server: "animate-pulse-green", icon: "🟢", msg: "All systems nominal" },
    overloaded: { label: "OVERLOADED / LAGGING", badge: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",   server: "animate-pulse",       icon: "🟡", msg: "Response times degrading" },
    critical:   { label: "SERVER DOWN — 503",   badge: "bg-red-500/20 text-red-300 border-red-500/60",            server: "animate-pulse-red animate-server-shake", icon: "🔴", msg: "Service unavailable" },
  };
  const sc = statusConfig[status];

  return (
    <section id="simulation" className="max-w-6xl mx-auto px-4 py-20 section-enter">
      <div className="text-center mb-12">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 mb-4">MODULE 2 · LIVE SIMULATION</span>
        <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
          Attack <span className="gradient-text-red">Simulator</span>
        </h2>
        <p className="text-slate-400 text-lg">Gamified real-time DDoS demonstration dashboard</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="glass-panel p-6 flex flex-col gap-6">
          <h3 className="text-cyan-400 font-bold uppercase tracking-widest text-sm flex items-center gap-2">
            <Wifi className="w-4 h-4" /> Attack Controls
          </h3>

          {/* RPS Slider */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-400">Requests / Second</span>
              <span className="text-cyan-300 font-mono font-bold">{rps.toLocaleString()} req/s</span>
            </div>
            <input type="range" min={0} max={10000} step={100} value={rps}
              onChange={e => setRps(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>0</span><span>5k</span><span>10k</span>
            </div>
            {/* Intensity bar */}
            <div className="mt-3 h-2 rounded-full bg-slate-700 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(rps/10000)*100}%`,
                  background: rps > 5000 ? "#ff2244" : rps > 1000 ? "#fbbf24" : "#00d4ff"
                }}
              />
            </div>
          </div>

          {/* Attack type */}
          <div>
            <label className="text-slate-400 text-sm mb-2 block">Attack Type</label>
            <select value={attackType} onChange={e => setAttackType(e.target.value as AttackType)}
              className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500">
              <option>SYN Flood</option>
              <option>UDP Flood</option>
              <option>HTTP Flood</option>
            </select>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button onClick={launch} disabled={running}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition-all duration-200
                bg-red-500/20 border border-red-500/50 text-red-300 hover:bg-red-500/30 disabled:opacity-40 disabled:cursor-not-allowed">
              <Play className="w-4 h-4" /> Launch
            </button>
            <button onClick={stop}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition-all duration-200
                bg-slate-700/50 border border-slate-600 text-slate-300 hover:bg-slate-600/50">
              <Square className="w-4 h-4" /> Stop
            </button>
          </div>

          {/* Attack type info */}
          <div className="text-xs text-slate-500 bg-slate-800/50 rounded-lg p-3 leading-relaxed">
            {attackType === "SYN Flood" && "Exploits TCP 3-way handshake. Sends SYN packets with spoofed IPs. Server allocates half-open connections until resources exhaust."}
            {attackType === "UDP Flood" && "Sends large volumes of UDP packets to random ports. Forces the server to process and reply with ICMP Destination Unreachable messages."}
            {attackType === "HTTP Flood" && "Layer-7 attack. Sends seemingly valid HTTP GET/POST requests. Bypasses simple network-level defenses. Exhausts web server threads."}
          </div>
        </div>

        {/* Server Status */}
        <div className={`glass-panel p-6 flex flex-col items-center justify-center gap-5 ${status === "critical" ? "animate-critical" : ""}`}>
          <h3 className="text-cyan-400 font-bold uppercase tracking-widest text-sm self-start">Target Server State</h3>
          <div className={`w-24 h-24 rounded-2xl bg-slate-800 border-2 flex items-center justify-center text-5xl ${sc.server} 
            ${status === "normal" ? "border-emerald-500" : status === "overloaded" ? "border-yellow-500" : "border-red-500"}`}>
            {status === "critical" ? "💀" : status === "overloaded" ? "⚠️" : "🖥️"}
          </div>

          <div className={`px-4 py-2 rounded-full border text-sm font-bold ${sc.badge}`}>
            {sc.icon} {sc.label}
          </div>
          <p className="text-slate-400 text-sm text-center">{sc.msg}</p>

          {/* Live KPIs */}
          <div className="w-full grid grid-cols-2 gap-3">
            {[
              { label: "CPU Load", value: `${data[data.length-1]?.cpu ?? 0}%`, alert: (data[data.length-1]?.cpu ?? 0) > 80 },
              { label: "Bandwidth", value: `${data[data.length-1]?.bw ?? 0} Mbps`, alert: (data[data.length-1]?.bw ?? 0) > 500 },
              { label: "RPS", value: running ? rps.toLocaleString() : "0", alert: rps > 5000 },
              { label: "Status", value: status.toUpperCase(), alert: status !== "normal" },
            ].map(k => (
              <div key={k.label} className={`rounded-lg p-3 border ${k.alert ? "bg-red-500/10 border-red-500/30" : "bg-slate-800/50 border-slate-700"}`}>
                <div className="text-xs text-slate-500 mb-1">{k.label}</div>
                <div className={`text-sm font-mono font-bold ${k.alert ? "text-red-400" : "text-white"}`}>{k.value}</div>
              </div>
            ))}
          </div>

          {status === "critical" && (
            <div className="w-full flex items-center gap-2 p-3 rounded-lg bg-red-500/20 border border-red-500/50">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span className="text-red-300 text-xs font-bold">503 SERVICE UNAVAILABLE — Server is Down</span>
            </div>
          )}
        </div>

        {/* Telemetry Chart */}
        <div className="glass-panel p-6 flex flex-col gap-4">
          <h3 className="text-cyan-400 font-bold uppercase tracking-widest text-sm">Live Telemetry</h3>
          <div className="flex-1" style={{ minHeight: 240 }}>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="t" tick={{ fill: "#475569", fontSize: 9 }} interval={4} />
                <YAxis tick={{ fill: "#475569", fontSize: 10 }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ background: "#0d1b35", border: "1px solid #1e3a5f", borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: "#94a3b8" }}
                />
                <Legend wrapperStyle={{ fontSize: 11, color: "#94a3b8" }} />
                <Line type="monotone" dataKey="cpu" name="CPU %" stroke="#00d4ff" strokeWidth={2} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="bw"  name="BW Mbps" stroke="#ff2244" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-xs text-slate-500 text-center">Auto-refreshes every 800ms · Last 30 data points</div>
        </div>
      </div>
    </section>
  );
}
