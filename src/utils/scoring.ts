import { seedData, CareerRole } from '../data/seedData';

export interface WellbeingScoreResult {
  instrumentType: 'epds' | 'phq9_gad7';
  epdsScore?: number;
  epdsBand?: string;
  phq9Score?: number;
  phq9Band?: string;
  gad7Score?: number;
  gad7Band?: string;
  wellbeingLevel: 'Urgent' | 'High' | 'Moderate' | 'Low';
  triggerReason: string;
  supportAverage: number;
  supportLevel: 'Strong' | 'Some' | 'Limited';
  returnPace: 'Pause: safety first' | 'Care first' | 'Gradual return' | 'Ready to return';
  isSafetyAlert: boolean;
}

export function computeEPDSScore(answers: Record<string, number>): { score: number; band: string; item10Score: number } {
  let total = 0;
  let item10Score = 0;

  seedData.instruments.epds.items.forEach((item) => {
    const key = `epds_${item.n}`;
    const val = answers[key] ?? 0;
    total += val;
    if (item.n === 10) {
      item10Score = val;
    }
  });

  let band = 'Low';
  if (total >= 13) {
    band = 'Probable';
  } else if (total >= 10) {
    band = 'Possible';
  }

  return { score: total, band, item10Score };
}

export function computePHQ9Score(answers: Record<string, number>): { score: number; band: string; item9Score: number } {
  let total = 0;
  let item9Score = 0;

  seedData.instruments.phq9.items.forEach((item) => {
    const key = `phq9_${item.n}`;
    const val = answers[key] ?? 0;
    total += val;
    if (item.n === 9) {
      item9Score = val;
    }
  });

  let band = 'Minimal';
  if (total >= 20) band = 'Severe';
  else if (total >= 15) band = 'Moderately severe';
  else if (total >= 10) band = 'Moderate';
  else if (total >= 5) band = 'Mild';

  return { score: total, band, item9Score };
}

export function computeGAD7Score(answers: Record<string, number>): { score: number; band: string } {
  let total = 0;

  seedData.instruments.gad7.items.forEach((item) => {
    const key = `gad7_${item.n}`;
    const val = answers[key] ?? 0;
    total += val;
  });

  let band = 'Minimal';
  if (total >= 15) band = 'Severe';
  else if (total >= 10) band = 'Moderate';
  else if (total >= 5) band = 'Mild';

  return { score: total, band };
}

export function computeSupportScore(lifeAnswers: Record<string, number>): { average: number; level: 'Strong' | 'Some' | 'Limited' } {
  const items = seedData.lifeAndSupport.items;
  let sum = 0;
  let count = 0;

  items.forEach((item) => {
    const rawVal = lifeAnswers[item.id] ?? 3; // default neutral 3 if missing
    const scoreVal = item.reversed ? 6 - rawVal : rawVal;
    sum += scoreVal;
    count += 1;
  });

  const average = count > 0 ? Math.round((sum / count) * 100) / 100 : 3.0;

  let level: 'Strong' | 'Some' | 'Limited' = 'Some';
  if (average >= 4.0) {
    level = 'Strong';
  } else if (average < 3.0) {
    level = 'Limited';
  } else {
    level = 'Some';
  }

  return { average, level };
}

