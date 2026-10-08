import React, { useState } from 'react';
import { 
  Sparkles, 
  Flame, 
  CheckCircle2, 
  Award, 
  Smile, 
  Target, 
  Calendar, 
  ArrowRight, 
  Zap, 
  Edit3, 
  Check,
  RefreshCw,
  Compass,
  Lightbulb,
  CheckCircle
} from 'lucide-react';
import { DailyCheckIn, RoadmapData } from '../../types/roadmap';
import { fetchDailyCheckInInsight, fetchDailyGoalIdeas } from '../../services/aiService';

interface DailyCheckInCardProps {
  streakDays: number;
  onCheckIn: (
    mood: string, 
    moodLabel: string, 
    goal: string, 
    aiData?: { insight?: string; actionItem?: string; recommendedResource?: string }
  ) => void;
  savedCheckIn: DailyCheckIn | null;
  roadmap?: RoadmapData;
  onClaimBonusXp?: (amount?: number) => void;
  onUpdateDailyCheckInAi?: (aiData: { insight: string; actionItem: string; recommendedResource?: string }) => void;
}

const MOODS = [
  { id: 'focused', emoji: '🚀', label: 'Focused', sub: 'Ready to build' },
  { id: 'curious', emoji: '💡', label: 'Curious', sub: 'Learning mode' },
  { id: 'energized', emoji: '⚡', label: 'Energized', sub: 'High momentum' },
  { id: 'steady', emoji: '🧘', label: 'Steady', sub: 'Consistent pace' },
  { id: 'pacing', emoji: '☕', label: 'Taking Steps', sub: 'One by one' }
];

const DEFAULT_PRESET_GOALS = [
  'Conquer 1 active skill node',
  'Push working code with tests to GitHub',
  'Log 1 hour of deep study time',
  'Practice 1 system trade-off interview question'
];

