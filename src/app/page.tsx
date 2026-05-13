"use client";
import { useState, useEffect, useRef } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, BarChart, Bar,
} from "recharts";
import {
  Shield, Brain, Activity, Search, Cpu, Eye, Target,
  Filter, CheckCircle, AlertTriangle, Database, Zap,
  TrendingUp, Play, RotateCcw,
} from "lucide-react";

/* ── Static anomaly dataset ── */
const ANOMALY_DATA = Array.from({ length: 40 }, (_, i) => ({
  t: i,
  traffic: i >= 25 && i <= 33
    ? +(65 + (i - 24) * 11 + Math.random() * 5).toFixed(1)
    : +(28 + Math.sin(i * 0.6) * 7 + Math.random() * 4).toFixed(1),
  threshold: 65,
}));

/* ── ML bar chart data ── */
const ML_DATA = [
  { model: "Random Forest", acc: 99.7, color: "#8b5cf6" },
  { model: "Neural Net",    acc: 98.9, color: "#2563EB" },
  { model: "Decision Tree", acc: 97.8, color: "#10b981" },
  { model: "KNN",           acc: 96.4, color: "#f59e0b" },
  { model: "Naïve Bayes",   acc: 88.2, color: "#94a3b8" },
];

type Tab = "signature" | "anomaly" | "ai";

