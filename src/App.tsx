import React, { useState, useEffect, useRef } from 'react';
import { seedData, Option, EpdsItem, SimpleItem, LifeItem } from './data/seedData';
import { uiStrings, uiTransitions, demoPersonas, DemoPersona } from './data/uiStrings';
import {
  WellbeingScoreResult,
  CareerMatchResult,
  evaluateWellbeing,
  matchCareers,
} from './utils/scoring';
import { Header } from './components/Header';
import { GuideAvatar } from './components/GuideAvatar';
import { GuideBubble, UserBubble } from './components/ConversationBubble';
import { SafetyScreen } from './components/SafetyScreen';
import { ReviewerPanel } from './components/ReviewerPanel';
import { AboutQuestionsModal } from './components/AboutQuestionsModal';
import { AllRolesChart } from './components/AllRolesChart';
import { CareerPlanView } from './components/CareerPlanView';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Heart,
  Briefcase,
  Play,
  RotateCcw,
  BookOpen,
  ChevronRight,
  Shield,
  HelpCircle,
  ExternalLink,
  Sliders,
} from 'lucide-react';

type Step =
  | 'welcome'
  | 'profile_name'
  | 'profile_country'
  | 'profile_city'
  | 'profile_age'
  | 'profile_birth'
  | 'profile_months'
  | 'profile_work_sit'
  | 'profile_career_break'
  | 'skip_check_confirm'
  | 'wellbeing_intro'
  | 'wellbeing_screening'
  | 'life_support_intro'
  | 'life_support'
  | 'wellbeing_summary'
  | 'career_intro'
  | 'career_lived_experience'
  | 'career_skills'
  | 'career_interests'
  | 'career_work_needs'
  | 'career_matches'
  | 'career_plan'
  | 'safety';

