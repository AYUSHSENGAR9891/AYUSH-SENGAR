import React from 'react';
import { 
  Trophy, 
  Award, 
  CheckCircle2, 
  Lock, 
  Zap, 
  Clock, 
  FolderGit2, 
  Sparkles, 
  Briefcase, 
  MessageSquare, 
  Rocket, 
  Target,
  Plus
} from 'lucide-react';
import { Milestone, RoadmapData, UserProfile, DailyCheckIn, DailyProgressTrend } from '../../types/roadmap';
import { MoodGoalsLineChart } from '../progress/MoodGoalsLineChart';

interface ProgressViewProps {
  roadmap: RoadmapData;
  userProfile: UserProfile;
  milestones: Milestone[];
  onLogStudyHours: (hours: number) => void;
  dailyCheckIn?: DailyCheckIn | null;
  progressTrends?: DailyProgressTrend[];
  onAddGoalToday?: () => void;
}

const getMoodScore = (mood?: string, label?: string): number => {
  if (!mood && !label) return 3;
  if (mood === '🚀' || label === 'Focused') return 5;
  if (mood === '⚡' || label === 'Energized') return 5;
  if (mood === '💡' || label === 'Curious') return 4;
  if (mood === '🧘' || label === 'Steady') return 3;
  if (mood === '☕' || label === 'Taking Steps') return 2;
  return 3;
};

