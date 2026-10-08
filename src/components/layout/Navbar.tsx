import React from 'react';
import { 
  Menu, 
  Sparkles, 
  Share2, 
  Zap, 
  Compass, 
  Target,
  Clock,
  Layers
} from 'lucide-react';
import { RoadmapData } from '../../types/roadmap';

interface NavbarProps {
  onOpenMobileSidebar: () => void;
  onStartSetup: () => void;
  onOpenExport: () => void;
  onTryDemo: () => void;
  activeTab: string;
  roadmap: RoadmapData;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenMobileSidebar,
  onStartSetup,
  onOpenExport,
  onTryDemo,
  activeTab,
  roadmap
}) => {
  const getTabLabel = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard Overview';
      case 'roadmap': return 'Interactive Skill Tree';
      case 'career-paths': return 'Explore Career Paths';
      case 'progress': return 'Career Readiness & XP';
      case 'coach': return 'AI Career Coach';
      default: return 'CareerQuest AI';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#07090E]/85 backdrop-blur-xl border-b border-white/10 px-4 md:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & View Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 md:hidden transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <span>{getTabLabel()}</span>
            {activeTab === 'roadmap' && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[10px] font-semibold">
                <Target className="w-3 h-3 text-cyan-400" />
                {roadmap.career}
              </span>
            )}
          </h1>
        </div>
      </div>

      {/* Right: Quick Actions */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onTryDemo}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all cursor-pointer"
          title="Autofill the full-stack climate-tech startup demo"
        >
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Try Demo</span>
        </button>

        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold transition-all cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Export / Share</span>
        </button>

        <button
          onClick={onStartSetup}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Roadmap</span>
        </button>
      </div>
    </header>
  );
};
