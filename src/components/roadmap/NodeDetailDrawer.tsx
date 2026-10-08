import React, { useState } from 'react';
import { 
  X, 
  Check, 
  RotateCcw, 
  Sparkles, 
  RefreshCw, 
  Clock, 
  Flame, 
  Github, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Award, 
  CheckSquare, 
  Square,
  Bot,
  Hammer,
  FileCode2,
  BookOpen,
  Layers,
  ArrowRight
} from 'lucide-react';
import { RoadmapNode } from '../../types/roadmap';
import { requestNewMission } from '../../services/aiService';

interface NodeDetailDrawerProps {
  node: RoadmapNode | null;
  onClose: () => void;
  onMarkComplete: (nodeId: string) => void;
  onTriggerReplanning: (node: RoadmapNode) => void;
  onAskCoach: (question: string) => void;
  career: string;
  industry: string;
  level?: string;
}

export const NodeDetailDrawer: React.FC<NodeDetailDrawerProps> = ({
  node,
  onClose,
  onMarkComplete,
  onTriggerReplanning,
  onAskCoach,
  career,
  industry,
  level = 'College Student'
}) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [isRegeneratingMission, setIsRegeneratingMission] = useState(false);
  const [activeMission, setActiveMission] = useState<{
    mission: string;
    goal?: string;
    difficulty?: string;
    estimatedHours?: number;
    skillsPracticed?: string[];
    deliverable?: string;
    githubProof?: string;
    interviewQuestion?: string;
    interviewAnswer?: string;
  } | null>(null);

  const [proofChecklist, setProofChecklist] = useState({
    githubProject: false,
    workingDemo: false,
    readmeDocumentation: false,
    interviewExplanation: false
  });

  if (!node) return null;

  const currentMissionText = activeMission?.mission || node.mission;
  const currentGithubProof = activeMission?.githubProof || node.githubProof;
  const currentInterviewQuestion = activeMission?.interviewQuestion || node.interviewQuestion;
  const currentInterviewAnswer = activeMission?.interviewAnswer || node.interviewAnswer;

  const toggleCheck = (key: keyof typeof proofChecklist) => {
    setProofChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleRegenerateMission = async () => {
    setIsRegeneratingMission(true);
    try {
      const res = await requestNewMission(node.title, career, industry);
      if (res && res.mission) {
        setActiveMission(res);
      }
    } finally {
      setIsRegeneratingMission(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-slate-950/95 backdrop-blur-2xl border-l border-cyan-500/25 shadow-[0_0_60px_rgba(0,0,0,0.85)] flex flex-col transform transition-transform duration-300">
      {/* Top Header - AI Mission Assistant */}
      <div className="p-5 border-b border-white/10 flex items-start justify-between gap-3 bg-gradient-to-r from-slate-900/80 via-slate-950 to-cyan-950/30">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Bot className="w-3.5 h-3.5" />
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400 font-mono">
              AI Node Blueprint
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
              node.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
              node.status === 'known' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
              node.status === 'active' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' :
              node.status === 'recommended' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
              'bg-slate-800 text-slate-400 border-slate-700'
            }`}>
              {node.status}
            </span>
          </div>

          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            SKILL
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {node.title}
          </h2>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable Content Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 text-sm">
        {/* ESTIMATED TIME & DIFFICULTY */}
        <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                ESTIMATED TIME
              </div>
              <div className="text-xs font-bold text-white font-mono">{node.estimatedHours} hours</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                DIFFICULTY
              </div>
              <div className="text-xs font-bold text-amber-300">{node.difficulty}</div>
            </div>
          </div>
        </div>

        {/* PREREQUISITES (If any) */}
        {node.prerequisites && node.prerequisites.length > 0 && (
          <div className="p-3 rounded-xl bg-slate-900/40 border border-amber-500/20 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
              Prerequisites Mapped:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {node.prerequisites.map((prereq, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-200 text-[11px] font-mono">
                  {prereq}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* WHY IT MATTERS */}
        <div>
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-cyan-400 mb-2 flex items-center gap-1.5 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            WHY IT MATTERS
          </h3>
          <p className="text-slate-300 leading-relaxed text-xs p-3.5 rounded-xl bg-slate-900/50 border border-white/5">
            {node.whyItMatters || node.description}
          </p>
        </div>

        {/* WHAT TO LEARN / TOPICS */}
        <div>
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-300 mb-2 font-mono flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            WHAT TO LEARN
          </h3>
          <ul className="space-y-1.5">
            {(node.whatToLearn || node.topics || []).map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 bg-slate-900/35 p-2 rounded-lg border border-white/5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* WEEKEND MISSION & BUILD THIS (Section 10 AI Mission Generator) */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/40 via-slate-900/80 to-slate-900/60 border border-indigo-500/25 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-indigo-300 flex items-center gap-1.5 font-mono">
              <Award className="w-3.5 h-3.5 text-indigo-400" />
              WEEKEND MISSION
            </h3>
            <button
              onClick={handleRegenerateMission}
              disabled={isRegeneratingMission}
              className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors disabled:opacity-50 cursor-pointer"
              title="Generate another practical mission with AI"
            >
              <RefreshCw className={`w-3 h-3 ${isRegeneratingMission ? 'animate-spin' : ''}`} />
              Generate Another Mission
            </button>
          </div>

          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 mb-1 flex items-center gap-1">
              <Hammer className="w-3 h-3" />
              BUILD THIS:
            </div>
            <p className="text-xs text-white font-medium leading-relaxed bg-slate-950/60 p-2.5 rounded-lg border border-white/5">
              "{currentMissionText}"
            </p>
          </div>

          {activeMission?.goal && (
            <div className="text-[11px] text-slate-300 bg-white/5 p-2 rounded-lg">
              <strong className="text-indigo-300">Goal:</strong> {activeMission.goal}
            </div>
          )}

          {/* GITHUB PROOF */}
          <div className="pt-2 border-t border-indigo-500/15">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
              <Github className="w-3 h-3 text-slate-300" />
              GITHUB PROOF:
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {currentGithubProof}
            </p>
          </div>
        </div>

        {/* INTERVIEW QUESTION */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-amber-500/25 space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-amber-300 flex items-center gap-1.5 font-mono">
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              INTERVIEW QUESTION
            </h3>
            <button
              onClick={() => setShowAnswer(!showAnswer)}
              className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
            >
              {showAnswer ? 'Hide Answer' : 'Reveal Answer'}
              {showAnswer ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          <p className="text-xs text-white font-semibold leading-relaxed">
            "{currentInterviewQuestion}"
          </p>

          {showAnswer && (
            <div className="mt-2.5 p-3 rounded-lg bg-slate-950/95 border border-amber-500/30 text-xs text-amber-100/90 leading-relaxed animate-fadeIn">
              <strong className="text-amber-400 block mb-1">Model Answer:</strong>
              {currentInterviewAnswer}
            </div>
          )}
        </div>

        {/* Proof of Skill Checklist */}
        <div>
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-2 font-mono">
            PROOF OF SKILL CHECKLIST
          </h3>
          <div className="space-y-2 bg-slate-900/40 p-3 rounded-xl border border-white/5">
            {[
              { id: 'githubProject', label: 'GitHub Repository code pushed' },
              { id: 'workingDemo', label: 'Live working demo or test suite' },
              { id: 'readmeDocumentation', label: 'Clean README with architecture notes' },
              { id: 'interviewExplanation', label: 'Can articulate trade-offs in an interview' },
            ].map(item => {
              const isChecked = proofChecklist[item.id as keyof typeof proofChecklist];
              return (
                <div
                  key={item.id}
                  onClick={() => toggleCheck(item.id as keyof typeof proofChecklist)}
                  className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer select-none hover:text-white"
                >
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-600 flex-shrink-0" />
                  )}
                  <span className={isChecked ? 'line-through text-slate-500' : ''}>
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* REQUIRED ACTION BUTTONS */}
      {/* ✓ Mark Complete | ↻ I Already Know This | ✦ Ask AI for Help */}
      <div className="p-4 border-t border-white/10 bg-slate-950 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onMarkComplete(node.id)}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
          >
            <Check className="w-4 h-4 text-slate-950" />
            <span>✓ Mark Complete</span>
          </button>

          <button
            onClick={() => onTriggerReplanning(node)}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl font-bold text-xs text-white bg-slate-900 hover:bg-slate-800 border border-amber-500/40 hover:border-amber-400 transition-all cursor-pointer shadow-lg"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>↻ I Already Know This</span>
          </button>
        </div>

        <button
          onClick={() => {
            onClose();
            onAskCoach(`How should I master "${node.title}" for my target role of ${career}? Any specific recommendations?`);
          }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-cyan-300 hover:text-cyan-200 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 transition-all cursor-pointer shadow-md"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>✦ Ask AI for Help</span>
        </button>
      </div>
    </div>
  );
};