export const ProgressView: React.FC<ProgressViewProps> = ({
  roadmap,
  userProfile,
  milestones,
  onLogStudyHours,
  dailyCheckIn,
  progressTrends,
  onAddGoalToday
}) => {
  const allNodes = (roadmap.phases || []).flatMap(p => p.nodes || []);
  const skillNodes = allNodes.filter(n => n.type === 'skill');
  const projectNodes = allNodes.filter(n => n.type === 'project');

  const completedSkills = skillNodes.filter(n => n.status === 'completed' || n.status === 'known').length;
  const totalSkills = Math.max(1, skillNodes.length);

  const completedProjects = projectNodes.filter(n => n.status === 'completed' || n.status === 'known').length;
  const totalProjects = Math.max(1, projectNodes.length);

  const completedMilestones = milestones.filter(m => m.completed).length;
  const totalMilestones = Math.max(1, milestones.length);

  const overallProgress = allNodes.length > 0 
    ? Math.round((allNodes.filter(n => n.status === 'completed' || n.status === 'known').length / allNodes.length) * 100) 
    : 32;

  const xpPercent = Math.min(100, Math.round((userProfile.currentXp / userProfile.nextLevelXp) * 100));

  // Compute 7-day trend records for Recharts
  const displayTrends = React.useMemo<DailyProgressTrend[]>(() => {
    if (progressTrends && progressTrends.length >= 7) {
      return progressTrends;
    }

    const days: DailyProgressTrend[] = [];
    const basePast = [
      { offset: 6, score: 3, mood: '🧘', moodLabel: 'Steady', goals: 2, xp: 40, goalText: 'Reviewed Git branch workflows' },
      { offset: 5, score: 4, mood: '💡', moodLabel: 'Curious', goals: 2, xp: 55, goalText: 'Mastered TypeScript generics' },
      { offset: 4, score: 5, mood: '⚡', moodLabel: 'Energized', goals: 3, xp: 75, goalText: 'Completed 2 data structure modules' },
      { offset: 3, score: 2, mood: '☕', moodLabel: 'Taking Steps', goals: 1, xp: 30, goalText: 'Studied React 19 concurrent concepts' },
      { offset: 2, score: 5, mood: '🚀', moodLabel: 'Focused', goals: 4, xp: 95, goalText: 'Built & tested RESTful auth pipeline' },
      { offset: 1, score: 4, mood: '💡', moodLabel: 'Curious', goals: 2, xp: 60, goalText: 'Refactored state management hooks' },
    ];

    const now = new Date();
    basePast.forEach((p) => {
      const d = new Date(now);
      d.setDate(now.getDate() - p.offset);
      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
      const formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const dateStr = d.toISOString().split('T')[0];
      days.push({
        date: dateStr,
        dayLabel,
        formattedDate,
        mood: p.mood,
        moodLabel: p.moodLabel,
        moodScore: p.score,
        goalsAchieved: p.goals,
        dailyGoalText: p.goalText,
        xpEarned: p.xp
      });
    });

    // Today (Day 7)
    const todayLabel = 'Today';
    const todayFormatted = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const todayDateStr = now.toISOString().split('T')[0];
    const todayMood = dailyCheckIn?.mood || '🚀';
    const todayMoodLabel = dailyCheckIn?.moodLabel || 'Focused';
    const todayScore = getMoodScore(todayMood, todayMoodLabel);
    const todayGoals = dailyCheckIn ? (1 + (dailyCheckIn.bonusXpClaimed ? 1 : 0)) : 2;
    const todayGoalText = dailyCheckIn?.goal || 'Build and ship 1 end-to-end component';
    const todayXp = dailyCheckIn ? (dailyCheckIn.xpEarned + (dailyCheckIn.bonusXpClaimed ? 15 : 0)) : 35;

    days.push({
      date: todayDateStr,
      dayLabel: todayLabel,
      formattedDate: todayFormatted,
      mood: todayMood,
      moodLabel: todayMoodLabel,
      moodScore: todayScore,
      goalsAchieved: todayGoals,
      dailyGoalText: todayGoalText,
      xpEarned: todayXp
    });

    return days;
  }, [progressTrends, dailyCheckIn]);

  const getMilestoneIcon = (title: string, completed: boolean) => {
    if (completed) return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
    return <Lock className="w-5 h-5 text-slate-500" />;
  };

  return (
    <div className="space-y-8 py-4">
      {/* Top Banner with XP / Level Status */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-white/10 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center border border-cyan-400/40 shadow-[0_0_25px_rgba(6,182,212,0.35)] flex-shrink-0">
              <Trophy className="w-8 h-8 text-slate-950" />
              <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-slate-950 border border-cyan-400 text-[10px] font-mono font-bold text-cyan-300">
                LVL {userProfile.levelNumber}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
                  LEVEL {userProfile.levelNumber}
                </span>
                <span className="text-slate-500">·</span>
                <span className="text-xs text-slate-300 font-medium">
                  {userProfile.streakDays} Day Study Streak 🔥
                </span>
              </div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                "{userProfile.levelTitle}"
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Targeting: {roadmap.career}
              </p>
            </div>
          </div>

          {/* XP Bar */}
          <div className="w-full md:w-80 bg-slate-950/80 p-4 rounded-xl border border-white/10">
            <div className="flex justify-between text-xs font-semibold mb-1.5 font-mono">
              <span className="text-slate-300">Experience Points</span>
              <span className="text-cyan-300 font-bold">
                {userProfile.currentXp} / {userProfile.nextLevelXp} XP
              </span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-white/5">
              <div
                className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-500 mt-1.5 text-right font-mono">
              {userProfile.nextLevelXp - userProfile.currentXp} XP to Level {userProfile.levelNumber + 1}
            </div>
          </div>
        </div>
      </div>

      {/* 5 CORE QUANTITATIVE METRICS (Section 8 Requirement) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Metric 1: Overall Progress Ring */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md shadow-xl flex items-center gap-3.5">
          <div className="relative w-14 h-14 flex items-center justify-center flex-shrink-0">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-cyan-400"
                strokeDasharray={`${overallProgress}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-black font-mono text-white">
              {overallProgress}%
            </span>
          </div>

          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Overall Progress
            </div>
            <div className="text-base font-extrabold text-white mt-0.5 font-mono">
              {overallProgress}%
            </div>
          </div>
        </div>

        {/* Metric 2: Skills */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
            <span className="font-bold uppercase text-[10px] text-slate-400 tracking-wider">Skills</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-white font-mono mb-2">
            8 <span className="text-xs font-normal text-slate-500 font-sans">/ 25</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full"
              style={{ width: `${(8 / 25) * 100}%` }}
            />
          </div>
        </div>

        {/* Metric 3: Projects */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
            <span className="font-bold uppercase text-[10px] text-slate-400 tracking-wider">Projects</span>
            <FolderGit2 className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-xl font-black text-white font-mono mb-2">
            1 <span className="text-xs font-normal text-slate-500 font-sans">/ 4</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-indigo-400 h-full rounded-full"
              style={{ width: `${(1 / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Metric 4: Milestones */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
            <span className="font-bold uppercase text-[10px] text-slate-400 tracking-wider">Milestones</span>
            <Award className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-black text-white font-mono mb-2">
            4 <span className="text-xs font-normal text-slate-500 font-sans">/ 10</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-amber-400 h-full rounded-full"
              style={{ width: `${(4 / 10) * 100}%` }}
            />
          </div>
        </div>

        {/* Metric 5: Learning Hours */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
            <span className="font-bold uppercase text-[10px] text-slate-400 tracking-wider">Learning Hours</span>
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-black text-white font-mono mb-2">
            7.5 <span className="text-xs font-normal text-slate-500 font-sans">/ 10</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-cyan-400 h-full rounded-full"
              style={{ width: `${(7.5 / 10) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* 7-DAY RECHARTS LINE CHART: DAILY MOOD TRENDS & GOALS ACHIEVED */}
      <MoodGoalsLineChart
        data={displayTrends}
        onAddGoalToday={onAddGoalToday}
        streakDays={userProfile.streakDays}
      />

      {/* MILESTONE CARDS (Section 8 Requirement) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white">Career Milestone Achievements</h2>
            <p className="text-xs text-slate-400">
              Verifiable proof items required to move from student to job-ready engineer.
            </p>
          </div>
          <span className="text-xs font-bold text-cyan-400 font-mono">
            4 / 10 Completed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { id: 'm1', title: 'First Skill Completed', completed: true, statusText: '✓ Completed · C Fundamentals' },
            { id: 'm2', title: 'First GitHub Project', completed: true, statusText: '✓ Completed · Verified README' },
            { id: 'm3', title: 'First AI Mission', completed: true, statusText: '✓ Completed · Weekend Code Proof' },
            { id: 'm4', title: 'Portfolio Ready', completed: false, statusText: '🔒 In Progress · Need 2 projects' },
            { id: 'm5', title: 'Internship Ready', completed: false, statusText: '🔒 Locked · Prerequisite: Capstone' },
            { id: 'm6', title: 'Mock Interview', completed: false, statusText: '🔒 Locked · Prerequisite: Phase 9' },
            { id: 'm7', title: 'Dream Job Ready', completed: false, statusText: '🔒 Locked · Offer Stage' },
          ].map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                item.completed
                  ? 'bg-slate-900/60 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                  : 'bg-slate-950/60 border-white/5 opacity-75'
              }`}
            >
              <div className={`p-2 rounded-xl mt-0.5 flex-shrink-0 ${
                item.completed
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-slate-800 text-slate-500'
              }`}>
                {item.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Lock className="w-5 h-5 text-slate-500" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className={`text-sm font-bold ${item.completed ? 'text-white' : 'text-slate-300'}`}>
                    {item.completed ? `✓ ${item.title}` : `🔒 ${item.title}`}
                  </h4>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/5 text-amber-300 border border-amber-500/20">
                    +{item.completed ? '100' : '250'} XP
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.statusText}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Study Logger Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/50 border border-white/10 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span>Log deep work sessions towards your weekly goal</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onLogStudyHours(1)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium border border-white/10 cursor-pointer"
          >
            +1 Hour (+20 XP)
          </button>
          <button
            onClick={() => onLogStudyHours(2.5)}
            className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold border border-cyan-500/30 cursor-pointer"
          >
            +2.5 Hours (+50 XP)
          </button>
        </div>
      </div>
    </div>
  );
};
