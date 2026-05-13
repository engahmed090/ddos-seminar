"use client";
import { useState, useEffect } from "react";
import { Shield, Wifi, Terminal, Database, ChevronRight, Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { id: "hero",       label: "Overview",        icon: <Shield className="w-4 h-4" />,   section: "Module 0" },
  { id: "dos",        label: "DoS Attacks",     icon: <ChevronRight className="w-4 h-4" />, section: "Module 1" },
  { id: "ddos",       label: "DDoS & Botnets",  icon: <ChevronRight className="w-4 h-4" />, section: "Module 1" },
  { id: "comparison", label: "Comparison",      icon: <ChevronRight className="w-4 h-4" />, section: "Module 1" },
  { id: "prevention", label: "Prevention",      icon: <Shield className="w-4 h-4" />,   section: "Module 1" },
  { id: "simulation", label: "Live Simulation", icon: <Wifi className="w-4 h-4" />,     section: "Module 2" },
  { id: "detection",  label: "IDS Engine",      icon: <Terminal className="w-4 h-4" />, section: "Module 3" },
  { id: "dataset",    label: "CICIDS2017",       icon: <Database className="w-4 h-4" />, section: "Module 4" },
];

export default function Sidebar() {
  const [active, setActive] = useState("hero");
  const [open, setOpen] = useState(false);

  // Track active section via IntersectionObserver
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    NAV_ITEMS.forEach(item => {
      const el = document.getElementById(item.id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(item.id); },
        { threshold: 0.3 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  // Group by section
  const sections: Record<string, typeof NAV_ITEMS> = {};
  NAV_ITEMS.forEach(item => {
    if (!sections[item.section]) sections[item.section] = [];
    sections[item.section].push(item);
  });

  const SidebarContent = () => (
    <nav className="flex flex-col h-full py-6 px-3">
      {/* Brand */}
      <div className="flex items-center gap-3 px-3 mb-8">
        <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
          <Shield className="w-4 h-4 text-cyan-400" />
        </div>
        <div>
          <div className="text-white font-bold text-sm leading-none">CyberSec</div>
          <div className="text-cyan-400 text-xs">Seminar 2026</div>
        </div>
      </div>

      {/* Nav groups */}
      <div className="flex-1 space-y-6 overflow-y-auto">
        {Object.entries(sections).map(([section, items]) => (
          <div key={section}>
            <div className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-widest">{section}</div>
            <div className="space-y-1">
              {items.map(item => (
                <button key={item.id} onClick={() => scrollTo(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 text-left
                    ${active === item.id ? "nav-active font-semibold" : "text-slate-400 hover:text-slate-200 hover:bg-white/5"}`}>
                  <span className={active === item.id ? "text-cyan-400" : "text-slate-500"}>{item.icon}</span>
                  {item.label}
                  {active === item.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 px-3 pt-4 border-t border-white/5">
        <div className="text-xs text-slate-500 leading-relaxed">
          Ahmad Osman<br />
          <span className="text-slate-600">ahmadosman7212@gmail.com</span>
        </div>
      </div>
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-56 bg-[#080f1e] border-r border-white/5 z-40">
        <SidebarContent />
      </aside>

      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-[#080f1e]/95 backdrop-blur border-b border-white/5 z-50 flex items-center px-4 gap-3">
        <button onClick={() => setOpen(true)} className="text-slate-400 hover:text-white">
          <Menu className="w-5 h-5" />
        </button>
        <div className="text-white font-bold text-sm">DoS &amp; DDoS Seminar</div>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="relative w-64 h-full bg-[#080f1e] border-r border-white/5 flex flex-col">
            <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}
