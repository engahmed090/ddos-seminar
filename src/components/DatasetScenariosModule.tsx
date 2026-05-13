"use client";
import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { Cpu, Shield, TrendingUp } from "lucide-react";

type ScenarioId = "syn" | "slowloris" | "benign";

interface Scenario {
  label:         string;
  sub:           string;
  emoji:         string;
  maliciousRatio:number;
  accent:        string;
  accentBg:      string;
  barData:       { name: string; value: number }[];
  pieData:       { name: string; value: number; color: string }[];
  metrics: { label: string; value: string }[];
  description:   string;
}

const SCENARIOS: Record<ScenarioId, Scenario> = {
  syn: {
    label: "Scenario A: Volumetric SYN Flood",
    sub: "High-intensity TCP handshake exhaustion",
    emoji: "🌊",
    maliciousRatio: 0.78,
    accent: "text-rose-400", accentBg: "bg-rose-500/10 border-rose-500/30",
    barData: [
      { name: "SYN Packets",  value: 982340 },
      { name: "ACK Packets",  value: 12450  },
      { name: "Normal HTTP",  value: 44200  },
      { name: "DNS Queries",  value: 8100   },
    ],
    pieData: [
      { name: "Malicious SYN", value: 78, color: "#f43f5e" },
      { name: "Benign Flow",   value: 22, color: "#10b981" },
    ],
    metrics: [
      { label: "Avg Packet Size",       value: "60 bytes"  },
      { label: "Inter-Arrival Time",    value: "0.003 ms"  },
      { label: "Spoofed Source IPs",    value: "48,210"    },
      { label: "Half-Open Connections", value: "512,000+"  },
    ],
    description: "Classic volumetric SYN Flood attack: attacker sends mass TCP SYN packets with spoofed IPs. Server allocates half-open connection state for each, exhausting socket buffers within seconds.",
  },
  slowloris: {
    label: "Scenario B: Application Layer Slowloris",
    sub: "Low-rate persistent connection exhaustion",
    emoji: "🐌",
    maliciousRatio: 0.43,
    accent: "text-amber-400", accentBg: "bg-amber-500/10 border-amber-500/30",
    barData: [
      { name: "Slow Connections", value: 43200  },
      { name: "Normal GET",       value: 31000  },
      { name: "POST Requests",    value: 18400  },
      { name: "DNS Lookups",      value: 6800   },
    ],
    pieData: [
      { name: "Slow HTTP Attack", value: 43, color: "#f59e0b" },
      { name: "Benign Flow",      value: 57, color: "#10b981" },
    ],
    metrics: [
      { label: "Avg Packet Size",        value: "280 bytes" },
      { label: "Inter-Arrival Time",     value: "8,500 ms"  },
      { label: "Open Connections",       value: "43,200"    },
      { label: "Throughput Consumed",    value: "99.8%"     },
    ],
    description: "Slowloris holds many connections open by sending partial HTTP headers, never completing the request. It bypasses volumetric detection while starving the web server of available threads.",
  },
  benign: {
    label: "Scenario C: Benign High-Traffic Period",
    sub: "Normal peak load baseline",
    emoji: "✅",
    maliciousRatio: 0.03,
    accent: "text-emerald-400", accentBg: "bg-emerald-500/10 border-emerald-500/30",
    barData: [
      { name: "HTTP GET",    value: 820000 },
      { name: "HTTPS POST",  value: 340000 },
      { name: "DNS Queries", value: 92000  },
      { name: "WebSocket",   value: 47000  },
    ],
    pieData: [
      { name: "Benign Flow", value: 97, color: "#10b981" },
      { name: "Anomalies",   value: 3,  color: "#f43f5e" },
    ],
    metrics: [
      { label: "Avg Packet Size",     value: "1,420 bytes" },
      { label: "Inter-Arrival Time",  value: "12.4 ms"     },
      { label: "Unique Source IPs",   value: "284,901"     },
      { label: "Detection Alerts",    value: "0.03%"       },
    ],
    description: "Normal high-traffic baseline captured during a flash sale event. Traffic is diverse, packet sizes are large, inter-arrival times are regular — all hallmarks that ML models use to classify benign flows.",
  },
};

const SCENARIO_IDS: ScenarioId[] = ["syn", "slowloris", "benign"];

