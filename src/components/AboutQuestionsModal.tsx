import React from 'react';
import { seedData } from '../data/seedData';
import { X, ShieldCheck, BookOpen, AlertCircle } from 'lucide-react';

interface AboutQuestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutQuestionsModal: React.FC<AboutQuestionsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-questions-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
    >
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#EFEAE2] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#F4DDD2] flex items-center justify-between bg-[#FFF6F2]">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#B8533E]" />
            <h2 id="about-questions-title" className="text-base font-bold text-[#2D2320]">
              About these questions & instruments
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-700 rounded-lg cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-[#524641] leading-relaxed">
          {/* Clinical note */}
          <div className="p-3 bg-[#EEF6F1] rounded-xl border border-[#D0E4D8] flex gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#2C6947] shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-[#183E29] text-xs">Validated Instruments Policy</div>
              <p className="text-[#204E35] mt-0.5 text-[11px]">
                Screening items and options in this prototype are reproduced verbatim from internationally validated clinical scales in English. No AI model ever scores, interprets, or gives advice on wellbeing answers.
              </p>
            </div>
          </div>

          {/* EPDS */}
          <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EFEAE2]">
            <div className="font-bold text-[#2D2320] text-xs mb-1">
              Edinburgh Postnatal Depression Scale (EPDS)
            </div>
            <p className="text-[#655A55] text-[11px] italic">
              {seedData.instruments.epds.attribution}
            </p>
          </div>

          {/* PHQ-9 & GAD-7 */}
          <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EFEAE2]">
            <div className="font-bold text-[#2D2320] text-xs mb-1">
              PHQ-9 (Patient Health Questionnaire) & GAD-7 (Generalised Anxiety Disorder-7)
            </div>
            <p className="text-[#655A55] text-[11px] italic">
              {seedData.instruments.phq9.attribution}
            </p>
          </div>

          {/* Life and Support */}
          <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EFEAE2]">
            <div className="font-bold text-[#2D2320] text-xs mb-1">Life and Support Assessment</div>
            <p className="text-[#655A55] text-[11px]">
              {seedData.lifeAndSupport.note}
            </p>
          </div>

          {/* Translations notice */}
          <div className="p-3 bg-[#FFF6F2] rounded-xl border border-[#F4DDD2] flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-[#B8533E] shrink-0 mt-0.5" />
            <div className="text-[11px] text-[#8C3E2D]">
              <span className="font-semibold">Language note:</span> All clinical instruments are displayed in validated English phrasing. Validated translations will be added by our clinical team.
            </div>
          </div>

          {/* Prototype statement */}
          <div className="text-center pt-2 text-[11px] text-[#7A6E69] font-medium">
            Prototype — not for clinical use · Community-Centred Maternal Wellbeing & Career Initiative
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#EFEAE2] bg-[#FAF7F2] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#B8533E] hover:bg-[#A34532] text-white font-medium rounded-lg text-xs cursor-pointer shadow-xs transition-colors"
          >
            I understand
          </button>
        </div>
      </div>
    </div>
  );
};
