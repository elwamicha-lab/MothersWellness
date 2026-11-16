import React, { useState } from 'react';
import { GuideAvatar } from './GuideAvatar';
import { uiStrings } from '../data/uiStrings';
import {
  Sparkles,
  HelpCircle,
  Settings2,
  Trash2,
  Pause,
  Play,
  RotateCcw,
  Check,
  Eye,
  Languages,
} from 'lucide-react';

interface HeaderProps {
  isDemoActive: boolean;
  demoName?: string;
  reviewerMode: boolean;
  onToggleReviewer: () => void;
  saveProgress: boolean;
  onToggleSaveProgress: (val: boolean) => void;
  onClearData: () => void;
  onOpenAboutQuestions: () => void;
  isPaused: boolean;
  onTogglePause: () => void;
  onResetToWelcome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isDemoActive,
  demoName,
  reviewerMode,
  onToggleReviewer,
  saveProgress,
  onToggleSaveProgress,
  onClearData,
  onOpenAboutQuestions,
  isPaused,
  onTogglePause,
  onResetToWelcome,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-sm border-b border-[#EFEAE2] shadow-2xs">
      {/* Demo Persona Active Banner */}
      {isDemoActive && (
        <div className="demo-banner bg-[#FEF6EC] border-b border-[#F7E2C7] px-4 py-1.5 text-xs text-[#8A4F1E] font-medium flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#D97706]" />
            <span>{uiStrings.en.demoBanner}</span>
            {demoName && <span className="text-[#6D3D14] font-semibold">({demoName})</span>}
          </div>
          <button
            onClick={onResetToWelcome}
            className="text-[#6D3D14] hover:text-[#522D0E] underline font-semibold cursor-pointer text-xs ml-3"
          >
            Exit demo
          </button>
        </div>
      )}

      {/* Main Bar */}
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Left: Wordmark & Guide Identity */}
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={onResetToWelcome}
            className="text-left flex items-center gap-2.5 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8533E] rounded-lg p-0.5"
            title="Return to welcome screen"
          >
            <GuideAvatar size="sm" />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-base font-bold text-[#2D2320] tracking-tight leading-tight group-hover:text-[#B8533E] transition-colors">
                  {uiStrings.en.appName}
                </span>
                <span className="text-[11px] font-semibold tracking-tight text-[#B8533E] bg-[#FDF1EB] border border-[#F2D7CD] rounded-sm px-1.5 py-0.5">
                  {uiStrings.en.aiGuideBadge}
                </span>
              </div>
              <p className="text-xs text-[#7A6E69] hidden sm:block truncate leading-tight mt-0.5">
                {uiStrings.en.appSubtitle}
              </p>
            </div>
          </button>
        </div>

        {/* Right: Essential Tools */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Pause Button */}
          <button
            onClick={onTogglePause}
            aria-label={isPaused ? 'Resume conversation' : 'Pause conversation'}
            className={`min-h-[40px] px-2.5 py-1 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
              isPaused
                ? 'bg-[#FEF3EB] text-[#9A4C22] border border-[#F7D8C4] font-semibold'
                : 'text-[#655A55] hover:text-[#2D2320] hover:bg-[#F3ECE4]'
            }`}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            <span className="hidden xs:inline">{isPaused ? 'Resume' : 'Pause'}</span>
          </button>

          {/* Reviewer View Toggle */}
          <button
            onClick={onToggleReviewer}
            aria-pressed={reviewerMode}
            className={`min-h-[40px] px-2.5 py-1 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
              reviewerMode
                ? 'bg-[#FDF1EB] text-[#B8533E] border border-[#F2D7CD] font-semibold shadow-2xs'
                : 'text-[#655A55] hover:text-[#2D2320] hover:bg-[#F3ECE4]'
            }`}
            title="Toggle clinician / reviewer scoring view"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reviewer view</span>
            {reviewerMode && <span className="w-1.5 h-1.5 rounded-full bg-[#B8533E]" />}
          </button>

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="min-h-[40px] min-w-[40px] px-2 py-1 text-xs text-[#655A55] hover:text-[#2D2320] hover:bg-[#F3ECE4] rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
              aria-label="Language selection"
              title="Language selection"
            >
              <Languages className="w-4 h-4 text-[#7A6E69]" />
              <span className="text-xs uppercase font-medium">EN</span>
            </button>
            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-1.5 z-50 text-sm">
                <div className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Interface Language
                </div>
                <button
                  onClick={() => setLangMenuOpen(false)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-900 font-medium hover:bg-gray-50 flex items-center justify-between cursor-pointer"
                >
                  <span>English (v0.1)</span>
                  <Check className="w-4 h-4 text-[#B8533E]" />
                </button>
                <div className="px-3 py-2 text-xs text-gray-400 flex items-center justify-between border-t border-[#EFEAE2]">
                  <span>Kiswahili</span>
                  <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">Coming soon</span>
                </div>
                <div className="px-3 py-2 text-xs text-gray-400 flex items-center justify-between">
                  <span>Nigerian Pidgin</span>
                  <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">Coming soon</span>
                </div>
              </div>
            )}
          </div>

