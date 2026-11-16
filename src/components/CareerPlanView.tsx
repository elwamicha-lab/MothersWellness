import React from 'react';
import { seedData, Pace } from '../data/seedData';
import { CareerMatchResult, WellbeingScoreResult } from '../utils/scoring';
import { uiStrings } from '../data/uiStrings';
import {
  Printer,
  RotateCcw,
  Sparkles,
  Calendar,
  CheckCircle2,
  Briefcase,
  AlertCircle,
  Clock,
  Layers,
} from 'lucide-react';

interface CareerPlanViewProps {
  firstName?: string;
  wellbeingResult: WellbeingScoreResult | null;
  topRoleMatch: CareerMatchResult;
  aiNarrative?: string;
  isAiLoading?: boolean;
  onStartAgain: () => void;
  isPaceDefault?: boolean;
}

export const CareerPlanView: React.FC<CareerPlanViewProps> = ({
  firstName,
  wellbeingResult,
  topRoleMatch,
  aiNarrative,
  isAiLoading,
  onStartAgain,
  isPaceDefault = false,
}) => {
  // Determine assigned pace from wellbeingResult or default
  const paceName = wellbeingResult ? wellbeingResult.returnPace : 'Gradual return';
  const paceData: Pace =
    seedData.paces.find((p) => p.name === paceName) || seedData.paces[2]; // Gradual return as default

  const handlePrint = () => {
    window.print();
  };

  const isSafetyPause = paceName === 'Pause: safety first';

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 print-container animate-fade-in">
      {/* Printable Title Bar (clean for print & screen) */}
      <div className="border-b border-[#EFEAE2] pb-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#B8533E]">
              Personalized 24-Week Re-Entry Plan
            </span>
            <h1 className="text-2xl font-bold text-[#2D2320] mt-0.5">
              {firstName ? `${firstName}’s Return to Work Plan` : 'Your Return to Work Plan'}
            </h1>
          </div>

          {/* Action buttons (hidden in print) */}
          <div className="flex items-center gap-2 no-print">
            <button
              onClick={handlePrint}
              className="min-h-[44px] px-3.5 py-2 bg-[#B8533E] hover:bg-[#A34532] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{uiStrings.en.printPlan}</span>
            </button>
            <button
              onClick={onStartAgain}
              className="min-h-[44px] px-3 py-2 text-[#655A55] hover:text-[#2D2320] hover:bg-[#F3ECE4] rounded-xl text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{uiStrings.en.startAgain}</span>
            </button>
          </div>
        </div>

        {/* Pace Badge & Wellbeing Context */}
        <div className="mt-3 flex items-center flex-wrap gap-2 text-xs">
          <span
            className={`font-semibold px-3 py-1 rounded-full border ${
              paceName === 'Pause: safety first'
                ? 'bg-[#FDF0EE] text-[#B91C1C] border-[#F7D1CB]'
                : paceName === 'Care first'
                ? 'bg-[#FEF6EC] text-[#B45309] border-[#F7E2C7]'
                : paceName === 'Gradual return'
                ? 'bg-[#FFF6F2] text-[#B8533E] border-[#F4DDD2]'
                : 'bg-[#EEF6F1] text-[#2C6947] border-[#D0E4D8]'
            }`}
          >
            Pace: {paceName}
          </span>
          {isPaceDefault && (
            <span className="text-[#7A6E69] italic bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#EFEAE2]">
              {uiStrings.en.defaultPaceNotice}
            </span>
          )}
          {wellbeingResult && (
            <span className="text-[#655A55]">
              Wellbeing state: <strong>{wellbeingResult.wellbeingLevel}</strong> · Support: <strong>{wellbeingResult.supportLevel}</strong>
            </span>
          )}
        </div>
        <p className="text-xs text-[#655A55] mt-2 leading-relaxed">
          {paceData.description}
        </p>
      </div>

      {/* Gemini AI Warm Intro Paragraph (if available, otherwise clean fallback) */}
      <div className="bg-gradient-to-br from-[#FFF6F2] to-[#FAF3EE] p-4 sm:p-5 rounded-2xl border border-[#F4DDD2] shadow-2xs relative overflow-hidden">
        <div className="flex items-center gap-2 mb-1.5 text-xs font-bold text-[#8C3E2D]">
          <Sparkles className="w-4 h-4 text-[#B8533E]" />
          <span>Warm Welcome to Your Roadmap</span>
        </div>
        {isAiLoading ? (
          <div className="flex items-center gap-2 text-xs text-[#7A6E69] py-2">
            <span className="w-3 h-3 rounded-full border-2 border-[#B8533E] border-t-transparent animate-spin" />
            <span>Pacing and drafting your intro paragraph with the AI guide...</span>
          </div>
        ) : (
          <p className="text-sm text-[#2D2320] leading-relaxed font-sans">
            {aiNarrative ||
              `Welcome to your personalized roadmap, ${firstName || 'friend'}. Returning to work after life changes or welcoming a child is a journey of courage, patience, and honoring your own rhythm. This plan is paced specifically to keep your wellbeing front and center, focusing first on small, encouraging wins before ramping up. Take each week one step at a time.`}
          </p>
        )}
      </div>

      {/* Matched Career Spotlight */}
      {!isSafetyPause && (
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EFEAE2] shadow-2xs space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#FFF0EB] flex items-center justify-center text-[#B8533E]">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#B8533E]">
                  Top Recommended Path
                </span>
                <h2 className="text-lg font-bold text-[#2D2320]">
                  {topRoleMatch.role.role}
                </h2>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#7A6E69] block">Overall Match</span>
              <span className="text-xl font-extrabold text-[#B8533E]">
                {topRoleMatch.overallScore}%
              </span>
            </div>
          </div>

          {/* Subscores */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#EFEAE2] text-xs">
            <div className="bg-[#FAF7F2] p-2 rounded-lg text-center border border-[#F2ECE6]">
              <span className="text-[#7A6E69] block text-[10px]">Skills</span>
              <span className="font-bold text-[#2D2320]">{topRoleMatch.skillsScore}%</span>
            </div>
            <div className="bg-[#FAF7F2] p-2 rounded-lg text-center border border-[#F2ECE6]">
              <span className="text-[#7A6E69] block text-[10px]">Interests</span>
              <span className="font-bold text-[#2D2320]">{topRoleMatch.interestsScore}%</span>
            </div>
            <div className="bg-[#FAF7F2] p-2 rounded-lg text-center border border-[#F2ECE6]">
              <span className="text-[#7A6E69] block text-[10px]">Work Fit</span>
              <span className="font-bold text-[#2D2320]">{topRoleMatch.fitScore}%</span>
            </div>
          </div>

          {/* Skill gaps chips */}
          {topRoleMatch.skillGaps.length > 0 && (
            <div className="pt-2">
              <span className="text-xs font-semibold text-[#524641] block mb-1.5">
                {uiStrings.en.skillsGapsTitle}:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {topRoleMatch.skillGaps.map((gap) => (
                  <span
                    key={gap}
                    className="text-xs font-medium px-2.5 py-1 bg-[#FEF6EC] text-[#8A4F1E] border border-[#F7E2C7] rounded-lg"
                  >
                    {gap}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* The Phase Cards (Weeks 1–4, 5–12, 13–24) */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-[#2D2320] flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#B8533E]" />
          <span>Action Phases & Timeline</span>
        </h3>

        {paceData.phases.map((phase, idx) => {
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EFEAE2] shadow-2xs space-y-2.5 transition-all hover:border-[#F4DDD2]"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#B8533E] bg-[#FFF6F2] px-2.5 py-1 rounded-md border border-[#F4DDD2]">
                  {phase.weeks}
                </span>
                <span className="text-xs text-[#7A6E69] font-medium">Phase {idx + 1}</span>
              </div>

              {/* Base step description from pace */}
              <p className="text-sm text-[#2D2320] leading-relaxed font-normal">
                {phase.steps}
              </p>

              {/* Specific additions */}
              {!isSafetyPause && idx === 0 && (
                <div className="p-3 bg-[#FFF6F2] rounded-xl border border-[#F4DDD2] text-xs text-[#2D2320] flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#B8533E] shrink-0 mt-0.5" />
                  <div>
                    <strong>Also: </strong>
                    <span>{topRoleMatch.role.firstStep}</span>
                  </div>
                </div>
              )}

              {!isSafetyPause && idx === 1 && (
                <div className="p-3 bg-[#EEF6F1] rounded-xl border border-[#D0E4D8] text-xs text-[#1D442E] flex items-start gap-2">
                  <Briefcase className="w-4 h-4 text-[#2C6947] shrink-0 mt-0.5" />
                  <div>
                    <strong>Suggested course: </strong>
                    <span>{topRoleMatch.role.skillBuilding}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Closing Wellbeing Re-check Reminder */}
      <div className="p-4 bg-[#EEF6F1] rounded-2xl border border-[#D0E4D8] flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-[#2C6947] shrink-0 mt-0.5" />
        <div className="text-xs text-[#1D442E] leading-relaxed">
          <span className="font-bold block mb-0.5">Gentle Pacing Principle</span>
          <span>{uiStrings.en.closingPaceReminder}</span>
        </div>
      </div>

      {/* Printable Footer */}
      <div className="pt-4 border-t border-gray-200 text-center text-xs text-gray-500">
        <p className="font-medium">{uiStrings.en.prototypeLabel}</p>
        <p className="text-[11px] text-gray-400 mt-1">
          {uiStrings.en.appName} · Community-centred maternal support prototype
        </p>
      </div>
    </div>
  );
};
