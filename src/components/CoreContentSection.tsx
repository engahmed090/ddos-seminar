"use client";
import { useState } from "react";
import { Users, User, ChevronDown, ChevronUp } from "lucide-react";

const DOS_TYPES = [
  {
    id: "pod",
    title: "Ping of Death",
    icon: "💀",
    color: "cyan",
    summary: "Oversized ICMP packets crash target systems",
    detail: "Sends ICMP Echo Request (ping) packets larger than 65,535 bytes — the maximum allowed by the IPv4 specification. When the target OS attempts to reassemble the fragmented oversized packet, it causes a buffer overflow, leading to crashes, freezes, or reboots. Modern systems are patched but legacy systems remain vulnerable.",
    severity: "High",
    protocol: "ICMP",
  },
  {
    id: "buffer",
    title: "Buffer Overflow",
    icon: "🧠",
    color: "red",
    summary: "Memory bounds overwritten with malicious data",
    detail: "Sends more data than a buffer can hold, overwriting adjacent memory regions. This corrupts program data, causes crashes, or — in exploitation scenarios — overwrites the return address to hijack execution flow. As a DoS vector, simply crashing the service is the attacker's primary goal.",
    severity: "Critical",
    protocol: "Any",
  },
  {
    id: "teardrop",
    title: "Teardrop Attack",
    icon: "🫧",
    color: "yellow",
    summary: "Malformed IP fragments with overlapping offsets",
    detail: "Exploits IP fragmentation by sending fragments with overlapping offset fields. When the target tries to reassemble the datagrams, the corrupted offset fields confuse the TCP/IP stack — causing the OS to crash during reassembly. Particularly dangerous for older Windows NT/95 systems. The overlap is the weapon.",
    severity: "High",
    protocol: "IP/UDP",
  },
  {
    id: "syn",
    title: "SYN Flood",
    icon: "🌊",
    color: "red",
    summary: "TCP handshake exploitation with spoofed IPs",
    detail: "Exploits the TCP three-way handshake (SYN → SYN-ACK → ACK). The attacker sends massive SYN packets with spoofed source IPs. The server allocates resources and replies with SYN-ACK, but never receives an ACK. Half-open connections pile up until the server's connection table is exhausted, refusing all legitimate connections.",
    severity: "Critical",
    protocol: "TCP",
  },
];

const colorMap: Record<string, { border: string; bg: string; badge: string; text: string; icon: string }> = {
  cyan:   { border: "border-cyan-500/30",  bg: "bg-cyan-500/5",  badge: "bg-cyan-500/20 text-cyan-300",   text: "text-cyan-400",  icon: "text-cyan-300" },
  red:    { border: "border-red-500/30",   bg: "bg-red-500/5",   badge: "bg-red-500/20 text-red-300",     text: "text-red-400",   icon: "text-red-300" },
  yellow: { border: "border-yellow-500/30",bg: "bg-yellow-500/5",badge: "bg-yellow-500/20 text-yellow-300",text: "text-yellow-400",icon: "text-yellow-300" },
};