          {/* Privacy & Settings Menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Privacy and Session options"
              className="min-h-[40px] min-w-[40px] p-2 text-[#655A55] hover:text-[#2D2320] hover:bg-[#F3ECE4] rounded-lg flex items-center justify-center transition-colors cursor-pointer"
            >
              <Settings2 className="w-4 h-4 text-[#655A55]" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-[#EFEAE2] p-3 z-50 text-sm">
                <div className="flex items-center justify-between pb-2 border-b border-[#EFEAE2] mb-2">
                  <span className="font-semibold text-gray-900 text-xs uppercase tracking-wider">Session & Privacy</span>
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="text-gray-400 hover:text-gray-600 text-xs cursor-pointer"
                  >
                    Close
                  </button>
                </div>

                {/* About Questions Modal trigger */}
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenAboutQuestions();
                  }}
                  className="w-full text-left py-2 px-2 rounded-lg text-gray-700 hover:bg-[#FAF7F2] flex items-center gap-2 cursor-pointer mb-2 text-xs font-medium"
                >
                  <HelpCircle className="w-4 h-4 text-[#B8533E] shrink-0" />
                  <span>About these questions (Attribution)</span>
                </button>

                {/* Save Progress Toggle */}
                <div className="p-2.5 rounded-lg bg-[#FAF7F2] border border-[#EFEAE2] mb-3">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={saveProgress}
                      onChange={(e) => onToggleSaveProgress(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded text-[#B8533E] focus:ring-[#B8533E] border-gray-300 cursor-pointer"
                    />
                    <div className="text-xs">
                      <div className="font-semibold text-gray-900">{uiStrings.en.saveProgressToggle}</div>
                      <div className="text-gray-500 text-[11px] mt-0.5 leading-snug">
                        Off by default. Answers stay locally on this device only.
                      </div>
                    </div>
                  </label>
                </div>

                {/* Reset or Clear Data */}
                <div className="pt-2 border-t border-gray-100 flex flex-col gap-1.5">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onResetToWelcome();
                    }}
                    className="w-full text-left py-1.5 px-2 text-xs text-gray-700 hover:bg-gray-100 rounded flex items-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
                    <span>Return to Welcome Screen</span>
                  </button>

                  {!showDeleteConfirm ? (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="w-full text-left py-1.5 px-2 text-xs text-red-600 hover:bg-red-50 rounded flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      <span>{uiStrings.en.deleteEverything}</span>
                    </button>
                  ) : (
                    <div className="p-2 bg-red-50 rounded border border-red-200 text-xs">
                      <p className="text-red-800 font-medium mb-1.5">Delete all local answers and reset?</p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setShowDeleteConfirm(false);
                            setMenuOpen(false);
                            onClearData();
                          }}
                          className="px-2.5 py-1 bg-red-600 text-white rounded font-medium hover:bg-red-700 cursor-pointer"
                        >
                          Yes, delete
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          className="px-2.5 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
