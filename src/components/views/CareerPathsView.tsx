import React, { useState } from 'react';
import { 
  Compass, 
  ArrowRight, 
  Clock, 
  Flame, 
  Layers, 
  GitCompare, 
  Sparkles, 
  Briefcase, 
  CheckCircle2, 
  X,
  Code2,
  FolderGit2
} from 'lucide-react';
import { CareerPreset } from '../../types/roadmap';
import { POPULAR_CAREER_PRESETS } from '../../data/demoRoadmaps';

interface CareerPathsViewProps {
  onSelectCareerPreset: (preset: CareerPreset) => void;
}

export const CareerPathsView: React.FC<CareerPathsViewProps> = ({
  onSelectCareerPreset
}) => {
  const [isComparing, setIsComparing] = useState(false);
  const [careerA, setCareerA] = useState<CareerPreset>(POPULAR_CAREER_PRESETS[0]);
  const [careerB, setCareerB] = useState<CareerPreset>(POPULAR_CAREER_PRESETS[1]);

  // Calculate skill overlap
  const skillsA = new Set(careerA.coreSkills.map(s => s.toLowerCase()));
  const overlapSkills = careerB.coreSkills.filter(s => skillsA.has(s.toLowerCase()));
  const overlapPercent = Math.round(
    (overlapSkills.length / Math.max(careerA.coreSkills.length, careerB.coreSkills.length)) * 100
  );

  return (
    <div className="space-y-8 py-4">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-white/10 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
            <Compass className="w-3.5 h-3.5" />
            Curated Career Destinations
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Explore Pre-Engineered Pathways
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Pick a high-demand tech specialization to generate its visual skill tree or compare two fields to choose your ideal focus.
          </p>
        </div>

        <button
          onClick={() => setIsComparing(true)}
          className="px-5 py-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center gap-2 shadow-lg transition-all flex-shrink-0 cursor-pointer"
        >
          <GitCompare className="w-4 h-4 text-cyan-400" />
          Compare Careers
        </button>
      </div>

      {/* Career Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {POPULAR_CAREER_PRESETS.map((preset) => (
          <div
            key={preset.id}
            className="group relative rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-md p-6 hover:border-cyan-500/40 transition-all flex flex-col justify-between shadow-xl hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]"
          >
            <div>
              {/* Header pill & industry */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400">
                  {preset.industry}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                  preset.difficulty === 'Intermediate' ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20' :
                  'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                }`}>
                  {preset.difficulty}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors mb-2">
                {preset.title}
              </h3>

              <p className="text-xs text-slate-300 mb-4 line-clamp-2 leading-relaxed">
                {preset.tagline}
              </p>

              {/* Timeline & Hours Info */}
              <div className="flex items-center gap-4 text-xs text-slate-400 mb-4 pb-4 border-b border-white/5">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{preset.typicalTimeline}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-slate-400" />
                  <span>~{preset.estimatedHours} hrs</span>
                </div>
              </div>

              {/* Core Skills */}
              <div className="mb-4">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">
                  Core Skills
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {preset.coreSkills.map((sk, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[11px] text-slate-300 font-mono"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recommended Projects */}
              <div className="mb-4">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5">
                  Recommended Capstone
                </div>
                <div className="text-xs text-slate-300 flex items-start gap-1.5">
                  <FolderGit2 className="w-3.5 h-3.5 text-indigo-400 mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-1">{preset.recommendedProjects[0]}</span>
                </div>
              </div>

              {/* Entry Roles */}
              <div className="mb-5">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5">
                  Typical Entry Roles
                </div>
                <div className="text-xs text-slate-400 line-clamp-1">
                  {preset.entryRoles.join(' · ')}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  setCareerA(preset);
                  setIsComparing(true);
                }}
                className="text-xs font-semibold text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
              >
                Compare
              </button>

              <button
                onClick={() => onSelectCareerPreset(preset)}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                Load Roadmap <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Representative Disclaimer Note */}
      <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 text-center text-xs text-slate-400">
        <em>"These are representative pathways. Career journeys vary by person, company and industry."</em>
      </div>

      {/* COMPARE CAREERS MODAL */}
      {isComparing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
          <div className="relative w-full max-w-4xl rounded-2xl bg-slate-950 border border-white/10 p-6 md:p-8 text-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <button
              onClick={() => setIsComparing(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
                <GitCompare className="w-3.5 h-3.5" />
                Career Trajectory Comparison
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white">
                Compare Career Specializations
              </h2>
            </div>

            {/* Selectors for Career A and Career B */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10">
                <label className="text-xs font-semibold text-cyan-400 block mb-1.5">
                  Career Option 1
                </label>
                <select
                  value={careerA.id}
                  onChange={(e) => {
                    const match = POPULAR_CAREER_PRESETS.find(p => p.id === e.target.value);
                    if (match) setCareerA(match);
                  }}
                  className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  {POPULAR_CAREER_PRESETS.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10">
                <label className="text-xs font-semibold text-purple-400 block mb-1.5">
                  Career Option 2
                </label>
                <select
                  value={careerB.id}
                  onChange={(e) => {
                    const match = POPULAR_CAREER_PRESETS.find(p => p.id === e.target.value);
                    if (match) setCareerB(match);
                  }}
                  className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-purple-400"
                >
                  {POPULAR_CAREER_PRESETS.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Overlap Summary Banner */}
            <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/20 mb-6 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-slate-300">
                  Shared Skill Overlap: <strong className="text-white">{overlapPercent}%</strong>
                </span>
              </div>
              <div className="text-slate-400">
                {overlapSkills.length > 0 ? (
                  <span>Shared: {overlapSkills.join(', ')}</span>
                ) : (
                  <span>Distinct foundation requirements</span>
                )}
              </div>
            </div>

            {/* Side by side comparison cards */}
            <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6 pr-1">
              {/* Option A Details */}
              <div className="p-5 rounded-2xl bg-slate-900/50 border border-cyan-500/20 space-y-4">
                <h3 className="text-lg font-bold text-cyan-300">{careerA.title}</h3>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Difficulty & Timeline
                  </span>
                  <div className="text-xs text-white font-semibold">
                    {careerA.difficulty} · ~{careerA.typicalTimeline} ({careerA.estimatedHours} hrs)
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Core Technical Stack
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {careerA.coreSkills.map((sk, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-200 text-[11px]">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Primary Capstone Focus
                  </span>
                  <ul className="text-xs text-slate-300 space-y-1">
                    {careerA.recommendedProjects.map((p, i) => (
                      <li key={i}>• {p}</li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => {
                    setIsComparing(false);
                    onSelectCareerPreset(careerA);
                  }}
                  className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
                >
                  Generate {careerA.title} Roadmap
                </button>
              </div>

              {/* Option B Details */}
              <div className="p-5 rounded-2xl bg-slate-900/50 border border-purple-500/20 space-y-4">
                <h3 className="text-lg font-bold text-purple-300">{careerB.title}</h3>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Difficulty & Timeline
                  </span>
                  <div className="text-xs text-white font-semibold">
                    {careerB.difficulty} · ~{careerB.typicalTimeline} ({careerB.estimatedHours} hrs)
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Core Technical Stack
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {careerB.coreSkills.map((sk, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-purple-950/60 border border-purple-500/30 text-purple-200 text-[11px]">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Primary Capstone Focus
                  </span>
                  <ul className="text-xs text-slate-300 space-y-1">
                    {careerB.recommendedProjects.map((p, i) => (
                      <li key={i}>• {p}</li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => {
                    setIsComparing(false);
                    onSelectCareerPreset(careerB);
                  }}
                  className="w-full py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
                >
                  Generate {careerB.title} Roadmap
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
