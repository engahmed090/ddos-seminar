"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { Zap, Database, ShieldCheck } from "lucide-react";

const SimulatorModule        = dynamic(() => import("@/components/SimulatorModule"),        { ssr: false });
const DatasetScenariosModule = dynamic(() => import("@/components/DatasetScenariosModule"), { ssr: false });
const MitigationModule       = dynamic(() => import("@/components/MitigationModule"),       { ssr: false });

type Tab = "simulator" | "dataset" | "mitigation";

const TABS = [
  { id: "simulator"  as Tab, label: "DoS / DDoS Simulator",  sub: "Live Attack Engine",  icon: <Zap         className="w-4 h-4" />, border: "border-cyan-400",    text: "text-cyan-400",    bg: "bg-cyan-400/10"    },
  { id: "dataset"    as Tab, label: "CICIDS2017 Scenarios",   sub: "Real Attack Dataset", icon: <Database    className="w-4 h-4" />, border: "border-emerald-400", text: "text-emerald-400", bg: "bg-emerald-400/10" },
  { id: "mitigation" as Tab, label: "Defense Matrix",         sub: "Mitigation Layers",   icon: <ShieldCheck className="w-4 h-4" />, border: "border-rose-400",    text: "text-rose-400",    bg: "bg-rose-400/10"    },
];

export default function Page() {
  const [tab, setTab] = useState<Tab>("simulator");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* ── Sticky header ── */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div>
            <p className="text-lg font-black tracking-tight leading-none">
              <span className="text-cyan-400">DoS</span>
              <span className="text-slate-500 mx-1.5">&amp;</span>
              <span className="text-rose-400">DDoS</span>
              <span className="text-white ml-2">Defense Lab</span>
            </p>
            <p className="text-slate-500 text-xs mt-0.5">Interactive Cybersecurity Seminar · Ahmad Osman · 2026</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-xs font-semibold">Live Dashboard</span>
          </div>
        </div>

        {/* ── Tab bar ── */}
        <div className="max-w-7xl mx-auto px-6 flex gap-1">
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all duration-200
                  ${active
                    ? `${t.border} ${t.text} ${t.bg}`
                    : "border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/5"}`}
              >
                {t.icon}
                <span className="hidden sm:block">{t.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* ── Content ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div key={tab} className="section-enter">
          {tab === "simulator"  && <SimulatorModule />}
          {tab === "dataset"    && <DatasetScenariosModule />}
          {tab === "mitigation" && <MitigationModule />}
        </div>
      </main>

      <footer className="text-center py-6 text-slate-700 text-xs border-t border-white/5">
        DoS &amp; DDoS Attacks — Cybersecurity Seminar · Stage 4 · Ahmad Osman
      </footer>
    </div>
  );
}
