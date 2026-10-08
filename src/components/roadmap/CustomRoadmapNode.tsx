import React, { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  Flame, 
  Code2, 
  FolderGit2, 
  Briefcase, 
  HelpCircle, 
  Trophy, 
  Clock, 
  ChevronRight,
  Zap,
  Info
} from 'lucide-react';
import { RoadmapNode } from '../../types/roadmap';

interface CustomNodeProps {
  data: {
    node: RoadmapNode;
    isSelected: boolean;
    onSelectNode: (node: RoadmapNode) => void;
    onQuickKnown: (node: RoadmapNode) => void;
  };
}

export const CustomRoadmapNode = memo(({ data }: CustomNodeProps) => {
  const node = data?.node;
  const isSelected = !!data?.isSelected;
  const onSelectNode = data?.onSelectNode;
  const onQuickKnown = data?.onQuickKnown;
  const [isHovered, setIsHovered] = useState(false);

  if (!node) {
    return null;
  }

  const getStatusStyles = () => {
    switch (node.status) {
      case 'completed':
        return {
          border: 'border-emerald-500/70 hover:border-emerald-400',
          bg: 'bg-emerald-950/35 backdrop-blur-md',
          glow: 'shadow-[0_0_22px_rgba(16,185,129,0.28)]',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        };
      case 'known':
        return {
          border: 'border-blue-400/80 hover:border-blue-300',
          bg: 'bg-blue-950/35 backdrop-blur-md',
          glow: 'shadow-[0_0_22px_rgba(59,130,246,0.3)]',
          badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
        };
      case 'active':
        return {
          border: 'border-cyan-400 ring-2 ring-cyan-400/50',
          bg: 'bg-slate-900/95 backdrop-blur-md',
          glow: 'shadow-[0_0_28px_rgba(6,182,212,0.4)]',
          badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
          icon: <Flame className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
        };
      case 'recommended':
        return {
          border: 'border-amber-400/80 hover:border-amber-300',
          bg: 'bg-slate-900/90 backdrop-blur-md',
          glow: 'shadow-[0_0_22px_rgba(245,158,11,0.25)]',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          icon: <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        };
      case 'optional':
        return {
          border: 'border-purple-500/50 border-dashed hover:border-purple-400',
          bg: 'bg-purple-950/20 backdrop-blur-md',
          glow: 'shadow-[0_0_15px_rgba(168,85,247,0.15)]',
          badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
          icon: <Sparkles className="w-3.5 h-3.5 text-purple-400" />
        };
      case 'locked':
      default:
        return {
          border: 'border-slate-800 hover:border-slate-700',
          bg: 'bg-slate-950/70 backdrop-blur-md opacity-75',
          glow: 'shadow-none',
          badge: 'bg-slate-800 text-slate-400 border-slate-700/50',
          icon: <Lock className="w-3 h-3 text-slate-500" />
        };
    }
  };

  const getTypeIcon = () => {
    switch (node.type) {
      case 'project':
        return <FolderGit2 className="w-3.5 h-3.5 text-indigo-400" />;
      case 'portfolio':
        return <FolderGit2 className="w-3.5 h-3.5 text-purple-400" />;
      case 'experience':
        return <Briefcase className="w-3.5 h-3.5 text-blue-400" />;
      case 'interview':
        return <HelpCircle className="w-3.5 h-3.5 text-amber-400" />;
      case 'milestone':
        return <Trophy className="w-3.5 h-3.5 text-yellow-400" />;
      default:
        return <Code2 className="w-3.5 h-3.5 text-cyan-400" />;
    }
  };

  const style = getStatusStyles();

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelectNode && onSelectNode(node)}
      className={`group relative w-[300px] rounded-2xl border p-4 transition-all duration-300 cursor-pointer select-none text-left
        ${style.border} ${style.bg} ${style.glow}
        ${isSelected ? 'ring-2 ring-cyan-400 scale-[1.03] shadow-[0_0_35px_rgba(6,182,212,0.55)]' : 'hover:scale-[1.02]'}
      `}
    >
      {/* React Flow Connection Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-cyan-400 !border-2 !border-slate-950 !-top-1.5 transition-colors group-hover:!bg-cyan-300"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-cyan-400 !border-2 !border-slate-950 !-bottom-1.5 transition-colors group-hover:!bg-cyan-300"
      />

      {/* HOVER TOOLTIP (Section 3 Requirement) */}
      {isHovered && (
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 z-50 w-72 bg-slate-950 border border-cyan-500/40 rounded-xl p-2.5 shadow-2xl text-[11px] text-slate-200 pointer-events-none animate-fadeIn">
          <div className="flex items-center justify-between font-bold text-white mb-1">
            <span className="truncate text-cyan-300">{node.title}</span>
            <span className="text-[10px] text-slate-400 uppercase font-mono">{node.status}</span>
          </div>
          {node.prerequisites && node.prerequisites.length > 0 && (
            <div className="text-[10px] text-amber-300/90 mb-1 truncate">
              Prereq: {node.prerequisites.join(', ')}
            </div>
          )}
          <div className="text-[10px] text-slate-300 flex items-center justify-between">
            <span>{node.difficulty} · {node.estimatedHours} hours</span>
            <span className="text-cyan-400 font-semibold">Click for AI Panel →</span>
          </div>
          <div className="w-2.5 h-2.5 bg-slate-950 border-r border-b border-cyan-500/40 rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1/2" />
        </div>
      )}

      {/* Top Meta Line: Status & Type */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          <span className="p-1 rounded-md bg-white/5 border border-white/10">
            {getTypeIcon()}
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {node.type}
          </span>
        </div>

        {/* STATUS BADGE */}
        <div className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${style.badge}`}>
          {style.icon}
          <span>{node.status}</span>
        </div>
      </div>

      {/* Node Title (Skill Name) */}
      <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1 mb-1">
        {node.title}
      </h4>

      {/* Short description */}
      <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
        {node.description}
      </p>

      {/* Required Node Specs: Difficulty & Estimated hours */}
      <div className="flex items-center justify-between text-xs pt-2.5 border-t border-white/5 text-slate-300">
        <div className="flex items-center gap-1 text-slate-300 font-medium">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{node.estimatedHours} hours</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${
            node.difficulty === 'Beginner' ? 'text-emerald-300 bg-emerald-500/15 border border-emerald-500/20' :
            node.difficulty === 'Intermediate' ? 'text-cyan-300 bg-cyan-500/15 border border-cyan-500/20' :
            node.difficulty === 'Advanced' ? 'text-amber-300 bg-amber-500/15 border border-amber-500/20' :
            'text-purple-300 bg-purple-500/15 border border-purple-500/20'
          }`}>
            {node.difficulty}
          </span>
        </div>
      </div>

      {/* Interactive hover actions bar */}
      <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelectNode(node);
          }}
          className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
        >
          <span>AI Mission Panel</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        {node.status !== 'completed' && (
          <button
            type="button"
            title="Tell AI you already know this skill to save study time"
            onClick={(e) => {
              e.stopPropagation();
              onQuickKnown(node);
            }}
            className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Zap className="w-3 h-3 text-amber-400" />
            <span>I Know This</span>
          </button>
        )}
      </div>
    </div>
  );
});

CustomRoadmapNode.displayName = 'CustomRoadmapNode';
