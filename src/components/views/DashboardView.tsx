import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Compass, 
  GitFork, 
  Zap, 
  Cpu, 
  CheckCircle2, 
  Trophy, 
  Play, 
  Layers, 
  ArrowDown, 
  Code2, 
  FolderGit2, 
  Briefcase, 
  HelpCircle, 
  Flame, 
  MousePointerClick,
  Check,
  ChevronRight,
  Target
} from 'lucide-react';
import { RoadmapData, DailyCheckIn } from '../../types/roadmap';
import { DailyCheckInCard } from '../dashboard/DailyCheckInCard';

interface DashboardViewProps {
  onStartSetup: () => void;
  onExploreCareers: () => void;
  onViewActiveRoadmap: () => void;
  onTryDemo: () => void;
  currentRoadmap: RoadmapData;
  streakDays: number;
  onDailyCheckIn: (
    mood: string, 
    moodLabel: string, 
    goal: string, 
    aiData?: { insight?: string; actionItem?: string; recommendedResource?: string }
  ) => void;
  savedDailyCheckIn: DailyCheckIn | null;
  onClaimBonusXp?: (amount?: number) => void;
  onUpdateDailyCheckInAi?: (aiData: { insight: string; actionItem: string; recommendedResource?: string }) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onStartSetup,
  onExploreCareers,
  onViewActiveRoadmap,
  onTryDemo,
  currentRoadmap,
  streakDays,
  onDailyCheckIn,
  savedDailyCheckIn,
  onClaimBonusXp,
  onUpdateDailyCheckInAi
}) => {
  const [activePreviewStep, setActivePreviewStep] = useState<number>(1);

  // The 7-step sequence for the visual preview requested:
  // Dream Job -> Skills -> Projects -> Portfolio -> Internship -> Interview -> Career
  const roadmapPreviewSteps = [
    {
      id: 0,
      label: 'Dream Job',
      subtitle: 'Target Ambition',
      detail: 'Full Stack Developer @ Climate-Tech Startup',
      icon: Trophy,
      color: 'from-amber-400 to-yellow-500',
      badge: 'GOAL'
    },
    {
      id: 1,
      label: 'Skills',
      subtitle: 'Core Foundations',
      detail: 'React, Node.js, PostgreSQL, System Design',
      icon: Code2,
      color: 'from-cyan-400 to-blue-500',
      badge: 'ACTIVE'
    },
    {
      id: 2,
      label: 'Projects',
      subtitle: 'Real Engineering',
      detail: 'EcoPulse: Satellite Carbon Ingestion Engine',
      icon: FolderGit2,
      color: 'from-indigo-400 to-purple-500',
      badge: 'CAPSTONE'
    },
    {
      id: 3,
      label: 'Portfolio',
      subtitle: 'Public Evidence',
      detail: 'GitHub Proofs, Architecture Specs, Live Demos',
      icon: Layers,
      color: 'from-purple-400 to-pink-500',
      badge: 'PROOF'
    },
    {
      id: 4,
      label: 'Internship',
      subtitle: 'Domain Outreach',
      detail: 'Climate-Tech Open-Source PRs & CTO Outreach',
      icon: Briefcase,
      color: 'from-blue-400 to-indigo-500',
      badge: 'OUTREACH'
    },
    {
      id: 5,
      label: 'Interview',
      subtitle: 'Technical Mastery',
      detail: 'System Scaling, LeetCode Patterns, STAR Rounds',
      icon: HelpCircle,
      color: 'from-emerald-400 to-teal-500',
      badge: 'SCREENING'
    },
    {
      id: 6,
      label: 'Career',
      subtitle: 'Target Landed',
      detail: 'Signed Offer & Day-1 Production Readiness',
      icon: Sparkles,
      color: 'from-emerald-400 to-green-500',
      badge: 'HIRED'
    }
  ];

  return (
    <div className="space-y-16 py-4">
      {/* HERO SECTION */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900/90 via-slate-950/95 to-[#07090E] p-8 md:p-14 text-center shadow-2xl">
        {/* Ambient lighting glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[340px] bg-gradient-to-r from-cyan-500/20 via-blue-600/25 to-purple-600/20 blur-[110px] pointer-events-none" />
        <div className="absolute -top-16 -left-16 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Tag Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-6 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Reverse Engineered Career Intelligence</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.08] mb-6">
          Your dream career. <br />
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Reverse engineered.
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-9 font-normal leading-relaxed">
          AI-powered career roadmaps that turn your dream job into the skills, projects and experience you need to get there.
        </p>

        {/* Hero Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
          <button
            onClick={onStartSetup}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 text-sm font-extrabold shadow-[0_0_30px_rgba(6,182,212,0.4)] flex items-center gap-2.5 transition-all transform hover:scale-[1.02] cursor-pointer"
          >
            <span>Build My Roadmap</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>

          <button
            onClick={onTryDemo}
            className="px-7 py-4 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 text-sm font-bold border border-amber-500/40 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.2)] cursor-pointer"
            title="Instant 1-click ideathon demonstration with Climate-Tech Full Stack path"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Try Demo</span>
          </button>

          <button
            onClick={onExploreCareers}
            className="px-6 py-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white text-sm font-semibold border border-white/10 hover:border-cyan-500/30 transition-all flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>Explore Careers</span>
          </button>
        </div>

        {/* VISUAL PREVIEW OF INTERACTIVE CAREER ROADMAP */}
        <div className="mt-6 pt-8 border-t border-white/10 max-w-4xl mx-auto">
          <div className="flex items-center justify-between gap-2 mb-4 px-2">
            <div className="flex items-center gap-2 text-left">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                Live Interactive Pathway Architecture
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              Click any stage to simulate reverse engineering
            </span>
          </div>

          {/* Interactive Stepper Graph Preview */}
          <div className="p-4 sm:p-6 rounded-2xl bg-slate-950/80 border border-white/10 shadow-inner">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-left">
              {roadmapPreviewSteps.map((step, idx) => {
                const Icon = step.icon;
                const isSelected = activePreviewStep === step.id;
                return (
                  <div
                    key={step.id}
                    onClick={() => setActivePreviewStep(step.id)}
                    className={`relative p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)] scale-[1.03]'
                        : 'bg-slate-900/60 border-white/5 hover:border-white/20 hover:bg-slate-900/90'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className={`p-1.5 rounded-lg bg-white/5 ${isSelected ? 'text-cyan-300' : 'text-slate-400'}`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          isSelected ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-white/5 text-slate-500'
                        }`}>
                          {step.badge}
                        </span>
                      </div>

                      <div className="text-xs font-bold text-white mb-0.5">
                        {step.label}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {step.subtitle}
                      </div>
                    </div>

                    {/* Step indicator arrow */}
                    {idx < roadmapPreviewSteps.length - 1 && (
                      <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-600">
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Selected Preview Stage Highlight Banner */}
            <div className="mt-4 p-3.5 rounded-xl bg-slate-900/80 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center flex-shrink-0">
                  <Play className="w-4 h-4 fill-cyan-400 text-cyan-400" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-cyan-400">
                    Step {activePreviewStep + 1}: {roadmapPreviewSteps[activePreviewStep].label} Breakdown
                  </div>
                  <div className="text-xs font-semibold text-white">
                    {roadmapPreviewSteps[activePreviewStep].detail}
                  </div>
                </div>
              </div>

              <button
                onClick={onViewActiveRoadmap}
                className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 flex-shrink-0 transition-colors cursor-pointer"
              >
                <span>View Full Skill Tree</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DAILY CHECK-IN SECTION (Interactive Mood & Goal Tracking + XP Integration) */}
      <DailyCheckInCard
        streakDays={streakDays}
        onCheckIn={onDailyCheckIn}
        savedCheckIn={savedDailyCheckIn}
        roadmap={currentRoadmap}
        onClaimBonusXp={onClaimBonusXp}
        onUpdateDailyCheckInAi={onUpdateDailyCheckInAi}
      />

      {/* WHY CAREERQUEST AI? SECTION (3 CARDS REQUESTED) */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Core Differentiation</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Why CareerQuest AI?
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Traditional career advice gives students generic checklists. CareerQuest AI computes a dynamic, dependency-mapped engineering path.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: AI-Powered */}
          <div className="relative rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-md p-7 shadow-xl hover:border-cyan-500/40 transition-all group flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-5 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                AI-Powered
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                "Your roadmap adapts to your current skills and goals."
              </p>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Reverse-engineers any target role down into concrete weekly learning blocks, project architecture, and domain-native interview questions.
              </p>
            </div>
          </div>

          {/* Card 2: Interactive */}
          <div className="relative rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-md p-7 shadow-xl hover:border-blue-500/40 transition-all group flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-5 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                <GitFork className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                Interactive
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                "Explore your career journey through a visual skill tree."
              </p>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Zoom, pan, and inspect node dependencies in real-time. See prerequisites unlock as you verify GitHub code proofs and missions.
              </p>
            </div>
          </div>

          {/* Card 3: Adaptive */}
          <div className="relative rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-md p-7 shadow-xl hover:border-amber-500/40 transition-all group flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-5 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                Adaptive
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                "Already know a skill? AI automatically replans your journey."
              </p>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                One-click dynamic replanning calculates exact weeks saved, recalculates your estimated job offer date, and pulls milestones forward.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* REQUIREMENT 18: JUDGE-FRIENDLY "HOW CAREERQUEST WORKS" SECTION */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900/70 to-slate-950/80 p-8 md:p-10 shadow-2xl">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-3">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>The 5-Stage Synthesis</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            How CareerQuest AI Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            A continuous loop from ambitious career vision to concrete engineering capability.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              step: '1',
              title: 'Define Your Dream Career',
              desc: 'Enter your niche target role, industry focus, weekly hours, and existing skills.',
              icon: Target,
              accent: 'border-cyan-500/30 text-cyan-400'
            },
            {
              step: '2',
              title: 'AI Reverse-Engineers the Role',
              desc: 'Gemini analyzes job market requirements and maps the strict dependency sequence.',
              icon: Cpu,
              accent: 'border-blue-500/30 text-blue-400'
            },
            {
              step: '3',
              title: 'Explore Your Interactive Roadmap',
              desc: 'Navigate the connected DAG skill tree with difficulty badges and time estimates.',
              icon: Layers,
              accent: 'border-indigo-500/30 text-indigo-400'
            },
            {
              step: '4',
              title: 'Build Real Projects',
              desc: 'Conquer practical weekend missions, verify code proofs, and prepare interview topics.',
              icon: FolderGit2,
              accent: 'border-emerald-500/30 text-emerald-400'
            },
            {
              step: '5',
              title: 'AI Replans as You Learn',
              desc: 'Mark known skills to instantly recalculate hours saved and accelerate your timeline.',
              icon: Zap,
              accent: 'border-amber-500/30 text-amber-400'
            }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="p-5 rounded-2xl bg-slate-950/70 border border-white/5 hover:border-cyan-500/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-black text-slate-500">
                      STAGE {item.step}
                    </span>
                    <div className={`p-2 rounded-xl bg-white/5 border ${item.accent}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1.5 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DEMO STORY / IDEATHON WALKTHROUGH BANNER (Section 12) */}
      <div className="rounded-2xl border border-cyan-500/25 bg-gradient-to-r from-cyan-950/40 via-slate-900/60 to-blue-950/40 p-6 md:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Trophy className="w-4 h-4 text-amber-400" />
              </span>
              <h3 className="text-base font-bold text-white">
                Ideathon Demonstration Flow (9-Step Experience)
              </h3>
            </div>
            <p className="text-xs text-slate-300">
              Guide the judges through the real end-to-end AI reverse engineering and dynamic replanning sequence:
            </p>
          </div>

          <button
            onClick={onTryDemo}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-xs shadow-lg flex items-center gap-2 flex-shrink-0 cursor-pointer"
          >
            <Zap className="w-4 h-4 text-slate-950" />
            Launch 1-Click Demo
          </button>
        </div>

        {/* 9-step compact grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-9 gap-2 text-xs">
          {[
            { step: '1', title: 'Dream Job Entered', desc: 'Climate-Tech Full Stack' },
            { step: '2', title: 'AI Generates Roadmap', desc: '9 structured phases' },
            { step: '3', title: 'Visual Skill Tree', desc: 'Interactive node graph' },
            { step: '4', title: 'Clicks React Node', desc: 'Opens AI panel' },
            { step: '5', title: 'Weekend Project', desc: 'EcoPulse Dashboard' },
            { step: '6', title: '"I Already Know This"', desc: 'Triggers WOW replanner' },
            { step: '7', title: 'AI Replans Graph', desc: 'Cascades downstream' },
            { step: '8', title: 'Timeline Changes', desc: '24w → 21w (Saved 3w)' },
            { step: '9', title: 'Progress Updates', desc: '32% → 36% & XP bonus' },
          ].map((item) => (
            <div key={item.step} className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-cyan-400">STEP {item.step}</span>
                <div className="font-bold text-white text-[11px] mt-0.5 leading-snug">{item.title}</div>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* REQUIREMENT 19: RESPONSIBLE AI NOTE */}
      <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/5 text-center text-xs text-slate-400 max-w-3xl mx-auto leading-relaxed">
        <p>
          "CareerQuest AI provides personalized learning guidance and estimated pathways. Career outcomes and timelines vary by individual, experience and market conditions."
        </p>
      </div>
    </div>
  );
};