export function evaluateWellbeing(
  hasGivenBirth: 'Yes' | 'No',
  wellbeingAnswers: Record<string, number>,
  lifeAnswers: Record<string, number>
): WellbeingScoreResult {
  const isPostpartum = hasGivenBirth === 'Yes';
  const { average: supportAverage, level: supportLevel } = computeSupportScore(lifeAnswers);

  if (isPostpartum) {
    const { score: epdsScore, band: epdsBand, item10Score } = computeEPDSScore(wellbeingAnswers);

    let wellbeingLevel: 'Urgent' | 'High' | 'Moderate' | 'Low' = 'Low';
    let triggerReason = 'EPDS score < 10 (Low band)';
    let isSafetyAlert = false;

    if (item10Score > 0) {
      wellbeingLevel = 'Urgent';
      triggerReason = `Immediate Safety Interrupt: EPDS Item 10 score is ${item10Score} (> 0)`;
      isSafetyAlert = true;
    } else if (epdsScore >= 13) {
      wellbeingLevel = 'High';
      triggerReason = `EPDS total score ${epdsScore} >= 13 (Probable symptoms)`;
    } else if (epdsScore >= 10) {
      wellbeingLevel = 'Moderate';
      triggerReason = `EPDS total score ${epdsScore} is 10–12 (Possible symptoms)`;
    }

    let returnPace: 'Pause: safety first' | 'Care first' | 'Gradual return' | 'Ready to return' = 'Ready to return';
    if (wellbeingLevel === 'Urgent') {
      returnPace = 'Pause: safety first';
    } else if (wellbeingLevel === 'High') {
      returnPace = 'Care first';
    } else if (wellbeingLevel === 'Moderate' || supportLevel === 'Limited') {
      returnPace = 'Gradual return';
    } else {
      returnPace = 'Ready to return';
    }

    return {
      instrumentType: 'epds',
      epdsScore,
      epdsBand,
      wellbeingLevel,
      triggerReason,
      supportAverage,
      supportLevel,
      returnPace,
      isSafetyAlert,
    };
  } else {
    const { score: phq9Score, band: phq9Band, item9Score } = computePHQ9Score(wellbeingAnswers);
    const { score: gad7Score, band: gad7Band } = computeGAD7Score(wellbeingAnswers);

    let wellbeingLevel: 'Urgent' | 'High' | 'Moderate' | 'Low' = 'Low';
    let triggerReason = 'PHQ-9 < 5 and GAD-7 < 5 (Minimal)';
    let isSafetyAlert = false;

    if (item9Score > 0) {
      wellbeingLevel = 'Urgent';
      triggerReason = `Immediate Safety Interrupt: PHQ-9 Item 9 score is ${item9Score} (> 0)`;
      isSafetyAlert = true;
    } else if (phq9Score >= 10 || gad7Score >= 10) {
      wellbeingLevel = 'High';
      triggerReason = `High threshold reached (PHQ-9: ${phq9Score} ${phq9Score >= 10 ? '>= 10' : ''}, GAD-7: ${gad7Score} ${gad7Score >= 10 ? '>= 10' : ''})`;
    } else if (phq9Score >= 5 || gad7Score >= 5) {
      wellbeingLevel = 'Moderate';
      triggerReason = `Moderate threshold reached (PHQ-9: ${phq9Score}, GAD-7: ${gad7Score})`;
    }

    let returnPace: 'Pause: safety first' | 'Care first' | 'Gradual return' | 'Ready to return' = 'Ready to return';
    if (wellbeingLevel === 'Urgent') {
      returnPace = 'Pause: safety first';
    } else if (wellbeingLevel === 'High') {
      returnPace = 'Care first';
    } else if (wellbeingLevel === 'Moderate' || supportLevel === 'Limited') {
      returnPace = 'Gradual return';
    } else {
      returnPace = 'Ready to return';
    }

    return {
      instrumentType: 'phq9_gad7',
      phq9Score,
      phq9Band,
      gad7Score,
      gad7Band,
      wellbeingLevel,
      triggerReason,
      supportAverage,
      supportLevel,
      returnPace,
      isSafetyAlert,
    };
  }
}

export interface CareerMatchResult {
  role: CareerRole;
  skillsScore: number;
  interestsScore: number;
  fitScore: number;
  overallScore: number;
  skillGaps: string[];
  libraryIndex: number;
}

export function matchCareers(
  userSkills: Record<string, number>, // 1-5
  userInterests: Record<string, number>, // 1-5
  workNeeds: {
    homeWorking?: string; // Yes / No
    hours?: string; // "Under 15 hours a week" | "15–30 hours a week" | "Over 30 hours a week"
    flexibleHours?: string; // Yes / No
  }
): CareerMatchResult[] {
  const results: CareerMatchResult[] = seedData.careers.map((role, libraryIndex) => {
    // 1. Skills match = round( Σ(her skill rating × role weight) ÷ (5 × Σ role weights) × 100 )
    let weightedSum = 0;
    let totalWeight = 0;

    Object.entries(role.skillWeights).forEach(([skillName, weight]) => {
      const userRating = userSkills[skillName] ?? 3; // default 3 if not set
      weightedSum += userRating * weight;
      totalWeight += weight;
    });

    const skillsScore = totalWeight > 0 ? Math.round((weightedSum / (5 * totalWeight)) * 100) : 0;

    // 2. Interests match = round( her rating for the role's interest area ÷ 5 × 100 )
    const interestRating = userInterests[role.interestArea] ?? 3;
    const interestsScore = Math.round((interestRating / 5) * 100);

    // 3. Fit = max(0, 100
    //    - 50 if she needs home-working and the role isn't remote
    //    - 40 if she can work under 30 hours and the role has no part-time option
    //    - 30 if she needs flexible hours and the role isn't flexible)
    let penalty = 0;
    if (workNeeds.homeWorking === 'Yes' && !role.remote) {
      penalty += 50;
    }
    const isUnder30Hours =
      workNeeds.hours === 'Under 15 hours a week' || workNeeds.hours === '15–30 hours a week';
    if (isUnder30Hours && !role.partTime) {
      penalty += 40;
    }
    if (workNeeds.flexibleHours === 'Yes' && !role.flexible) {
      penalty += 30;
    }

    const fitScore = Math.max(0, 100 - penalty);

    // 4. Overall = round(0.45 × skills + 0.30 × interests + 0.25 × fit)
    const overallScore = Math.round(0.45 * skillsScore + 0.30 * interestsScore + 0.25 * fitScore);

    // Skill gaps for role = skills where role weight >= 2 and her rating <= 2
    const gaps: string[] = [];
    Object.entries(role.skillWeights).forEach(([skillName, weight]) => {
      const userRating = userSkills[skillName] ?? 3;
      if (weight >= 2 && userRating <= 2) {
        gaps.push(skillName);
      }
    });

    return {
      role,
      skillsScore,
      interestsScore,
      fitScore,
      overallScore,
      skillGaps: gaps,
      libraryIndex,
    };
  });

  // Sort descending by overallScore, breaking ties by libraryIndex ascending (library order)
  results.sort((a, b) => {
    if (b.overallScore !== a.overallScore) {
      return b.overallScore - a.overallScore;
    }
    return a.libraryIndex - b.libraryIndex;
  });

  return results;
}
