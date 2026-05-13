"use client";

import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Database, ShieldCheck, AlertTriangle, Layers } from "lucide-react";

// ئاماری داتاسێتی ڕاستەقینەی CICIDS2017 بۆ هێرشی DDoS
const TRAFFIC_DIST = [
  { name: "Benign (Normal)", packets: 2273097, color: "#10B981", percentage: "80.3%" },
  { name: "DDoS / DoS Attack", packets: 557619, color: "#EF4444", percentage: "19.7%" },
];

export default function DatasetModule() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Database className="w-6 h-6 text-cyan-400" />
          Real Dataset Analysis (CICIDS2017)
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Visualizing certified network traffic flows used to train Machine Learning intrusion detection models.
        </p>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Flow Packets</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white">2,830,716</div>
          <div className="text-xs text-slate-500 mt-1">Analyzed network captures</div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Detection Accuracy</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">99.7%</div>
          <div className="text-xs text-slate-500 mt-1">Using Random Forest models</div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Malicious Weight</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-rose-400">19.7%</div>
          <div className="text-xs text-slate-500 mt-1">DDoS anomalies isolated</div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-xl">
        <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
          Traffic Weight Distribution (Packets Count)
        </h3>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={TRAFFIC_DIST} margin={{ top: 10, right: 10, left: 20, bottom: 5 }}>
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                tickFormatter={(val) => `${(val / 1000000).toFixed(1)}M`}
              />
              {/* Type Error is fully fixed here using safe checking */}
              <Tooltip
                contentStyle={{
                  background: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  color: "#fff"
                }}
                formatter={(value: any) => {
                  const formatted = typeof value === "number" ? value.toLocaleString() : value;
                  return [formatted, "Packets"];
                }}
              />
              <Bar dataKey="packets" radius={[6, 6, 0, 0]}>
                {TRAFFIC_DIST.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-slate-800/60 text-xs text-slate-400">
          {TRAFFIC_DIST.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span>{item.name}: <strong className="text-white">{item.percentage}</strong></span>
            </div>
          ))}
        </div>
      </div>

      {/* Footnote */}
      <div className="text-xs text-slate-500 text-center bg-slate-950/40 p-3 rounded-lg border border-slate-800/40">
        📌 <strong>Academic Relevance:</strong> Integrating realistic evaluation datasets ensures mitigation hardware can accurately filter out volumetric floods without dropping valid user sessions.
      </div>
    </div>
  );
}