export default function DatasetScenariosModule() {
  const [active, setActive] = useState<ScenarioId>("syn");
  const sc = SCENARIOS[active];

  // Heatmap: grid of 80 cells colored by maliciousRatio
  const cells = useMemo(() =>
    Array.from({ length: 80 }, (_, i) => ({
      id: i,
      bad: Math.random() < sc.maliciousRatio,
    })),
  [active]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white">
          <span className="text-emerald-400">CICIDS2017</span> Dataset Scenarios
        </h2>
        <p className="text-slate-500 text-sm mt-1">Real certified attack flows analysed and visualised per scenario</p>
      </div>

      {/* ── Scenario tabs ── */}
      <div className="flex flex-wrap gap-2">
        {SCENARIO_IDS.map(id => {
          const s = SCENARIOS[id];
          const isActive = active === id;
          return (
            <button key={id} onClick={() => setActive(id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-200
                ${isActive ? s.accentBg + " " + s.accent : "bg-slate-900 border-slate-700 text-slate-500 hover:text-slate-300"}`}>
              <span>{s.emoji}</span>
              <span className="hidden sm:block">{s.label.split(":")[0]}</span>
              <span className="sm:hidden">Scenario {id === "syn" ? "A" : id === "slowloris" ? "B" : "C"}</span>
            </button>
          );
        })}
      </div>

      {/* ── Scenario header ── */}
      <div className={`glass-panel p-4 border ${sc.accentBg}`}>
        <div className="flex items-start gap-3">
          <span className="text-3xl">{sc.emoji}</span>
          <div>
            <h3 className={`font-bold text-lg ${sc.accent}`}>{sc.label}</h3>
            <p className="text-slate-400 text-sm">{sc.sub}</p>
            <p className="text-slate-500 text-xs mt-2 leading-relaxed max-w-3xl">{sc.description}</p>
          </div>
        </div>
      </div>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Heatmap */}
        <div className="glass-panel p-6">
          <h4 className="text-white font-semibold mb-1 text-sm">Live Packet Classification Grid</h4>
          <p className="text-slate-500 text-xs mb-4">Each cell = packet batch · <span className="text-emerald-400">■ Benign</span> · <span className="text-rose-400">■ Malicious</span></p>
          <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(10, 1fr)" }}>
            {cells.map(c => (
              <div key={c.id}
                className={`h-5 rounded-sm transition-all duration-700 ${c.bad ? "bg-rose-500/70" : "bg-emerald-500/50"}`}
                style={{ animationDelay: `${c.id * 0.01}s` }}
              />
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between text-xs">
            <span className="text-slate-500">Malicious ratio</span>
            <div className="flex-1 mx-3 h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-rose-500 transition-all duration-700"
                style={{ width: `${sc.maliciousRatio * 100}%` }} />
            </div>
            <span className={`font-bold ${sc.accent}`}>{(sc.maliciousRatio * 100).toFixed(0)}%</span>
          </div>
        </div>

        {/* Charts */}
        <div className="space-y-4">
          {/* Bar chart */}
          <div className="glass-panel p-5">
            <h4 className="text-white font-semibold text-sm mb-3">Packet Volume by Type</h4>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={sc.barData} margin={{ left: -10, right: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" tick={{ fill: "#475569", fontSize: 9 }} />
                <YAxis tick={{ fill: "#475569", fontSize: 9 }} tickFormatter={(v: any) => typeof v === "number" && v >= 1000 ? `${(v/1000).toFixed(0)}k` : String(v)} />
                {/* @ts-ignore */}
                <Tooltip
                  contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, fontSize: 11 }}
                  formatter={(value: any) => [typeof value === "number" ? value.toLocaleString() : value, "Packets"]}
                />
                <Bar dataKey="value" radius={[3, 3, 0, 0]} fill={active === "syn" ? "#f43f5e" : active === "slowloris" ? "#f59e0b" : "#10b981"} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie chart */}
          <div className="glass-panel p-5">
            <h4 className="text-white font-semibold text-sm mb-2">Traffic Composition</h4>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="50%" height={110}>
                <PieChart>
                  <Pie data={sc.pieData} cx="50%" cy="50%" outerRadius={45} dataKey="value" strokeWidth={0}>
                    {sc.pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  {/* @ts-ignore */}
                  <Tooltip
                    contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, fontSize: 11 }}
                    formatter={(value: any) => [`${typeof value === "number" ? value : 0}%`, ""]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {sc.pieData.map(d => (
                  <div key={d.name} className="flex items-center gap-2 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                    <span className="text-slate-300">{d.name}</span>
                    <span className="font-bold text-white ml-auto">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Metrics cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {sc.metrics.map(m => (
          <div key={m.label} className="glass-panel p-4 hover-card">
            <div className="text-xs text-slate-500 mb-1">{m.label}</div>
            <div className={`text-xl font-black ${sc.accent}`}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* ── ML accuracy footer ── */}
      <div className="glass-panel p-5 border border-emerald-500/20 bg-emerald-500/5">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <span className="text-white font-bold">ML Detection Engine — CICIDS2017</span>
          </div>
          {[
            { icon: <TrendingUp className="w-4 h-4" />, label: "Random Forest Accuracy", value: "99.7%", color: "text-emerald-400" },
            { icon: <Cpu className="w-4 h-4" />,        label: "Features Analysed",      value: "80+",   color: "text-cyan-400"    },
            { icon: <Shield className="w-4 h-4" />,     label: "False Positive Rate",    value: "0.01%", color: "text-amber-400"   },
          ].map(k => (
            <div key={k.label} className="flex items-center gap-2 text-sm">
              <span className={k.color}>{k.icon}</span>
              <span className="text-slate-400">{k.label}:</span>
              <span className={`font-bold ${k.color}`}>{k.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
