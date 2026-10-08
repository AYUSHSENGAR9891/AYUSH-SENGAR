import React, { useState } from 'react';
import { Clock, TrendingDown, TrendingUp, Sparkles, Sliders } from 'lucide-react';

interface TimeAdaptationBarProps {
  currentHours: number;
  totalEstimatedHours: number;
  onChangeHours: (newHours: number) => void;
}

export const TimeAdaptationBar: React.FC<TimeAdaptationBarProps> = ({
  currentHours,
  totalEstimatedHours,
  onChangeHours
}) => {
  const [sliderValue, setSliderValue] = useState(currentHours);

  const baselineWeeks = Math.ceil(totalEstimatedHours / currentHours);
  const projectedWeeks = Math.ceil(totalEstimatedHours / sliderValue);
  const diffWeeks = baselineWeeks - projectedWeeks;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setSliderValue(val);
    onChangeHours(val);
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-xl mb-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Info */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">Dynamic Time Adaptation</h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Live Recalculation
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Adjust weekly commitment to see how your career timeline recalculates in real-time.
            </p>
          </div>
        </div>

        {/* Center / Slider */}
        <div className="flex-1 max-w-xs px-2">
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span className="text-slate-400">Commitment:</span>
            <span className="text-cyan-300 font-mono">{sliderValue} hours/week</span>
          </div>
          <input
            type="range"
            min={5}
            max={40}
            step={5}
            value={sliderValue}
            onChange={handleSliderChange}
            className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>5 hrs (Casual)</span>
            <span>20 hrs (Intensive)</span>
            <span>40 hrs (Full-time)</span>
          </div>
        </div>

        {/* Right Output Card */}
        <div className="flex items-center gap-3 bg-slate-950/80 p-3 rounded-xl border border-white/5">
          <div className="text-right">
            <div className="text-[10px] text-slate-400 font-medium">Estimated Duration</div>
            <div className="text-sm font-bold font-mono text-white flex items-center gap-1.5 justify-end">
              <span>{projectedWeeks} weeks</span>
              {diffWeeks > 0 && (
                <span className="text-[11px] text-emerald-400 font-medium flex items-center">
                  <TrendingDown className="w-3 h-3 inline mr-0.5" />
                  -{diffWeeks}w
                </span>
              )}
              {diffWeeks < 0 && (
                <span className="text-[11px] text-amber-400 font-medium flex items-center">
                  <TrendingUp className="w-3 h-3 inline mr-0.5" />
                  +{Math.abs(diffWeeks)}w
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Motivational Feedback Message */}
      {diffWeeks > 0 && (
        <div className="mt-3 pt-3 border-t border-white/5 text-xs text-emerald-300/90 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
          <span>
            <strong>Velocity accelerated!</strong> Your increased study time shortens your career roadmap by <strong>{diffWeeks} weeks</strong>.
          </span>
        </div>
      )}
    </div>
  );
};
