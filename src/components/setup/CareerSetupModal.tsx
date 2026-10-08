import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Briefcase, 
  Building2, 
  GraduationCap, 
  Wrench, 
  Clock, 
  Calendar, 
  Target,
  Zap,
  Plus
} from 'lucide-react';
import { CareerSetupInput } from '../../types/roadmap';
import { DEMO_SETUP_INPUT } from '../../data/demoRoadmaps';

interface CareerSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: CareerSetupInput) => void;
  initialValues?: Partial<CareerSetupInput>;
}

const INDUSTRIES = [
  'Climate Tech',
  'Technology',
  'AI & Machine Learning',
  'Cybersecurity',
  'Finance & FinTech',
  'Healthcare & BioTech',
  'Gaming & Interactive',
  'Automotive & Robotics',
  'Education',
  'Other'
];

const LEVELS = [
  'Complete Beginner',
  'School Student',
  'College Student',
  'Beginner',
  'Intermediate',
  'Advanced'
];

const PRESET_SKILLS = [
  'C',
  'Basic HTML',
  'CSS',
  'JavaScript',
  'Python',
  'Git',
  'SQL',
  'React',
  'Node.js',
  'Java',
  'C++',
  'Docker'
];

const TIMELINES = [
  '3 months',
  '6 months',
  '1 year',
  '2 years',
  'Flexible'
];

const COMPANIES = [
  'Startup',
  'MNC / Big Tech',
  'Product Company',
  'Service Company',
  'Government',
  'Freelance',
  'Any'
];

