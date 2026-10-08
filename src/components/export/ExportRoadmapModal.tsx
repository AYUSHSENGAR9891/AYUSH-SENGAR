import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Copy, 
  Check, 
  Download, 
  Share2, 
  FileText, 
  Sparkles,
  Calendar,
  Clock,
  Layers
} from 'lucide-react';
import { RoadmapData } from '../../types/roadmap';

interface ExportRoadmapModalProps {
  roadmap: RoadmapData;
  isOpen: boolean;
  onClose: () => void;
}

export const ExportRoadmapModal: React.FC<ExportRoadmapModalProps> = ({
  roadmap,
  isOpen,
  onClose
}) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedType('link');
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(roadmap, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${roadmap.career.replace(/\s+/g, '_')}_Roadmap.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopyMarkdown = () => {
    let md = `# CareerQuest AI: ${roadmap.career}\n`;
    md += `**Industry:** ${roadmap.industry} | **Target Timeline:** ${roadmap.timeline} (${roadmap.estimatedWeeks} weeks @ ${roadmap.hoursPerWeek} hrs/wk)\n\n`;
    md += `## Learning Phases & Milestones\n\n`;

    roadmap.phases.forEach((p, idx) => {
      md += `### Phase ${idx + 1}: ${p.name} (${p.duration})\n`;
      md += `${p.description}\n\n`;
      p.nodes.forEach(n => {
        md += `- **[${n.status.toUpperCase()}] ${n.title}** (${n.estimatedHours} hrs, ${n.difficulty})\n`;
        md += `  - Mission: ${n.mission}\n`;
        md += `  - Proof: ${n.githubProof}\n`;
      });
      md += `\n`;
    });

    navigator.clipboard.writeText(md);
    setCopiedType('markdown');
    setTimeout(() => setCopiedType(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-3xl rounded-2xl bg-slate-950 border border-white/10 p-6 md:p-8 text-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Export & Share Roadmap</h2>
              <p className="text-xs text-slate-400">Save, print, or share your reverse-engineered skill tree</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <button
            onClick={handlePrint}
            className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-xs font-semibold text-white flex flex-col items-center gap-1.5 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 text-cyan-400" />
            Print / Save PDF
          </button>

          <button
            onClick={handleCopyShareLink}
            className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-xs font-semibold text-white flex flex-col items-center gap-1.5 transition-all cursor-pointer"
          >
            {copiedType === 'link' ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-cyan-400" />}
            {copiedType === 'link' ? 'Link Copied!' : 'Copy Share Link'}
          </button>

          <button
            onClick={handleCopyMarkdown}
            className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-xs font-semibold text-white flex flex-col items-center gap-1.5 transition-all cursor-pointer"
          >
            {copiedType === 'markdown' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
            {copiedType === 'markdown' ? 'Copied MD!' : 'Copy Markdown'}
          </button>

          <button
            onClick={handleDownloadJSON}
            className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-xs font-semibold text-white flex flex-col items-center gap-1.5 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            Download JSON
          </button>
        </div>

        {/* Printable Preview Container */}
        <div className="flex-1 overflow-y-auto p-6 rounded-xl bg-slate-900/60 border border-white/5 space-y-6 text-xs text-slate-300">
          <div className="border-b border-white/10 pb-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block mb-1">
              CareerQuest AI Portfolio Roadmap
            </span>
            <h1 className="text-xl font-bold text-white mb-2">{roadmap.career}</h1>
            <div className="flex flex-wrap items-center gap-4 text-slate-400 text-xs">
              <span>Industry: <strong className="text-white">{roadmap.industry}</strong></span>
              <span>Level: <strong className="text-white">{roadmap.level}</strong></span>
              <span>Pacing: <strong className="text-white">{roadmap.hoursPerWeek} hrs/week</strong></span>
              <span>Duration: <strong className="text-white">{roadmap.estimatedWeeks} weeks</strong></span>
            </div>
          </div>

          {/* Phases List */}
          <div className="space-y-4">
            {roadmap.phases.map((phase, pIdx) => (
              <div key={phase.id} className="p-4 rounded-xl bg-slate-950/80 border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>{phase.name}</span>
                  <span className="text-cyan-400 text-[11px] font-mono">{phase.duration}</span>
                </div>
                <p className="text-[11px] text-slate-400">{phase.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  {phase.nodes.map(n => (
                    <div key={n.id} className="p-2.5 rounded-lg bg-slate-900/70 border border-white/5">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-white mb-1">
                        <span className="truncate">{n.title}</span>
                        <span className="text-slate-400 font-mono text-[10px]">{n.estimatedHours}h</span>
                      </div>
                      <div className="text-[10px] text-slate-400 line-clamp-1">{n.mission}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
