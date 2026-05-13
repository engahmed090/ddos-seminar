"use client";
import { useState } from "react";
import { Shield, Zap, Globe, Eye, Filter, CheckCircle, XCircle } from "lucide-react";

interface DefenseLayer {
  id:      string;
  label:   string;
  icon:    React.ReactNode;
  color:   string;
  accentBg:string;
  border:  string;
  reduction: number; // % of malicious traffic it blocks
  description: string;
  tech: string;
}

const LAYERS: DefenseLayer[] = [
  {
    id: "anycast", label: "Anycast Distributed Routing", icon: <Globe className="w-5 h-5" />,
    color: "text-cyan-400", accentBg: "bg-cyan-500/10", border: "border-cyan-500/40",
    reduction: 35,
    description: "Routes attack traffic to the nearest PoP (Point of Presence) globally. Distributes volumetric load across 200+ edge nodes, preventing any single origin from being overwhelmed.",
    tech: "BGP Anycast, GeoDNS, 200+ PoPs",
  },
  {
    id: "ratelimit", label: "Hardware Rate Limiting", icon: <Zap className="w-5 h-5" />,
    color: "text-amber-400", accentBg: "bg-amber-500/10", border: "border-amber-500/40",
    reduction: 30,
    description: "Line-rate packet processing at the network edge. Enforces per-IP and per-subnet request quotas. SYN cookies eliminate half-open connection exhaustion attacks.",
    tech: "ASIC line-rate, SYN cookies, ACL burst limits",
  },
  {
    id: "waf", label: "Web Application Firewall (WAF)", icon: <Shield className="w-5 h-5" />,
    color: "text-emerald-400", accentBg: "bg-emerald-500/10", border: "border-emerald-500/40",
    reduction: 20,
    description: "Layer-7 inspection engine that challenges suspicious clients with CAPTCHA, JS probes, or cookie validation. Blocks HTTP floods, Slowloris, and credential stuffing.",
    tech: "OWASP CRS 3.3, CAPTCHA, JS challenge",
  },
  {
    id: "dpi", label: "Deep Packet Inspection & Blackholing", icon: <Eye className="w-5 h-5" />,
    color: "text-purple-400", accentBg: "bg-purple-500/10", border: "border-purple-500/40",
    reduction: 15,
    description: "Full payload inspection to detect DDoS botnet signatures and C2 command patterns. Confirmed attack sources are null-routed via BGP blackhole communities with upstream ISPs.",
    tech: "DPI engines, BGP null-route, FlowSpec",
  },
];