export const CareerSetupModal: React.FC<CareerSetupModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialValues
}) => {
  const [step, setStep] = useState(1);
  const [dreamJob, setDreamJob] = useState(initialValues?.dreamJob || '');
  const [industry, setIndustry] = useState(initialValues?.industry || 'Climate Tech');
  const [level, setLevel] = useState(initialValues?.level || 'College Student');
  const [skills, setSkills] = useState<string[]>(initialValues?.existingSkills || ['C', 'Basic HTML']);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [hoursPerWeek, setHoursPerWeek] = useState(initialValues?.hoursPerWeek || 10);
  const [timeline, setTimeline] = useState(initialValues?.timeline || '6 months');
  const [targetCompany, setTargetCompany] = useState(initialValues?.targetCompany || 'Startup');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cleanly reset wizard state when modal is opened
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setIsSubmitting(false);
      if (initialValues) {
        if (initialValues.dreamJob !== undefined) setDreamJob(initialValues.dreamJob);
        if (initialValues.industry !== undefined) setIndustry(initialValues.industry);
        if (initialValues.level !== undefined) setLevel(initialValues.level);
        if (initialValues.existingSkills !== undefined) setSkills(initialValues.existingSkills);
        if (initialValues.hoursPerWeek !== undefined) setHoursPerWeek(initialValues.hoursPerWeek);
        if (initialValues.timeline !== undefined) setTimeline(initialValues.timeline);
        if (initialValues.targetCompany !== undefined) setTargetCompany(initialValues.targetCompany);
      }
    }
  }, [isOpen, initialValues]);

  if (!isOpen) return null;

  const totalSteps = 7;

  const handleToggleSkill = (skill: string) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter(s => s !== skill));
    } else {
      setSkills([...skills, skill]);
    }
  };

  const handleAddCustomSkill = () => {
    if (customSkillInput.trim() && !skills.includes(customSkillInput.trim())) {
      setSkills([...skills, customSkillInput.trim()]);
      setCustomSkillInput('');
    }
  };

  const handleApplyDemoPreset = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setDreamJob(DEMO_SETUP_INPUT.dreamJob);
    setIndustry(DEMO_SETUP_INPUT.industry);
    setLevel(DEMO_SETUP_INPUT.level);
    setSkills(DEMO_SETUP_INPUT.existingSkills);
    setHoursPerWeek(DEMO_SETUP_INPUT.hoursPerWeek);
    setTimeline(DEMO_SETUP_INPUT.timeline);
    setTargetCompany(DEMO_SETUP_INPUT.targetCompany);
    // Submit directly
    onSubmit({
      dreamJob: DEMO_SETUP_INPUT.dreamJob,
      industry: DEMO_SETUP_INPUT.industry,
      level: DEMO_SETUP_INPUT.level,
      existingSkills: DEMO_SETUP_INPUT.existingSkills,
      hoursPerWeek: DEMO_SETUP_INPUT.hoursPerWeek,
      timeline: DEMO_SETUP_INPUT.timeline,
      targetCompany: DEMO_SETUP_INPUT.targetCompany
    });
    setTimeout(() => setIsSubmitting(false), 800);
  };

  const handleQuickSubmit = (targetDreamJob?: string) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const chosenJob = (targetDreamJob || dreamJob).trim() || 'Full Stack Developer at a Climate Tech Startup';
    onSubmit({
      dreamJob: chosenJob,
      industry,
      level,
      existingSkills: skills,
      hoursPerWeek,
      timeline,
      targetCompany
    });
    setTimeout(() => setIsSubmitting(false), 800);
  };

  const handleFinalSubmit = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    onSubmit({
      dreamJob: dreamJob.trim() || 'Full Stack Developer at a Climate Tech Startup',
      industry,
      level,
      existingSkills: skills,
      hoursPerWeek,
      timeline,
      targetCompany
    });
    setTimeout(() => setIsSubmitting(false), 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-2xl bg-slate-950 border border-white/10 p-6 md:p-8 text-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Glow decorative blurs */}
        <div className="absolute -top-20 -right-20 w-52 h-52 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-52 h-52 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Let's build your career path</h2>
              <p className="text-xs text-slate-400">Step {step} of {totalSteps}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleApplyDemoPreset}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all flex items-center gap-1.5"
              title="Autofill the climate-tech demo parameters"
            >
              <Zap className="w-3 h-3 text-amber-400" />
              1-Click Demo Fill
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar Indicator */}
        <div className="w-full bg-slate-900 rounded-full h-1.5 mb-6 overflow-hidden border border-white/5">
          <div
            className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        {/* Multi-Step Body */}
        <div className="flex-1 overflow-y-auto pr-1 py-1">
          {/* STEP 1: Dream Career */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-sm font-bold text-white mb-1.5 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-cyan-400" />
                  What is your dream job?
                </label>
                <p className="text-xs text-slate-400 mb-3">
                  Be as specific as you want. Mention your desired role and target space.
                </p>
                <input
                  type="text"
                  autoFocus
                  placeholder="e.g. Full Stack Developer at a climate-tech startup"
                  value={dreamJob}
                  onChange={(e) => setDreamJob(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && setStep(2)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 focus:border-cyan-400 focus:outline-none text-white text-sm placeholder-slate-500 transition-all shadow-inner"
                />
              </div>

              {/* Suggestions chips */}
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                  Popular Aspirations:
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Full Stack Developer at a climate-tech startup',
                    'AI Engineer at a Fintech Company',
                    'Cloud & DevOps Architect',
                    'Cybersecurity Defense Analyst',
                    'Game Developer (C++ & Engines)',
                    'Mobile iOS / Android Engineer'
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setDreamJob(preset)}
                      className={`text-xs px-3 py-1.5 rounded-lg border text-left transition-all cursor-pointer ${
                        dreamJob === preset
                          ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                          : 'bg-slate-900 hover:bg-cyan-500/10 hover:text-cyan-300 border-white/5 hover:border-cyan-500/30 text-slate-300'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Launch Callout */}
              <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span className="text-slate-300">
                    Want an instant roadmap? We'll apply smart defaults for your dream job.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleQuickSubmit()}
                  className="px-3.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Instant Generate →</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Industry */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-sm font-bold text-white mb-1.5 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-cyan-400" />
                  Which industry are you aiming for?
                </label>
                <p className="text-xs text-slate-400 mb-3">
                  This tailors your portfolio projects, missions, and interview challenges.
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  {INDUSTRIES.map((ind) => (
                    <button
                      key={ind}
                      type="button"
                      onClick={() => setIndustry(ind)}
                      className={`p-3 rounded-xl text-xs font-semibold text-left transition-all border ${
                        industry === ind
                          ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                          : 'bg-slate-900/60 text-slate-300 border-white/5 hover:bg-white/5'
                      }`}
                    >
                      {ind}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Current Level */}
          {step === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-sm font-bold text-white mb-1.5 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-cyan-400" />
                  What is your current background & experience level?
                </label>
                <p className="text-xs text-slate-400 mb-3">
                  We'll start your roadmap at the right foundational difficulty.
                </p>
                <div className="space-y-2">
                  {LEVELS.map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setLevel(lvl)}
                      className={`w-full p-3.5 rounded-xl text-xs font-semibold text-left flex items-center justify-between transition-all border ${
                        level === lvl
                          ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                          : 'bg-slate-900/60 text-slate-300 border-white/5 hover:bg-white/5'
                      }`}
                    >
                      <span>{lvl}</span>
                      {level === lvl && <Check className="w-4 h-4 text-cyan-400" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Existing Skills */}
          {step === 4 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-sm font-bold text-white mb-1.5 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-cyan-400" />
                  What skills or languages do you already know?
                </label>
                <p className="text-xs text-slate-400 mb-3">
                  Select all that apply. CareerQuest will automatically mark them completed and save you study time!
                </p>

                {/* Preset Chips */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {PRESET_SKILLS.map((sk) => {
                    const isSelected = skills.includes(sk);
                    return (
                      <button
                        key={sk}
                        type="button"
                        onClick={() => handleToggleSkill(sk)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                          isSelected
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                            : 'bg-slate-900/70 text-slate-400 border-white/5 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}{sk}
                      </button>
                    );
                  })}
                </div>

                {/* Custom skill adder */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add custom skill (e.g. Tailwind, Redis, Rust)..."
                    value={customSkillInput}
                    onChange={(e) => setCustomSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomSkill();
                      }
                    }}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomSkill}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-white/10 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Time Available */}
          {step === 5 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-sm font-bold text-white mb-1.5 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  How many hours can you learn per week?
                </label>
                <p className="text-xs text-slate-400 mb-4">
                  We'll use this to pace your phases and predict your job-ready finish date.
                </p>

                <div className="p-6 rounded-2xl bg-slate-900/70 border border-white/5 text-center">
                  <div className="text-3xl font-extrabold text-cyan-300 font-mono mb-2">
                    {hoursPerWeek} <span className="text-sm font-sans text-slate-400 font-normal">hours/week</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={40}
                    step={1}
                    value={hoursPerWeek}
                    onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg mb-3"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>5 hrs/wk (Casual Study)</span>
                    <span>10 hrs/wk (Recommended)</span>
                    <span>40 hrs/wk (Bootcamp Pace)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Target Timeline */}
          {step === 6 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-sm font-bold text-white mb-1.5 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  What is your target timeline?
                </label>
                <p className="text-xs text-slate-400 mb-3">
                  When do you want to start applying for jobs or internships?
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  {TIMELINES.map((tl) => (
                    <button
                      key={tl}
                      type="button"
                      onClick={() => setTimeline(tl)}
                      className={`p-3.5 rounded-xl text-xs font-semibold text-left transition-all border ${
                        timeline === tl
                          ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                          : 'bg-slate-900/60 text-slate-300 border-white/5 hover:bg-white/5'
                      }`}
                    >
                      {tl}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: Target Company */}
          {step === 7 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-sm font-bold text-white mb-1.5 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-cyan-400" />
                  What type of company do you want to join?
                </label>
                <p className="text-xs text-slate-400 mb-3">
                  Startup culture values shipping speed & generalist grit; MNCs focus heavily on DSA and scale.
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  {COMPANIES.map((cmp) => (
                    <button
                      key={cmp}
                      type="button"
                      onClick={() => setTargetCompany(cmp)}
                      className={`p-3.5 rounded-xl text-xs font-semibold text-left transition-all border ${
                        targetCompany === cmp
                          ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                          : 'bg-slate-900/60 text-slate-300 border-white/5 hover:bg-white/5'
                      }`}
                    >
                      {cmp}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Navigation */}
        <div className="pt-4 border-t border-white/10 mt-6 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-1.5 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          ) : (
            <div />
          )}

          {step < totalSteps ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center gap-1.5 transition-all cursor-pointer"
            >
              Next <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinalSubmit}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 text-xs font-extrabold shadow-[0_0_25px_rgba(6,182,212,0.4)] flex items-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              Generate My Roadmap →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
