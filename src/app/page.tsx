"use client";
import dynamic from "next/dynamic";
import HeroSection from "@/components/HeroSection";
import Sidebar from "@/components/Sidebar";
import CoreContentSection from "@/components/CoreContentSection";

// Lazy-load chart-heavy modules (recharts needs client-side)
const SimulationModule = dynamic(() => import("@/components/SimulationModule"), { ssr: false });
const DetectionModule  = dynamic(() => import("@/components/DetectionModule"),  { ssr: false });
const DatasetModule    = dynamic(() => import("@/components/DatasetModule"),    { ssr: false });

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#020817]">
      <Sidebar />

      {/* Main content shifted right on desktop */}
      <main className="lg:ml-56 pt-14 lg:pt-0">
        <HeroSection />

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent mx-8" />

        <CoreContentSection />

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent mx-8 my-4" />

        <SimulationModule />

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent mx-8 my-4" />

        <DetectionModule />

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent mx-8 my-4" />

        <DatasetModule />

        {/* Footer */}
        <footer className="text-center py-12 border-t border-white/5 text-slate-600 text-sm">
          <p className="mb-1">
            DoS &amp; DDoS Attacks — Cybersecurity Seminar · Stage 4
          </p>
          <p>
            Presented by{" "}
            <a href="mailto:ahmadosman7212@gmail.com" className="text-cyan-600 hover:text-cyan-400 transition-colors">
              Ahmad Osman
            </a>{" "}
            · {new Date().getFullYear()}
          </p>
        </footer>
      </main>
    </div>
  );
}
