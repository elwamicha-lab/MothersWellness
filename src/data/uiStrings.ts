export interface DemoPersona {
  id: 'amina' | 'chioma' | 'safety';
  name: string;
  tagline: string;
  badge: string;
  profile: {
    firstName: string;
    country: string;
    city: string;
    ageGroup: string;
    hasGivenBirth: 'Yes' | 'No';
    monthsSinceBirth?: string;
    workSituation: string;
    careerBreak: string;
  };
  wellbeingAnswers: Record<string, number>;
  lifeAnswers: Record<string, number>;
  careerAnswers: {
    skills: Record<string, number>;
    interests: Record<string, number>;
    workNeeds: {
      homeWorking: string;
      hours: string;
      flexibleHours: string;
    };
  };
}

export const uiTransitions = {
  welcomeToProfile: "Welcome. Let's start with a few simple details about you and your current season of life.",
  profileToWellbeingIntro: "Thank you. Now let's gently check in on how your mind, body and spirit have felt lately.",
  wellbeingIntroToQuestions: "Take your time with these questions. There are no right or wrong answers, only what is true for you.",
  instrumentToLifeSupport: "Thank you for sharing that with me. Next, let's look at your daily life, rest and support around you.",
  lifeSupportToWellbeingSummary: "You've completed the wellbeing check. Let's look together at what your answers suggest and what support you deserve.",
  wellbeingToCareerIntro: "When you feel ready, let's explore your skills, lived experience, and what kind of work fits your rhythm now.",
  careerIntroToSkills: "First, let's explore your talents. Even caring for family or running a home builds real, valuable workplace skills.",
  skillsToInterests: "Wonderful. Now let's reflect on the kinds of tasks and impact that spark your curiosity and energy.",
  interestsToWorkNeeds: "Almost there! Let's clarify the practical conditions you need—like working hours and flexibility.",
  workNeedsToMatches: "I've matched your profile with promising career paths paced specially to your wellbeing. Let's look together.",
  matchesToPlan: "Here is your 24-week re-entry roadmap, paced gently to support your wellbeing at every step.",
};

export const uiStrings = {
  en: {
    appName: "Wellness Conversations for working mothers",
    appSubtitle: "Your wellbeing and your way back to work",
    aiGuideBadge: "AI guide",
    prototypeLabel: "Prototype — not for clinical use",
    demoBanner: "Demo person — not real data",
    saveProgressToggle: "Save my progress on this device",
    deleteEverything: "Delete everything",
    dataDeletedNotice: "All local data has been erased from this device.",
    pauseButton: "Pause",
    resumeButton: "Resume",
    pausedTitle: "Conversation paused",
    pausedText: "Take as much time as you need. Your answers are held safely on your device while this session is active.",
    backButton: "Back",
    continueButton: "Continue",
    startButton: "Start with my wellbeing",
    recommendedBadge: "Recommended",
    careerOnlyButton: "Go straight to my career plan",
    loadDemoButton: "Load a demo person",
    reviewerToggle: "Reviewer view",
    languageLabel: "Language",
    aboutQuestions: "About these questions",
    printPlan: "Print or save as PDF",
    startAgain: "Start again",
    welcomeGuideGreeting:
      "I'm an AI guide. I'm not a doctor or counsellor, and I can't diagnose. I can help you check in on your wellbeing and plan your return to work.",
    privacyPromise: "Your wellbeing answers stay on this phone",
    privacySubtext: "We never upload or share your answers. Everything is scored privately on your device.",
    timeEstimate: "Wellbeing ~5 min · Career ~8 min",
    skipCheckPrompt: "Your plan is paced to your wellbeing. Would you like a 5-minute check first?",
    skipCheckYes: "Yes, do the wellbeing check (5 min)",
    skipCheckNo: "No, continue to career plan directly",
    defaultPaceNotice: "Paced with default gradual return (wellbeing check skipped)",
    safetyAlertTitle: "We care about your safety",
    nearestFacilityButton: "Show me the nearest health facility",
    safeRightNowButton: "I'm safe right now — continue later",
    callButton: "Call",
    placeholderTag: "[Prototype placeholder — to be confirmed by clinical lead]",
    skillsGapsTitle: "Skills to build",
    planIntroDefault: "Here is a thoughtful 24-week re-entry roadmap tailored to your strengths, interest areas, and current wellbeing pace.",
    closingPaceReminder: "Check in on your wellbeing at each phase. If it changes, your plan's pace changes too.",
  },
};