export default function App() {
  // Session / Storage state
  const [saveProgress, setSaveProgress] = useState<boolean>(false);
  const [isDemoActive, setIsDemoActive] = useState<boolean>(false);
  const [demoName, setDemoName] = useState<string>('');
  const [reviewerMode, setReviewerMode] = useState<boolean>(false);
  const [aboutModalOpen, setAboutModalOpen] = useState<boolean>(false);
  const [allRolesChartOpen, setAllRolesChartOpen] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [step, setStep] = useState<Step>('welcome');
  const [history, setHistory] = useState<Step[]>([]);

  // User Profile
  const [firstName, setFirstName] = useState<string>('');
  const [country, setCountry] = useState<string>('Kenya');
  const [city, setCity] = useState<string>('');
  const [ageGroup, setAgeGroup] = useState<string>('25–34');
  const [hasGivenBirth, setHasGivenBirth] = useState<'Yes' | 'No'>('Yes');
  const [monthsSinceBirth, setMonthsSinceBirth] = useState<string>('4–6 months');
  const [workSituation, setWorkSituation] = useState<string>('On maternity leave');
  const [careerBreak, setCareerBreak] = useState<string>('6–12 months');

  // Wellbeing answers
  // keys: epds_1..10, phq9_1..9, gad7_1..7
  const [wellbeingAnswers, setWellbeingAnswers] = useState<Record<string, number>>({});
  // keys: L1..L8
  const [lifeAnswers, setLifeAnswers] = useState<Record<string, number>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [isWellbeingSkipped, setIsWellbeingSkipped] = useState<boolean>(false);

  // Career answers
  const [livedExperienceText, setLivedExperienceText] = useState<string>('');
  const [isAiSuggestingSkills, setIsAiSuggestingSkills] = useState<boolean>(false);
  const [aiSkillFeedback, setAiSkillFeedback] = useState<string | null>(null);
  const [skillsRatings, setSkillsRatings] = useState<Record<string, number>>({});
  const [interestsRatings, setInterestsRatings] = useState<Record<string, number>>({});
  const [workNeeds, setWorkNeeds] = useState<{
    homeWorking: string;
    hours: string;
    flexibleHours: string;
  }>({
    homeWorking: 'Yes',
    hours: '15–30 hours a week',
    flexibleHours: 'Yes',
  });

  // AI Narrative for Career Plan
  const [aiNarrative, setAiNarrative] = useState<string>('');
  const [isAiNarrativeLoading, setIsAiNarrativeLoading] = useState<boolean>(false);

  // Scroll anchor
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load from localStorage if enabled
  useEffect(() => {
    try {
      const savedPref = localStorage.getItem('wellness_save_pref');
      if (savedPref === 'true') {
        setSaveProgress(true);
        const savedData = localStorage.getItem('wellness_session_data');
        if (savedData) {
          const parsed = JSON.parse(savedData);
          if (parsed.step) setStep(parsed.step);
          if (parsed.firstName) setFirstName(parsed.firstName);
          if (parsed.country) setCountry(parsed.country);
          if (parsed.city) setCity(parsed.city);
          if (parsed.ageGroup) setAgeGroup(parsed.ageGroup);
          if (parsed.hasGivenBirth) setHasGivenBirth(parsed.hasGivenBirth);
          if (parsed.monthsSinceBirth) setMonthsSinceBirth(parsed.monthsSinceBirth);
          if (parsed.workSituation) setWorkSituation(parsed.workSituation);
          if (parsed.careerBreak) setCareerBreak(parsed.careerBreak);
          if (parsed.wellbeingAnswers) setWellbeingAnswers(parsed.wellbeingAnswers);
          if (parsed.lifeAnswers) setLifeAnswers(parsed.lifeAnswers);
          if (parsed.skillsRatings) setSkillsRatings(parsed.skillsRatings);
          if (parsed.interestsRatings) setInterestsRatings(parsed.interestsRatings);
          if (parsed.workNeeds) setWorkNeeds(parsed.workNeeds);
          if (parsed.isWellbeingSkipped !== undefined)
            setIsWellbeingSkipped(parsed.isWellbeingSkipped);
        }
      }
    } catch (e) {
      console.warn('Storage read failed:', e);
    }
  }, []);

  // Save to localStorage when updated if toggle is on
  useEffect(() => {
    if (saveProgress) {
      try {
        localStorage.setItem('wellness_save_pref', 'true');
        const stateToSave = {
          step,
          firstName,
          country,
          city,
          ageGroup,
          hasGivenBirth,
          monthsSinceBirth,
          workSituation,
          careerBreak,
          wellbeingAnswers,
          lifeAnswers,
          skillsRatings,
          interestsRatings,
          workNeeds,
          isWellbeingSkipped,
        };
        localStorage.setItem('wellness_session_data', JSON.stringify(stateToSave));
      } catch (e) {
        console.warn('Storage write failed:', e);
      }
    }
  }, [
    saveProgress,
    step,
    firstName,
    country,
    city,
    ageGroup,
    hasGivenBirth,
    monthsSinceBirth,
    workSituation,
    careerBreak,
    wellbeingAnswers,
    lifeAnswers,
    skillsRatings,
    interestsRatings,
    workNeeds,
    isWellbeingSkipped,
  ]);

  const handleToggleSaveProgress = (val: boolean) => {
    setSaveProgress(val);
    if (!val) {
      try {
        localStorage.removeItem('wellness_save_pref');
        localStorage.removeItem('wellness_session_data');
      } catch (e) {
        console.warn('Storage clear failed:', e);
      }
    }
  };

  const handleClearData = () => {
    try {
      localStorage.removeItem('wellness_save_pref');
      localStorage.removeItem('wellness_session_data');
    } catch (e) {
      console.warn('Storage clear failed:', e);
    }
    setSaveProgress(false);
    resetToWelcome();
  };

  const resetToWelcome = () => {
    setIsDemoActive(false);
    setDemoName('');
    setStep('welcome');
    setHistory([]);
    setFirstName('');
    setCountry('Kenya');
    setCity('');
    setAgeGroup('25–34');
    setHasGivenBirth('Yes');
    setMonthsSinceBirth('4–6 months');
    setWorkSituation('On maternity leave');
    setCareerBreak('6–12 months');
    setWellbeingAnswers({});
    setLifeAnswers({});
    setCurrentQuestionIndex(0);
    setIsWellbeingSkipped(false);
    setLivedExperienceText('');
    setSkillsRatings({});
    setInterestsRatings({});
    setAiNarrative('');
    setIsPaused(false);
  };

  const navigateTo = (nextStep: Step) => {
    setHistory((prev) => [...prev, step]);
    setStep(nextStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory((old) => old.slice(0, old.length - 1));
      setStep(prev);
    } else {
      setStep('welcome');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Evaluate wellbeing results whenever answers change
  const wellbeingResult: WellbeingScoreResult | null =
    !isWellbeingSkipped &&
    (Object.keys(wellbeingAnswers).length > 0 || Object.keys(lifeAnswers).length > 0)
      ? evaluateWellbeing(hasGivenBirth, wellbeingAnswers, lifeAnswers)
      : null;

  // Career matches
  const careerMatches: CareerMatchResult[] = matchCareers(
    skillsRatings,
    interestsRatings,
    workNeeds
  );
  const topMatch = careerMatches[0];

  // Load Demo Person
  const loadDemo = (persona: DemoPersona) => {
    setIsDemoActive(true);
    setDemoName(persona.name);
    setFirstName(persona.profile.firstName);
    setCountry(persona.profile.country);
    setCity(persona.profile.city);
    setAgeGroup(persona.profile.ageGroup);
    setHasGivenBirth(persona.profile.hasGivenBirth);
    if (persona.profile.monthsSinceBirth) setMonthsSinceBirth(persona.profile.monthsSinceBirth);
    setWorkSituation(persona.profile.workSituation);
    setCareerBreak(persona.profile.careerBreak);
    setWellbeingAnswers(persona.wellbeingAnswers);
    setLifeAnswers(persona.lifeAnswers);
    setSkillsRatings(persona.careerAnswers.skills);
    setInterestsRatings(persona.careerAnswers.interests);
    setWorkNeeds(persona.careerAnswers.workNeeds);
    setIsWellbeingSkipped(false);

    if (persona.id === 'safety') {
      setStep('safety');
    } else {
      setStep('career_plan');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Immediate Safety Check on EPDS item 10 or PHQ-9 item 9
  const checkSafetyInterrupt = (key: string, score: number) => {
    if (key === 'epds_10' && score > 0) {
      navigateTo('safety');
      return true;
    }
    if (key === 'phq9_9' && score > 0) {
      navigateTo('safety');
      return true;
    }
    return false;
  };

  // Fetch AI Skill Suggestion (Career lived experience)
  const handleFetchAiSkills = async () => {
    if (!livedExperienceText.trim()) return;
    setIsAiSuggestingSkills(true);
    setAiSkillFeedback(null);
    try {
      const res = await fetch('/api/suggest-skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ experience: livedExperienceText.trim() }),
      });
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }
      const data = await res.json();
      if (Array.isArray(data.suggestions) && data.suggestions.length > 0) {
        const updated: Record<string, number> = { ...skillsRatings };
        data.suggestions.forEach((item: { skill: string; rating: number }) => {
          if (seedData.skills.includes(item.skill)) {
            updated[item.skill] = Math.max(1, Math.min(5, Math.round(item.rating)));
          }
        });
        setSkillsRatings(updated);
        setAiSkillFeedback(
          'Gemini suggested ratings based on your story. Please review and adjust them below before continuing.'
        );
      } else {
        setAiSkillFeedback('Could not detect specific skills. You can set your ratings directly below.');
      }
    } catch (err) {
      console.warn('AI skill suggestion fallback:', err);
      // Heuristic fallback if AI server is offline or fails
      const updated: Record<string, number> = { ...skillsRatings };
      seedData.skills.forEach((s) => {
        if (!updated[s]) updated[s] = 3;
      });
      setSkillsRatings(updated);
      setAiSkillFeedback(
        'AI suggestion was unavailable. We have set initial ratings to 3 for you to adjust.'
      );
    } finally {
      setIsAiSuggestingSkills(false);
    }
  };

  // Fetch AI Plan Narrative (Triggered when entering Career Plan view)
  const fetchAiNarrative = async () => {
    if (aiNarrative) return;
    const paceName = wellbeingResult ? wellbeingResult.returnPace : 'Gradual return';
    const topRole = topMatch?.role?.role || 'Virtual or administrative assistant';
    const gaps = topMatch?.skillGaps || [];
    const steps = [
      topMatch?.role?.firstStep || '',
      topMatch?.role?.skillBuilding || '',
    ].filter(Boolean);

    setIsAiNarrativeLoading(true);
    try {
      const res = await fetch('/api/plan-narrative', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName || undefined,
          paceName,
          topRole,
          skillGaps: gaps,
          planSteps: steps,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.narrative) {
          setAiNarrative(data.narrative);
        }
      }
    } catch (e) {
      console.warn('AI plan narrative fallback:', e);
    } finally {
      setIsAiNarrativeLoading(false);
    }
  };

  // Helper: Questions array for current screening instrument
  const getScreeningQuestions = () => {
    if (hasGivenBirth === 'Yes') {
      return seedData.instruments.epds.items.map((item) => ({
        type: 'epds' as const,
        key: `epds_${item.n}`,
        n: item.n,
        total: 10,
        text: item.text,
        stem: seedData.instruments.epds.stem,
        options: item.options,
        safetyItem: item.safetyItem,
      }));
    } else {
      // PHQ-9 (9 items) + GAD-7 (7 items) = 16 items
      const phq9Items = seedData.instruments.phq9.items.map((item) => ({
        type: 'phq9' as const,
        key: `phq9_${item.n}`,
        n: item.n,
        total: 16,
        text: item.text,
        stem: seedData.instruments.phq9.stem,
        options: seedData.instruments.frequencyOptions,
        safetyItem: item.safetyItem,
      }));
      const gad7Items = seedData.instruments.gad7.items.map((item, idx) => ({
        type: 'gad7' as const,
        key: `gad7_${item.n}`,
        n: item.n + 9,
        total: 16,
        text: item.text,
        stem: seedData.instruments.gad7.stem,
        options: seedData.instruments.frequencyOptions,
        safetyItem: false,
      }));
      return [...phq9Items, ...gad7Items];
    }
  };

  const screeningQuestions = getScreeningQuestions();

  // Scroll to bottom helper for chat immersion
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [step, currentQuestionIndex]);

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between selection:bg-blue-100 selection:text-blue-900">
      {/* Top Header */}
      <Header
        isDemoActive={isDemoActive}
        demoName={demoName}
        reviewerMode={reviewerMode}
        onToggleReviewer={() => setReviewerMode(!reviewerMode)}
        saveProgress={saveProgress}
        onToggleSaveProgress={handleToggleSaveProgress}
        onClearData={handleClearData}
        onOpenAboutQuestions={() => setAboutModalOpen(true)}
        isPaused={isPaused}
        onTogglePause={() => setIsPaused(!isPaused)}
        onResetToWelcome={resetToWelcome}
      />

      {/* Paused State Overlay */}
      {isPaused ? (
        <main className="flex-1 max-w-lg mx-auto w-full px-4 py-16 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#FEF6EC] text-[#8A4F1E] border border-[#F7E2C7] flex items-center justify-center mx-auto shadow-xs">
            <Play className="w-7 h-7 ml-0.5" />
          </div>
          <h2 className="text-xl font-bold text-[#2D2320]">{uiStrings.en.pausedTitle}</h2>
          <p className="text-sm text-[#655A55] max-w-md mx-auto leading-relaxed">
            {uiStrings.en.pausedText}
          </p>
          <div className="pt-4 flex justify-center gap-3">
            <button
              onClick={() => setIsPaused(false)}
              className="min-h-[44px] px-6 py-2.5 bg-[#B8533E] hover:bg-[#A34532] text-white font-semibold rounded-xl text-sm shadow-sm cursor-pointer transition-colors"
            >
              {uiStrings.en.resumeButton}
            </button>
            <button
              onClick={resetToWelcome}
              className="min-h-[44px] px-4 py-2.5 text-[#7A6E69] hover:text-[#2D2320] text-sm font-medium rounded-xl cursor-pointer"
            >
              Start over
            </button>
          </div>
        </main>
      ) : (
        <main className="flex-1 max-w-xl mx-auto w-full px-4 py-6">
          {/* ========================================================= */}
          {/* SCREEN 1: WELCOME */}
          {/* ========================================================= */}
          {step === 'welcome' && (
            <div className="space-y-6 animate-fade-in">
              {/* Guide Introduction */}
              <GuideBubble speaker="AI Guide">
                <p className="font-semibold text-[#2D2320] mb-2 text-base">
                  {uiStrings.en.welcomeGuideGreeting}
                </p>
                <p className="text-xs text-[#655A55] leading-relaxed">
                  Whether you are navigating motherhood, recovery, or a career break, we will move at a gentle pace that protects your peace and honors your lived journey.
                </p>
              </GuideBubble>

              {/* Two modules overview card */}
              <div className="bg-[#FAF7F2] border border-[#EFEAE2] rounded-2xl p-5 space-y-4 shadow-2xs">
                <div className="text-xs font-bold uppercase tracking-wider text-[#8A7D77]">
                  How we can work together
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 bg-white rounded-xl border border-[#DCEBE2] shadow-2xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-[#1F4B32] text-sm mb-1">
                        <Heart className="w-4 h-4 text-[#2C6947]" />
                        <span>1. Wellbeing Check</span>
                      </div>
                      <p className="text-[#655A55] leading-relaxed text-[11px]">
                        A private, validated screening of mood, anxiety, rest, and support around you.
                      </p>
                    </div>
                    <span className="text-[10px] text-[#2C6947] font-semibold mt-2 block">
                      ~5 minutes · Stays on device
                    </span>
                  </div>

                  <div className="p-3.5 bg-white rounded-xl border border-[#F4DDD2] shadow-2xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-[#8C3E2D] text-sm mb-1">
                        <Briefcase className="w-4 h-4 text-[#B8533E]" />
                        <span>2. Career Re-Entry Plan</span>
                      </div>
                      <p className="text-[#655A55] leading-relaxed text-[11px]">
                        Matches based on your skills, lived experience, and a 24-week plan paced to your wellbeing.
                      </p>
                    </div>
                    <span className="text-[10px] text-[#B8533E] font-semibold mt-2 block">
                      ~8 minutes · Flexible roadmap
                    </span>
                  </div>
                </div>

                {/* Privacy Promise Banner */}
                <div className="p-3 bg-[#EEF6F1] border border-[#D0E4D8] rounded-xl flex items-start gap-2.5 text-xs text-[#1D442E]">
                  <Shield className="w-4 h-4 text-[#2C6947] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">{uiStrings.en.privacyPromise}</span>
                    <p className="text-[11px] text-[#204E35] mt-0.5 leading-snug">
                      {uiStrings.en.privacySubtext}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                {/* Primary Button: Start with wellbeing */}
                <button
                  onClick={() => navigateTo('profile_name')}
                  className="w-full min-h-[48px] px-5 py-3.5 bg-[#B8533E] hover:bg-[#A34532] text-white font-semibold rounded-2xl text-sm flex items-center justify-between shadow-sm transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-[#FDE5DC]" />
                    <span>{uiStrings.en.startButton}</span>
                  </div>
                  <span className="text-xs bg-[#9E3E2B] text-[#FFF4F0] px-2 py-0.5 rounded-full font-normal">
                    {uiStrings.en.recommendedBadge}
                  </span>
                </button>

                {/* Career only button */}
                <button
                  onClick={() => {
                    setIsWellbeingSkipped(true);
                    navigateTo('skip_check_confirm');
                  }}
                  className="w-full min-h-[48px] px-5 py-3 bg-white hover:bg-[#FBF8F4] text-[#2D2320] font-medium rounded-2xl text-xs border border-[#EFEAE2] transition-colors cursor-pointer flex items-center justify-between"
                >
                  <span>{uiStrings.en.careerOnlyButton}</span>
                  <ChevronRight className="w-4 h-4 text-[#8A7D77]" />
                </button>

                {/* Load demo person trigger */}
                <div className="pt-3 border-t border-[#EFEAE2]">
                  <div className="text-xs text-[#7A6E69] font-medium mb-2 text-center">
                    Quick demo for reviewers and clinicians:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {demoPersonas.map((persona) => (
                      <button
                        key={persona.id}
                        onClick={() => loadDemo(persona)}
                        className="p-2.5 text-left bg-white hover:bg-[#FFF6F2] border border-[#EFEAE2] hover:border-[#F4DDD2] rounded-xl transition-all cursor-pointer shadow-2xs"
                      >
                        <div className="font-bold text-[#2D2320] text-xs flex items-center justify-between">
                          <span>{persona.name}</span>
                          <ArrowRight className="w-3 h-3 text-[#B8533E]" />
                        </div>
                        <div className="text-[10px] text-[#7A6E69] mt-0.5 line-clamp-1">
                          {persona.tagline}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SKIP CHECK CONFIRMATION DIALOG */}
          {/* ========================================================= */}
          {step === 'skip_check_confirm' && (
            <div className="space-y-5 animate-fade-in">
              <GuideBubble>
                <p className="font-semibold text-[#2D2320] mb-1.5">{uiStrings.en.skipCheckPrompt}</p>
                <p className="text-xs text-[#655A55]">
                  A wellbeing check allows us to tailor your 24-week plan’s pace so you are never overwhelmed. If you skip, we will set a sensible <strong>Gradual return</strong> default.
                </p>
              </GuideBubble>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    setIsWellbeingSkipped(false);
                    navigateTo('profile_name');
                  }}
                  className="w-full min-h-[46px] p-3.5 bg-[#B8533E] hover:bg-[#A34532] text-white font-semibold text-xs rounded-xl text-left flex items-center justify-between cursor-pointer shadow-xs"
                >
                  <span>{uiStrings.en.skipCheckYes}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setIsWellbeingSkipped(true);
                    navigateTo('profile_name');
                  }}
                  className="w-full min-h-[46px] p-3.5 bg-white hover:bg-[#FBF8F4] text-[#2D2320] text-xs rounded-xl text-left border border-[#EFEAE2] cursor-pointer flex items-center justify-between font-medium"
                >
                  <span>{uiStrings.en.skipCheckNo}</span>
                  <ChevronRight className="w-4 h-4 text-[#8A7D77]" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PROFILE STEPS (About You) */}
          {/* ========================================================= */}
          {step.startsWith('profile_') && (
            <div className="space-y-5 animate-fade-in">
              {/* Profile Step 1: First Name */}
              {step === 'profile_name' && (
                <>
                  <GuideBubble>
                    <p className="mb-1 text-[#2D2320]">
                      {uiTransitions.welcomeToProfile}
                    </p>
                    <p className="text-xs text-[#655A55]">
                      What would you like me to call you? (This is optional).
                    </p>
                  </GuideBubble>

                  <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EFEAE2] space-y-3">
                    <input
                      type="text"
                      placeholder="Your first name (optional)"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full min-h-[46px] px-3.5 py-2.5 bg-white border border-[#E0D8D0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B8533E] text-[#2D2320]"
                    />
                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={goBack}
                        className="text-xs text-[#655A55] hover:text-[#2D2320] flex items-center gap-1 cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>{uiStrings.en.backButton}</span>
                      </button>
                      <button
                        onClick={() => navigateTo('profile_country')}
                        className="min-h-[42px] px-5 py-2 bg-[#B8533E] hover:bg-[#A34532] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <span>{uiStrings.en.continueButton}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Profile Step 2: Country */}
              {step === 'profile_country' && (
                <>
                  <GuideBubble>
                    <p className="text-[#2D2320]">Where are you based right now?</p>
                    <p className="text-xs text-[#655A55] mt-1">
                      This helps us connect you to local resources and health referrals if needed.
                    </p>
                  </GuideBubble>

                  <div className="space-y-2 pt-1">
                    {seedData.profileOptions.country.map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          setCountry(c);
                          navigateTo('profile_city');
                        }}
                        className={`w-full min-h-[48px] p-3.5 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                          country === c
                            ? 'bg-[#FFF6F2] border-[#F0B2A4] text-[#8C3E2D] font-semibold'
                            : 'bg-white hover:bg-[#FBF8F4] border-[#EFEAE2] text-[#2D2320]'
                        }`}
                      >
                        <span>{c}</span>
                        <ChevronRight className="w-4 h-4 text-[#8A7D77]" />
                      </button>
                    ))}
                    <div className="pt-2">
                      <button
                        onClick={goBack}
                        className="text-xs text-[#655A55] hover:text-[#2D2320] flex items-center gap-1 cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>{uiStrings.en.backButton}</span>
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Profile Step 3: City */}
              {step === 'profile_city' && (
                <>
                  <GuideBubble>
                    <p>Which city or town do you live in?</p>
                  </GuideBubble>

                  <div className="bg-[#FFFDFB] p-4 rounded-2xl border border-[#EFEAE2] space-y-3 shadow-2xs">
                    <input
                      type="text"
                      placeholder="e.g. Nairobi, Lagos, Mombasa, Abuja..."
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full min-h-[46px] px-3.5 py-2.5 bg-white border border-[#E5DAD3] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B8533E] text-[#2D2320]"
                    />
                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={goBack}
                        className="text-xs text-[#7A6E69] hover:text-[#2D2320] flex items-center gap-1 cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>{uiStrings.en.backButton}</span>
                      </button>
                      <button
                        onClick={() => navigateTo('profile_age')}
                        className="min-h-[42px] px-5 py-2 bg-[#B8533E] hover:bg-[#A34532] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                      >
                        <span>{uiStrings.en.continueButton}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Profile Step 4: Age Group */}
              {step === 'profile_age' && (
                <>
                  <GuideBubble>
                    <p>Which age group best describes you?</p>
                  </GuideBubble>

                  <div className="space-y-2 pt-1">
                    {seedData.profileOptions.ageGroup.map((a) => (
                      <button
                        key={a}
                        onClick={() => {
                          setAgeGroup(a);
                          navigateTo('profile_birth');
                        }}
                        className={`w-full min-h-[46px] p-3.5 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                          ageGroup === a
                            ? 'bg-[#FFF6F2] border-[#F0B2A4] text-[#8C3E2D] font-semibold'
                            : 'bg-white hover:bg-[#FFFBF9] border-[#EFEAE2] text-[#2D2320]'
                        }`}
                      >
                        <span>{a}</span>
                        <ChevronRight className="w-4 h-4 text-[#A89B95]" />
                      </button>
                    ))}
                    <div className="pt-2">
                      <button
                        onClick={goBack}
                        className="text-xs text-[#7A6E69] hover:text-[#2D2320] flex items-center gap-1 cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>{uiStrings.en.backButton}</span>
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Profile Step 5: Postpartum birth question (CRITICAL ROUTER) */}
              {step === 'profile_birth' && (
                <>
                  <GuideBubble>
                    <p className="font-semibold text-[#2D2320] mb-1">
                      Have you given birth in the last 12 months?
                    </p>
                    <p className="text-xs text-[#655A55]">
                      This determines the clinically validated screening instrument we use: EPDS for new mothers, or PHQ-9 & GAD-7 otherwise.
                    </p>
                  </GuideBubble>

                  <div className="space-y-2 pt-1">
                    <button
                      onClick={() => {
                        setHasGivenBirth('Yes');
                        navigateTo('profile_months');
                      }}
                      className="w-full min-h-[48px] p-3.5 rounded-xl border border-[#EFEAE2] bg-white hover:bg-[#EEF6F1] hover:border-[#B8D7C4] text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-[#2C6947]" />
                        <span className="text-[#2D2320]">Yes, I gave birth in the last 12 months</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#A89B95]" />
                    </button>

                    <button
                      onClick={() => {
                        setHasGivenBirth('No');
                        navigateTo('profile_work_sit');
                      }}
                      className="w-full min-h-[48px] p-3.5 rounded-xl border border-[#EFEAE2] bg-white hover:bg-[#FFF6F2] hover:border-[#F0B2A4] text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[#2D2320]">No, I have not</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#A89B95]" />
                    </button>

                    <div className="pt-2">
                      <button
                        onClick={goBack}
                        className="text-xs text-[#7A6E69] hover:text-[#2D2320] flex items-center gap-1 cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>{uiStrings.en.backButton}</span>
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Profile Step 6: If postpartum, how many months */}
              {step === 'profile_months' && (
                <>
                  <GuideBubble>
                    <p>How long ago did you give birth?</p>
                  </GuideBubble>

                  <div className="space-y-2 pt-1">
                    {seedData.profileOptions.monthsSinceBirth.map((m) => (
                      <button
                        key={m}
                        onClick={() => {
                          setMonthsSinceBirth(m);
                          navigateTo('profile_work_sit');
                        }}
                        className="w-full min-h-[46px] p-3.5 rounded-xl border border-[#EFEAE2] bg-white hover:bg-[#FFFBF9] text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between cursor-pointer text-[#2D2320]"
                      >
                        <span>{m}</span>
                        <ChevronRight className="w-4 h-4 text-[#A89B95]" />
                      </button>
                    ))}
                    <div className="pt-2">
                      <button
                        onClick={goBack}
                        className="text-xs text-[#7A6E69] hover:text-[#2D2320] flex items-center gap-1 cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>{uiStrings.en.backButton}</span>
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Profile Step 7: Work Situation */}
              {step === 'profile_work_sit' && (
                <>
                  <GuideBubble>
                    <p>What is your current work situation?</p>
                  </GuideBubble>

                  <div className="space-y-2 pt-1">
                    {seedData.profileOptions.workSituation.map((w) => (
                      <button
                        key={w}
                        onClick={() => {
                          setWorkSituation(w);
                          navigateTo('profile_career_break');
                        }}
                        className="w-full min-h-[46px] p-3.5 rounded-xl border border-[#EFEAE2] bg-white hover:bg-[#FFFBF9] text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between cursor-pointer text-[#2D2320]"
                      >
                        <span>{w}</span>
                        <ChevronRight className="w-4 h-4 text-[#A89B95]" />
                      </button>
                    ))}
                    <div className="pt-2">
                      <button
                        onClick={goBack}
                        className="text-xs text-[#7A6E69] hover:text-[#2D2320] flex items-center gap-1 cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>{uiStrings.en.backButton}</span>
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Profile Step 8: Career Break length */}
              {step === 'profile_career_break' && (
                <>
                  <GuideBubble>
                    <p>How long has your career break or leave been so far?</p>
                  </GuideBubble>

                  <div className="space-y-2 pt-1">
                    {seedData.profileOptions.careerBreak.map((cb) => (
                      <button
                        key={cb}
                        onClick={() => {
                          setCareerBreak(cb);
                          if (isWellbeingSkipped) {
                            navigateTo('career_intro');
                          } else {
                            navigateTo('wellbeing_intro');
                          }
                        }}
                        className="w-full min-h-[46px] p-3.5 rounded-xl border border-[#EFEAE2] bg-white hover:bg-[#FFFBF9] text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between cursor-pointer text-[#2D2320]"
                      >
                        <span>{cb}</span>
                        <ChevronRight className="w-4 h-4 text-[#A89B95]" />
                      </button>
                    ))}
                    <div className="pt-2">
                      <button
                        onClick={goBack}
                        className="text-xs text-[#7A6E69] hover:text-[#2D2320] flex items-center gap-1 cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>{uiStrings.en.backButton}</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* SCREEN 3: WELLBEING INTRO */}
          {/* ========================================================= */}
          {step === 'wellbeing_intro' && (
            <div className="space-y-5 animate-fade-in">
              <GuideBubble>
                <p className="font-semibold text-[#2D2320] mb-1.5">
                  {uiTransitions.profileToWellbeingIntro}
                </p>
                <p className="text-xs text-[#655A55] mb-2 leading-relaxed">
                  {hasGivenBirth === 'Yes'
                    ? 'Since you gave birth in the last 12 months, we will use the Edinburgh Postnatal Depression Scale (EPDS). It has 10 simple questions.'
                    : 'We will use standard validated screenings (PHQ-9 and GAD-7) to check in on mood and anxiety.'}
                </p>
                <p className="text-xs text-[#2C6947] font-medium">
                  {uiTransitions.wellbeingIntroToQuestions}
                </p>
              </GuideBubble>

              <div className="p-4 bg-[#EEF6F1] border border-[#D0E4D8] rounded-2xl flex items-start gap-2.5 text-xs text-[#1D442E] shadow-2xs">
                <Shield className="w-4 h-4 text-[#2C6947] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Privacy reminder</span>
                  <p className="text-[11px] text-[#2C6947] mt-0.5">
                    Your answers never leave your browser and are scored purely on your phone.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={goBack}
                  className="text-xs text-[#7A6E69] hover:text-[#2D2320] flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{uiStrings.en.backButton}</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentQuestionIndex(0);
                    navigateTo('wellbeing_screening');
                  }}
                  className="min-h-[44px] px-6 py-2.5 bg-[#2C6947] hover:bg-[#235338] text-white font-semibold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-sm transition-colors"
                >
                  <span>Begin screening</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCREEN 3: WELLBEING SCREENING (EPDS or PHQ-9 + GAD-7) */}
          {/* ========================================================= */}
          {step === 'wellbeing_screening' && (
            <div className="space-y-5 animate-fade-in">
              {(() => {
                const q = screeningQuestions[currentQuestionIndex];
                if (!q) return null;

                const instrumentTitle =
                  q.type === 'epds'
                    ? 'Edinburgh Postnatal Depression Scale'
                    : q.type === 'phq9'
                    ? 'PHQ-9 Mood Check'
                    : 'GAD-7 Anxiety Check';

                return (
                  <>
                    {/* Slim Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-[#7A6E69]">
                        <span className="font-medium text-[#2C6947]">
                          {instrumentTitle} · {currentQuestionIndex + 1} of {screeningQuestions.length}
                        </span>
                        <button
                          onClick={() => setAboutModalOpen(true)}
                          className="text-[11px] text-[#B8533E] hover:underline cursor-pointer"
                        >
                          About these questions
                        </button>
                      </div>
                      <div className="w-full bg-[#EFEAE2] h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#2C6947] h-full transition-all duration-300 rounded-full"
                          style={{
                            width: `${((currentQuestionIndex + 1) / screeningQuestions.length) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Guide Bubble with Stem & Question Text */}
                    <GuideBubble>
                      <div className="text-[11px] uppercase tracking-wider text-[#8A7D77] font-semibold mb-1">
                        {q.stem}
                      </div>
                      <div className="text-sm sm:text-base font-semibold text-[#2D2320] leading-snug">
                        {q.text}
                      </div>
                    </GuideBubble>

                    {/* Show selected answer bubble if answered */}
                    {wellbeingAnswers[q.key] !== undefined && (
                      <UserBubble>
                        {(() => {
                          const selectedVal = wellbeingAnswers[q.key];
                          const opt = q.options.find((o) => o.score === selectedVal);
                          return opt ? opt.label : `Selected score: ${selectedVal}`;
                        })()}
                      </UserBubble>
                    )}

                    {/* Tappable Option Cards */}
                    <div className="space-y-2 pt-1">
                      {q.options.map((opt) => {
                        const isSelected = wellbeingAnswers[q.key] === opt.score;
                        return (
                          <button
                            key={opt.label}
                            onClick={() => {
                              // Check immediate safety interrupt on self-harm items
                              if (checkSafetyInterrupt(q.key, opt.score)) {
                                return;
                              }

                              // Record score
                              setWellbeingAnswers((prev) => ({
                                ...prev,
                                [q.key]: opt.score,
                              }));

                              // Advance or transition
                              if (currentQuestionIndex + 1 < screeningQuestions.length) {
                                setCurrentQuestionIndex((prev) => prev + 1);
                              } else {
                                navigateTo('life_support_intro');
                              }
                            }}
                            className={`w-full min-h-[48px] p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? 'bg-[#EEF6F1] border-[#B8D7C4] text-[#1D442E] font-semibold shadow-2xs'
                                : 'bg-white hover:bg-[#FFFBF9] border-[#EFEAE2] text-[#2D2320]'
                            }`}
                          >
                            <span>{opt.label}</span>
                            <ChevronRight className="w-4 h-4 text-[#A89B95] shrink-0 ml-2" />
                          </button>
                        );
                      })}
                    </div>

                    {/* Back button */}
                    <div className="flex items-center justify-between pt-2">
                      <button
                        onClick={() => {
                          if (currentQuestionIndex > 0) {
                            setCurrentQuestionIndex((prev) => prev - 1);
                          } else {
                            goBack();
                          }
                        }}
                        className="text-xs text-[#7A6E69] hover:text-[#2D2320] flex items-center gap-1 cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>{uiStrings.en.backButton}</span>
                      </button>

                      {wellbeingAnswers[q.key] !== undefined &&
                        currentQuestionIndex + 1 < screeningQuestions.length && (
                          <button
                            onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                            className="text-xs text-[#2C6947] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <span>Next question</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                    </div>
                  </>
                );
              })()}
            </div>
          )}

          {/* ========================================================= */}
          {/* SCREEN 3: LIFE & SUPPORT INTRO */}
          {/* ========================================================= */}
          {step === 'life_support_intro' && (
            <div className="space-y-5 animate-fade-in">
              <GuideBubble>
                <p className="font-semibold text-[#2D2320] mb-1">
                  {uiTransitions.instrumentToLifeSupport}
                </p>
                <p className="text-xs text-[#655A55] leading-relaxed">
                  These 8 questions help us understand practical realities like childcare, rest, open conversation, and money pressure.
                </p>
              </GuideBubble>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={goBack}
                  className="text-xs text-[#7A6E69] hover:text-[#2D2320] flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{uiStrings.en.backButton}</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentQuestionIndex(0);
                    navigateTo('life_support');
                  }}
                  className="min-h-[44px] px-6 py-2.5 bg-[#B8533E] hover:bg-[#A34532] text-white font-semibold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-sm transition-colors"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCREEN 3: LIFE & SUPPORT QUESTIONS (L1..L8) */}
          {/* ========================================================= */}
          {step === 'life_support' && (
            <div className="space-y-5 animate-fade-in">
              {(() => {
                const items = seedData.lifeAndSupport.items;
                const currentItem = items[currentQuestionIndex];
                if (!currentItem) return null;

                return (
                  <>
                    {/* Slim Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-[#7A6E69]">
                        <span className="font-medium text-[#B8533E]">
                          Life & Support · {currentQuestionIndex + 1} of {items.length}
                        </span>
                        <span className="text-[11px] text-[#A89B95]">Agree scale (1–5)</span>
                      </div>
                      <div className="w-full bg-[#EFEAE2] h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#B8533E] h-full transition-all duration-300 rounded-full"
                          style={{
                            width: `${((currentQuestionIndex + 1) / items.length) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    <GuideBubble>
                      <div className="text-sm sm:text-base font-semibold text-[#2D2320] leading-snug">
                        {currentItem.text}
                      </div>
                    </GuideBubble>

                    {/* Show selected answer if set */}
                    {lifeAnswers[currentItem.id] !== undefined && (
                      <UserBubble>
                        {(() => {
                          const val = lifeAnswers[currentItem.id];
                          const opt = seedData.lifeAndSupport.scale.find((s) => s.value === val);
                          return opt ? opt.label : `Selected: ${val}`;
                        })()}
                      </UserBubble>
                    )}

                    {/* 5-point scale buttons */}
                    <div className="space-y-2 pt-1">
                      {seedData.lifeAndSupport.scale.map((scaleOpt) => {
                        const isSelected = lifeAnswers[currentItem.id] === scaleOpt.value;
                        return (
                          <button
                            key={scaleOpt.label}
                            onClick={() => {
                              setLifeAnswers((prev) => ({
                                ...prev,
                                [currentItem.id]: scaleOpt.value,
                              }));
                              if (currentQuestionIndex + 1 < items.length) {
                                setCurrentQuestionIndex((prev) => prev + 1);
                              } else {
                                navigateTo('wellbeing_summary');
                              }
                            }}
                            className={`w-full min-h-[46px] p-3 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? 'bg-[#FFF6F2] border-[#F0B2A4] text-[#8C3E2D] font-semibold'
                                : 'bg-white hover:bg-[#FFFBF9] border-[#EFEAE2] text-[#2D2320]'
                            }`}
                          >
                            <span>{scaleOpt.label}</span>
                            <ChevronRight className="w-4 h-4 text-[#A89B95]" />
                          </button>
                        );
                      })}
                    </div>

                    {/* Back / Navigation */}
                    <div className="flex items-center justify-between pt-2">
                      <button
                        onClick={() => {
                          if (currentQuestionIndex > 0) {
                            setCurrentQuestionIndex((prev) => prev - 1);
                          } else {
                            goBack();
                          }
                        }}
                        className="text-xs text-[#7A6E69] hover:text-[#2D2320] flex items-center gap-1 cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>{uiStrings.en.backButton}</span>
                      </button>

                      {lifeAnswers[currentItem.id] !== undefined &&
                        currentQuestionIndex + 1 < items.length && (
                          <button
                            onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                            className="text-xs text-[#B8533E] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <span>Next</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                    </div>
                  </>
                );
              })()}
            </div>
          )}

          {/* ========================================================= */}
          {/* SCREEN 4: WELLBEING SUMMARY */}
          {/* ========================================================= */}
          {step === 'wellbeing_summary' && wellbeingResult && (
            <div className="space-y-6 animate-fade-in">
              <GuideBubble>
                <p className="font-semibold text-[#2D2320] mb-1">
                  {uiTransitions.lifeSupportToWellbeingSummary}
                </p>
                <p className="text-xs text-[#655A55] leading-relaxed">
                  Here is what your responses suggest, along with self-care ideas and our recommended return pace.
                </p>
              </GuideBubble>

              {/* Wellbeing Level Card */}
              <div
                className={`p-5 rounded-2xl border shadow-xs space-y-3 ${
                  wellbeingResult.wellbeingLevel === 'High'
                    ? 'bg-[#FDF2EE] border-[#F7D8CE] text-[#8C3E2D]'
                    : wellbeingResult.wellbeingLevel === 'Moderate'
                    ? 'bg-[#FEF6EC] border-[#F7E2C7] text-[#8A4F1E]'
                    : 'bg-[#EEF6F1] border-[#D0E4D8] text-[#1D442E]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        wellbeingResult.wellbeingLevel === 'High'
                          ? 'bg-[#FAD8CD] text-[#8C3E2D]'
                          : wellbeingResult.wellbeingLevel === 'Moderate'
                          ? 'bg-[#FCE5C6] text-[#8A4F1E]'
                          : 'bg-[#D7EDE0] text-[#1D442E]'
                      }`}
                    >
                      Wellbeing: {wellbeingResult.wellbeingLevel}
                    </span>
                  </div>
                  <span className="text-xs font-semibold">
                    Support: {wellbeingResult.supportLevel}
                  </span>
                </div>

                {/* Exact seed message for this level */}
                <p className="text-sm font-medium leading-relaxed">
                  {seedData.wellbeingGuidance.find((g) => g.level === wellbeingResult.wellbeingLevel)
                    ?.message}
                </p>

                {/* Support sentence */}
                <div className="text-xs pt-1 border-t border-black/10">
                  {wellbeingResult.supportLevel === 'Strong' &&
                    'You have a strong support circle to lean on as you plan your next steps.'}
                  {wellbeingResult.supportLevel === 'Some' &&
                    'You have some helpful support around you, though balancing rest and childcare will be key.'}
                  {wellbeingResult.supportLevel === 'Limited' &&
                    'Your answers suggest current support or rest is limited right now. We recommend pacing yourself very gently.'}
                </div>
              </div>

              {/* Recommended Pace Card */}
              <div className="bg-[#FFFDFB] p-4 sm:p-5 rounded-2xl border border-[#EFEAE2] space-y-2 shadow-2xs">
                <span className="text-xs font-bold uppercase tracking-wider text-[#B8533E]">
                  Recommended Return Pace
                </span>
                <div className="text-lg font-bold text-[#2D2320] flex items-center gap-2">
                  <span>{wellbeingResult.returnPace}</span>
                </div>
                <p className="text-xs text-[#655A55] leading-relaxed">
                  {seedData.paces.find((p) => p.name === wellbeingResult.returnPace)?.description}
                </p>
              </div>

              {/* High level specific alert: Talk to a health worker */}
              {wellbeingResult.wellbeingLevel === 'High' && (
                <div className="p-4 bg-[#FEF6EC] rounded-2xl border border-[#F7E2C7] text-[#8A4F1E] space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-[#8A4F1E]">
                    <AlertTriangle className="w-4 h-4 text-[#D97706]" />
                    <span>Talk to a health worker</span>
                  </div>
                  <p className="text-xs text-[#8A4F1E] leading-relaxed">
                    We recommend speaking with a doctor, nurse, or community midwife within the next week. You do not have to carry heavy feelings alone.
                  </p>
                  <div className="text-[11px] text-[#784318] bg-[#FCE5C6]/60 p-2 rounded-lg border border-[#F7E2C7] font-mono">
                    Referral point placeholder: [Partner clinic referral — to be confirmed by clinical lead]
                  </div>
                </div>
              )}

              {/* Vetted Self-Care Steps */}
              <div className="bg-white p-5 rounded-2xl border border-[#EFEAE2] space-y-3 shadow-2xs">
                <h3 className="text-sm font-bold text-[#2D2320] flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-[#B8533E]" />
                  <span>Small, helpful self-care steps</span>
                </h3>
                <ul className="space-y-2 text-xs text-[#655A55]">
                  {seedData.selfCare.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2C6947] mt-1.5 shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action: Plan my return to work */}
              <div className="pt-2 space-y-2">
                <button
                  onClick={() => navigateTo('career_intro')}
                  className="w-full min-h-[48px] px-6 py-3.5 bg-[#B8533E] hover:bg-[#A34532] text-white font-semibold rounded-2xl text-sm flex items-center justify-between shadow-sm cursor-pointer transition-colors"
                >
                  <span>Plan my return to work</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCREEN 5: CAREER INTRO */}
          {/* ========================================================= */}
          {step === 'career_intro' && (
            <div className="space-y-5 animate-fade-in">
              <GuideBubble>
                <p className="font-semibold text-[#2D2320] mb-1">
                  {uiTransitions.wellbeingToCareerIntro}
                </p>
                <p className="text-xs text-[#655A55] leading-relaxed">
                  We match your strengths to 15 practical roles in Kenya, Nigeria, and remote markets. First, tell me about something you’re proud of so I can recognize your transferable skills.
                </p>
              </GuideBubble>

              <div className="bg-[#FFFDFB] p-4 sm:p-5 rounded-2xl border border-[#EFEAE2] space-y-3 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-bold text-[#2D2320]">
                  <Sparkles className="w-4 h-4 text-[#B8533E]" />
                  <span>Optional: Discover skills from your lived experience</span>
                </div>
                <p className="text-xs text-[#655A55] leading-relaxed">
                  Tell me about something you're proud of: at work, at home, raising a family, or in your community.
                </p>
                <textarea
                  rows={3}
                  value={livedExperienceText}
                  onChange={(e) => setLivedExperienceText(e.target.value)}
                  placeholder="e.g. I organised a community fundraiser, managed all household budgeting with two children, and ran our women's savings group meetings..."
                  className="w-full p-3 bg-white border border-[#E5DAD3] rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#B8533E] text-[#2D2320]"
                />

                <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
                  <button
                    disabled={!livedExperienceText.trim() || isAiSuggestingSkills}
                    onClick={handleFetchAiSkills}
                    className="min-h-[42px] px-4 py-2 bg-[#B8533E] hover:bg-[#A34532] disabled:bg-gray-300 text-white text-xs font-semibold rounded-xl flex items-center gap-2 cursor-pointer shadow-xs disabled:cursor-not-allowed transition-colors"
                  >
                    {isAiSuggestingSkills ? (
                      <>
                        <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        <span>Analyzing story with Gemini...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Suggest my skills (AI)</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => navigateTo('career_skills')}
                    className="text-xs text-[#7A6E69] hover:text-[#2D2320] font-medium underline cursor-pointer"
                  >
                    Skip and rate skills manually
                  </button>
                </div>

                {aiSkillFeedback && (
                  <div className="p-3 bg-[#FFF6F2] border border-[#F4DDD2] rounded-xl text-xs text-[#8C3E2D] flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#B8533E] shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p>{aiSkillFeedback}</p>
                      <button
                        onClick={() => navigateTo('career_skills')}
                        className="font-bold underline text-[#8C3E2D] hover:text-[#6F2E20] cursor-pointer block mt-1"
                      >
                        Review and confirm ratings →
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={goBack}
                  className="text-xs text-[#7A6E69] hover:text-[#2D2320] flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{uiStrings.en.backButton}</span>
                </button>
                <button
                  onClick={() => navigateTo('career_skills')}
                  className="min-h-[44px] px-6 py-2.5 bg-[#B8533E] hover:bg-[#A34532] text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
                >
                  <span>Rate my skills</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCREEN 5: SKILLS RATING (10 skills) */}
          {/* ========================================================= */}
          {step === 'career_skills' && (
            <div className="space-y-5 animate-fade-in">
              <GuideBubble>
                <p className="font-semibold text-[#2D2320] mb-1">
                  {uiTransitions.careerIntroToSkills}
                </p>
                <p className="text-xs text-[#655A55]">
                  Rate each skill from 1 (Not yet) to 5 (Expert). You can adjust any AI suggestion.
                </p>
              </GuideBubble>

              <div className="space-y-4">
                {seedData.skills.map((skillName, sIdx) => {
                  const currentVal = skillsRatings[skillName] ?? 3;
                  return (
                    <div
                      key={skillName}
                      className="p-4 bg-white rounded-2xl border border-[#EFEAE2] shadow-2xs space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#2D2320]">
                          {sIdx + 1}. {skillName}
                        </span>
                        <span className="text-xs font-semibold text-[#8C3E2D] bg-[#FFF6F2] px-2 py-0.5 rounded border border-[#F4DDD2]">
                          {seedData.skillScale.find((s) => s.value === currentVal)?.label}
                        </span>
                      </div>

                      <div className="grid grid-cols-5 gap-1.5 pt-1">
                        {seedData.skillScale.map((scaleOpt) => {
                          const isSelected = currentVal === scaleOpt.value;
                          return (
                            <button
                              key={scaleOpt.value}
                              onClick={() => {
                                setSkillsRatings((prev) => ({
                                  ...prev,
                                  [skillName]: scaleOpt.value,
                                }));
                              }}
                              className={`py-2 px-1 text-center rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-[#B8533E] text-white border-[#B8533E] shadow-xs'
                                  : 'bg-[#FAF7F2] hover:bg-[#F5EFE8] text-[#655A55] border-[#EFEAE2]'
                              }`}
                            >
                              <span className="block font-bold">{scaleOpt.value}</span>
                              <span className="text-[10px] hidden sm:block truncate opacity-80">
                                {scaleOpt.label.split('–')[1]?.trim()}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-3">
                <button
                  onClick={goBack}
                  className="text-xs text-[#7A6E69] hover:text-[#2D2320] flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{uiStrings.en.backButton}</span>
                </button>
                <button
                  onClick={() => navigateTo('career_interests')}
                  className="min-h-[44px] px-6 py-2.5 bg-[#B8533E] hover:bg-[#A34532] text-white font-semibold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-sm transition-colors"
                >
                  <span>Continue to Interests</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCREEN 5: INTERESTS RATING (6 interest areas) */}
          {/* ========================================================= */}
          {step === 'career_interests' && (
            <div className="space-y-5 animate-fade-in">
              <GuideBubble>
                <p className="font-semibold text-[#2D2320] mb-1">
                  {uiTransitions.skillsToInterests}
                </p>
                <p className="text-xs text-[#655A55]">
                  Rate how much you enjoy each work area from 1 (Not for me) to 5 (Very much).
                </p>
              </GuideBubble>

              <div className="space-y-4">
                {seedData.interests.map((interest) => {
                  const currentVal = interestsRatings[interest.name] ?? 3;
                  return (
                    <div
                      key={interest.name}
                      className="p-4 bg-white rounded-2xl border border-[#EFEAE2] shadow-2xs space-y-2"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-1">
                        <div>
                          <div className="text-xs font-bold text-[#2D2320]">{interest.name}</div>
                          <p className="text-[11px] text-[#7A6E69]">{interest.description}</p>
                        </div>
                        <span className="text-xs font-semibold text-[#1D442E] bg-[#EEF6F1] px-2 py-0.5 rounded border border-[#D0E4D8]">
                          {seedData.interestScale.find((s) => s.value === currentVal)?.label}
                        </span>
                      </div>

                      <div className="grid grid-cols-5 gap-1.5 pt-2">
                        {seedData.interestScale.map((scaleOpt) => {
                          const isSelected = currentVal === scaleOpt.value;
                          return (
                            <button
                              key={scaleOpt.value}
                              onClick={() => {
                                setInterestsRatings((prev) => ({
                                  ...prev,
                                  [interest.name]: scaleOpt.value,
                                }));
                              }}
                              className={`py-2 px-1 text-center rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-[#2C6947] text-white border-[#2C6947] shadow-xs'
                                  : 'bg-[#FAF7F2] hover:bg-[#F5EFE8] text-[#655A55] border-[#EFEAE2]'
                              }`}
                            >
                              <span className="block font-bold">{scaleOpt.value}</span>
                              <span className="text-[10px] hidden sm:block truncate opacity-80">
                                {scaleOpt.label.split('–')[1]?.trim()}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-3">
                <button
                  onClick={goBack}
                  className="text-xs text-[#7A6E69] hover:text-[#2D2320] flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{uiStrings.en.backButton}</span>
                </button>
                <button
                  onClick={() => navigateTo('career_work_needs')}
                  className="min-h-[44px] px-6 py-2.5 bg-[#B8533E] hover:bg-[#A34532] text-white font-semibold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-sm transition-colors"
                >
                  <span>Continue to Work Needs</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCREEN 5: WORK NEEDS */}
          {/* ========================================================= */}
          {step === 'career_work_needs' && (
            <div className="space-y-5 animate-fade-in">
              <GuideBubble>
                <p className="font-semibold text-[#2D2320] mb-1">
                  {uiTransitions.interestsToWorkNeeds}
                </p>
                <p className="text-xs text-[#655A55]">
                  Let's make sure the roles respect your schedule, childcare, and location requirements.
                </p>
              </GuideBubble>

              <div className="space-y-4">
                {/* 1. Work from home? */}
                <div className="p-4 bg-white rounded-2xl border border-[#EFEAE2] shadow-2xs space-y-2">
                  <span className="text-xs font-bold text-[#2D2320] block">
                    Do you need to work from home (remote)?
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {seedData.workNeeds.homeWorking.map((hw) => (
                      <button
                        key={hw}
                        onClick={() => setWorkNeeds((prev) => ({ ...prev, homeWorking: hw }))}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                          workNeeds.homeWorking === hw
                            ? 'bg-[#B8533E] text-white border-[#B8533E] shadow-xs'
                            : 'bg-[#FAF7F2] hover:bg-[#F5EFE8] text-[#655A55] border-[#EFEAE2]'
                        }`}
                      >
                        {hw === 'Yes' ? 'Yes, remote required' : 'No, in-person is okay'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Working hours */}
                <div className="p-4 bg-white rounded-2xl border border-[#EFEAE2] shadow-2xs space-y-2">
                  <span className="text-xs font-bold text-[#2D2320] block">
                    How many hours can you commit each week?
                  </span>
                  <div className="space-y-2">
                    {seedData.workNeeds.hours.map((h) => (
                      <button
                        key={h}
                        onClick={() => setWorkNeeds((prev) => ({ ...prev, hours: h }))}
                        className={`w-full py-2.5 px-3 rounded-xl border text-xs text-left font-medium cursor-pointer transition-all flex items-center justify-between ${
                          workNeeds.hours === h
                            ? 'bg-[#FFF6F2] border-[#F0B2A4] text-[#8C3E2D] font-semibold'
                            : 'bg-[#FAF7F2] hover:bg-[#F5EFE8] text-[#655A55] border-[#EFEAE2]'
                        }`}
                      >
                        <span>{h}</span>
                        {workNeeds.hours === h && <CheckCircle2 className="w-4 h-4 text-[#B8533E]" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Flexible hours */}
                <div className="p-4 bg-white rounded-2xl border border-[#EFEAE2] shadow-2xs space-y-2">
                  <span className="text-xs font-bold text-[#2D2320] block">
                    Do you need flexible hours (setting your own work schedule)?
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {seedData.workNeeds.flexibleHours.map((fh) => (
                      <button
                        key={fh}
                        onClick={() => setWorkNeeds((prev) => ({ ...prev, flexibleHours: fh }))}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                          workNeeds.flexibleHours === fh
                            ? 'bg-[#B8533E] text-white border-[#B8533E] shadow-xs'
                            : 'bg-[#FAF7F2] hover:bg-[#F5EFE8] text-[#655A55] border-[#EFEAE2]'
                        }`}
                      >
                        {fh === 'Yes' ? 'Yes, flexible hours' : 'No, fixed hours fine'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3">
                <button
                  onClick={goBack}
                  className="text-xs text-[#7A6E69] hover:text-[#2D2320] flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{uiStrings.en.backButton}</span>
                </button>
                <button
                  onClick={() => navigateTo('career_matches')}
                  className="min-h-[46px] px-6 py-2.5 bg-[#B8533E] hover:bg-[#A34532] text-white font-semibold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-sm transition-colors"
                >
                  <span>See my matches</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCREEN 6: CAREER MATCHES */}
          {/* ========================================================= */}
          {step === 'career_matches' && (
            <div className="space-y-6 animate-fade-in">
              <GuideBubble>
                <p className="font-semibold text-[#2D2320] mb-1">
                  {uiTransitions.workNeedsToMatches}
                </p>
                <p className="text-xs text-[#655A55]">
                  Here are your top 3 matches calculated from your skills, interests and schedule requirements.
                </p>
              </GuideBubble>

              {/* Top 3 Match Cards */}
              <div className="space-y-4">
                {careerMatches.slice(0, 3).map((match, idx) => {
                  const isTop = idx === 0;
                  return (
                    <div
                      key={match.role.role}
                      className={`p-5 rounded-2xl border transition-all ${
                        isTop
                          ? 'bg-white border-[#F0B2A4] ring-2 ring-[#B8533E]/20 shadow-xs'
                          : 'bg-white border-[#EFEAE2] shadow-2xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#B8533E] block">
                            Match #{idx + 1} · {match.role.interestArea}
                          </span>
                          <h3 className="text-base font-bold text-[#2D2320] mt-0.5">
                            {match.role.role}
                          </h3>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-extrabold text-[#B8533E]">
                            {match.overallScore}%
                          </span>
                          <span className="text-[10px] text-[#A89B95] block">overall</span>
                        </div>
                      </div>

                      {/* Overall match bar */}
                      <div className="w-full bg-[#FAF7F2] h-2 rounded-full overflow-hidden border border-[#EFEAE2]/60">
                        <div
                          className="bg-[#B8533E] h-full rounded-full transition-all duration-500"
                          style={{ width: `${match.overallScore}%` }}
                        />
                      </div>

                      {/* Sub-score mini bars */}
                      <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
                        <div>
                          <div className="flex justify-between text-[#7A6E69] mb-0.5">
                            <span>Skills</span>
                            <span className="font-semibold text-[#2D2320]">{match.skillsScore}%</span>
                          </div>
                          <div className="w-full bg-[#FAF7F2] h-1.5 rounded-full overflow-hidden border border-[#EFEAE2]/50">
                            <div
                              className="bg-[#2C6947] h-full rounded-full"
                              style={{ width: `${match.skillsScore}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-[#7A6E69] mb-0.5">
                            <span>Interests</span>
                            <span className="font-semibold text-[#2D2320]">{match.interestsScore}%</span>
                          </div>
                          <div className="w-full bg-[#FAF7F2] h-1.5 rounded-full overflow-hidden border border-[#EFEAE2]/50">
                            <div
                              className="bg-[#D97706] h-full rounded-full"
                              style={{ width: `${match.interestsScore}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-[#7A6E69] mb-0.5">
                            <span>Fit</span>
                            <span className="font-semibold text-[#2D2320]">{match.fitScore}%</span>
                          </div>
                          <div className="w-full bg-[#FAF7F2] h-1.5 rounded-full overflow-hidden border border-[#EFEAE2]/50">
                            <div
                              className="bg-[#B8533E] h-full rounded-full"
                              style={{ width: `${match.fitScore}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* First step */}
                      <div className="pt-2 text-xs text-[#655A55] bg-[#FFFDFB] p-2.5 rounded-xl border border-[#EFEAE2] flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2C6947] shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-[#2D2320]">First step: </strong>
                          <span>{match.role.firstStep}</span>
                        </div>
                      </div>

                      {/* Skill gaps chips (for top card per prompt) */}
                      {isTop && match.skillGaps.length > 0 && (
                        <div className="pt-2 border-t border-[#EFEAE2]">
                          <span className="text-xs font-semibold text-[#655A55] block mb-1.5">
                            {uiStrings.en.skillsGapsTitle}:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {match.skillGaps.map((gap) => (
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
                  );
                })}
              </div>

              {/* See all roles trigger (Recharts modal) */}
              <div className="pt-1 text-center">
                <button
                  onClick={() => setAllRolesChartOpen(true)}
                  className="text-xs text-[#B8533E] font-semibold hover:underline inline-flex items-center gap-1.5 cursor-pointer py-1.5 px-3 rounded-lg hover:bg-[#FFF6F2] transition-colors"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>See all 15 roles (Match comparison chart)</span>
                </button>
              </div>

              {/* Action: View my 24-week plan */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={goBack}
                  className="text-xs text-[#7A6E69] hover:text-[#2D2320] flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{uiStrings.en.backButton}</span>
                </button>
                <button
                  onClick={() => {
                    fetchAiNarrative();
                    navigateTo('career_plan');
                  }}
                  className="min-h-[48px] px-6 py-3 bg-[#B8533E] hover:bg-[#A34532] text-white font-semibold rounded-2xl text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-sm transition-colors"
                >
                  <span>Build my 24-week plan</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCREEN 7: MY RE-ENTRY PLAN */}
          {/* ========================================================= */}
          {step === 'career_plan' && (
            <CareerPlanView
              firstName={firstName}
              wellbeingResult={wellbeingResult}
              topRoleMatch={topMatch}
              aiNarrative={aiNarrative}
              isAiLoading={isAiNarrativeLoading}
              onStartAgain={resetToWelcome}
              isPaceDefault={isWellbeingSkipped}
            />
          )}

          {/* ========================================================= */}
          {/* SAFETY SCREEN */}
          {/* ========================================================= */}
          {step === 'safety' && (
            <SafetyScreen
              country={country}
              isDemo={isDemoActive && demoName === 'Safety Pathway Demo'}
              onSafeForNow={() => {
                // Gentle option: return to welcome or hold safe
                navigateTo('welcome');
              }}
              onStartAgain={resetToWelcome}
            />
          )}

          <div ref={messagesEndRef} />
        </main>
      )}

      {/* Reviewer / Clinician Logic Panel */}
      {reviewerMode && (
        <ReviewerPanel
          wellbeingResult={wellbeingResult}
          topCareerMatches={careerMatches}
          onClose={() => setReviewerMode(false)}
        />
      )}

      {/* About Questions Modal (EPDS, PHQ-9, GAD-7 Attribution) */}
      <AboutQuestionsModal
        isOpen={aboutModalOpen}
        onClose={() => setAboutModalOpen(false)}
      />

      {/* All Roles Chart (Recharts) */}
      <AllRolesChart
        isOpen={allRolesChartOpen}
        onClose={() => setAllRolesChartOpen(false)}
        matches={careerMatches}
      />

      {/* Global Prototype Footer on Every Screen */}
      <footer className="w-full py-4 border-t border-[#EFEAE2] bg-[#FAF7F2]/90 text-center text-xs text-[#7A6E69] no-print">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>{uiStrings.en.prototypeLabel}</span>
          <span className="text-[11px] text-[#A89B95]">
            Wellness Conversations for working mothers · Maternal wellbeing and career re-entry support
          </span>
          <button
            onClick={() => setAboutModalOpen(true)}
            className="text-[11px] text-[#B8533E] hover:underline cursor-pointer"
          >
            Instruments & Clinical Attribution
          </button>
        </div>
      </footer>
    </div>
  );
}
