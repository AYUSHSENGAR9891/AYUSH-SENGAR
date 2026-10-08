import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  Smile, 
  Target, 
  Calendar, 
  Zap, 
  Award,
  Flame,
  Plus,
  Info
} from 'lucide-react';
import { DailyProgressTrend } from '../../types/roadmap';

interface MoodGoalsLineChartProps {
  data: DailyProgressTrend[];
  onAddGoalToday?: () => void;
  streakDays: number;
}

// Mood score mapping to emoji and label
const MOOD_SCORE_MAP: Record<number, { emoji: string; label: string }> = {
  1: { emoji: '😴', label: 'Drained' },
  2: { emoji: '☕', label: 'Taking Steps' },
  3: { emoji: '🧘', label: 'Steady' },
  4: { emoji: '💡', label: 'Curious' },
  5: { emoji: '🚀', label: 'Focused' }
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    color: string;
    dataKey: string;
    payload: DailyProgressTrend;
  }>;
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  const itemData = payload[0].payload;
  const moodInfo = MOOD_SCORE_MAP[itemData.moodScore] || { emoji: itemData.mood, label: itemData.moodLabel };

  return (
    <div className="bg-slate-900/95 backdrop-blur-xl border border-white/15 rounded-xl p-4 shadow-2xl min-w-[220px] text-xs font-sans text-slate-200">
      <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2.5">
        <div className="flex items-center gap-1.5 font-bold text-white">
          <Calendar className="w-3.5 h-3.5 text-cyan-400" />
          <span>{label}</span>
          <span className="text-slate-400 font-normal">({itemData.formattedDate})</span>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 text-[10px] font-mono font-semibold border border-cyan-500/20">
          +{itemData.xpEarned} XP
        </span>
      </div>

      <div className="space-y-2">
        {/* Mood Section */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <div className="flex items-center gap-2">
            <span className="text-base leading-none">{moodInfo.emoji}</span>
            <span className="text-slate-300 font-medium">Daily Mood</span>
          </div>
          <div className="text-right">
            <span className="font-bold text-emerald-400">{moodInfo.label}</span>
            <span className="text-slate-400 text-[10px] ml-1 font-mono">({itemData.moodScore}/5)</span>
          </div>
        </div>

        {/* Goals Achieved Section */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-400" />
            <span className="text-slate-300 font-medium">Goals Met</span>
          </div>
          <span className="font-black text-indigo-300 font-mono text-sm">
            {itemData.goalsAchieved} <span className="text-xs font-normal text-slate-400 font-sans">achieved</span>
          </span>
        </div>

        {/* Focus Item */}
        {itemData.dailyGoalText && (
          <div className="pt-1 text-[11px] text-slate-400 flex items-start gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-400 flex-shrink-0 mt-0.5" />
            <span className="italic line-clamp-2">"{itemData.dailyGoalText}"</span>
          </div>
        )}
      </div>
    </div>
  );
};

export const MoodGoalsLineChart: React.FC<MoodGoalsLineChartProps> = ({
  data,
  onAddGoalToday,
  streakDays
}) => {
  const [activeFilter, setActiveFilter] = useState<'both' | 'mood' | 'goals'>('both');

  // Compute 7-day stats
  const totalGoalsAchieved = data.reduce((acc, curr) => acc + curr.goalsAchieved, 0);
  const avgMoodScore = data.length > 0
    ? (data.reduce((acc, curr) => acc + curr.moodScore, 0) / data.length).toFixed(1)
    : '4.2';
  
  const peakDay = data.reduce((best, curr) => 
    curr.goalsAchieved > (best?.goalsAchieved || 0) ? curr : best, data[0]
  );

  return (
    <div className="rounded-2xl bg-slate-900/70 border border-white/10 backdrop-blur-md p-6 shadow-2xl relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold tracking-wider uppercase flex items-center gap-1.5">
              <TrendingUp className="w-3 h-3" />
              7-Day Performance Analytics
            </span>
            <span className="text-slate-500 text-xs">·</span>
            <span className="text-xs text-slate-400 font-medium">Recharts Telemetry</span>
          </div>
          <h3 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Daily Mood Trends & Goals Achieved
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Correlation between your daily cognitive mindset and completed career milestones over the last 7 days.
          </p>
        </div>

        {/* View toggles & Quick Action */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-slate-950/80 p-1 rounded-xl border border-white/10 flex items-center text-xs">
            <button
              onClick={() => setActiveFilter('both')}
              className={`px-3 py-1.5 rounded-lg transition-all font-medium cursor-pointer ${
                activeFilter === 'both'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Both Trends
            </button>
            <button
              onClick={() => setActiveFilter('mood')}
              className={`px-3 py-1.5 rounded-lg transition-all font-medium cursor-pointer ${
                activeFilter === 'mood'
                  ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Mood Only
            </button>
            <button
              onClick={() => setActiveFilter('goals')}
              className={`px-3 py-1.5 rounded-lg transition-all font-medium cursor-pointer ${
                activeFilter === 'goals'
                  ? 'bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Goals Only
            </button>
          </div>

          {onAddGoalToday && (
            <button
              onClick={onAddGoalToday}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.25)] transition-all cursor-pointer"
              title="Record another completed micro-goal for today"
            >
              <Plus className="w-3.5 h-3.5" />
              Log Today's Goal (+1)
            </button>
          )}
        </div>
      </div>

      {/* KPI Metric Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5">
          <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1">
            <span>7-Day Mood Avg</span>
            <Smile className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-black text-emerald-400 font-mono">{avgMoodScore}</span>
            <span className="text-xs text-slate-400">/ 5.0</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            🚀 High Energy & Focus
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5">
          <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1">
            <span>Goals Met (7d)</span>
            <Target className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-black text-indigo-300 font-mono">{totalGoalsAchieved}</span>
            <span className="text-xs text-slate-400">milestones</span>
          </div>
          <div className="text-[10px] text-emerald-400 mt-0.5 flex items-center gap-1">
            <TrendingUp className="w-2.5 h-2.5" />
            +18% vs prev week
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5">
          <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1">
            <span>Peak Momentum</span>
            <Award className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-lg font-black text-white font-mono truncate">
            {peakDay ? `${peakDay.dayLabel}` : 'Wednesday'}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {peakDay ? `${peakDay.goalsAchieved} goals logged` : '3 goals completed'}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5">
          <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1">
            <span>Check-in Consistency</span>
            <Flame className="w-3.5 h-3.5 text-orange-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-black text-orange-400 font-mono">100%</span>
            <span className="text-xs text-slate-400">rate</span>
          </div>
          <div className="text-[10px] text-orange-300 mt-0.5">
            {streakDays} Day Active Streak 🔥
          </div>
        </div>
      </div>

      {/* Main Recharts Line Chart Container */}
      <div className="w-full h-72 sm:h-80 bg-slate-950/70 rounded-xl p-3 border border-white/5 relative">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 25, left: -10, bottom: 5 }}
          >
            <defs>
              <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.2} />
              </linearGradient>
              <linearGradient id="goalsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#818cf8" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0.2} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />

            <XAxis
              dataKey="dayLabel"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              dy={8}
            />

            {/* Left Y-Axis for Mood (Scale 1-5) */}
            {(activeFilter === 'both' || activeFilter === 'mood') && (
              <YAxis
                yAxisId="moodAxis"
                domain={[1, 5]}
                ticks={[1, 2, 3, 4, 5]}
                stroke="#10b981"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => {
                  if (val === 5) return '🚀 5';
                  if (val === 4) return '💡 4';
                  if (val === 3) return '🧘 3';
                  if (val === 2) return '☕ 2';
                  return '😴 1';
                }}
              />
            )}

            {/* Right Y-Axis for Goals (Scale 0-5) */}
            {(activeFilter === 'both' || activeFilter === 'goals') && (
              <YAxis
                yAxisId="goalsAxis"
                orientation="right"
                domain={[0, 5]}
                ticks={[0, 1, 2, 3, 4, 5]}
                stroke="#818cf8"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `${val} 🎯`}
              />
            )}

            <Tooltip content={<CustomTooltip />} />

            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ paddingBottom: 15, fontSize: 11 }}
              formatter={(value) => {
                if (value === 'moodScore') {
                  return <span className="text-emerald-400 font-semibold mr-3">🚀 Daily Mood Index (1-5)</span>;
                }
                if (value === 'goalsAchieved') {
                  return <span className="text-indigo-400 font-semibold">🎯 Goals Achieved (Count)</span>;
                }
                return value;
              }}
            />

            {/* Line 1: Mood Score */}
            {(activeFilter === 'both' || activeFilter === 'mood') && (
              <Line
                yAxisId="moodAxis"
                type="monotone"
                dataKey="moodScore"
                name="moodScore"
                stroke="#10b981"
                strokeWidth={3}
                dot={{
                  r: 5,
                  fill: '#0f172a',
                  stroke: '#10b981',
                  strokeWidth: 2
                }}
                activeDot={{
                  r: 7,
                  fill: '#10b981',
                  stroke: '#ffffff',
                  strokeWidth: 2
                }}
                animationDuration={900}
              />
            )}

            {/* Line 2: Goals Achieved */}
            {(activeFilter === 'both' || activeFilter === 'goals') && (
              <Line
                yAxisId="goalsAxis"
                type="monotone"
                dataKey="goalsAchieved"
                name="goalsAchieved"
                stroke="#818cf8"
                strokeWidth={3}
                strokeDasharray={activeFilter === 'both' ? '4 2' : undefined}
                dot={{
                  r: 5,
                  fill: '#0f172a',
                  stroke: '#818cf8',
                  strokeWidth: 2
                }}
                activeDot={{
                  r: 7,
                  fill: '#818cf8',
                  stroke: '#ffffff',
                  strokeWidth: 2
                }}
                animationDuration={900}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Legend / Footnote */}
      <div className="mt-4 pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 gap-2">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-slate-300 font-medium">Daily Mood Score:</span>
            <span>1 (Drained) to 5 (Peak Focus)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
            <span className="text-slate-300 font-medium">Goals Achieved:</span>
            <span>Completed skills, study goals & micro-quests</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-slate-500 font-mono text-[10px]">
          <Info className="w-3 h-3 text-cyan-400/80" />
          <span>Synced with Daily Check-in & Roadmap XP</span>
        </div>
      </div>
    </div>
  );
};