export const demoPersonas: DemoPersona[] = [
  {
    id: 'amina',
    name: 'Amina',
    tagline: 'Nairobi · Baby 5 months · Moderate wellbeing · Some support',
    badge: 'Gradual return · Virtual assistant',
    profile: {
      firstName: 'Amina',
      country: 'Kenya',
      city: 'Nairobi',
      ageGroup: '25–34',
      hasGivenBirth: 'Yes',
      monthsSinceBirth: '4–6 months',
      workSituation: 'On maternity leave',
      careerBreak: '6–12 months',
    },
    // EPDS items 1-10: moderate total (e.g. 11, item 10=0)
    // 1: 1, 2: 1, 3: 2, 4: 2, 5: 1, 6: 2, 7: 1, 8: 1, 9: 0, 10: 0 -> total 11 (Moderate band 10-12)
    wellbeingAnswers: {
      epds_1: 1,
      epds_2: 1,
      epds_3: 2,
      epds_4: 2,
      epds_5: 1,
      epds_6: 2,
      epds_7: 1,
      epds_8: 1,
      epds_9: 0,
      epds_10: 0,
    },
    // Life L1-L8: average between 3 and 4 -> Some support
    // L1: 4, L2: 4, L3: 3, L4: 3, L5: 3, L6: 3, L7: 3 (rev: 6-3=3), L8: 3 (rev: 6-3=3) -> avg 3.25
    lifeAnswers: {
      L1: 4,
      L2: 4,
      L3: 3,
      L4: 3,
      L5: 3,
      L6: 3,
      L7: 3,
      L8: 3,
    },
    // Career: high in organising, digital, communication -> top path: Virtual or administrative assistant
    careerAnswers: {
      skills: {
        'Communication': 4,
        'Caring & empathy': 3,
        'Organisation & planning': 4,
        'Numbers & money': 3,
        'Basic digital (email, documents, phone apps)': 4,
        'Advanced digital or technical': 2,
        'Creativity & design': 2,
        'Teaching & training': 2,
        'Sales & persuasion': 2,
        'Leading people': 2,
      },
      interests: {
        'Helping & caring': 3,
        'Organising': 5,
        'Creating': 2,
        'Analysing': 3,
        'Practical & hands-on': 2,
        'Leading & persuading': 2,
      },
      workNeeds: {
        homeWorking: 'Yes',
        hours: '15–30 hours a week',
        flexibleHours: 'Yes',
      },
    },
  },
  {
    id: 'chioma',
    name: 'Chioma',
    tagline: 'Lagos · Not postpartum · Low wellbeing · Strong support',
    badge: 'Ready to return · Content manager',
    profile: {
      firstName: 'Chioma',
      country: 'Nigeria',
      city: 'Lagos',
      ageGroup: '25–34',
      hasGivenBirth: 'No',
      workSituation: 'Looking for work',
      careerBreak: '1–3 years',
    },
    // PHQ-9 (total 2: Minimal) & GAD-7 (total 2: Minimal) -> Low wellbeing
    wellbeingAnswers: {
      phq9_1: 0,
      phq9_2: 0,
      phq9_3: 1,
      phq9_4: 1,
      phq9_5: 0,
      phq9_6: 0,
      phq9_7: 0,
      phq9_8: 0,
      phq9_9: 0,
      gad7_1: 0,
      gad7_2: 0,
      gad7_3: 1,
      gad7_4: 0,
      gad7_5: 0,
      gad7_6: 1,
      gad7_7: 0,
    },
    // Life L1-L8: average >= 4 -> Strong support
    // L1: 5, L2: 5, L3: 4, L4: 4, L5: 4, L6: 4, L7: 2 (rev: 4), L8: 2 (rev: 4) -> avg 4.25
    lifeAnswers: {
      L1: 5,
      L2: 5,
      L3: 4,
      L4: 4,
      L5: 4,
      L6: 4,
      L7: 2,
      L8: 2,
    },
    // Career: high in Creating & Communication -> top path: Social media or content manager
    careerAnswers: {
      skills: {
        'Communication': 5,
        'Caring & empathy': 3,
        'Organisation & planning': 3,
        'Numbers & money': 2,
        'Basic digital (email, documents, phone apps)': 4,
        'Advanced digital or technical': 3,
        'Creativity & design': 5,
        'Teaching & training': 2,
        'Sales & persuasion': 4,
        'Leading people': 3,
      },
      interests: {
        'Helping & caring': 2,
        'Organising': 3,
        'Creating': 5,
        'Analysing': 2,
        'Practical & hands-on': 2,
        'Leading & persuading': 4,
      },
      workNeeds: {
        homeWorking: 'Yes',
        hours: 'Over 30 hours a week',
        flexibleHours: 'Yes',
      },
    },
  },
  {
    id: 'safety',
    name: 'Safety Pathway Demo',
    tagline: 'Demo of immediate clinical safety interrupt and referral contacts',
    badge: 'Immediate Safety Screen',
    profile: {
      firstName: 'Zara',
      country: 'Kenya',
      city: 'Mombasa',
      ageGroup: '18–24',
      hasGivenBirth: 'Yes',
      monthsSinceBirth: '0–3 months',
      workSituation: 'On maternity leave',
      careerBreak: 'Less than 6 months',
    },
    wellbeingAnswers: {
      epds_1: 2,
      epds_2: 2,
      epds_3: 2,
      epds_4: 3,
      epds_5: 2,
      epds_6: 2,
      epds_7: 3,
      epds_8: 3,
      epds_9: 2,
      epds_10: 2, // Non-zero triggers immediate safety screen!
    },
    lifeAnswers: {
      L1: 2,
      L2: 2,
      L3: 2,
      L4: 1,
      L5: 2,
      L6: 1,
      L7: 5,
      L8: 4,
    },
    careerAnswers: {
      skills: {},
      interests: {},
      workNeeds: {
        homeWorking: 'Yes',
        hours: 'Under 15 hours a week',
        flexibleHours: 'Yes',
      },
    },
  },
];
