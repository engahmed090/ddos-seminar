"use client";
import { Shield, Zap, AlertTriangle } from "lucide-react";

export default function HeroSection() {
  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center grid-bg overflow-hidden px-4 py-20">
      {/* Background rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full border border-cyan-500/10 animate-spin-slow" />
        <div className="absolute w-[400px] h-[400px] rounded-full border border-red-500/10" style={{ animationDuration: "12s", animation: "spin-slow 12s linear infinite reverse" }} />
        <div className="absolute w-[800px] h-[800px] rounded-full border border-cyan-500/5" />
      </div>

      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scanline" style={{ animation: "scanline 4s linear infinite" }} />
      </div>

      <div className="relative z-10 text-center max-w-5xl mx-auto animate-slide-up">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 text-sm font-medium">
          <Zap className="w-4 h-4" />
          Cybersecurity Seminar · Stage 4
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 leading-none">
          <span className="gradient-text text-glow-cyan">DoS</span>
          <span className="text-slate-400 mx-4">&amp;</span>
          <span className="gradient-text-red text-glow-red">DDoS</span>
          <br />
          <span className="text-white text-4xl md:text-5xl lg:text-6xl font-bold">Attacks</span>
        </h1>

        <p className="text-slate-300 text-xl md:text-2xl mb-4 font-light">
          Understanding, Simulating &amp; Defending Against Network Denial of Service
        </p>
        <p className="text-slate-500 text-base mb-12">
          Presented by <span className="text-cyan-400 font-semibold">Ahmad Osman</span> · Department of Computer Engineering
        </p>

        {/* Stats row */}
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          {[
            { icon: <Shield className="w-5 h-5" />, label: "Attack Types", value: "4+" },
            { icon: <AlertTriangle className="w-5 h-5" />, label: "Dataset Packets", value: "2.8M" },
            { icon: <Zap className="w-5 h-5" />, label: "ML Accuracy", value: "99.7%" },
          ].map((s) => (
            <div key={s.label} className="glass-panel px-6 py-4 flex items-center gap-3 glow-cyan hover-card">
              <span className="text-cyan-400">{s.icon}</span>
              <div className="text-left">
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="text-xs text-slate-400">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll cue */}
        <div className="flex flex-col items-center gap-2 text-slate-500 text-sm animate-float">
          <span>Scroll to explore</span>
          <div className="w-px h-8 bg-gradient-to-b from-cyan-500/50 to-transparent" />
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#020817] to-transparent" />
    </section>
  );
}