/* ══════════════════════════════════════════════════════════
   SIGNATURE TAB
══════════════════════════════════════════════════════════ */
function SignatureTab() {
  const [scanPos, setScanPos] = useState(-1);
  const [hits, setHits]       = useState<number[]>([]);
  const [running, setRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const SLOTS = ["SYN","ACK","GET","RST","PSH","FIN","UDP","TCP",
                 "SYN","ICM","GET","SYN","TCP","ACK","UDP"];
  const BAD_IDX = [0, 3, 8, 11];

  const startScan = () => {
    setHits([]); setScanPos(0); setRunning(true);
    let pos = 0;
    timerRef.current = setInterval(() => {
      pos++;
      setScanPos(pos);
      if (BAD_IDX.includes(pos)) setHits(h => [...h, pos]);
      if (pos >= SLOTS.length - 1) {
        clearInterval(timerRef.current!);
        setRunning(false);
      }
    }, 180);
  };
  const reset = () => { clearInterval(timerRef.current!); setScanPos(-1); setHits([]); setRunning(false); };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 slide-up">
      {/* Explanation */}
      <div className="lg:col-span-2 card p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl badge-blue flex items-center justify-center">
            <Search className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-900">Signature-Based Detection</h3>
        </div>
        <p className="text-slate-500 text-sm leading-relaxed">
          Matches incoming packets against a database of <strong className="text-slate-700">known malicious signatures</strong>.
          Deterministic and fast, but cannot detect zero-day or polymorphic attacks.
        </p>
        {[
          { t: "Pattern Matching",   d: "Byte-sequence compared against signature DB", cls: "badge-blue"  },
          { t: "IP Blacklisting",    d: "Known C2 / botnet source IPs auto-blocked",  cls: "badge-rose"  },
          { t: "Protocol Anomaly",   d: "Malformed headers vs RFC spec flagged",       cls: "badge-amber" },
        ].map(r => (
          <div key={r.t} className={`rounded-xl p-3 ${r.cls}`}>
            <div className="text-xs font-bold mb-0.5">{r.t}</div>
            <div className="text-xs opacity-80">{r.d}</div>
          </div>
        ))}
        <div className="rounded-xl badge-amber p-3">
          <div className="text-xs font-bold mb-0.5">⚠ Key Limitation</div>
          <div className="text-xs opacity-80">Blind to zero-day attacks without daily signature updates.</div>
        </div>
      </div>

      {/* Scanner */}
      <div className="lg:col-span-3 card p-6">
        <div className="flex items-center justify-between mb-5">
          <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
            <Eye className="w-4 h-4 text-blue-600" /> Live Pattern Scanner
          </h4>
          <div className="flex gap-2">
            <button onClick={startScan} disabled={running}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold btn-primary disabled:opacity-50 transition-all">
              <Play className="w-3 h-3" /> Scan
            </button>
            <button onClick={reset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold btn-ghost transition-all">
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2 mb-4">
          {SLOTS.map((label, i) => {
            const hit  = hits.includes(i);
            const scan = scanPos === i;
            return (
              <div key={i} className={`rounded-xl border p-2.5 text-center transition-all duration-300
                ${hit  ? "bg-rose-50 border-rose-300 scale-105 shadow-sm"
                : scan ? "bg-blue-50 border-blue-400 scale-105"
                :        "bg-slate-50 border-slate-200"}`}>
                <div className="text-[9px] font-mono font-bold text-slate-400 mb-1">{label}</div>
                {hit  ? <AlertTriangle className="w-4 h-4 text-rose-500 mx-auto" />
                : scan ? <Search       className="w-4 h-4 text-blue-500 mx-auto animate-pulse" />
                :        <div className="w-4 h-1.5 bg-slate-200 rounded mx-auto" />}
              </div>
            );
          })}
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>Scan progress</span>
            <span>{Math.min(100, Math.round(((scanPos + 1) / SLOTS.length) * 100))}%</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full transition-all duration-200"
              style={{ width: `${Math.min(100, ((scanPos + 1) / SLOTS.length) * 100)}%` }} />
          </div>
        </div>

        <div className="space-y-2">
          {hits.length > 0 ? hits.map(i => (
            <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-50 border border-rose-200">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
              <span className="text-xs text-rose-700 font-semibold">
                MATCH: SYN-Flood signature in slot #{i} — IP blacklist triggered
              </span>
            </div>
          )) : (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <CheckCircle className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs text-slate-500">Press "Scan" to begin pattern matching simulation.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   ANOMALY TAB
══════════════════════════════════════════════════════════ */
function AnomalyTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 slide-up">
      <div className="lg:col-span-2 card p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl badge-violet flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-900">Anomaly-Based Detection</h3>
        </div>
        <p className="text-slate-500 text-sm leading-relaxed">
          Profiles <strong className="text-slate-700">normal baseline behaviour</strong> and raises alerts for
          statistical deviations. Can detect zero-day attacks, but generates more false positives.
        </p>
        {[
          { t: "Baseline Profiling",    d: "7–30 day ML learning window for 'normal' traffic", cls: "badge-blue"   },
          { t: "Statistical Deviation", d: "Z-score & entropy analysis flags outliers",          cls: "badge-violet" },
          { t: "Rate Threshold Alert",  d: "Triggers when packets/sec exceed learned max",       cls: "badge-rose"   },
        ].map(r => (
          <div key={r.t} className={`rounded-xl p-3 ${r.cls}`}>
            <div className="text-xs font-bold mb-0.5">{r.t}</div>
            <div className="text-xs opacity-80">{r.d}</div>
          </div>
        ))}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="p-3 rounded-xl badge-blue text-center">
            <div className="text-xl font-black">65%</div>
            <div className="text-xs mt-0.5 opacity-80">Alert Threshold</div>
          </div>
          <div className="p-3 rounded-xl badge-rose text-center">
            <div className="text-xl font-black">118%</div>
            <div className="text-xs mt-0.5 opacity-80">Attack Peak</div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-3 card p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold text-slate-900 text-sm">Traffic Rate vs Safe Threshold (Mbps)</h4>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block"/>Normal</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500 inline-block"/>Attack</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={ANOMALY_DATA} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="gBlue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#2563EB" stopOpacity={0.2}  />
                <stop offset="100%" stopColor="#2563EB" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="t" tick={{ fill: "#94a3b8", fontSize: 10 }} tickLine={false} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} tickLine={false} domain={[0, 130]} />
            <ReferenceLine y={65} stroke="#ef4444" strokeDasharray="6 3"
              label={{ value: "⚠ Threshold (65)", fill: "#ef4444", fontSize: 10, position: "insideTopRight" }} />
            {/* @ts-ignore */}
            <Tooltip
              contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 11, boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
              formatter={(value: any) => [typeof value === "number" ? `${value.toFixed(1)} Mbps` : value, "Traffic"]}
            />
            <Area type="monotone" dataKey="traffic" stroke="#2563EB" strokeWidth={2.5}
              fill="url(#gBlue)" dot={false} activeDot={{ r: 4, fill: "#2563EB" }} />
          </AreaChart>
        </ResponsiveContainer>
        <p className="text-xs text-slate-400 text-center mt-3">
          Attack spike at T=25 — 81% above baseline. Rate-limiting and blackholing auto-activated at T=26.
        </p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   AI / ML TAB
══════════════════════════════════════════════════════════ */
function AITab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 slide-up">
      <div className="lg:col-span-2 card p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl badge-violet flex items-center justify-center">
            <Brain className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-900">AI &amp; Machine Learning</h3>
        </div>
        <p className="text-slate-500 text-sm leading-relaxed">
          Processes <strong className="text-slate-700">3.2M packets/sec</strong> via Random Forest &amp; Neural Networks trained on CICIDS2017.
          Layer-7 behavioral analysis distinguishes humans from bots in real time.
        </p>
        {[
          { icon: <Eye    className="w-3.5 h-3.5"/>, t:"Behavioral Analysis",   d:"Click speed, navigation paths, session timing patterns", cls:"badge-violet" },
          { icon: <Cpu    className="w-3.5 h-3.5"/>, t:"Big Data Processing",   d:"3.2M packets/sec classified with <1ms latency",          cls:"badge-blue"   },
          { icon: <Filter className="w-3.5 h-3.5"/>, t:"Layer-7 Inspection",    d:"Application payload decoded & semantically classified",   cls:"badge-green"  },
          { icon: <Target className="w-3.5 h-3.5"/>, t:"Bot vs. Human Scoring", d:"Per-session probability: 0.00 = human, 1.00 = bot",       cls:"badge-rose"   },
        ].map(r => (
          <div key={r.t} className={`flex items-start gap-2.5 rounded-xl p-3 ${r.cls}`}>
            <span className="mt-0.5 flex-shrink-0">{r.icon}</span>
            <div>
              <div className="text-xs font-bold mb-0.5">{r.t}</div>
              <div className="text-xs opacity-80">{r.d}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="lg:col-span-3 space-y-4">
        {/* AI Decision Core card */}
        <div className="ai-card p-6 text-white">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">AI Decision Core · CICIDS2017</div>
              <div className="text-xl font-black">Classification Engine</div>
              <div className="text-slate-400 text-sm mt-0.5">Random Forest — 80+ Feature Extraction</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
              <Brain className="w-5 h-5 text-violet-300" />
            </div>
          </div>

          {/* Accuracy ring + live metrics */}
          <div className="flex items-center gap-8">
            <div className="relative w-28 h-28 flex-shrink-0">
              <svg className="w-28 h-28 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9" className="ring-track" />
                <circle cx="18" cy="18" r="15.9" className="ring-fill"
                  strokeDasharray="99.7 0.3" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black leading-none">99.7%</span>
                <span className="text-[9px] text-slate-400 mt-0.5">Accuracy</span>
              </div>
            </div>
            <div className="space-y-3 flex-1">
              {[
                { label: "Model Accuracy",        val: "99.7%",  color: "text-violet-400"  },
                { label: "False Positive Rate",   val: "0.01%",  color: "text-emerald-400" },
                { label: "Packets/sec",           val: "3.2M",   color: "text-blue-400"    },
                { label: "Real-time Features",    val: "80+",    color: "text-amber-400"   },
                { label: "Inference Latency",     val: "<1 ms",  color: "text-slate-300"   },
              ].map(m => (
                <div key={m.label} className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">{m.label}</span>
                  <span className={`font-bold ${m.color}`}>{m.val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs">
            {[
              { label: "Samples Trained", val: "2.83M" },
              { label: "Attack Classes",  val: "14" },
              { label: "Dataset",         val: "CICIDS2017" },
            ].map(s => (
              <div key={s.label} className="rounded-xl bg-white/5 border border-white/10 py-2.5 px-2">
                <div className="font-black text-white text-sm">{s.val}</div>
                <div className="text-slate-400 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Model comparison bar chart */}
        <div className="card p-5">
          <h4 className="font-bold text-slate-900 text-sm mb-4">Model Accuracy Comparison</h4>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={ML_DATA} margin={{ left: -10, right: 5, top: 5, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="model" tick={{ fill: "#94a3b8", fontSize: 9 }} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 9 }} tickLine={false} domain={[80, 100]} />
              {/* @ts-ignore */}
              <Tooltip
                contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 11, boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
                formatter={(value: any) => [`${typeof value === "number" ? value.toFixed(1) : value}%`, "Accuracy"]}
              />
              <Bar dataKey="acc" radius={[4, 4, 0, 0]}>
                {ML_DATA.map((d, i) => (
                  <rect key={i} fill={d.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════ */
export default function Page() {
  const [tab, setTab] = useState<Tab>("signature");

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "signature", label: "Signature-Based",      icon: <Search   className="w-4 h-4" /> },
    { id: "anomaly",   label: "Anomaly-Based",        icon: <Activity className="w-4 h-4" /> },
    { id: "ai",        label: "AI & Machine Learning",icon: <Brain    className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#F8FAFC" }}>
      {/* ── Header ── */}
      <header style={{ background: "#fff", borderBottom: "1px solid #e2e8f0" }}
        className="sticky top-0 z-40 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "#2563EB" }}>
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm leading-none">DoS / DDoS Defense Lab</div>
              <div className="text-slate-400 text-xs mt-0.5">Interactive Cybersecurity Dashboard</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs badge-green px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
            <span className="font-semibold">Live Engine Active</span>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section style={{ background: "#fff", borderBottom: "1px solid #e2e8f0" }}>
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full badge-blue text-xs font-semibold mb-5">
            <Zap className="w-3 h-3" /> Stage 4 — Ahmad Osman · 2026
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-3 leading-tight">
            DoS &amp; DDoS Attacks<br />
            <span style={{ color: "#2563EB" }}>Detection &amp; Defense</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mb-10 leading-relaxed">
            Academic engineering dashboard covering attack simulation, AI-driven detection methodologies,
            CICIDS2017 dataset analysis, and proactive mitigation architecture.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <Database   className="w-4 h-4"/>, label: "Dataset Packets",    val: "2.83M",  cls: "text-blue-600",    bg: "badge-blue"   },
              { icon: <TrendingUp className="w-4 h-4"/>, label: "ML Accuracy",         val: "99.7%",  cls: "text-emerald-600", bg: "badge-green"  },
              { icon: <Cpu        className="w-4 h-4"/>, label: "Network Features",    val: "80+",    cls: "text-violet-600",  bg: "badge-violet" },
              { icon: <Target     className="w-4 h-4"/>, label: "False Positive Rate", val: "0.01%",  cls: "text-rose-600",    bg: "badge-rose"   },
            ].map(k => (
              <div key={k.label} className="card-sm p-4">
                <div className={`${k.bg} ${k.cls} w-7 h-7 rounded-lg flex items-center justify-center mb-3`}>
                  {k.icon}
                </div>
                <div className="text-2xl font-black text-slate-900">{k.val}</div>
                <div className="text-xs text-slate-500 mt-0.5">{k.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI Detection Module ── */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full badge-violet text-xs font-bold mb-3">
            <Brain className="w-3 h-3" /> AI-DRIVEN DETECTION ENGINE
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-1">Detection Paradigms</h2>
          <p className="text-slate-500 text-sm">
            Select a detection strategy to explore its logic, visualisation, and academic context
          </p>
        </div>

        {/* Tab buttons */}
        <div className="flex flex-wrap gap-2 mb-7">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200
                ${tab === t.id ? "tab-active" : "tab-inactive"}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Tab panels */}
        {tab === "signature" && <SignatureTab />}
        {tab === "anomaly"   && <AnomalyTab  />}
        {tab === "ai"        && <AITab       />}
      </section>

      {/* ── Footer ── */}
      <footer className="text-center py-8 text-slate-400 text-xs border-t border-slate-200"
        style={{ background: "#fff" }}>
        DoS &amp; DDoS Defense Lab · Ahmad Osman · ahmadosman7212@gmail.com · 2026
      </footer>
    </div>
  );
}
