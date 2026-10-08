import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Lightbulb, 
  Compass, 
  Clock, 
  Loader2,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { RoadmapData } from '../../types/roadmap';
import { requestCoachResponse } from '../../services/aiService';

interface Message {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  timestamp: string;
}

interface CoachViewProps {
  roadmap: RoadmapData;
  initialQuestion?: string | null;
  onClearInitialQuestion?: () => void;
}

const SUGGESTED_PROMPTS = [
  "What's my next best skill?",
  "Am I ready for an internship?",
  "Give me a weekend project.",
  "How should I prepare for interviews?",
  "What am I missing for my dream role?"
];

export const CoachView: React.FC<CoachViewProps> = ({
  roadmap,
  initialQuestion,
  onClearInitialQuestion
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'coach',
      text: `Hello! I'm your CareerQuest AI Coach. I've analyzed your goal to become a **${roadmap.career}** in **${roadmap.industry}**. 

I have full visibility of your roadmap phases, estimated timeline (${roadmap.estimatedWeeks} weeks), and weekly commitment (${roadmap.hoursPerWeek} hrs/week). What's on your mind today?`,
      timestamp: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  // Handle incoming initial question from node details
  useEffect(() => {
    if (initialQuestion) {
      handleSendMessage(initialQuestion);
      if (onClearInitialQuestion) {
        onClearInitialQuestion();
      }
    }
  }, [initialQuestion]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim() || isThinking) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInputText('');
    setIsThinking(true);

    try {
      const reply = await requestCoachResponse(userMsg.text, {
        career: roadmap.career,
        industry: roadmap.industry,
        level: roadmap.level,
        hoursPerWeek: roadmap.hoursPerWeek
      });

      const coachMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'coach',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, coachMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] min-h-[600px] flex flex-col md:flex-row gap-6 py-4">
      {/* Left Context & Prompts Column */}
      <div className="w-full md:w-80 flex flex-col gap-4">
        {/* Grounding Context Card */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 shadow-xl">
          <div className="flex items-center gap-2 mb-2 text-cyan-400">
            <Bot className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider">
              Roadmap Context Active
            </h3>
          </div>
          <div className="space-y-2 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Goal</span>
              <span className="text-white font-medium">{roadmap.career}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Pacing</span>
              <span className="text-slate-300">{roadmap.hoursPerWeek} hrs/week · ~{roadmap.estimatedWeeks} weeks</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Student Level</span>
              <span className="text-slate-300">{roadmap.level}</span>
            </div>
          </div>
        </div>

        {/* Suggested Prompts */}
        <div className="flex-1 p-5 rounded-2xl bg-slate-900/40 border border-white/5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3 text-slate-300 text-xs font-bold uppercase tracking-wider">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              Suggested Questions
            </div>
            <div className="space-y-2">
              {SUGGESTED_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  disabled={isThinking}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-950/70 hover:bg-cyan-500/10 hover:border-cyan-500/30 border border-white/5 text-xs text-slate-300 hover:text-cyan-300 transition-all flex items-center justify-between group disabled:opacity-50"
                >
                  <span className="line-clamp-2">{prompt}</span>
                  <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 flex-shrink-0 ml-1.5 transition-transform group-hover:translate-x-0.5" />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Grounded in your personalized skill tree</span>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col rounded-2xl bg-slate-950/80 border border-white/10 shadow-2xl overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-white/10 bg-slate-900/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 shadow-md">
              <Bot className="w-4 h-4 text-slate-950" />
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-950" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">AI Career Coach</h2>
              <p className="text-[10px] text-slate-400">Ask anything about skills, projects, and interviews</p>
            </div>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'coach' && (
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 flex-shrink-0 mt-1">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none shadow-md'
                    : 'bg-slate-900/80 border border-white/10 text-slate-200 rounded-tl-none shadow-md'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <div className={`text-[10px] mt-1.5 text-right ${msg.sender === 'user' ? 'text-cyan-100/70' : 'text-slate-400'}`}>
                  {msg.timestamp}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-200 flex-shrink-0 mt-1">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}

          {isThinking && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 flex-shrink-0">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 text-xs text-slate-400 flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                <span>Coach is analyzing your career graph...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-white/10 bg-slate-900/30">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask your career coach anything..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isThinking}
              className="flex-1 bg-slate-950 border border-white/10 focus:border-cyan-400 focus:outline-none rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 transition-all"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isThinking}
              className="px-4 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
