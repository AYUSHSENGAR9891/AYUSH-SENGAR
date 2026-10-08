import React from 'react';
import { 
  Zap, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  Unlock, 
  X, 
  Cpu,
  Check
} from 'lucide-react';
import { RoadmapNode, RoadmapData } from '../../types/roadmap';

interface ReplanningModalProps {
  node: RoadmapNode | null;
  roadmap: RoadmapData;
  isOpen: boolean;
  onClose: () => void;
  onConfirmReplanning: (node: RoadmapNode, weeksSaved: number) => void;
}

export const ReplanningModal: React.FC<ReplanningModalProps> = ({
  node,
  roadmap,
  isOpen,
  onClose,
  onConfirmReplanning
}) => {
  if (!isOpen || !node) return null;

  const hoursPerWeek = roadmap.hoursPerWeek || 10;
  const hours = node.estimatedHours || 30;
  // Dynamic reasonable weeks saved based on node hours and study pace
  const weeksSaved = Math.max(1, Math.round(hours / hoursPerWeek));
  const currentWeeks = roadmap.estimatedWeeks || 24;
  const newWeeks = Math.max(2, currentWeeks - weeksSaved);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-950 border border-cyan-500/35 shadow-[0_0_60px_rgba(6,182,212,0.3)] p-6 md:p-7 text-white overflow-hidden">
        {/* Futuristic glowing ambient background */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header: AI REPLANNING */}
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Cpu className="w-4 h-4 animate-spin text-cyan-400" />
          </div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
            AI REPLANNING
          </span>
        </div>

        {/* Title: You already know [Skill] */}
        <h2 className="text-xl md:text-2xl font-black tracking-tight text-white mb-2">
          You already know {node.title}.
        </h2>

        <p className="text-xs text-slate-300 mb-5 leading-relaxed">
          CareerQuest AI will re-index your career graph, mark this prerequisite complete, and automatically accelerate your downstream milestones.
        </p>

        {/* Comparison Metrics Card */}
        <div className="p-4 rounded-xl bg-slate-900/85 border border-white/10 mb-5 space-y-3 font-mono">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Original roadmap:</span>
            <span className="text-slate-300 font-bold">{currentWeeks} weeks</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Updated roadmap:</span>
            <span className="text-cyan-300 font-bold text-sm bg-cyan-500/15 px-2 py-0.5 rounded border border-cyan-500/30">
              {newWeeks} weeks
            </span>
          </div>

          <div className="h-[1px] bg-white/5 my-1" />

          <div className="flex items-center justify-between text-xs">
            <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Time saved:
            </span>
            <span className="text-emerald-400 font-black text-sm">
              {weeksSaved} {weeksSaved === 1 ? 'week' : 'weeks'}
            </span>
          </div>
        </div>

        {/* Notice: Your roadmap has been optimized */}
        <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 mb-5 flex items-center gap-2 text-xs text-cyan-200">
          <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span className="font-semibold">Your roadmap has been optimized.</span>
        </div>

        {/* Downstream cascade preview */}
        <div className="mb-6 space-y-1.5 text-xs text-slate-300 bg-slate-900/40 p-3 rounded-xl border border-white/5">
          <div className="flex items-center gap-2 text-emerald-300 text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Mark "{node.title}" as verified knowledge</span>
          </div>
          <div className="flex items-center gap-2 text-cyan-300 text-[11px]">
            <Unlock className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Unlock downstream dependencies automatically</span>
          </div>
          <div className="flex items-center gap-2 text-amber-300 text-[11px]">
            <Zap className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Advance target job readiness date</span>
          </div>
        </div>

        {/* Action Buttons: Apply New Roadmap */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl border border-white/10 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirmReplanning(node, weeksSaved)}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs shadow-[0_0_25px_rgba(6,182,212,0.45)] flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>Apply New Roadmap</span>
          </button>
        </div>
      </div>
    </div>
  );
};
