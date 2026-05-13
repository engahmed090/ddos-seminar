"use client";
import { useState, useRef } from "react";
import { Terminal, Activity, AlertTriangle, CheckCircle } from "lucide-react";

type LogLevel = "pass" | "warn" | "critical";
interface LogEntry { id: number; level: LogLevel; msg: string; ts: string; }

const RULES = [
  { threshold: 0,    level: "pass"     as LogLevel, msg: "PASS: Traffic flow normal. Signature verified. Source entropy within bounds." },
  { threshold: 1,    level: "pass"     as LogLevel, msg: "PASS: Packet inspection clean. No malicious payload detected. Flow authorized." },
  { threshold: 2,    level: "warn"     as LogLevel, msg: "WARNING: High request velocity detected from single subnet [192.168.1.x/24]. Monitoring escalated." },
  { threshold: 3,    level: "warn"     as LogLevel, msg: "WARNING: Anomalous SYN ratio spike. Half-open connections approaching threshold (82%). Watchlist updated." },
  { threshold: 4,    level: "critical" as LogLevel, msg: "CRITICAL ALERT: DDoS Signature identified — BOTNET pattern [AS65001]. Implementing IP drop rules NOW." },
  { threshold: 5,    level: "critical" as LogLevel, msg: "CRITICAL ALERT: UDP amplification vector confirmed. Reflector IPs blackholed. BGP null-route activated." },
];

const NORMAL_MSGS = [
  "PASS: Traffic flow normal. Signature verified.",
  "PASS: HTTP GET request valid. Response: 200 OK.",
  "PASS: DNS query legitimate. TTL within range.",
  "PASS: TCP handshake completed. Connection established.",
];

const ANOMALY_MSGS = [
  "WARNING: High request velocity detected from single subnet.",
  "WARNING: Unusual port scan activity from 203.0.113.47.",
  "WARNING: Packet TTL manipulation detected. Possible spoofing.",
  "WARNING: Connection rate 850 req/s — approaching threshold (1000 req/s).",
];

const BOTNET_MSGS = [
  "CRITICAL ALERT: DDoS Signature identified. Implementing IP drop rules.",
  "CRITICAL ALERT: Botnet C2 beacon detected — blocking 48 source IPs.",
  "CRITICAL ALERT: SYN flood confirmed. SYN cookies enabled. Rate-limit enforced.",
  "CRITICAL ALERT: Layer-7 HTTP flood. WAF challenge-response activated.",
];

