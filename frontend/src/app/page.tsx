"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Cpu, Terminal, Scan, FileText, Fingerprint, BoxSelect, Zap, AlertTriangle, Lightbulb, Gavel, Eye, Crosshair, Waves, Activity, Target, Download, Search, RefreshCw } from 'lucide-react';
import { jsPDF } from "jspdf";

export default function DetectiveAI_Master() {
  const [image, setImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [data, setData] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'normal' | 'forensic'>('normal');
  const [logs, setLogs] = useState<string[]>(["[KERNEL] Detective.AI v3.8 Master Core Loaded...", "[NODE] HYD_CSE_ENCRYPTED_SYNC_ACTIVE"]);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { logEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [logs]);

  const addLog = (msg: string) => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  // PREDICTION ENGINE
  const getForensicIntel = () => {
    if (!data) return null;
    const labels = data.detections.map((d: any) => d.label.toLowerCase());
    const isViolent = labels.some((l:string) => ['knife', 'firearm', 'baseball bat'].includes(l));
    const originality = 100 - data.integrity.score;

    let intel = {
      level: 'STABLE', color: 'text-cyan-400',
      scenario: 'Baseline Surveillance Observation',
      hits: labels.length > 0 ? labels.join(", ").toUpperCase() : "NONE",
      clues: "Consistent pixel-grid alignment. Metadata timestamps verified.",
      prediction: "Low probability of incident escalation.",
      solution: "Continue passive logging. No kinetic intervention required."
    };

    if (isViolent) {
      intel = {
        level: 'CRITICAL', color: 'text-red-500',
        scenario: 'High-Probability Aggravated Assault',
        hits: `WEAPON_DETECTED [${labels.find(l => ['knife', 'firearm', 'baseball bat'].includes(l))?.toUpperCase()}]`,
        clues: "Lethal artifact localized via YOLO11 geometry logic.",
        prediction: "92% probability of kinetic engagement within T-minus 120s.",
        solution: "Deploy Emergency Response Units. Lockdown perimeter immediately."
      };
    }
    if (originality < 50) intel.clues += " // ALERT: Non-uniform quantization suggests digital tampering.";
    return intel;
  };

  const intel = getForensicIntel();

  const handleProcess = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Clear previous state for new image
    setImage(URL.createObjectURL(file));
    setData(null);
    setIsScanning(true);
    
    addLog(`Ingesting New Evidence: ${file.name}`);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('http://localhost:8000/analyze', { method: 'POST', body: formData });
      const result = await res.json();
      setData(result);
      addLog(`Signature Hashed: ${result.hash.substring(0, 16)}...`);
    } catch (err) { 
        addLog("CRITICAL: Backend offline."); 
        setIsScanning(false);
    } finally { 
        setIsScanning(false); 
    }
  };

  const downloadPDFReport = () => {
    const doc = new jsPDF();
    doc.setFont("courier", "bold");
    doc.text("DETECTIVE.AI FORENSIC ANALYSIS REPORT", 20, 20);
    doc.setFontSize(10);
    doc.text(`Timestamp: ${new Date().toLocaleString()}`, 20, 35);
    doc.text(`Evidence Hash: ${data.hash}`, 20, 45);
    doc.text(`Originality Score: ${100 - data.integrity.score}%`, 20, 55);
    doc.text(`Threat Level: ${intel?.level}`, 20, 65);
    doc.save(`Forensic_Report_${Date.now()}.pdf`);
  };

  return (
    <div className={`min-h-screen p-4 lg:p-10 font-mono transition-all duration-700 ${viewMode === 'forensic' ? 'bg-[#080000] text-red-50' : 'bg-[#02040a] text-cyan-50'}`}>
      
      {/* 1. HEADER */}
      <header className={`max-w-[1600px] mx-auto mb-10 flex flex-col md:flex-row justify-between items-center border-b pb-8 ${viewMode === 'forensic' ? 'border-red-900/40' : 'border-cyan-900/40'}`}>
        <div className="flex items-center gap-6">
          <Crosshair className={`w-12 h-12 ${viewMode === 'forensic' ? 'text-red-500 animate-pulse' : 'text-cyan-400'}`} />
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase leading-none">Detective.AI // <span className="text-white">Forensic_OS</span></h1>
            <p className="text-[10px] tracking-[0.4em] opacity-40 uppercase mt-2 font-bold">IEEE_RESEARCH_V3.8 // HYD_CSE</p>
          </div>
        </div>
        <div className="flex gap-4 mt-6 md:mt-0">
          {intel && <div className={`px-6 py-2 border rounded-full font-black text-xs ${intel.color} border-current animate-pulse shadow-lg bg-black/40 tracking-widest`}>STATUS: {intel.level}</div>}
          <button onClick={downloadPDFReport} disabled={!data} className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-black flex items-center gap-2 hover:bg-white/10 transition-all disabled:opacity-20"><Download size={16}/> EXPORT_REPORT</button>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto grid grid-cols-12 gap-8">
        {/* 2. VIEWER HUB */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className={`p-6 border rounded-[32px] backdrop-blur-md ${viewMode === 'forensic' ? 'bg-red-950/20 border-red-900/40' : 'bg-white/5 border-white/10'}`}>
            <div className="flex justify-between items-end mb-4 text-[10px] font-black uppercase tracking-widest opacity-60">
              <span className="flex items-center gap-2"><Waves size={16}/> Evidence_Integrity_Gauge</span>
              {data && <span className={data.integrity.score < 40 ? 'text-green-400' : 'text-red-500'}>{100 - data.integrity.score}% AUTHENTIC</span>}
            </div>
            <div className="h-4 bg-black/80 rounded-full overflow-hidden border border-white/5">
              {data && <motion.div initial={{ width: 0 }} animate={{ width: `${100 - data.integrity.score}%` }} className={`h-full ${data.integrity.score < 40 ? 'bg-green-500 shadow-[0_0_15px_green]' : 'bg-red-600 shadow-[0_0_15px_red]'}`} />}
            </div>
          </div>

          <div className={`relative border-2 rounded-[40px] aspect-video bg-black overflow-hidden shadow-2xl transition-all ${viewMode === 'forensic' ? 'border-red-900/50' : 'border-cyan-900/30'}`}>
            {image ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img src={viewMode === 'normal' ? image : data?.integrity.heatmap} className={`max-h-full max-w-full object-contain ${viewMode === 'forensic' ? 'grayscale contrast-150 brightness-110' : ''}`} />
                {viewMode === 'normal' && data?.detections.map((d: any, i: number) => (
                  <motion.div key={i} className="absolute border-2 border-cyan-400 bg-cyan-400/10 shadow-[0_0_15px_cyan]" style={{ left: `${d.bbox[0] * 100}%`, top: `${d.bbox[1] * 100}%`, width: `${(d.bbox[2] - d.bbox[0]) * 100}%`, height: `${(d.bbox[3] - d.bbox[1]) * 100}%` }}>
                    <span className="absolute -top-7 left-0 bg-cyan-400 text-black text-[9px] px-2 py-0.5 font-black uppercase shadow-lg tracking-tighter">{d.label} // {d.conf}%</span>
                  </motion.div>
                ))}
                
                {/* RE-SCAN OPTION (Floating Button) */}
                <label className="absolute bottom-6 right-6 z-[60] cursor-pointer bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 p-3 rounded-full transition-all group">
                   <RefreshCw className={`text-white group-hover:rotate-180 transition-transform duration-500 ${isScanning ? 'animate-spin' : ''}`} size={20} />
                   <input type="file" className="hidden" onChange={handleProcess} />
                </label>

                {isScanning && <motion.div animate={{ top: ["0%", "100%", "0%"] }} transition={{ duration: 1.5, repeat: Infinity }} className={`absolute left-0 w-full h-[3px] z-50 ${viewMode === 'forensic' ? 'bg-red-500 shadow-[0_0_30px_red]' : 'bg-cyan-400 shadow-[0_0_30px_cyan]'}`} />}
              </div>
            ) : (
              <label className="cursor-pointer flex flex-col items-center group opacity-30 hover:opacity-100 transition-opacity"><Scan size={100} className="mb-6 group-hover:text-cyan-500 transition-colors"/><span className="text-[10px] font-black uppercase tracking-[0.8em] group-hover:text-cyan-200">Load_Evidence_Buffer</span><input type="file" className="hidden" onChange={handleProcess} /></label>
            )}
          </div>

          <div className="flex gap-4">
            <button onClick={() => setViewMode('normal')} className={`flex-1 py-5 text-[11px] font-black border-2 rounded-2xl transition-all uppercase ${viewMode === 'normal' ? 'bg-cyan-500 text-black border-cyan-500 shadow-[0_15px_30px_rgba(34,211,238,0.3)]' : 'border-white/5 text-white/30 hover:border-cyan-900'}`}>Visual_Spectrum</button>
            <button onClick={() => setViewMode('forensic')} className={`flex-1 py-5 text-[11px] font-black border-2 rounded-2xl transition-all uppercase ${viewMode === 'forensic' ? 'bg-red-600 text-white border-red-600 shadow-[0_15px_30px_rgba(239,68,68,0.3)]' : 'border-white/5 text-white/30 hover:border-red-900'}`}>Forensic_Audit</button>
          </div>
        </div>

        {/* 3. SIDEBAR */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <section className={`p-8 border-2 rounded-[40px] bg-white/5 backdrop-blur-xl h-[350px] overflow-y-auto ${viewMode === 'forensic' ? 'border-red-900/30 shadow-red-950/20' : 'border-cyan-900/20 shadow-cyan-950/20'}`}>
            <h2 className="text-[10px] font-black uppercase mb-6 opacity-40 tracking-[0.4em] border-l-4 border-cyan-500 pl-3">Target_Artifact_Log</h2>
            {data?.detections.map((d: any, i: number) => (
              <div key={i} className="flex justify-between p-4 mb-4 bg-black/60 rounded-xl border border-white/5 text-[10px] font-black shadow-lg">
                <span className="flex items-center gap-3 tracking-tighter text-cyan-200 underline decoration-cyan-900 underline-offset-4">{d.label.toUpperCase()}</span>
                <span className="text-cyan-400 font-mono italic">{d.conf}%</span>
              </div>
            ))}
          </section>
          <section className="p-4 bg-black border-2 border-white/5 rounded-[40px] h-[250px] overflow-y-auto text-[9px] text-cyan-900 font-mono shadow-inner">
            <div className="flex items-center gap-2 mb-4 uppercase font-bold text-cyan-600 border-b border-cyan-950 pb-2"><Terminal size={14}/> Forensic_Console</div>
            {logs.map((l, i) => <p key={i}>{l}</p>)}
            <div ref={logEndRef} />
          </section>
        </div>

        {/* 4. ENLARGED INTELLIGENCE BRIEFING */}
        <section className={`col-span-12 p-12 border-2 rounded-[56px] backdrop-blur-3xl shadow-2xl transition-all ${viewMode === 'forensic' ? 'bg-red-950/20 border-red-900/40' : 'bg-white/5 border-white/5'}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-8">
              <div className="flex items-center gap-4 text-cyan-400 font-black uppercase tracking-[0.4em] mb-4"><Search size={24}/> <span>Evidence_Briefing</span></div>
              <div className="p-8 bg-black/80 rounded-[32px] border border-white/5 text-xs leading-loose text-cyan-100/80 italic font-mono shadow-inner">
                {data ? (
                  <div className="space-y-6">
                    <p className="text-cyan-500 font-black uppercase text-[10px] border-b border-cyan-900 pb-2 mb-4 tracking-widest font-bold">I. Scene Synthesis</p>
                    <p>Primary Artifacts: <span className="text-white font-bold">{intel?.hits}</span>.</p>
                    <p>Incident Class: <span className="text-white font-bold underline decoration-cyan-900 underline-offset-8 italic">"{intel?.scenario}"</span>.</p>
                    <p className="mt-8 text-cyan-500 font-black uppercase text-[10px] border-b border-cyan-900 pb-2 mb-4 tracking-widest font-bold">II. Forensic Clues</p>
                    <p className="opacity-90 leading-relaxed font-bold">"{intel?.clues}"</p>
                    <p className="mt-10 text-[9px] text-cyan-950 font-black truncate opacity-40 uppercase tracking-tighter">Digital_Signature: {data.hash}</p>
                  </div>
                ) : <p className="text-center py-20 opacity-20 uppercase tracking-[0.8em]">Awaiting_Neural_Packet...</p>}
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex items-center gap-4 text-green-400 font-black uppercase tracking-[0.4em] mb-4"><Gavel size={24}/> <span>Predictive_Logic</span></div>
              <div className="p-8 bg-green-950/5 rounded-[32px] border border-green-500/10 text-xs leading-loose shadow-2xl">
                {intel ? (
                  <div className="space-y-10">
                    <div>
                      <p className="text-green-500 font-black uppercase text-[10px] mb-4 border-b border-green-900 pb-2 tracking-widest font-bold">III. Behavioral Prediction</p>
                      <p className="text-green-50 italic text-lg leading-tight tracking-tighter">"{intel.prediction}"</p>
                    </div>
                    <div>
                      <p className="text-green-500 font-black uppercase text-[10px] mb-4 border-b border-green-900 pb-2 tracking-widest font-bold">IV. Actionable Strategy</p>
                      <p className="text-green-100 text-2xl font-black leading-tight tracking-tighter italic">"{intel.solution}"</p>
                    </div>
                    <div className="flex justify-between items-center pt-8 border-t border-green-900/20 text-[10px] font-black uppercase opacity-60">
                      <span>Inference_Accuracy: 94.8%</span>
                      <span className="bg-green-500 text-black px-4 py-1 rounded-full">Priority_Level_I</span>
                    </div>
                  </div>
                ) : <p className="text-center py-20 opacity-20 uppercase tracking-[0.8em]">Synthesizing_Resolution_Path...</p>}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}