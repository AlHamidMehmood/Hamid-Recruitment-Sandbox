/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { generateHiringAssets, GenerationResult } from './services/ai';
import { 
  ClipboardCopy, 
  Send, 
  Briefcase, 
  Users, 
  Loader2, 
  Check, 
  Info,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [rawNotes, setRawNotes] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [activeTab, setActiveTab] = useState<'jd' | 'guide'>('jd');
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!rawNotes.trim()) return;
    setIsGenerating(true);
    try {
      const data = await generateHiringAssets(rawNotes);
      setResult(data);
      setActiveTab('jd');
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Failed to generate assets. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(id);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#f8f7f2] text-[#3d3d3d] font-sans selection:bg-[#5c6b5e]/30 selection:text-[#1a1a1a]">
      {/* Header Section */}
      <header className="flex items-center justify-between px-8 py-5 bg-white border-b border-[#ece9e4] sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#5c6b5e] rounded-xl flex items-center justify-center text-white shadow-md">
            <Briefcase size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold font-serif tracking-tight text-[#2d332f]">Hamid Recruitment Sandbox</h1>
            <p className="text-[10px] text-[#8B7E66] font-bold uppercase tracking-widest leading-none mt-1">AI Strategy Workspace</p>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-[#5c6b5e]/5 rounded-full border border-[#5c6b5e]/20">
            <Sparkles size={12} className="text-[#5c6b5e]" />
            <span className="text-xs font-semibold text-[#5c6b5e] uppercase tracking-tighter">AI Core Active</span>
          </div>
          <div className="h-8 w-px bg-[#ece9e4]"></div>
          <button 
            onClick={() => result && copyToClipboard(JSON.stringify(result, null, 2), 'export')}
            className="bg-[#5c6b5e] text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#4a574b] transition-all shadow-sm active:translate-y-px"
          >
            {copyStatus === 'export' ? 'Copied JSON' : 'Export Results'}
          </button>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* Input Column */}
        <section className="md:col-span-4 flex flex-col gap-4 h-full">
          <div className="flex items-center gap-2 mb-1 px-2">
            <div className="w-2 h-2 rounded-full bg-[#8B7E66]"></div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#5c6b5e]">Raw Role Notes</h2>
          </div>
          
          <div className="flex-1 min-h-[400px] bg-[#f1efea] rounded-3xl p-6 border border-[#e5e2d9] shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] relative group">
            <textarea
              value={rawNotes}
              onChange={(e) => setRawNotes(e.target.value)}
              placeholder="Paste raw notes, requirements, or team culture details here..."
              className="w-full h-full bg-transparent border-none focus:ring-0 text-[#2d332f] text-sm leading-relaxed resize-none outline-none placeholder:text-[#8B7E66]/50"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !rawNotes.trim()}
            className="w-full py-4 bg-[#8b7e66] text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-[#8b7e66]/20 hover:bg-[#7a6e59] transition-all disabled:opacity-50 active:scale-[0.98]"
          >
            {isGenerating ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
            {isGenerating ? 'Synthesizing...' : 'Synthesize Artifacts'}
          </button>

          <div className="bg-white/50 p-4 rounded-2xl border border-[#ece9e4] flex gap-3 italic text-[11px] text-[#8B7E66]">
            <Info size={14} className="shrink-0 mt-0.5 opacity-60" />
            <span>AI will extract core competencies and behavioral indicators from these notes.</span>
          </div>
        </section>

        {/* Output: JD Column */}
        <section className="md:col-span-4 flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-1 px-2">
            <div className="w-2 h-2 rounded-full bg-[#5c6b5e]"></div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#5c6b5e]">LinkedIn Description</h2>
          </div>

          <div className="flex-1 bg-white rounded-3xl border border-[#ece9e4] shadow-sm overflow-hidden flex flex-col min-h-[600px] max-h-[800px]">
            {!result ? (
              <EmptyState icon={<Briefcase size={32} />} title="Awaiting Input" description="JD will be generated based on your notes." />
            ) : (
              <>
                <div className="p-6 border-b border-[#f5f2ed] flex justify-between items-start bg-white sticky top-0 z-10">
                  <div>
                    <div className="text-[10px] font-bold text-[#5c6b5e] uppercase tracking-tighter mb-1">Generated Output</div>
                    <p className="font-serif italic text-lg leading-tight text-[#2d332f]">Professional LinkedIn Post</p>
                  </div>
                  <button 
                    onClick={() => copyToClipboard(result.jobDescription, 'jd')}
                    className="p-2 hover:bg-[#5c6b5e]/5 rounded-lg text-[#8B7E66] transition-colors"
                  >
                    {copyStatus === 'jd' ? <Check size={18} /> : <ClipboardCopy size={18} />}
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                  <div className="prose prose-stone max-w-none text-sm leading-relaxed text-[#4a4a4a] whitespace-pre-wrap font-sans">
                    {result.jobDescription}
                  </div>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Output: Guide Column */}
        <section className="md:col-span-4 flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-1 px-2">
            <div className="w-2 h-2 rounded-full bg-[#b5a48b]"></div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#5c6b5e]">Interview Guide</h2>
          </div>

          <div className="flex-1 bg-white rounded-3xl border border-[#ece9e4] shadow-sm overflow-hidden flex flex-col min-h-[600px] max-h-[800px]">
             {!result ? (
              <EmptyState icon={<Users size={32} />} title="Behavioral Matrix" description="10 targeted questions will appear here." />
            ) : (
              <>
                <div className="bg-[#5c6b5e] text-white px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] flex justify-between items-center">
                  <span>Behavioral Competencies</span>
                  <button onClick={() => copyToClipboard(result.interviewGuide.join('\n\n'), 'guide')}>
                    {copyStatus === 'guide' ? <Check size={14} /> : <ClipboardCopy size={14} />}
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-0 custom-scrollbar">
                  <div className="divide-y divide-[#f5f2ed]">
                    {result.interviewGuide.map((question, idx) => (
                      <div key={idx} className="p-6 hover:bg-[#f8f7f2]/50 transition-colors">
                        <div className="text-[10px] text-[#8b7e66] font-bold mb-2 uppercase tracking-tighter">
                          Target Question {String(idx + 1).padStart(2, '0')}
                        </div>
                        <p className="text-xs font-serif leading-relaxed italic text-[#3d3d3d]">
                          "{question}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      <footer className="mt-auto py-12 bg-[#f1efea] border-t border-[#e5e2d9]">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6 opacity-60">
          <div className="flex items-center gap-3">
            <Briefcase size={14} className="text-[#8B7E66]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Strategy Sandbox v1.0</span>
          </div>
          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-[#5c6b5e]">Efficiency Protocols</a>
            <a href="#" className="hover:text-[#5c6b5e]">Privacy Vault</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function EmptyState({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-12 opacity-30">
      <div className="mb-4 text-[#5c6b5e]">{icon}</div>
      <h3 className="font-serif italic text-lg text-[#2d332f]">{title}</h3>
      <p className="text-xs uppercase tracking-widest mt-1">{description}</p>
    </div>
  );
}
