import React from 'react';
import { WellbeingScoreResult, CareerMatchResult } from '../utils/scoring';
import { ShieldCheck, Code, CheckCircle, Calculator, X } from 'lucide-react';

interface ReviewerPanelProps {
  wellbeingResult: WellbeingScoreResult | null;
  topCareerMatches?: CareerMatchResult[];
  onClose: () => void;
}

export const ReviewerPanel: React.FC<ReviewerPanelProps> = ({
  wellbeingResult,
  topCareerMatches,
  onClose,
}) => {
  return (
    <aside
      aria-label="Clinician and Reviewer Audit Panel"
      className="reviewer-panel fixed bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto bg-gray-900 text-gray-100 z-50 border-t-2 border-[#B8533E] shadow-2xl p-4 md:p-6 text-xs font-mono"
    >
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-sm font-bold text-white tracking-wide font-sans">
              Reviewer & Clinician View (Logic Audit)
            </h3>
            <span className="text-[11px] text-[#F0B2A4] bg-[#421D15] px-2 py-0.5 rounded border border-[#8C3E2D]">
              Deterministic scoring v0.1
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-gray-400 hover:text-white hover:bg-gray-800 cursor-pointer"
            aria-label="Close reviewer panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Zero AI guarantee for wellbeing */}
        <div className="p-2.5 rounded bg-emerald-950/50 border border-emerald-700/60 text-emerald-300 flex items-center gap-2 text-[11px]">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Deterministic Isolation Guarantee:</strong> All wellbeing screening scores, cutoffs, support levels, and pace assignments are computed client-side via rule-based functions. No AI model ever scores or reads health answers.
          </span>
        </div>

        {/* Wellbeing screening data */}
        {wellbeingResult ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Screening scores */}
            <div className="p-3 bg-gray-800/80 rounded-lg border border-gray-700">
              <div className="text-[#E8A796] font-bold mb-2 flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5" />
                <span>Screening Scores & Cutoff Bands</span>
              </div>
              {wellbeingResult.instrumentType === 'epds' ? (
                <div className="space-y-1 text-gray-300">
                  <div className="flex justify-between">
                    <span>Instrument:</span>
                    <strong className="text-white">EPDS (Postpartum &lt; 12m)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Raw Total Score:</span>
                    <strong className="text-yellow-400">{wellbeingResult.epdsScore} / 30</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Calculated Band:</span>
                    <strong className="text-white">{wellbeingResult.epdsBand} (Cutoffs: 0-9 Low, 10-12 Possible, ≥13 Probable)</strong>
                  </div>
                </div>
              ) : (
                <div className="space-y-1 text-gray-300">
                  <div className="flex justify-between">
                    <span>Instrument:</span>
                    <strong className="text-white">PHQ-9 & GAD-7</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>PHQ-9 Score:</span>
                    <strong className="text-yellow-400">{wellbeingResult.phq9Score} / 27 ({wellbeingResult.phq9Band})</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>GAD-7 Score:</span>
                    <strong className="text-yellow-400">{wellbeingResult.gad7Score} / 21 ({wellbeingResult.gad7Band})</strong>
                  </div>
                </div>
              )}

              <div className="mt-2 pt-2 border-t border-gray-700 flex justify-between text-gray-300">
                <span>Support Level:</span>
                <strong className="text-white">
                  {wellbeingResult.supportLevel} (Avg: {wellbeingResult.supportAverage} / 5, L7/L8 reversed)
                </strong>
              </div>
            </div>

            {/* Decision Rule Fired */}
            <div className="p-3 bg-gray-800/80 rounded-lg border border-gray-700">
              <div className="text-[#E8A796] font-bold mb-2 flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5" />
                <span>Deterministic Rules Fired</span>
              </div>
              <div className="space-y-1 text-gray-300">
                <div>
                  <span className="text-gray-400">Rule Trigger: </span>
                  <span className="text-white font-semibold">{wellbeingResult.triggerReason}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span>Assigned Wellbeing Level:</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                      wellbeingResult.wellbeingLevel === 'Urgent'
                        ? 'bg-red-950 text-red-300 border border-red-700'
                        : wellbeingResult.wellbeingLevel === 'High'
                        ? 'bg-amber-950 text-amber-300 border border-amber-700'
                        : wellbeingResult.wellbeingLevel === 'Moderate'
                        ? 'bg-[#422A15] text-[#FCD399] border border-[#B4702E]'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                    }`}
                  >
                    {wellbeingResult.wellbeingLevel}
                  </span>
                </div>
                <div className="flex justify-between pt-1">
                  <span>Assigned Return Pace:</span>
                  <span className="font-bold text-white bg-gray-900 px-2 py-0.5 rounded border border-gray-700">
                    {wellbeingResult.returnPace}
                  </span>
                </div>
                <div className="text-[10px] text-gray-400 mt-2">
                  Pace Rule: Urgent → Pause | High → Care first | Moderate or Limited Support → Gradual return | Low → Ready to return
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-gray-800 text-gray-400 italic rounded">
            Wellbeing screening has not yet been submitted in this session (or was skipped).
          </div>
        )}

        {/* Career Matching Logic Audit */}
        {topCareerMatches && topCareerMatches.length > 0 && (
          <div className="p-3 bg-gray-800/80 rounded-lg border border-gray-700">
            <div className="text-[#E8A796] font-bold mb-2">
              Career Matching Math Breakdown (Top 3 Roles)
            </div>
            <div className="space-y-2">
              {topCareerMatches.slice(0, 3).map((item, idx) => (
                <div key={item.role.role} className="p-2 bg-gray-900 rounded border border-gray-700/70">
                  <div className="flex items-center justify-between font-bold text-white">
                    <span>
                      #{idx + 1} {item.role.role}
                    </span>
                    <span className="text-emerald-400">Overall: {item.overallScore} / 100</span>
                  </div>
                  <div className="text-gray-400 text-[11px] mt-1 grid grid-cols-3 gap-2">
                    <div>
                      Skills: <span className="text-white font-medium">{item.skillsScore}</span>
                      <span className="text-[10px] text-gray-500"> (×0.45)</span>
                    </div>
                    <div>
                      Interests: <span className="text-white font-medium">{item.interestsScore}</span>
                      <span className="text-[10px] text-gray-500"> (×0.30)</span>
                    </div>
                    <div>
                      Fit: <span className="text-white font-medium">{item.fitScore}</span>
                      <span className="text-[10px] text-gray-500"> (×0.25)</span>
                    </div>
                  </div>
                  {item.skillGaps.length > 0 && (
                    <div className="mt-1 text-[10px] text-amber-300">
                      Gaps (weight ≥ 2 & rating ≤ 2): {item.skillGaps.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-2 text-[10px] text-gray-500">
              Formula: Overall = round(0.45 × Skills + 0.30 × Interests + 0.25 × Fit). Ties broken by library index order.
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
