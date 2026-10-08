import React, { useState } from 'react';
import { 
  Target, 
  GraduationCap, 
  Clock, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  Zap, 
  Sliders, 
  CheckCircle2, 
  Play, 
  Info, 
  ChevronRight,
  Flame,
  GitBranch,
  X,
  Layers,
  ArrowRight
} from 'lucide-react';
import { AlternativeRoute, RoadmapData, RoadmapNode } from '../../types/roadmap';

interface RoadmapHeaderDashboardProps {
  roadmap: RoadmapData;
  onChangeHours: (newHours: number) => void;
  onTriggerQuickDemoStep: (stepNumber: number) => void;
  currentDemoStep: number;
  onSelectSkill?: (node: RoadmapNode) => void;
}

export const RoadmapHeaderDashboard: React.FC<RoadmapHeaderDashboardProps> = ({
  roadmap,
  onChangeHours,
  onTriggerQuickDemoStep,
  currentDemoStep,
  onSelectSkill
}) => {
  const [sliderHours, setSliderHours] = useState(roadmap.hoursPerWeek || 10);

  React.useEffect(() => {
    setSliderHours(roadmap.hoursPerWeek || 10);
  }, [roadmap.hoursPerWeek]);

  const [scheduleNotice, setScheduleNotice] = useState<{
    oldMonths: number;
    newMonths: number;
    oldWeeks: number;
    newWeeks: number;
  } | null>(null);

  const [showAlternativeRoutes, setShowAlternativeRoutes] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<AlternativeRoute | null>(null);

  const allNodes = (roadmap.phases || []).flatMap(p => p.nodes || []);
  const completedCount = allNodes.filter(n => n.status === 'completed' || n.status === 'known').length;
  const progressPercent = allNodes.length > 0 
    ? Math.round((completedCount / allNodes.length) * 100) 
    : 32;

  // Requirement 4: Career Readiness Score calculation
  // 0–20%: Getting Started | 21–40%: Building Foundations | 41–60%: Developing | 61–80%: Career Ready | 81–100%: Interview Ready
  const readinessPercent = progressPercent;
  let readinessLabel = 'Developing';
  let readinessColor = 'text-cyan-400';
  let readinessBadge = 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';

  if (readinessPercent <= 20) {
    readinessLabel = 'Getting Started';
    readinessColor = 'text-slate-300';
    readinessBadge = 'bg-slate-800 text-slate-300 border-slate-700';
  } else if (readinessPercent <= 40) {
    readinessLabel = 'Building Foundations';
    readinessColor = 'text-blue-400';
    readinessBadge = 'bg-blue-500/10 text-blue-300 border-blue-500/30';
  } else if (readinessPercent <= 60) {
    readinessLabel = 'Developing';
    readinessColor = 'text-cyan-400';
    readinessBadge = 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
  } else if (readinessPercent <= 80) {
    readinessLabel = 'Career Ready';
    readinessColor = 'text-emerald-400';
    readinessBadge = 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
  } else {
    readinessLabel = 'Interview Ready';
    readinessColor = 'text-purple-400';
    readinessBadge = 'bg-purple-500/10 text-purple-300 border-purple-500/30';
  }

  // Requirement 10: Dynamic Next Best Action
  const nextSkillNode = allNodes.find(n => n.status === 'active') || 
                        allNodes.find(n => n.status === 'recommended') || 
                        allNodes.find(n => n.status !== 'completed' && n.status !== 'known') || 
                        allNodes[0];

  const downstreamBlocked = allNodes.find(n => 
    n.status === 'locked' && (
      (n.prerequisites && n.prerequisites.length > 0) ||
      (nextSkillNode && (n.description || '').toLowerCase().includes(((nextSkillNode.title || '').toLowerCase().split(' ')[0] || '')))
    )
  );

  const nextActionTitle = nextSkillNode ? `Complete ${nextSkillNode.title}` : 'Complete JavaScript Fundamentals';
  const nextActionWhy = downstreamBlocked 
    ? `${downstreamBlocked.title || 'Next milestone'} is currently blocked by this prerequisite.` 
    : nextSkillNode?.whyItMatters || 'Essential foundational skill to unlock downstream architecture.';

  // Convert weeks to approx months
  const currentWeeks = roadmap.estimatedWeeks || 24;
  const currentMonths = Number((currentWeeks / 4).toFixed(1));

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHours = Number(e.target.value);
    const oldHours = sliderHours;
    setSliderHours(newHours);
    onChangeHours(newHours);

    const oldW = Math.ceil((roadmap.totalEstimatedHours || 240) / oldHours);
    const newW = Math.ceil((roadmap.totalEstimatedHours || 240) / newHours);
    const oldM = Number((oldW / 4).toFixed(1));
    const newM = Number((newW / 4).toFixed(1));

    if (oldHours !== newHours) {
      setScheduleNotice({
        oldMonths: oldM,
        newMonths: newM,
        oldWeeks: oldW,
        newWeeks: newW
      });
    }
  };

  const defaultWhyRoadmap = `Because your goal is to become a ${roadmap.career} in ${roadmap.industry}, this roadmap prioritizes domain-native architectures, API integration, and verifiable proof projects. Your existing background was analyzed to bypass redundant basics and focus your study time on high-leverage milestones.`;

  return (
    <div className="space-y-4 mb-4">
      {/* REQUIREMENT 5: CLEAN TOP ROADMAP HEADER */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-950 to-slate-900/90 border border-white/10 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 mb-1 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-cyan-400" />
            <span>CAREER GOAL</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {roadmap.career}
          </h1>
          <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
            <span className="text-cyan-300 font-semibold">{roadmap.industry}</span>
            <span>•</span>
            <span>Target: {roadmap.targetCompany || 'Top Tech Startup'}</span>
          </div>
        </div>

        {/* 4 Clean Header Metric Badges */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs">
          <div className="px-3 py-2 rounded-xl bg-slate-900/80 border border-white/10 flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-slate-400">Progress:</span>
            <span className="font-mono font-bold text-emerald-400">{progressPercent}%</span>
          </div>

          <div className="px-3 py-2 rounded-xl bg-slate-900/80 border border-white/10 flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-slate-400">Estimated Time:</span>
            <span className="font-mono font-bold text-white">{currentMonths} months</span>
          </div>

          <div className="px-3 py-2 rounded-xl bg-slate-900/80 border border-cyan-500/30 flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-cyan-300">Learning:</span>
            <span className="font-mono font-bold text-cyan-300">{sliderHours} hrs/week</span>
          </div>

          <div className="px-3 py-2 rounded-xl bg-slate-900/80 border border-white/10 flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-slate-400">Career Readiness:</span>
            <span className={`font-bold ${readinessColor}`}>{readinessLabel}</span>
          </div>
        </div>
      </div>

      {/* REQUIREMENT 10: NEXT BEST ACTION BAR */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900/85 to-indigo-950/40 border border-cyan-500/35 backdrop-blur-md shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex-shrink-0 mt-0.5">
            <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                NEXT BEST ACTION
              </span>
              <span className="text-[10px] px-2 py-0.2 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-semibold">
                High Leverage
              </span>
            </div>
            <div className="text-sm font-bold text-white">
              {nextActionTitle}
            </div>
            <div className="text-xs text-slate-300 mt-0.5">
              <strong className="text-slate-400">Why: </strong>
              "{nextActionWhy}"
            </div>
          </div>
        </div>

        {nextSkillNode && (
          <button
            onClick={() => onSelectSkill && onSelectSkill(nextSkillNode)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer flex-shrink-0"
          >
            <span>Start Skill</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* WHY THIS ROADMAP? EXPLANATION CARD */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex-shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                Why this roadmap?
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                Personalized Synthesis
              </span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed max-w-3xl">
              {roadmap.whyThisRoadmap || defaultWhyRoadmap}
            </p>
          </div>
        </div>

        {/* Alternative Routes trigger */}
        <button
          onClick={() => setShowAlternativeRoutes(true)}
          className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer shadow-md"
        >
          <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
          <span>Alternative Routes</span>
        </button>
      </div>

      {/* 5 DASHBOARD METRIC CARDS (Includes Requirement 4 Career Readiness Card) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        {/* Card 1: REQUIREMENT 4 - CAREER READINESS CARD */}
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-cyan-500/30 backdrop-blur-md shadow-lg flex flex-col justify-between col-span-2 md:col-span-1">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 font-mono">
                CAREER READINESS
              </span>
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black font-mono text-white">{readinessPercent}%</span>
              <span className={`text-xs font-bold ${readinessColor}`}>"{readinessLabel}"</span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mt-2">
              <div
                className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${readinessPercent}%` }}
              />
            </div>
          </div>
          <p className="text-[9px] text-slate-400 mt-2 leading-tight">
            An estimated preparation indicator based on your roadmap progress.
          </p>
        </div>

        {/* Card 2: Current Level */}
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-white/10 backdrop-blur-md shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              Current Level
            </span>
            <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-sm font-bold text-white">
            {roadmap.level}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Prerequisites Mapped
          </div>
        </div>

        {/* Card 3: Learning Time (Interactive Slider - Requirement 7) */}
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-cyan-500/30 backdrop-blur-md shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 font-mono">
              Learning
            </span>
            <span className="text-xs font-bold font-mono text-cyan-300">
              {sliderHours} hrs/wk
            </span>
          </div>

          <input
            type="range"
            min={5}
            max={40}
            step={5}
            value={sliderHours}
            onChange={handleHoursChange}
            className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg my-1.5"
          />

          <div className="flex justify-between text-[9px] text-slate-400">
            <span>5h casual</span>
            <span>40h full</span>
          </div>
        </div>

        {/* Card 4: Estimated Duration */}
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-white/10 backdrop-blur-md shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              Estimated Duration
            </span>
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-sm font-extrabold text-white font-mono flex items-baseline gap-1.5">
            <span>{currentMonths} months</span>
            <span className="text-[11px] font-normal text-slate-400">({currentWeeks}w)</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Target: {roadmap.timeline}
          </div>
        </div>

        {/* Card 5: Overall Progress */}
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-white/10 backdrop-blur-md shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              Milestone Progress
            </span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-extrabold text-emerald-400 font-mono">
            {progressPercent}%
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden mt-1">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* DYNAMIC SCHEDULE CHANGE NOTIFICATION (Requirement 7 WOW Moment) */}
      {scheduleNotice && (
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/60 to-blue-950/60 border border-cyan-500/40 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn shadow-[0_0_25px_rgba(6,182,212,0.2)]">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300">
              <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
            </div>
            <div>
              <div className="font-bold text-white text-xs">
                Your learning schedule changed.
              </div>
              <div className="text-slate-300 text-[11px]">
                Estimated completion: <strong className="text-slate-400 line-through">{scheduleNotice.oldMonths} months</strong> → <strong className="text-cyan-300 font-mono">{scheduleNotice.newMonths} months</strong> ({scheduleNotice.oldWeeks} weeks → {scheduleNotice.newWeeks} weeks). Target date pulled forward!
              </div>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-md bg-cyan-500/20 text-cyan-200 text-[10px] font-mono font-bold uppercase tracking-wider border border-cyan-500/30">
            Roadmap Timeline Updated
          </span>
        </div>
      )}

      {/* IDEATHON DEMO WALKTHROUGH CONTROLLER */}
      <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="p-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Play className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          </span>
          <div>
            <span className="font-bold text-white">Ideathon Demo Walkthrough: </span>
            <span className="text-slate-400">Step 4 (React Mission) → Step 6 (AI Replanning) → Step 8 (Dynamic Pace)</span>
          </div>
        </div>

        {/* Quick action buttons for the demo */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onTriggerQuickDemoStep(4)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-cyan-500/20 hover:text-cyan-300 border border-white/10 text-[11px] font-medium text-slate-300 transition-colors cursor-pointer"
            title="Step 4: Select React node & view weekend mission"
          >
            Step 4: Open React Mission
          </button>

          <button
            onClick={() => onTriggerQuickDemoStep(6)}
            className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-semibold transition-colors cursor-pointer"
            title="Step 6: Test 'I Already Know This' AI Replanning"
          >
            Step 6: AI Replanning (WOW)
          </button>

          <button
            onClick={() => onTriggerQuickDemoStep(8)}
            className="px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[11px] font-semibold transition-colors cursor-pointer"
            title="Step 8: Change study hours from 10 to 15 hrs/week"
          >
            Step 8: Accelerate Pace
          </button>
        </div>
      </div>

      {/* RESPONSIBLE AI TRANSPARENCY NOTICE (Requirement 19) */}
      <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 text-[11px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
          <span>
            CareerQuest AI provides personalized learning guidance and estimated pathways. Career outcomes and timelines vary by individual, experience and market conditions.
          </span>
        </div>
        <span className="text-slate-500 text-[10px] font-mono flex-shrink-0">
          Estimated on {roadmap.totalEstimatedHours || 240} curriculum hours
        </span>
      </div>

      {/* SECTION 15: ALTERNATIVE ROUTES MODAL */}
      {showAlternativeRoutes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
          <div className="relative w-full max-w-3xl rounded-2xl bg-slate-950 border border-white/10 p-6 md:p-8 text-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <button
              onClick={() => setShowAlternativeRoutes(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
                <GitBranch className="w-3.5 h-3.5" />
                Strategic Pathway Options
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white">
                Alternative Career Routes for {roadmap.career}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Depending on your preferred style, explore alternative execution paths to reach your dream role.
              </p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {(roadmap.alternativeRoutes || [
                {
                  id: 'r1',
                  title: 'Route A: Traditional Learning → Projects → Internship → Job',
                  description: 'Build rigorous theoretical foundations first, then assemble capstones and apply for university-aligned internships.',
                  estimatedDuration: `${roadmap.estimatedWeeks} weeks`,
                  focus: 'Foundational Depth',
                  stages: ['Core CS & Systems', 'Framework Mastery', 'Capstone Project', 'Internship & Job']
                },
                {
                  id: 'r2',
                  title: 'Route B: Projects First → Open Source → Internship → Job',
                  description: 'Jump straight into building real software. Learn syntax on-the-fly and build credibility through open-source pull requests.',
                  estimatedDuration: `${Math.ceil((roadmap.estimatedWeeks || 24) * 0.9)} weeks`,
                  focus: 'Practical Velocity',
                  stages: ['Mini-Projects Sprint', 'Flagship Capstone', 'Open Source Contributions', 'Direct Startup Outreach']
                },
                {
                  id: 'r3',
                  title: 'Route C: Industry Certifications → Portfolio → Entry-Level Role',
                  description: 'Pair practical code demonstrations with recognized industry certifications to pass automated recruiter screening filters.',
                  estimatedDuration: `${Math.ceil((roadmap.estimatedWeeks || 24) * 1.1)} weeks`,
                  focus: 'Credential Verification',
                  stages: ['Core Skills', 'Cloud Certification Exam', 'Portfolio Case Studies', 'Enterprise Applications']
                }
              ]).map((route, idx) => (
                <div
                  key={route.id}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-cyan-500/30 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      {route.title}
                    </h3>
                    <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                      {route.estimatedDuration}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {route.description}
                  </p>

                  <div className="pt-2 border-t border-white/5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Milestone Sequence:
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-300 font-mono">
                      {route.stages.map((stg, sIdx) => (
                        <React.Fragment key={sIdx}>
                          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5">
                            {stg}
                          </span>
                          {sIdx < route.stages.length - 1 && (
                            <ArrowRight className="w-3 h-3 text-slate-500" />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10 mt-4 text-center">
              <p className="text-[11px] text-slate-500 italic">
                "These are representative pathways. Career journeys vary by person, company and industry."
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