export default function DetectionModule() {
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: 0, level: "pass", msg: "IDS Engine initialized. Listening on all interfaces...", ts: new Date().toLocaleTimeString() },
  ]);
  const [processing, setProcessing] = useState(false);
  const counterRef = useRef(1);
  const bottomRef = useRef<HTMLDivElement>(null);

  const addLog = (level: LogLevel, msg: string) => {
    const entry: LogEntry = { id: counterRef.current++, level, msg, ts: new Date().toLocaleTimeString("en-US", { hour12: false }) };
    setLogs(prev => [...prev.slice(-49), entry]);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const simulate = async (type: "normal" | "anomaly" | "botnet") => {
    setProcessing(true);
    addLog("pass", `> Injecting ${type} traffic packet...`);
    await new Promise(r => setTimeout(r, 400));
    addLog("pass", "> Analyzing payload headers and flow entropy...");
    await new Promise(r => setTimeout(r, 600));

    if (type === "normal") {
      const msgs = NORMAL_MSGS;
      addLog("pass", msgs[Math.floor(Math.random() * msgs.length)]);
    } else if (type === "anomaly") {
      addLog("pass", "> Initial inspection: packet structure valid.");
      await new Promise(r => setTimeout(r, 300));
      addLog("warn", ANOMALY_MSGS[Math.floor(Math.random() * ANOMALY_MSGS.length)]);
    } else {
      addLog("warn", "> Elevated entropy detected. Running signature correlation...");
      await new Promise(r => setTimeout(r, 500));
      addLog("warn", "> Multiple source IPs with identical payload detected.");
      await new Promise(r => setTimeout(r, 400));
      addLog("critical", BOTNET_MSGS[Math.floor(Math.random() * BOTNET_MSGS.length)]);
    }
    setProcessing(false);
  };

  const colorMap = {
    pass:     { text: "text-emerald-400", prefix: "[PASS]     ", icon: <CheckCircle className="w-3 h-3 inline mr-1" /> },
    warn:     { text: "text-yellow-400",  prefix: "[WARNING]  ", icon: <AlertTriangle className="w-3 h-3 inline mr-1" /> },
    critical: { text: "text-red-400",     prefix: "[CRITICAL] ", icon: <AlertTriangle className="w-3 h-3 inline mr-1" /> },
  };

  return (
    <section id="detection" className="max-w-6xl mx-auto px-4 py-20 section-enter">
      <div className="text-center mb-12">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-4">MODULE 3 · IDS ENGINE</span>
        <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
          Traffic <span className="gradient-text">Detection Engine</span>
        </h2>
        <p className="text-slate-400 text-lg">Client-side intrusion detection simulation with real-time log output</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Control Panel */}
        <div className="flex flex-col gap-4">
          <div className="glass-panel p-6">
            <h3 className="text-purple-400 font-bold uppercase tracking-widest text-sm flex items-center gap-2 mb-6">
              <Activity className="w-4 h-4" /> Packet Injector
            </h3>

            {[
              {
                type: "normal"  as const,
                label: "Send Normal Traffic",
                icon: "📦",
                color: "border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300",
                desc: "Simulates valid HTTP/TCP packets that pass all checks.",
              },
              {
                type: "anomaly" as const,
                label: "Send Anomaly Spikes",
                icon: "📈",
                color: "border-yellow-500/40 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-300",
                desc: "Elevated request rate from a single subnet — triggers WARNING.",
              },
              {
                type: "botnet" as const,
                label: "Send Botnet Signature",
                icon: "🕷️",
                color: "border-red-500/40 bg-red-500/10 hover:bg-red-500/20 text-red-300",
                desc: "Known DDoS botnet fingerprints — triggers CRITICAL ALERT.",
              },
            ].map(btn => (
              <button key={btn.type} disabled={processing}
                onClick={() => simulate(btn.type)}
                className={`w-full mb-3 flex flex-col items-start gap-1 p-4 rounded-xl border font-semibold text-sm transition-all duration-200 ${btn.color} disabled:opacity-50 disabled:cursor-wait`}>
                <span className="flex items-center gap-2">{btn.icon} {btn.label}</span>
                <span className="text-xs opacity-60 font-normal text-left">{btn.desc}</span>
              </button>
            ))}

            <button onClick={() => setLogs([{ id: counterRef.current++, level: "pass", msg: "IDS Engine reset. Listening...", ts: new Date().toLocaleTimeString() }])}
              className="w-full py-2 rounded-lg border border-slate-600 text-slate-400 text-sm hover:bg-slate-700/50 transition-colors mt-2">
              🗑️ Clear Console
            </button>
          </div>

          {/* Legend */}
          <div className="glass-panel p-4 text-xs space-y-2">
            <div className="text-slate-400 font-semibold mb-2">Output Legend</div>
            <div className="flex items-center gap-2 text-emerald-400"><CheckCircle className="w-3 h-3" /> PASS — Normal traffic</div>
            <div className="flex items-center gap-2 text-yellow-400"><AlertTriangle className="w-3 h-3" /> WARNING — Suspicious activity</div>
            <div className="flex items-center gap-2 text-red-400"><AlertTriangle className="w-3 h-3" /> CRITICAL — DDoS confirmed</div>
          </div>
        </div>

        {/* Terminal */}
        <div className="lg:col-span-2 terminal p-4 flex flex-col" style={{ minHeight: 420 }}>
          <div className="flex items-center gap-2 mb-3 border-b border-cyan-500/10 pb-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400 text-xs font-mono">IDS-CONSOLE v2.4.1 — LIVE</span>
            <div className={`ml-auto w-2 h-2 rounded-full ${processing ? "bg-yellow-400 animate-pulse" : "bg-emerald-400"}`} />
          </div>
          <div className="flex-1 overflow-y-auto space-y-1 font-mono text-xs">
            {logs.map(log => {
              const c = colorMap[log.level];
              return (
                <div key={log.id} className={`flex gap-2 ${c.text} leading-relaxed`}>
                  <span className="text-slate-600 flex-shrink-0 select-none">{log.ts}</span>
                  <span className="text-slate-600 flex-shrink-0 select-none">{c.prefix}</span>
                  <span>{log.msg}</span>
                </div>
              );
            })}
            {processing && (
              <div className="text-cyan-400 flex items-center gap-1">
                <span className="text-slate-600">{new Date().toLocaleTimeString()}</span>
                <span className="ml-2">Processing<span className="cursor-blink">█</span></span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>
      </div>
    </section>
  );
}
