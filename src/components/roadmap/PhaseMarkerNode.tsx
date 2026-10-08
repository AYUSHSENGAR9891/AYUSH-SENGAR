import React, { memo } from 'react';

interface PhaseMarkerNodeProps {
  data: {
    hierarchyTag: string;
    name: string;
    duration: string;
  };
}

export const PhaseMarkerNode = memo(({ data }: PhaseMarkerNodeProps) => {
  return (
    <div className="text-left font-mono select-none p-3.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 text-slate-200 shadow-xl backdrop-blur-md w-[200px] pointer-events-none">
      <div className="text-[10px] font-black uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        {data.hierarchyTag || 'STAGE'}
      </div>
      <div className="text-xs font-bold text-white mt-1 line-clamp-2">
        {data.name || 'Core Phase'}
      </div>
      <div className="text-[10px] text-slate-400 mt-1">{data.duration}</div>
    </div>
  );
});

PhaseMarkerNode.displayName = 'PhaseMarkerNode';
