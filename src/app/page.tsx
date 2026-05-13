"use client";
import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from "recharts";
import { Shield, Brain, Activity, Search, AlertTriangle, CheckCircle, Play, Zap, Eye, Wifi, RotateCcw } from "lucide-react";

type Sim = "idle"|"analyzing"|"complete";

const NORMAL = Array.from({length:20},(_,i)=>({t:`T${i}`,v:+(25+Math.sin(i*.6)*7+Math.random()*3).toFixed(1)}));
const SPIKE  = [...NORMAL.slice(0,14),{t:"T14",v:72},{t:"T15",v:98},{t:"T16",v:115},{t:"T17",v:108},{t:"T18",v:120},{t:"T19",v:116}];
const PKTS   = [{l:"SYN",bad:true},{l:"GET",bad:false},{l:"SYN",bad:true},{l:"ACK",bad:false},{l:"UDP",bad:false},{l:"RST",bad:true},{l:"PSH",bad:false},{l:"SYN",bad:true}];
const FEATS  = ["Packet Size","Request Rate","IP Reputation","Click Speed","Nav Pattern","Session Time","URL Repeat","User-Agent","Endpoint"];

const SC = [
  {id:1,icon:<Search className="w-4 h-4"/>,label:"Signature-Based",color:"blue",mode:"Pattern Matching",result:"Attack Identified",risk:"High",conf:"97%",
   why:"3 packets matched known SYN-Flood signatures. Source IPs found on global blocklist. Payload matched template #AF-2291.",
   b:"Detection works like fingerprint matching — if traffic matches a known bad pattern, it gets blocked.",
   a:"Relies on predefined signatures. Efficient for known attacks but limited against zero-day threats."},
  {id:2,icon:<Activity className="w-4 h-4"/>,label:"Anomaly-Based",color:"violet",mode:"Statistical Baseline",result:"Anomaly Detected",risk:"Medium",conf:"91%",
   why:"Traffic exceeded threshold by 82%. Inter-arrival time dropped 94%. Deviation score crossed 4.2σ.",
   b:"The system learns normal traffic. A sudden spike triggers a suspicious alert.",
   a:"Models normal behaviour and flags statistical deviations. Useful for unknown or evolving attacks."},
  {id:3,icon:<Wifi className="w-4 h-4"/>,label:"Protocol Analysis",color:"amber",mode:"TCP State Inspection",result:"Protocol Abuse",risk:"High",conf:"99%",
   why:"847 half-open TCP connections in 3 seconds. 99.4% of SYN requests received no ACK — SYN Flood confirmed.",
   b:"If many connections start but never finish, the system detects something is wrong.",
   a:"Detects deviations from TCP protocol semantics. Half-open connections indicate SYN Flood exhaustion."},
  {id:4,icon:<Brain className="w-4 h-4"/>,label:"AI / ML",color:"purple",mode:"Behavioural AI",result:"Bot DDoS Detected",risk:"Critical",conf:"99.7%",
   why:"Random Forest: 97.3% flows malicious. Bot probability 0.973. Same URL repeated 12,400× in 30 seconds.",
   b:"AI studies behaviour — if requests look like a bot, it detects it without needing a known signature.",
   a:"ML models classify flows using extracted features. Effective against zero-day and Layer-7 attacks."},
] as const;

const CLR: Record<string,{bg:string,text:string,border:string}> = {
  blue:   {bg:"bg-blue-50",   text:"text-blue-700",   border:"border-blue-200"},
  violet: {bg:"bg-violet-50", text:"text-violet-700", border:"border-violet-200"},
  amber:  {bg:"bg-amber-50",  text:"text-amber-700",  border:"border-amber-200"},
  purple: {bg:"bg-purple-50", text:"text-purple-700", border:"border-purple-200"},
  rose:   {bg:"bg-rose-50",   text:"text-rose-700",   border:"border-rose-200"},
  emerald:{bg:"bg-emerald-50",text:"text-emerald-700",border:"border-emerald-200"},
  slate:  {bg:"bg-slate-100", text:"text-slate-600",  border:"border-slate-200"},
};

