import React from 'react';
import { seedData } from '../data/seedData';
import { uiStrings } from '../data/uiStrings';
import { AlertTriangle, Phone, MapPin, HeartHandshake, ShieldAlert, ArrowLeft } from 'lucide-react';

interface SafetyScreenProps {
  country?: string;
  isDemo?: boolean;
  onSafeForNow: () => void;
  onStartAgain: () => void;
}

export const SafetyScreen: React.FC<SafetyScreenProps> = ({
  country = 'Kenya',
  isDemo = false,
  onSafeForNow,
  onStartAgain,
}) => {
  const urgentGuidance = seedData.wellbeingGuidance.find((g) => g.level === 'Urgent');
  const matchingContact =
    seedData.crisisContacts.find((c) => c.country.toLowerCase() === country.toLowerCase()) ||
    seedData.crisisContacts[0];

  return (
    <div className="max-w-xl mx-auto px-4 py-8 animate-fade-in" role="alert" aria-live="assertive">
      {/* Banner if it's the safety demo */}
      {isDemo && (
        <div className="mb-6 p-3 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-xs font-semibold flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Demo of the safety pathway — this is an illustration of the immediate clinical interrupt</span>
        </div>
      )}

      {/* Main Calm Red Card */}
      <div className="bg-white rounded-2xl border-2 border-[#F7D8CE] shadow-xl overflow-hidden">
        {/* Top Header */}
        <div className="bg-[#FDF2EE] px-6 py-5 border-b border-[#F7D8CE] flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-full bg-[#FCE5DC] flex items-center justify-center shrink-0 text-[#C04832]">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <span className="inline-block text-[11px] font-bold tracking-wide uppercase text-[#A8321D] bg-[#FCE5DC] px-2 py-0.5 rounded mb-1">
              Safety Support
            </span>
            <h1 className="text-xl font-bold text-[#2D2320] leading-tight">
              {uiStrings.en.safetyAlertTitle}
            </h1>
          </div>
        </div>

        {/* Body Message */}
        <div className="p-6 space-y-6">
          <div className="text-sm text-[#2D2320] leading-relaxed bg-[#FFF8F5] p-4 rounded-xl border border-[#F7D8CE]">
            {urgentGuidance?.message ||
              'You mentioned thoughts of harming yourself. You deserve support right now, and you do not have to manage this alone.'}
          </div>

          {/* Placeholder Contacts */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-900">
                Support resources in {matchingContact.country}
              </h2>
              <span className="text-[10px] text-gray-500 font-mono">
                {uiStrings.en.placeholderTag}
              </span>
            </div>

            {/* Crisis Line Card */}
            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xs font-semibold text-gray-900">National Maternal / Crisis Support Line</div>
                <div className="text-xs text-gray-500 mt-0.5">{matchingContact.crisisLine}</div>
                <span className="inline-block text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded mt-1">
                  {uiStrings.en.placeholderTag}
                </span>
              </div>
              <button
                disabled
                title="Disabled in prototype — real number to be confirmed by clinical lead"
                className="px-3 py-2 bg-gray-200 text-gray-400 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-not-allowed shrink-0"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{uiStrings.en.callButton}</span>
              </button>
            </div>

            {/* Emergency Service Card */}
            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xs font-semibold text-gray-900">Emergency Medical Helpline</div>
                <div className="text-xs text-gray-500 mt-0.5">{matchingContact.emergency}</div>
                <span className="inline-block text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded mt-1">
                  {uiStrings.en.placeholderTag}
                </span>
              </div>
              <button
                disabled
                title="Disabled in prototype — real number to be confirmed by clinical lead"
                className="px-3 py-2 bg-gray-200 text-gray-400 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-not-allowed shrink-0"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{uiStrings.en.callButton}</span>
              </button>
            </div>

            {/* Partner Referral Point */}
            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200">
              <div className="text-xs font-semibold text-gray-900">Partner Healthcare Referral Point</div>
              <div className="text-xs text-gray-500 mt-0.5">{matchingContact.referralPoint}</div>
              <span className="inline-block text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded mt-1">
                {uiStrings.en.placeholderTag}
              </span>
            </div>
          </div>

          {/* Action to find health facilities */}
          <div className="pt-2">
            <a
              href="https://www.google.com/maps/search/health+facility+near+me"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[48px] py-3 px-4 bg-[#B8533E] hover:bg-[#A34532] text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <MapPin className="w-4 h-4" />
              <span>{uiStrings.en.nearestFacilityButton}</span>
            </a>
            <p className="text-[11px] text-gray-500 text-center mt-2">
              Opens a map search for licensed clinics and hospitals in your area.
            </p>
          </div>

          {/* Pause Notice & Gentle Options */}
          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={onSafeForNow}
              className="w-full sm:w-auto min-h-[44px] px-4 py-2 text-xs font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer text-center"
            >
              {uiStrings.en.safeRightNowButton}
            </button>
            <button
              onClick={onStartAgain}
              className="w-full sm:w-auto min-h-[44px] px-4 py-2 text-xs font-medium text-gray-500 hover:text-gray-700 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Start again</span>
            </button>
          </div>
        </div>

        {/* Footer Notice */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 text-[11px] text-gray-500 text-center">
          Career planning is safely paused for this session. Your wellbeing and safety always come first.
        </div>
      </div>
    </div>
  );
};
