import React from 'react';
import { 
  Compass, 
  LayoutDashboard, 
  GitFork, 
  TrendingUp, 
  Bot, 
  GraduationCap, 
  Sparkles, 
  Award,
  Zap
} from 'lucide-react';
import { UserProfile } from '../../types/roadmap';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userProfile: UserProfile;
  onToggleStudentMode: () => void;
  onStartSetup: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  userProfile,
  onToggleStudentMode,
  onStartSetup,
  isOpenMobile,
  onCloseMobile
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'roadmap', label: 'My Roadmap', icon: GitFork, badge: 'Live Tree' },
    { id: 'career-paths', label: 'Career Paths', icon: Compass },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'coach', label: 'AI Career Coach', icon: Bot, badge: 'AI' }
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-950/95 md:bg-slate-950/80 backdrop-blur-2xl border-r border-white/10 flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top: Logo & Main Navigation */}
        <div className="p-5">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
              <Compass className="w-5 h-5 text-slate-950 animate-pulse-subtle" />
            </div>
            <div>
              <div className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
                <span>CareerQuest</span>
                <span className="text-cyan-400">AI</span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium tracking-wide">
                Reverse Engineered
              </div>
            </div>
          </div>

          {/* Quick CTA button */}
          <button
            onClick={() => {
              onStartSetup();
              onCloseMobile();
            }}
            className="w-full mb-6 py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold shadow-[0_0_20px_rgba(6,182,212,0.25)] flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
            New Career Quest
          </button>

          {/* Nav Items */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-white/5 text-cyan-300 border border-cyan-500/20">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom: Student Mode & User Profile */}
        <div className="p-4 border-t border-white/10 space-y-4 bg-slate-950/60">
          {/* Student Mode Toggle */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className={`w-4 h-4 ${userProfile.studentMode ? 'text-cyan-400' : 'text-slate-500'}`} />
              <div>
                <div className="text-xs font-semibold text-white">Student Mode</div>
                <div className="text-[10px] text-slate-400">
                  {userProfile.studentMode ? 'Internship Focus' : 'Pro Engineer'}
                </div>
              </div>
            </div>

            <button
              onClick={onToggleStudentMode}
              className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                userProfile.studentMode ? 'bg-cyan-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  userProfile.studentMode ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* User Profile Mini Card */}
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/40 border border-white/5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold text-xs shadow-md">
              AM
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white truncate">
                {userProfile.name}
              </div>
              <div className="text-[10px] text-cyan-300 font-medium truncate flex items-center gap-1">
                <Award className="w-3 h-3 text-cyan-400" />
                LVL {userProfile.levelNumber} · {userProfile.currentXp} XP
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