export default function Page() {
  const [sid, setSid] = useState(1);
  const [sim, setSim] = useState<Sim>("idle");
  const [scanStep, setScanStep] = useState(-1);
  const [synCount, setSynCount] = useState(0);
  const [featIdx, setFeatIdx]   = useState(0);

  const sc = SC.find(s=>s.id===sid)!;

  const reset = () => { setSim("idle"); setScanStep(-1); setSynCount(0); setFeatIdx(0); };
  const run   = () => { reset(); setTimeout(()=>{ setSim("analyzing"); setTimeout(()=>setSim("complete"),3500); },50); };

  useEffect(()=>{ if(sid!==1||sim!=="analyzing") return; let i=0; const t=setInterval(()=>{ setScanStep(i++); if(i>=PKTS.length) clearInterval(t); },380); return()=>clearInterval(t); },[sid,sim]);
  useEffect(()=>{ if(sid!==3||sim!=="analyzing") return; const t=setInterval(()=>setSynCount(c=>Math.min(c+Math.floor(Math.random()*55+10),850)),110); return()=>clearInterval(t); },[sid,sim]);
  useEffect(()=>{ if(sid!==4||sim!=="analyzing") return; let i=0; const t=setInterval(()=>{ setFeatIdx(i++); if(i>=FEATS.length) clearInterval(t); },320); return()=>clearInterval(t); },[sid,sim]);

  const c = CLR[sc.color];

  return (
    <div className="min-h-screen bg-white" style={{fontFamily:"'Inter',system-ui,sans-serif"}}>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm shadow-blue-200">
              <Shield className="w-5 h-5 text-white"/>
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">AI-Driven DoS/DDoS Detection Dashboard</div>
              <div className="text-slate-400 text-xs mt-0.5">Defensive Simulation · Ahmad Osman · Stage 4 · 2026</div>
            </div>
          </div>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block"/>Live Engine
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-4">
            <Zap className="w-3 h-3"/>Cybersecurity Seminar Presentation
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 leading-tight">
            Interactive Scenario Simulator<br/>
            <span className="text-blue-600">AI-Driven Attack Detection</span>
          </h1>
          <p className="text-slate-500 text-base max-w-2xl mb-8">
            Explore how signature matching, anomaly detection, protocol analysis, and machine learning identify malicious traffic through guided visual simulations.
          </p>
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {l:"Traffic Status",v:sim==="complete"?sc.result:sim==="analyzing"?"Analyzing…":"Monitoring",cl:sim==="complete"?"rose":sim==="analyzing"?"amber":"blue"},
              {l:"Detection Mode",  v:sc.mode,       cl:sc.color},
              {l:"Risk Level",      v:sim==="complete"?sc.risk:"—",   cl:sim==="complete"?(sc.risk==="Critical"||sc.risk==="High"?"rose":"amber"):"slate"},
              {l:"AI Confidence",   v:sim==="complete"?sc.conf:"—",   cl:"emerald"},
            ].map(k=>{ const kc=CLR[k.cl]||CLR.slate; return (
              <div key={k.l} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <div className={`text-sm font-bold mb-0.5 ${sim==="complete"?kc.text:"text-slate-800"}`}>{k.v}</div>
                <div className="text-xs text-slate-400">{k.l}</div>
              </div>
            );})}
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-xl font-black text-slate-900 mb-2">Detection Scenarios</h2>
        <p className="text-slate-500 text-sm mb-6">Select a scenario, then run the simulation to observe the detection engine live.</p>

        {/* Scenario selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {SC.map(s=>{ const sc2=CLR[s.color]; const on=sid===s.id; return (
            <button key={s.id} onClick={()=>{setSid(s.id);reset();}}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-semibold transition-all duration-200 text-left
                ${on?`${sc2.bg} ${sc2.text} ${sc2.border} shadow-sm`:"bg-white text-slate-600 border-slate-200 hover:border-slate-300"}`}>
              {s.icon}<span>{s.label}</span>
            </button>
          );})}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Visualization */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${c.bg} ${c.text}`}>{sc.icon}</div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{sc.label} Detection</div>
                    <div className="text-xs text-slate-400">{sc.mode}</div>
                  </div>
                </div>
                {sim==="analyzing"&&<span className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold animate-pulse">⟳ Analyzing</span>}
                {sim==="complete" &&<span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold"><AlertTriangle className="w-3 h-3"/>{sc.result}</span>}
              </div>
              <div className="p-6">

                {/* SCENARIO 1 */}
                {sid===1&&(
                  <div>
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      {PKTS.map((p,i)=>{ const scanned=scanStep>i; const hit=scanned&&p.bad; const scanning=scanStep===i; return (
                        <div key={i} className={`rounded-xl border p-3 text-center transition-all duration-300 ${hit?"bg-rose-50 border-rose-300 scale-105":scanning?"bg-blue-50 border-blue-300":scanned?"bg-slate-50 border-slate-200":"bg-white border-slate-200"}`}>
                          <div className={`text-xs font-mono font-bold mb-1.5 ${hit?"text-rose-600":"text-slate-400"}`}>{p.l}</div>
                          {hit?<AlertTriangle className="w-5 h-5 text-rose-500 mx-auto"/>:scanning?<Search className="w-5 h-5 text-blue-500 mx-auto animate-pulse"/>:scanned?<CheckCircle className="w-5 h-5 text-emerald-400 mx-auto"/>:<div className="w-5 h-1.5 bg-slate-200 rounded mx-auto"/>}
                          {hit&&<div className="text-[9px] text-rose-600 font-bold mt-1">MATCH</div>}
                        </div>
                      );})}
                    </div>
                    {sim!=="idle"&&(
                      <div>
                        <div className="flex justify-between text-xs text-slate-500 mb-1"><span>Scan progress</span><span>{Math.min(100,Math.round(((scanStep+1)/PKTS.length)*100))}%</span></div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full transition-all duration-300" style={{width:`${Math.min(100,Math.round(((scanStep+1)/PKTS.length)*100))}%`}}/></div>
                      </div>
                    )}
                  </div>
                )}

                {/* SCENARIO 2 */}
                {sid===2&&(
                  <div>
                    <ResponsiveContainer width="100%" height={240}>
                      <AreaChart data={sim==="complete"?SPIKE:NORMAL} margin={{top:10,right:10,bottom:0,left:-20}}>
                        <defs>
                          <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#2563EB" stopOpacity={0.2}/>
                            <stop offset="100%" stopColor="#2563EB" stopOpacity={0.02}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                        <XAxis dataKey="t" tick={{fill:"#94a3b8",fontSize:10}} tickLine={false}/>
                        <YAxis tick={{fill:"#94a3b8",fontSize:10}} tickLine={false} domain={[0,130]}/>
                        <ReferenceLine y={65} stroke="#ef4444" strokeDasharray="5 3" label={{value:"⚠ Threshold",fill:"#ef4444",fontSize:10,position:"insideTopRight"}}/>
                        {/* @ts-ignore */}
                        <Tooltip contentStyle={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,fontSize:11}} formatter={(v:any)=>[typeof v==="number"?`${v.toFixed(1)} Mbps`:v,"Traffic"]}/>
                        <Area type="monotone" dataKey="v" stroke="#2563EB" strokeWidth={2.5} fill="url(#gA)" dot={false} activeDot={{r:4,fill:"#2563EB"}}/>
                      </AreaChart>
                    </ResponsiveContainer>
                    {sim==="complete"&&<div className="mt-3 flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200"><AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0"/><span className="text-xs text-rose-700 font-semibold">Traffic spiked 82% above baseline — anomaly alert triggered at T=14</span></div>}
                  </div>
                )}

                {/* SCENARIO 3 */}
                {sid===3&&(
                  <div>
                    <div className="grid grid-cols-3 gap-3 text-center text-xs mb-5">
                      {["CLIENT","NETWORK","SERVER"].map(n=>(
                        <div key={n} className="rounded-xl bg-slate-50 border border-slate-200 py-3 font-bold text-slate-600">{n}</div>
                      ))}
                    </div>
                    <div className="space-y-2 mb-5">
                      {[{label:"SYN →",complete:true},{label:"SYN/ACK ←",complete:true},{label:"ACK → ✓",complete:true}].map((r,i)=>(
                        <div key={i} className="flex items-center gap-2 text-xs">
                          <div className="flex-1 h-0.5 bg-emerald-300 rounded"/>
                          <span className="text-emerald-700 font-semibold px-2">{r.label}</span>
                          <div className="flex-1 h-0.5 bg-emerald-300 rounded"/>
                        </div>
                      ))}
                      {sim!=="idle"&&Array.from({length:Math.min(5,Math.floor(synCount/120))}).map((_,i)=>(
                        <div key={i} className="flex items-center gap-2 text-xs">
                          <div className="flex-1 h-0.5 bg-rose-300 rounded"/>
                          <span className="text-rose-600 font-semibold px-2">SYN → (no ACK)</span>
                          <div className="flex-1 h-0.5 border-t-2 border-rose-300 border-dashed rounded"/>
                        </div>
                      ))}
                    </div>
                    <div className={`rounded-xl border p-4 transition-all duration-500 ${synCount>500?"bg-rose-50 border-rose-300":"bg-amber-50 border-amber-200"}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-700">Half-Open Connections</span>
                        <span className={`text-xl font-black ${synCount>500?"text-rose-600":"text-amber-600"}`}>{synCount.toLocaleString()}</span>
                      </div>
                      <div className="h-2 bg-white rounded-full overflow-hidden border border-slate-200">
                        <div className="h-full rounded-full transition-all duration-200" style={{width:`${Math.min(100,(synCount/850)*100)}%`,background:synCount>500?"#ef4444":"#f59e0b"}}/>
                      </div>
                      {sim==="complete"&&<p className="text-xs text-rose-700 font-semibold mt-2">⚠ Resource exhaustion threshold exceeded — SYN Flood confirmed</p>}
                    </div>
                  </div>
                )}

                {/* SCENARIO 4 */}
                {sid===4&&(
                  <div>
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 text-white">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">AI Decision Core</div>
                          <div className="text-base font-black">Behavioural Classification Engine</div>
                        </div>
                        <div className="w-9 h-9 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
                          <Brain className="w-5 h-5 text-violet-300"/>
                        </div>
                      </div>
                      {/* Feature chips */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {FEATS.map((f,i)=>(
                          <span key={f} className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-all duration-300 ${i<featIdx?"bg-violet-500/30 text-violet-300 border border-violet-500/40":"bg-white/5 text-slate-600 border border-white/10"}`}>{f}</span>
                        ))}
                      </div>
                      {/* Metrics */}
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {[
                          {l:"Model Accuracy",v:"99.7%",c:"text-violet-300"},
                          {l:"Bot Probability",v:sim==="complete"?"0.973":"—",c:"text-rose-400"},
                          {l:"Packets/sec",v:"3.2M",c:"text-blue-300"},
                          {l:"Layer-7 Match",v:sim==="complete"?"YES":"—",c:"text-amber-300"},
                        ].map(m=>(
                          <div key={m.l} className="rounded-xl bg-white/5 border border-white/10 p-3">
                            <div className={`text-sm font-black ${m.c}`}>{m.v}</div>
                            <div className="text-slate-500 text-xs mt-0.5">{m.l}</div>
                          </div>
                        ))}
                      </div>
                      {sim==="complete"&&(
                        <div className="rounded-xl bg-rose-500/20 border border-rose-500/40 p-3 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0"/>
                          <span className="text-rose-300 text-xs font-bold">AI Decision: Application-Layer DDoS (Bot) · Confidence 99.7%</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      {[{l:"Supervised Learning",d:"Trained on CICIDS2017 labeled flows"},{l:"Unsupervised Learning",d:"Detects anomalies without known labels"}].map(m=>(
                        <div key={m.l} className="rounded-xl bg-slate-50 border border-slate-200 p-3">
                          <div className="font-bold text-slate-700 mb-0.5">{m.l}</div>
                          <div className="text-slate-500">{m.d}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="px-6 pb-5 flex gap-3">
                <button onClick={run} disabled={sim==="analyzing"}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-blue-600 text-white shadow-sm shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 transition-all">
                  <Play className="w-4 h-4"/>Run Simulation
                </button>
                <button onClick={reset}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white border border-slate-200 text-slate-600 hover:border-slate-300 transition-all">
                  <RotateCcw className="w-4 h-4"/>Reset
                </button>
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <Eye className="w-4 h-4 text-blue-600"/>
                <h3 className="font-bold text-slate-900 text-sm">Why was this detected?</h3>
              </div>
              {sim==="complete"?(
                <p className="text-slate-600 text-sm leading-relaxed">{sc.why}</p>
              ):(
                <p className="text-slate-400 text-sm">Run the simulation to see the detection reasoning.</p>
              )}
            </div>
            <div className={`rounded-2xl border p-5 ${c.bg} ${c.border}`}>
              <div className={`text-xs font-bold uppercase tracking-widest mb-2 ${c.text}`}>Beginner Explanation</div>
              <p className={`text-sm leading-relaxed ${c.text} opacity-90`}>{sc.b}</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Academic Context</div>
              <p className="text-slate-600 text-sm leading-relaxed">{sc.a}</p>
              {sid===4&&<p className="text-slate-500 text-xs mt-2 pt-2 border-t border-slate-100">CICIDS2017 features: packet count, flow duration, inter-arrival time, protocol stats.</p>}
            </div>
          </div>
        </div>

        {/* Seminar card */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-200">
          <div className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-2">Seminar Script</div>
          <p className="text-base leading-relaxed">
            "In DoS and DDoS defense, the core challenge is distinguishing legitimate users from malicious traffic.
            <strong className="font-semibold"> Signature-based detection</strong> identifies known attack fingerprints.
            <strong className="font-semibold"> Anomaly-based detection</strong> finds deviations from normal behaviour.
            <strong className="font-semibold"> Protocol analysis</strong> detects misuse of network rules.
            <strong className="font-semibold"> AI-based detection</strong> studies large-scale behavioural patterns in real time — achieving 99.7% accuracy on the CICIDS2017 dataset."
          </p>
        </div>
      </main>

      <footer className="text-center py-6 text-slate-400 text-xs border-t border-slate-100 mt-8">
        DoS &amp; DDoS Defense Lab · Ahmad Osman · ahmadosman7212@gmail.com · 2026
      </footer>
    </div>
  );
}