export default function MitigationModule() {
  const [active, setActive] = useState<Record<string, boolean>>({
    anycast: false, ratelimit: false, waf: false, dpi: false,
  });

  const toggle = (id: string) => setActive(prev => ({ ...prev, [id]: !prev[id] }));

  const totalReduction = LAYERS.reduce((sum, l) => active[l.id] ? sum + l.reduction : sum, 0);
  const maliciousThrough = Math.max(0, 100 - totalReduction);
  const activeCount = Object.values(active).filter(Boolean).length;

  const pipelineColor =
    maliciousThrough > 70 ? { bar: "bg-rose-500", text: "text-rose-400", label: "CRITICAL — Server Exposed" } :
    maliciousThrough > 40 ? { bar: "bg-amber-500", text: "text-amber-400", label: "WARNING — Partially Protected" } :
    maliciousThrough > 10 ? { bar: "bg-yellow-400", text: "text-yellow-400", label: "GUARDED — Mostly Filtered" } :
                            { bar: "bg-emerald-500", text: "text-emerald-400", label: "SECURE — Attack Neutralised" };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white">
          Proactive <span className="text-rose-400">Mitigation</span> &amp; Defense Matrix
        </h2>
        <p className="text-slate-500 text-sm mt-1">Toggle defense layers to see how modern networks neutralise DoS/DDoS attacks in real-time</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Toggle Panel ── */}
        <div className="glass-panel p-6 flex flex-col gap-4">
          <h3 className="text-rose-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            <Filter className="w-4 h-4" /> Defense Layers
            <span className="ml-auto text-slate-400 font-normal">{activeCount}/4 active</span>
          </h3>

          {LAYERS.map(l => {
            const on = active[l.id];
            return (
              <div key={l.id}
                className={`rounded-xl border p-4 cursor-pointer transition-all duration-300
                  ${on ? l.accentBg + " " + l.border : "bg-slate-900 border-slate-700 hover:border-slate-600"}`}
                onClick={() => toggle(l.id)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={on ? l.color : "text-slate-500"}>{l.icon}</span>
                    <span className={`font-semibold text-sm ${on ? l.color : "text-slate-400"}`}>{l.label}</span>
                  </div>
                  {/* Toggle pill */}
                  <div className={`w-10 h-5 rounded-full transition-all duration-300 flex items-center px-0.5
                    ${on ? "bg-emerald-500 justify-end" : "bg-slate-700 justify-start"}`}>
                    <div className="w-4 h-4 rounded-full bg-white shadow" />
                  </div>
                </div>
                {on && (
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{l.tech}</p>
                )}
                <div className="mt-2 flex items-center gap-1 text-xs">
                  {on
                    ? <><CheckCircle className="w-3 h-3 text-emerald-400" /><span className="text-emerald-400 font-semibold">Blocks ~{l.reduction}% attack traffic</span></>
                    : <><XCircle   className="w-3 h-3 text-slate-600" /><span className="text-slate-600">Inactive</span></>
                  }
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Pipeline Visualiser ── */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Traffic pipeline */}
          <div className="glass-panel p-6">
            <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
              <Filter className="w-4 h-4 text-rose-400" /> Live Traffic Pipeline
            </h3>

            {/* Attack input */}
            <div className="flex items-center gap-3 mb-4">
              <div className="px-3 py-2 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                ATTACK TRAFFIC — 100 Gbps
              </div>
              <div className="flex-1 h-px bg-rose-500/30" />
              <span className="text-slate-500 text-xs">→</span>
            </div>

            {/* Layer pipeline */}
            <div className="space-y-2 mb-4">
              {LAYERS.map((l, i) => {
                const on = active[l.id];
                const cumulativeBlocked = LAYERS.slice(0, i + 1).reduce((s, x) => active[x.id] ? s + x.reduction : s, 0);
                const passing = Math.max(0, 100 - cumulativeBlocked);
                return (
                  <div key={l.id} className="flex items-center gap-3">
                    <div className={`w-32 text-xs font-semibold flex-shrink-0 ${on ? l.color : "text-slate-600"}`}>
                      {l.label.split(" ").slice(0, 2).join(" ")}
                    </div>
                    <div className="flex-1 h-6 rounded-full bg-slate-800 overflow-hidden relative">
                      {/* Pass-through bar */}
                      <div className="h-full rounded-full transition-all duration-700 flex items-center justify-end pr-2"
                        style={{ width: `${passing}%`, background: on ? "#10b981" : "#1e293b" }}>
                        {on && <span className="text-white text-[10px] font-bold">{passing.toFixed(0)}%</span>}
                      </div>
                      {/* Blocked overlay */}
                      {on && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2"
                          style={{ width: `${100 - passing}%` }}>
                          <span className="text-rose-300 text-[10px] font-bold ml-auto">-{l.reduction}%</span>
                        </div>
                      )}
                    </div>
                    <div className={`w-16 text-xs text-right ${on ? "text-emerald-400 font-bold" : "text-slate-600"}`}>
                      {on ? "✓ ACTIVE" : "— OFF"}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Server receiving */}
            <div className="border-t border-white/5 pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm font-medium">Malicious Traffic Reaching Server</span>
                <span className={`text-xl font-black ${pipelineColor.text}`}>{maliciousThrough.toFixed(0)}%</span>
              </div>
              <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-700 ${pipelineColor.bar}`}
                  style={{ width: `${maliciousThrough}%` }} />
              </div>
              <div className={`text-xs font-bold mt-2 ${pipelineColor.text}`}>{pipelineColor.label}</div>
            </div>

            {/* Server icon */}
            <div className={`mt-4 flex items-center gap-3 p-3 rounded-xl border transition-all duration-700
              ${maliciousThrough < 10 ? "bg-emerald-500/10 border-emerald-500/30" : maliciousThrough > 70 ? "bg-rose-500/10 border-rose-500/30" : "bg-amber-500/10 border-amber-500/30"}`}>
              <span className="text-2xl">{maliciousThrough < 10 ? "🖥️" : maliciousThrough > 70 ? "💀" : "⚠️"}</span>
              <div>
                <div className={`font-bold text-sm ${maliciousThrough < 10 ? "text-emerald-300" : maliciousThrough > 70 ? "text-rose-300" : "text-amber-300"}`}>
                  {maliciousThrough < 10 ? "Server: Fully Protected" : maliciousThrough > 70 ? "Server: Under Heavy Attack" : "Server: Partially Defended"}
                </div>
                <div className="text-slate-500 text-xs">{activeCount} of 4 defense layers active · {(100 - maliciousThrough).toFixed(0)}% traffic scrubbed</div>
              </div>
            </div>
          </div>

          {/* ── Tech Cards grid ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {LAYERS.map(l => (
              <div key={l.id} className={`glass-panel p-5 border transition-all duration-300 hover-card
                ${active[l.id] ? l.accentBg + " " + l.border : "border-slate-800"}`}>
                <div className={`mb-3 ${active[l.id] ? l.color : "text-slate-500"}`}>{l.icon}</div>
                <h4 className={`font-bold text-sm mb-1 ${active[l.id] ? l.color : "text-slate-400"}`}>{l.label}</h4>
                <p className="text-slate-500 text-xs leading-relaxed">{l.description}</p>
                <div className="mt-2 text-xs font-mono text-slate-600">{l.tech}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