export default function CoreContentSection() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="space-y-20">

      {/* ── What is a DoS Attack ── */}
      <section id="dos" className="max-w-6xl mx-auto px-4 py-16 section-enter">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-4">MODULE 1</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">What is a <span className="gradient-text">DoS Attack?</span></h2>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto">
            A <strong className="text-cyan-300">Denial of Service</strong> attack aims to make a machine or network resource unavailable to its intended users by overwhelming it with illegitimate requests or data.
          </p>
        </div>

        {/* Legitimate vs Attacker visual */}
        <div className="glass-panel p-8 mb-12 glow-cyan">
          <h3 className="text-center text-slate-300 text-sm font-semibold uppercase tracking-widest mb-8">Traffic Flow Comparison</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Legitimate users */}
            <div className="flex flex-col items-center gap-3">
              <div className="text-emerald-400 font-semibold text-sm uppercase tracking-wide">Legitimate Users</div>
              <div className="flex flex-wrap justify-center gap-3">
                {[1,2,3].map(i => (
                  <div key={i} className="flex flex-col items-center gap-1 animate-float" style={{ animationDelay: `${i*0.3}s` }}>
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                      <Users className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="text-emerald-500/60 text-xs">User {i}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-1">
                {[1,2,3].map(i => (
                  <div key={i} className="w-8 h-0.5 bg-gradient-to-r from-emerald-500/60 to-emerald-500/20" style={{ animationDelay: `${i*0.1}s` }} />
                ))}
              </div>
            </div>

            {/* Server */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-xl bg-slate-800 border-2 border-slate-600 flex items-center justify-center glow-cyan">
                  <span className="text-3xl">🖥️</span>
                </div>
                <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="text-center">
                <div className="text-white font-bold">Target Server</div>
                <div className="text-emerald-400 text-xs">● Online &amp; Serving</div>
              </div>
            </div>

            {/* Attacker */}
            <div className="flex flex-col items-center gap-3">
              <div className="text-red-400 font-semibold text-sm uppercase tracking-wide">Attacker</div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-full bg-red-500/20 border-2 border-red-500/50 flex items-center justify-center animate-pulse-red">
                  <User className="w-6 h-6 text-red-400" />
                </div>
                <div className="text-red-500/60 text-xs">Malicious</div>
              </div>
              <div className="flex flex-col gap-1">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="w-16 h-0.5 bg-gradient-to-r from-red-500/80 to-red-500/20" style={{ transform: `scaleX(${0.5 + i*0.1})`, animationDelay: `${i*0.1}s` }} />
                ))}
              </div>
              <div className="text-red-400 text-xs font-mono bg-red-500/10 px-2 py-1 rounded">FLOOD →</div>
            </div>
          </div>

          <div className="mt-8 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-center">
            <span className="text-red-300 text-sm">⚠️ Result: Legitimate users are <strong>blocked</strong> — server resources exhausted by attacker's flood traffic</span>
          </div>
        </div>

        {/* DoS Types Accordion */}
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="text-cyan-400">⚡</span> Types of DoS Attacks
        </h3>
        <div className="space-y-3">
          {DOS_TYPES.map((t) => {
            const c = colorMap[t.color];
            const isOpen = openId === t.id;
            return (
              <div key={t.id} className={`rounded-xl border ${c.border} ${c.bg} overflow-hidden hover-card cursor-pointer transition-all duration-300`}
                onClick={() => setOpenId(isOpen ? null : t.id)}>
                <div className="flex items-center gap-4 p-5">
                  <span className="text-3xl">{t.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className={`text-lg font-bold ${c.text}`}>{t.title}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c.badge}`}>{t.protocol}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${t.severity === "Critical" ? "bg-red-500/30 text-red-300" : "bg-yellow-500/20 text-yellow-300"}`}>{t.severity}</span>
                    </div>
                    <p className="text-slate-400 text-sm">{t.summary}</p>
                  </div>
                  <div className={`${c.text} transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                    {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
                {isOpen && (
                  <div className="px-5 pb-5 border-t border-white/5 pt-4 animate-slide-up">
                    <p className="text-slate-300 leading-relaxed">{t.detail}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── DDoS + Architecture Flow ── */}
      <section id="ddos" className="max-w-6xl mx-auto px-4 py-16 section-enter">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 mb-4">DISTRIBUTED ATTACK</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            <span className="gradient-text-red">DDoS</span> Attacks
          </h2>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto">
            A <strong className="text-red-300">Distributed Denial of Service</strong> attack leverages hundreds or thousands of compromised systems (a <em>botnet</em>) to simultaneously flood a target — massively amplifying scale and making mitigation exponentially harder.
          </p>
        </div>

        {/* Architecture flow */}
        <div className="glass-panel-red p-8 glow-red">
          <h3 className="text-center text-slate-300 text-sm font-semibold uppercase tracking-widest mb-10">DDoS Attack Architecture</h3>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Attacker */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-xl bg-red-500/20 border-2 border-red-500/60 flex items-center justify-center animate-pulse-red">
                <span className="text-2xl">👤</span>
              </div>
              <div className="text-center">
                <div className="text-red-400 font-bold text-sm">ATTACKER</div>
                <div className="text-slate-500 text-xs">Command &amp; Control</div>
              </div>
            </div>
            {/* Arrow */}
            <div className="flex flex-col items-center text-red-500/40">
              <div className="hidden md:block w-16 h-0.5 bg-gradient-to-r from-red-500/60 to-red-500/30" />
              <div className="md:hidden h-8 w-0.5 bg-gradient-to-b from-red-500/60 to-red-500/30" />
              <span className="text-xs text-red-500/60 mt-1">Commands</span>
            </div>
            {/* Handlers */}
            <div className="flex flex-col items-center gap-3">
              <div className="flex gap-2">
                {["H1","H2","H3"].map(h => (
                  <div key={h} className="w-12 h-12 rounded-lg bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-xs font-bold text-orange-400">{h}</div>
                ))}
              </div>
              <div className="text-center">
                <div className="text-orange-400 font-bold text-sm">HANDLERS</div>
                <div className="text-slate-500 text-xs">Master Controllers</div>
              </div>
            </div>
            {/* Arrow */}
            <div className="flex flex-col items-center text-orange-500/40">
              <div className="hidden md:block w-16 h-0.5 bg-gradient-to-r from-orange-500/60 to-orange-500/30" />
              <div className="md:hidden h-8 w-0.5 bg-gradient-to-b from-orange-500/60 to-orange-500/30" />
              <span className="text-xs text-orange-500/60 mt-1">Activates</span>
            </div>
            {/* Zombies */}
            <div className="flex flex-col items-center gap-3">
              <div className="grid grid-cols-3 gap-1">
                {["Z1","Z2","Z3","Z4","Z5","Z6"].map(z => (
                  <div key={z} className="w-9 h-9 rounded bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-xs font-bold text-purple-400 animate-float" style={{ animationDelay: `${Math.random()*2}s` }}>{z}</div>
                ))}
              </div>
              <div className="text-center">
                <div className="text-purple-400 font-bold text-sm">BOTNET</div>
                <div className="text-slate-500 text-xs">Zombie Nodes</div>
              </div>
            </div>
            {/* Arrow */}
            <div className="flex flex-col items-center text-purple-500/40">
              <div className="hidden md:block w-16 h-0.5 bg-gradient-to-r from-purple-500/60 to-red-500/60 animate-pulse" />
              <div className="md:hidden h-8 w-0.5 bg-gradient-to-b from-purple-500/60 to-red-500/60 animate-pulse" />
              <span className="text-xs text-red-400/60 mt-1 font-bold">FLOOD ▶▶▶</span>
            </div>
            {/* Victim */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-xl bg-red-500/30 border-2 border-red-500 flex items-center justify-center animate-critical">
                <span className="text-2xl">🖥️</span>
              </div>
              <div className="text-center">
                <div className="text-red-400 font-bold text-sm">VICTIM</div>
                <div className="text-red-500 text-xs font-mono">503 DOWN</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DoS vs DDoS Comparison ── */}
      <section id="comparison" className="max-w-6xl mx-auto px-4 py-16 section-enter">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-white mb-4">DoS <span className="text-slate-400">vs</span> DDoS</h2>
          <p className="text-slate-400">Side-by-side comparison of key characteristics</p>
        </div>
        <div className="glass-panel overflow-hidden glow-cyan">
          <div className="grid grid-cols-3 text-sm font-semibold">
            <div className="p-4 text-slate-400 bg-white/5">Attribute</div>
            <div className="p-4 text-cyan-400 bg-cyan-500/10 text-center border-l border-white/5">DoS</div>
            <div className="p-4 text-red-400 bg-red-500/10 text-center border-l border-white/5">DDoS</div>
          </div>
          {[
            ["Attack Source",      "Single machine",             "Hundreds–thousands of nodes"],
            ["Traffic Volume",     "Moderate",                   "Massive / Terabits"],
            ["Setup Complexity",   "Low — simple scripts",       "High — botnet C2 infrastructure"],
            ["Tracing Difficulty", "Easier — single IP",         "Very Hard — spoofed / distributed"],
            ["Mitigation Speed",   "Faster — block one IP",      "Slow — requires traffic scrubbing"],
            ["Attack Duration",    "Minutes to hours",           "Days to weeks"],
          ].map(([attr, dos, ddos], i) => (
            <div key={attr} className={`grid grid-cols-3 border-t border-white/5 text-sm ${i % 2 === 0 ? "bg-white/[0.02]" : ""}`}>
              <div className="p-4 text-slate-300 font-medium">{attr}</div>
              <div className="p-4 text-cyan-300/80 text-center border-l border-white/5">{dos}</div>
              <div className="p-4 text-red-300/80 text-center border-l border-white/5">{ddos}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Prevention & Mitigation ── */}
      <section id="prevention" className="max-w-6xl mx-auto px-4 py-16 section-enter">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4">DEFENSE LAYERS</span>
          <h2 className="text-4xl font-black text-white mb-4">Prevention &amp; <span className="text-emerald-400">Mitigation</span></h2>
          <p className="text-slate-400">Multi-layer security architecture to defend against DoS/DDoS attacks</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: "🔥", title: "Firewall Rules", color: "emerald", desc: "Stateful packet inspection to filter malformed packets and known attack signatures before they reach the server. ACLs block suspicious source IPs." },
            { icon: "⚖️", title: "Load Balancing", color: "cyan", desc: "Distribute incoming traffic across multiple server instances. Even if one node is overwhelmed, others continue serving legitimate users without interruption." },
            { icon: "⏱️", title: "Rate Limiting", color: "yellow", desc: "Throttle requests per IP per second. SYN cookies prevent half-open connection exhaustion. Request queuing absorbs burst traffic spikes." },
            { icon: "🔍", title: "Intrusion Detection (IDS)", color: "purple", desc: "Signature-based and anomaly-based IDS engines detect attack patterns in real-time. Alerts trigger automated countermeasures and traffic drops." },
            { icon: "📡", title: "Network Monitoring", color: "blue", desc: "Continuous traffic analysis with flow-based tools (NetFlow, sFlow). ML models identify behavioral anomalies and trigger early warnings." },
            { icon: "☁️", title: "CDN / Scrubbing Centers", color: "pink", desc: "Route traffic through upstream scrubbing centers that filter attack traffic before it reaches the origin server. Anycast diffuses volumetric floods." },
          ].map((item) => (
            <div key={item.title} className="glass-panel p-6 hover-card glow-cyan group">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-white font-bold text-lg mb-2 group-hover:text-cyan-300 transition-colors">{item.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