export const DailyCheckInCard: React.FC<DailyCheckInCardProps> = ({
  streakDays,
  onCheckIn,
  savedCheckIn,
  roadmap,
  onClaimBonusXp,
  onUpdateDailyCheckInAi
}) => {
  const [selectedMood, setSelectedMood] = useState<string>('focused');
  const [selectedGoal, setSelectedGoal] = useState<string>(DEFAULT_PRESET_GOALS[0]);
  const [customGoal, setCustomGoal] = useState<string>('');
  const [presetGoals, setPresetGoals] = useState<string[]>(DEFAULT_PRESET_GOALS);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isFetchingGoals, setIsFetchingGoals] = useState<boolean>(false);
  const [isFetchingInsight, setIsFetchingInsight] = useState<boolean>(false);
  const [bonusClaimedLocally, setBonusClaimedLocally] = useState<boolean>(false);

  // Today's formatted date string
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  }).format(new Date());

  const activeMoodObj = MOODS.find(m => m.id === selectedMood) || MOODS[0];
  const targetCareer = roadmap?.career || 'Software Engineer';
  const targetIndustry = roadmap?.industry || 'Technology';

  // Find currently active skill node for hyper-tailored advice
  const currentActiveSkill = roadmap?.phases?.flatMap(p => p.nodes || []).find(n => n.status === 'active')?.title || 'Technical Fundamentals';

  // Fetch AI Goal Ideas from API
  const handleFetchAiGoals = async () => {
    setIsFetchingGoals(true);
    try {
      const goals = await fetchDailyGoalIdeas({
        mood: activeMoodObj.label,
        career: targetCareer,
        industry: targetIndustry
      });
      if (goals && goals.length > 0) {
        setPresetGoals(goals);
        setSelectedGoal(goals[0]);
        setCustomGoal('');
      }
    } catch (err) {
      console.warn('Failed to fetch AI goals:', err);
    } finally {
      setIsFetchingGoals(false);
    }
  };

  // Submit check-in and immediately request AI strategy via API
  const handleCompleteCheckIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const finalGoal = customGoal.trim() || selectedGoal;

    // Record check-in immediately so UI is responsive
    onCheckIn(activeMoodObj.emoji, activeMoodObj.label, finalGoal);
    setIsEditing(false);

    // Fetch AI Insight in background from API
    setIsFetchingInsight(true);
    try {
      const aiResponse = await fetchDailyCheckInInsight({
        mood: activeMoodObj.emoji,
        moodLabel: activeMoodObj.label,
        goal: finalGoal,
        career: targetCareer,
        industry: targetIndustry,
        currentSkill: currentActiveSkill
      });

      if (aiResponse && onUpdateDailyCheckInAi) {
        onUpdateDailyCheckInAi(aiResponse);
      }
    } catch (err) {
      console.warn('AI insight fetch error:', err);
    } finally {
      setIsFetchingInsight(false);
    }
  };

  // Explicitly fetch or refresh AI Insight on a completed check-in
  const handleRefreshAiInsight = async () => {
    if (!savedCheckIn) return;
    setIsFetchingInsight(true);
    try {
      const aiResponse = await fetchDailyCheckInInsight({
        mood: savedCheckIn.mood,
        moodLabel: savedCheckIn.moodLabel,
        goal: savedCheckIn.goal,
        career: targetCareer,
        industry: targetIndustry,
        currentSkill: currentActiveSkill
      });

      if (aiResponse && onUpdateDailyCheckInAi) {
        onUpdateDailyCheckInAi(aiResponse);
      }
    } catch (err) {
      console.warn('Error refreshing AI insight:', err);
    } finally {
      setIsFetchingInsight(false);
    }
  };

  const handleClaimBonus = () => {
    if (onClaimBonusXp) {
      onClaimBonusXp(15);
    }
    setBonusClaimedLocally(true);
  };

  const isBonusClaimed = savedCheckIn?.bonusXpClaimed || bonusClaimedLocally;

  // COMPLETED STATE
  if (savedCheckIn && !isEditing) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/35 bg-gradient-to-r from-emerald-950/40 via-slate-900/90 to-cyan-950/40 p-5 md:p-6 shadow-[0_0_40px_rgba(16,185,129,0.18)] transition-all space-y-4">
        {/* Glow ambient blurs */}
        <div className="absolute -top-16 -right-16 w-44 h-44 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Card Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.35)] flex-shrink-0">
              <CheckCircle2 className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                  Daily Check-in Complete
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {todayFormatted}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-bold flex items-center gap-1">
                  <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
                  {streakDays} Day Streak
                </span>
              </div>

              <h3 className="text-base font-extrabold text-white flex flex-wrap items-center gap-2">
                <span>Today's Goal:</span>
                <span className="text-emerald-300 font-medium">"{savedCheckIn.goal}"</span>
              </h3>

              <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-300">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-base leading-none">{savedCheckIn.mood}</span>
                  <span className="font-semibold text-white">{savedCheckIn.moodLabel}</span>
                </span>
                <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  +{savedCheckIn.xpEarned} XP Earned
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={() => {
                setCustomGoal(savedCheckIn.goal);
                setIsEditing(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Change Goal</span>
            </button>
          </div>
        </div>

        {/* AI STRATEGY & MICRO-QUEST SECTION (API FETCHED) */}
        <div className="pt-3 border-t border-white/10">
          {savedCheckIn.aiInsight ? (
            <div className="rounded-xl bg-slate-950/80 border border-cyan-500/30 p-4 relative overflow-hidden space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white">AI Coach Daily Strategy</span>
                    <span className="text-[10px] text-cyan-400 ml-2 font-mono">Tailored for {targetCareer}</span>
                  </div>
                </div>

                <button
                  onClick={handleRefreshAiInsight}
                  disabled={isFetchingInsight}
                  className="text-[11px] text-slate-400 hover:text-cyan-300 flex items-center gap-1 self-start sm:self-auto cursor-pointer transition-colors"
                  title="Fetch fresh insight from AI Coach API"
                >
                  <RefreshCw className={`w-3 h-3 ${isFetchingInsight ? 'animate-spin text-cyan-400' : ''}`} />
                  <span>{isFetchingInsight ? 'Fetching API...' : 'Refresh Strategy'}</span>
                </button>
              </div>

              {/* Coaching Insight Quote */}
              <p className="text-xs text-slate-200 leading-relaxed italic bg-white/5 p-3 rounded-lg border border-white/5">
                "{savedCheckIn.aiInsight}"
              </p>

              {/* Actionable Micro-Quest */}
              {savedCheckIn.actionItem && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-gradient-to-r from-cyan-950/40 to-blue-950/40 border border-cyan-500/20">
                  <div className="flex items-start gap-2.5">
                    <div className="p-1 rounded-lg bg-cyan-400 text-slate-950 mt-0.5">
                      <Target className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-cyan-300 uppercase tracking-wide">
                        Today's 20-Min Micro-Quest
                      </div>
                      <div className="text-xs text-white font-medium mt-0.5">
                        {savedCheckIn.actionItem}
                      </div>
                      {savedCheckIn.recommendedResource && (
                        <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                          <Lightbulb className="w-3 h-3 text-amber-400 flex-shrink-0" />
                          <span>Tip: {savedCheckIn.recommendedResource}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Micro-quest Bonus XP Claim Button */}
                  <div className="self-end sm:self-center flex-shrink-0">
                    {isBonusClaimed ? (
                      <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        Bonus Claimed (+15 XP)
                      </span>
                    ) : (
                      <button
                        onClick={handleClaimBonus}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer transform hover:scale-[1.02]"
                      >
                        <Zap className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
                        Complete Quest (+15 XP)
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-cyan-500/20">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Want personalized coaching and a 20-min micro-quest for today's goal?</span>
              </div>
              <button
                onClick={handleRefreshAiInsight}
                disabled={isFetchingInsight}
                className="px-3.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {isFetchingInsight ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                    <span>Fetching API...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Fetch AI Daily Strategy (+15 XP Quest)</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // FORM INPUT STATE
  return (
    <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-slate-900/95 via-slate-950 to-slate-900/95 p-5 md:p-6 shadow-2xl backdrop-blur-xl transition-all">
      {/* Background glow highlights */}
      <div className="absolute top-0 right-1/4 w-72 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-72 h-40 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-4 border-b border-white/10 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Calendar className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white tracking-tight">
                Daily Check-in
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono font-bold">
                +35 XP
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {todayFormatted} • Record your mindset & focus goal to compound momentum
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{streakDays} Day Streak</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleCompleteCheckIn} className="space-y-4">
        {/* Step 1: Mood Selection */}
        <div>
          <label className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
            <Smile className="w-3.5 h-3.5 text-cyan-400" />
            <span>How are you feeling today?</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {MOODS.map(m => {
              const isSelected = selectedMood === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedMood(m.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.25)] scale-[1.02]'
                      : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-slate-900 hover:border-white/20'
                  }`}
                >
                  <div className="text-xl mb-1">{m.emoji}</div>
                  <div className="text-xs font-bold text-white leading-tight">{m.label}</div>
                  <div className="text-[10px] text-slate-400 truncate">{m.sub}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Goal Selection */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-cyan-400" />
              <span>One clear goal for today:</span>
            </label>

            {/* Fetch Goals API Button */}
            <button
              type="button"
              onClick={handleFetchAiGoals}
              disabled={isFetchingGoals}
              className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors cursor-pointer"
              title="Query AI API for fresh smart daily goals"
            >
              {isFetchingGoals ? (
                <>
                  <RefreshCw className="w-3 h-3 animate-spin text-cyan-400" />
                  <span>Fetching API...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>Fetch AI Goal Ideas</span>
                </>
              )}
            </button>
          </div>

          {/* Preset Goal Pills */}
          <div className="flex flex-wrap gap-2 mb-2.5">
            {presetGoals.map((preset, idx) => {
              const isSelected = selectedGoal === preset && !customGoal.trim();
              return (
                <button
                  key={`${preset}-${idx}`}
                  type="button"
                  onClick={() => {
                    setSelectedGoal(preset);
                    setCustomGoal('');
                  }}
                  className={`text-xs px-3 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                      : 'bg-slate-900/60 text-slate-400 border-white/5 hover:text-white hover:bg-slate-800 hover:border-white/10'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 text-cyan-400" />}
                  <span>{preset}</span>
                </button>
              );
            })}
          </div>

          {/* Custom Goal Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Or write your own custom daily learning goal..."
              value={customGoal}
              onChange={(e) => setCustomGoal(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 focus:border-cyan-400 focus:outline-none text-xs text-white placeholder-slate-500 shadow-inner transition-all"
            />
          </div>
        </div>

        {/* Footer Submit Button */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Earns <strong className="text-white">+35 XP</strong> + unlocks AI Micro-Quest</span>
          </div>

          <div className="flex items-center gap-2">
            {isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all cursor-pointer"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 text-xs font-extrabold shadow-[0_0_20px_rgba(6,182,212,0.35)] flex items-center justify-center gap-2 transition-all cursor-pointer transform hover:scale-[1.01]"
            >
              <span>{isEditing ? 'Update Check-in' : 'Complete Daily Check-in'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
