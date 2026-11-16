export interface Option {
  label: string;
  score: number;
}

export interface EpdsItem {
  n: number;
  text: string;
  options: Option[];
  safetyItem: boolean;
}

export interface SimpleItem {
  n: number;
  text: string;
  safetyItem?: boolean;
}

export interface LifeItem {
  id: string;
  text: string;
  reversed: boolean;
}

export interface BandItem {
  from: number;
  band: string;
}

export interface WellbeingGuidanceItem {
  level: 'Urgent' | 'High' | 'Moderate' | 'Low';
  message: string;
  serviceAction: string;
  status: string;
}

export interface CrisisContact {
  country: string;
  crisisLine: string;
  emergency: string;
  referralPoint: string;
}

export interface PacePhase {
  weeks: string;
  steps: string;
}

export interface Pace {
  name: string;
  description: string;
  phases: PacePhase[];
}

export interface CareerRole {
  role: string;
  interestArea: string;
  skillWeights: Record<string, number>;
  remote: boolean;
  partTime: boolean;
  flexible: boolean;
  firstStep: string;
  skillBuilding: string;
}

export const seedData = {
  "instruments": {
    "epds": {
      "stem": "In the past 7 days:",
      "attribution": "Edinburgh Postnatal Depression Scale (EPDS). Source: Cox, J.L., Holden, J.M., and Sagovsky, R. 1987. Detection of postnatal depression: Development of the 10-item Edinburgh Postnatal Depression Scale. British Journal of Psychiatry 150:782-786. May be reproduced without permission provided the authors, title and source are cited in all copies.",
      "items": [
        {
          "n": 1,
          "text": "I have been able to laugh and see the funny side of things",
          "options": [
            {
              "label": "As much as I always could",
              "score": 0
            },
            {
              "label": "Not quite so much now",
              "score": 1
            },
            {
              "label": "Definitely not so much now",
              "score": 2
            },
            {
              "label": "Not at all",
              "score": 3
            }
          ],
          "safetyItem": false
        },
        {
          "n": 2,
          "text": "I have looked forward with enjoyment to things",
          "options": [
            {
              "label": "As much as I ever did",
              "score": 0
            },
            {
              "label": "Rather less than I used to",
              "score": 1
            },
            {
              "label": "Definitely less than I used to",
              "score": 2
            },
            {
              "label": "Hardly at all",
              "score": 3
            }
          ],
          "safetyItem": false
        },
        {
          "n": 3,
          "text": "I have blamed myself unnecessarily when things went wrong",
          "options": [
            {
              "label": "Yes, most of the time",
              "score": 3
            },
            {
              "label": "Yes, some of the time",
              "score": 2
            },
            {
              "label": "Not very often",
              "score": 1
            },
            {
              "label": "No, never",
              "score": 0
            }
          ],
          "safetyItem": false
        },
        {
          "n": 4,
          "text": "I have been anxious or worried for no good reason",
          "options": [
            {
              "label": "No, not at all",
              "score": 0
            },
            {
              "label": "Hardly ever",
              "score": 1
            },
            {
              "label": "Yes, sometimes",
              "score": 2
            },
            {
              "label": "Yes, very often",
              "score": 3
            }
          ],
          "safetyItem": false
        },
        {
          "n": 5,
          "text": "I have felt scared or panicky for no very good reason",
          "options": [
            {
              "label": "Yes, quite a lot",
              "score": 3
            },
            {
              "label": "Yes, sometimes",
              "score": 2
            },
            {
              "label": "No, not much",
              "score": 1
            },
            {
              "label": "No, not at all",
              "score": 0
            }
          ],
          "safetyItem": false
        },
        {
          "n": 6,
          "text": "Things have been getting on top of me",
          "options": [
            {
              "label": "Yes, most of the time I haven't been able to cope at all",
              "score": 3
            },
            {
              "label": "Yes, sometimes I haven't been coping as well as usual",
              "score": 2
            },
            {
              "label": "No, most of the time I have coped quite well",
              "score": 1
            },
            {
              "label": "No, I have been coping as well as ever",
              "score": 0
            }
          ],
          "safetyItem": false
        },
        {
          "n": 7,
          "text": "I have been so unhappy that I have had difficulty sleeping",
          "options": [
            {
              "label": "Yes, most of the time",
              "score": 3
            },
            {
              "label": "Yes, sometimes",
              "score": 2
            },
            {
              "label": "Not very often",
              "score": 1
            },
            {
              "label": "No, not at all",
              "score": 0
            }
          ],
          "safetyItem": false
        },
        {
          "n": 8,
          "text": "I have felt sad or miserable",
          "options": [
            {
              "label": "Yes, most of the time",
              "score": 3
            },
            {
              "label": "Yes, quite often",
              "score": 2
            },
            {
              "label": "Not very often",
              "score": 1
            },
            {
              "label": "No, not at all",
              "score": 0
            }
          ],
          "safetyItem": false
        },
        {
          "n": 9,
          "text": "I have been so unhappy that I have been crying",
          "options": [
            {
              "label": "Yes, most of the time",
              "score": 3
            },
            {
              "label": "Yes, quite often",
              "score": 2
            },
            {
              "label": "Only occasionally",
              "score": 1
            },
            {
              "label": "No, never",
              "score": 0
            }
          ],
          "safetyItem": false
        },
        {
          "n": 10,
          "text": "The thought of harming myself has occurred to me",
          "options": [
            {
              "label": "Yes, quite often",
              "score": 3
            },
            {
              "label": "Sometimes",
              "score": 2
            },
            {
              "label": "Hardly ever",
              "score": 1
            },
            {
              "label": "Never",
              "score": 0
            }
          ],
          "safetyItem": true
        }
      ]
    },
    "phq9": {
      "stem": "Over the last 2 weeks, how often have you been bothered by the following problems?",
      "attribution": "PHQ-9 and GAD-7. Developed by Drs. Robert L. Spitzer, Janet B.W. Williams, Kurt Kroenke and colleagues, with an educational grant from Pfizer Inc. No permission required to reproduce, translate, display or distribute.",
      "items": [
        {
          "n": 1,
          "text": "Little interest or pleasure in doing things",
          "safetyItem": false
        },
        {
          "n": 2,
          "text": "Feeling down, depressed, or hopeless",
          "safetyItem": false
        },
        {
          "n": 3,
          "text": "Trouble falling or staying asleep, or sleeping too much",
          "safetyItem": false
        },
        {
          "n": 4,
          "text": "Feeling tired or having little energy",
          "safetyItem": false
        },
        {
          "n": 5,
          "text": "Poor appetite or overeating",
          "safetyItem": false
        },
        {
          "n": 6,
          "text": "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
          "safetyItem": false
        },
        {
          "n": 7,
          "text": "Trouble concentrating on things, such as reading the newspaper or watching television",
          "safetyItem": false
        },
        {
          "n": 8,
          "text": "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
          "safetyItem": false
        },
        {
          "n": 9,
          "text": "Thoughts that you would be better off dead or of hurting yourself in some way",
          "safetyItem": true
        }
      ]
    },
    "gad7": {
      "stem": "Over the last 2 weeks, how often have you been bothered by the following problems?",
      "attribution": "PHQ-9 and GAD-7. Developed by Drs. Robert L. Spitzer, Janet B.W. Williams, Kurt Kroenke and colleagues, with an educational grant from Pfizer Inc. No permission required to reproduce, translate, display or distribute.",
      "items": [
        {
          "n": 1,
          "text": "Feeling nervous, anxious or on edge"
        },
        {
          "n": 2,
          "text": "Not being able to stop or control worrying"
        },
        {
          "n": 3,
          "text": "Worrying too much about different things"
        },
        {
          "n": 4,
          "text": "Trouble relaxing"
        },
        {
          "n": 5,
          "text": "Being so restless that it is hard to sit still"
        },
        {
          "n": 6,
          "text": "Becoming easily annoyed or irritable"
        },
        {
          "n": 7,
          "text": "Feeling afraid as if something awful might happen"
        }
      ]
    },
    "frequencyOptions": [
      {
        "label": "Not at all",
        "score": 0
      },
      {
        "label": "Several days",
        "score": 1
      },
      {
        "label": "More than half the days",
        "score": 2
      },
      {
        "label": "Nearly every day",
        "score": 3
      }
    ]
  },
  "bands": {
    "epds": [
      {
        "from": 0,
        "band": "Low"
      },
      {
        "from": 10,
        "band": "Possible"
      },
      {
        "from": 13,
        "band": "Probable"
      }
    ],
    "phq9": [
      {
        "from": 0,
        "band": "Minimal"
      },
      {
        "from": 5,
        "band": "Mild"
      },
      {
        "from": 10,
        "band": "Moderate"
      },
      {
        "from": 15,
        "band": "Moderately severe"
      },
      {
        "from": 20,
        "band": "Severe"
      }
    ],
    "gad7": [
      {
        "from": 0,
        "band": "Minimal"
      },
      {
        "from": 5,
        "band": "Mild"
      },
      {
        "from": 10,
        "band": "Moderate"
      },
      {
        "from": 15,
        "band": "Severe"
      }
    ],
    "support": [
      {
        "from": 0,
        "band": "Limited"
      },
      {
        "from": 3,
        "band": "Some"
      },
      {
        "from": 4,
        "band": "Strong"
      }
    ],
    "note": "Commonly used cut-offs; to be confirmed by the clinical lead for the pilot population."
  },
  "lifeAndSupport": {
    "scale": [
      {
        "label": "Strongly disagree",
        "value": 1
      },
      {
        "label": "Disagree",
        "value": 2
      },
      {
        "label": "Not sure",
        "value": 3
      },
      {
        "label": "Agree",
        "value": 4
      },
      {
        "label": "Strongly agree",
        "value": 5
      }
    ],
    "items": [
      {
        "id": "L1",
        "text": "I have someone I can rely on for practical help with childcare or home responsibilities.",
        "reversed": false
      },
      {
        "id": "L2",
        "text": "I have someone I can talk to openly about how I feel.",
        "reversed": false
      },
      {
        "id": "L3",
        "text": "I have reliable childcare, or a clear plan for it, if I return to work.",
        "reversed": false
      },
      {
        "id": "L4",
        "text": "The changes in my life in recent months feel manageable.",
        "reversed": false
      },
      {
        "id": "L5",
        "text": "The expectations I have of myself right now feel realistic.",
        "reversed": false
      },
      {
        "id": "L6",
        "text": "I am getting enough rest to manage day to day.",
        "reversed": false
      },
      {
        "id": "L7",
        "text": "Money worries are causing me a lot of stress.",
        "reversed": true
      },
      {
        "id": "L8",
        "text": "I feel pressure from family or others about when I return to work.",
        "reversed": true
      }
    ],
    "note": "Non-clinical, not validated; used only for support level and pace."
  },
  "wellbeingGuidance": [
    {
      "level": "Urgent" as const,
      "message": "You mentioned thoughts of harming yourself. You deserve support right now, and you do not have to manage this alone. Please contact [crisis line — to be confirmed by clinical lead] or go to the nearest health facility today. If you are in immediate danger, call [emergency number].",
      "serviceAction": "Show crisis contacts immediately; offer same-day referral to partner clinician; pause career planning.",
      "status": "DRAFT - pending clinical approval"
    },
    {
      "level": "High" as const,
      "message": "Your answers suggest you may be having symptoms that deserve professional attention. This is common, and it is treatable. Please speak to a health worker or doctor within the next week.",
      "serviceAction": "Offer referral to partner clinician within 7 days; suggest repeating the check after speaking to a professional.",
      "status": "DRAFT - pending clinical approval"
    },
    {
      "level": "Moderate" as const,
      "message": "Some of your answers suggest you are under real strain. Many women feel this way after big life changes. Talking to a health worker or someone you trust can help, and so can small steps for rest and support.",
      "serviceAction": "Suggest talking to a health worker; share vetted self-care steps; repeat the check in 2 weeks.",
      "status": "DRAFT - pending clinical approval"
    },
    {
      "level": "Low" as const,
      "message": "Your answers suggest you are coping well right now. Keep doing what helps: rest when you can, stay connected with people you trust, and check in again in about a month.",
      "serviceAction": "Share vetted self-care steps; repeat the check in 4 weeks.",
      "status": "DRAFT - pending clinical approval"
    }
  ],
  "selfCare": [
    "Rest when you can, and accept practical help with the baby or home when it is offered.",
    "Talk regularly with someone you trust about how you are feeling.",
    "Eat regular meals and drink enough water, even when busy.",
    "Spend a little time outdoors or moving gently each day if you can.",
    "Lower the bar: it is okay if not everything gets done.",
    "Join a mothers' or community group to share experiences."
  ],
  "crisisContacts": [
    {
      "country": "Kenya",
      "crisisLine": "[to be confirmed]",
      "emergency": "[to be confirmed]",
      "referralPoint": "[to be confirmed]"
    },
    {
      "country": "Nigeria",
      "crisisLine": "[to be confirmed]",
      "emergency": "[to be confirmed]",
      "referralPoint": "[to be confirmed]"
    }
  ],
  "paces": [
    {
      "name": "Pause: safety first",
      "description": "Your wellbeing comes first. We have paused career planning so you can focus on getting support now. You can return to it whenever you are ready.",
      "phases": [
        {
          "weeks": "Now",
          "steps": "Get support today: contact the crisis line or a health facility."
        },
        {
          "weeks": "Now",
          "steps": "Let someone you trust know how you are feeling."
        },
        {
          "weeks": "Now",
          "steps": "Come back to career planning once you and your health worker feel ready."
        }
      ]
    },
    {
      "name": "Care first",
      "description": "Focus on your wellbeing first, with light preparation for work only when you feel able.",
      "phases": [
        {
          "weeks": "Weeks 1–4",
          "steps": "Weeks 1–4: Speak to a health worker and agree what support you need. Keep career tasks very light: update one line of your CV, or note one role that interests you."
        },
        {
          "weeks": "Weeks 5–12",
          "steps": "Weeks 5–12: As you feel stronger, explore your top path: talk to one person who does this work, or try one short free lesson. Repeat the wellbeing check."
        },
        {
          "weeks": "Weeks 13–24",
          "steps": "Weeks 13–24: If your wellbeing check improves, move to a gradual return plan with flexible or part-time options."
        }
      ]
    },
    {
      "name": "Gradual return",
      "description": "Return step by step, starting flexible or part-time, building confidence and skills as you go.",
      "phases": [
        {
          "weeks": "Weeks 1–4",
          "steps": "Weeks 1–4: Update your CV and profiles; reconnect with three former colleagues or contacts; confirm childcare arrangements."
        },
        {
          "weeks": "Weeks 5–12",
          "steps": "Weeks 5–12: Take one short course for your top skill gap; apply for part-time, flexible or project roles; practise interviews."
        },
        {
          "weeks": "Weeks 13–24",
          "steps": "Weeks 13–24: Start in a part-time or flexible role; review workload and wellbeing monthly; increase hours only if it feels right."
        }
      ]
    },
    {
      "name": "Ready to return",
      "description": "You are in a good place to plan a full return, while keeping an eye on your wellbeing.",
      "phases": [
        {
          "weeks": "Weeks 1–4",
          "steps": "Weeks 1–4: Update your CV and profiles; reconnect with your network; confirm childcare and a back-up plan."
        },
        {
          "weeks": "Weeks 5–12",
          "steps": "Weeks 5–12: Close your top skill gaps; apply for full-time or flexible roles; negotiate flexible terms where possible."
        },
        {
          "weeks": "Weeks 13–24",
          "steps": "Weeks 13–24: Start your role; check your wellbeing monthly; plan your next development step."
        }
      ]
    }
  ],
  "profileOptions": {
    "country": [
      "Kenya",
      "Nigeria",
      "Other"
    ],
    "ageGroup": [
      "Under 18",
      "18–24",
      "25–34",
      "35–44",
      "45+"
    ],
    "monthsSinceBirth": [
      "0–3 months",
      "4–6 months",
      "7–12 months"
    ],
    "workSituation": [
      "On maternity leave",
      "On a career break",
      "Working",
      "Looking for work"
    ],
    "careerBreak": [
      "Less than 6 months",
      "6–12 months",
      "1–3 years",
      "More than 3 years"
    ]
  },
  "skills": [
    "Communication",
    "Caring & empathy",
    "Organisation & planning",
    "Numbers & money",
    "Basic digital (email, documents, phone apps)",
    "Advanced digital or technical",
    "Creativity & design",
    "Teaching & training",
    "Sales & persuasion",
    "Leading people"
  ],
  "skillScale": [
    {
      "label": "1 – Not yet",
      "value": 1
    },
    {
      "label": "2 – Some",
      "value": 2
    },
    {
      "label": "3 – Good",
      "value": 3
    },
    {
      "label": "4 – Strong",
      "value": 4
    },
    {
      "label": "5 – Expert",
      "value": 5
    }
  ],
  "interests": [
    {
      "name": "Helping & caring",
      "description": "Supporting people's health, wellbeing or development"
    },
    {
      "name": "Organising",
      "description": "Planning, coordinating, keeping things in order"
    },
    {
      "name": "Creating",
      "description": "Writing, designing, making content or products"
    },
    {
      "name": "Analysing",
      "description": "Working with information, numbers and problems"
    },
    {
      "name": "Practical & hands-on",
      "description": "Making, fixing, growing or producing things"
    },
    {
      "name": "Leading & persuading",
      "description": "Selling, influencing, starting or running something"
    }
  ],
  "interestScale": [
    {
      "label": "1 – Not for me",
      "value": 1
    },
    {
      "label": "2 – A little",
      "value": 2
    },
    {
      "label": "3 – Somewhat",
      "value": 3
    },
    {
      "label": "4 – Quite a lot",
      "value": 4
    },
    {
      "label": "5 – Very much",
      "value": 5
    }
  ],
  "workNeeds": {
    "homeWorking": [
      "Yes",
      "No"
    ],
    "hours": [
      "Under 15 hours a week",
      "15–30 hours a week",
      "Over 30 hours a week"
    ],
    "flexibleHours": [
      "Yes",
      "No"
    ]
  },
  "careers": [
    {
      "role": "Community health promoter",
      "interestArea": "Helping & caring",
      "skillWeights": {
        "Communication": 3,
        "Caring & empathy": 3,
        "Organisation & planning": 2,
        "Numbers & money": 1,
        "Basic digital (email, documents, phone apps)": 1,
        "Advanced digital or technical": 0,
        "Creativity & design": 0,
        "Teaching & training": 2,
        "Sales & persuasion": 1,
        "Leading people": 1
      },
      "remote": false,
      "partTime": true,
      "flexible": true,
      "firstStep": "Contact your county or local health office about community health roles.",
      "skillBuilding": "Short course in community health or first aid."
    },
    {
      "role": "Early childhood teacher or caregiver",
      "interestArea": "Helping & caring",
      "skillWeights": {
        "Communication": 3,
        "Caring & empathy": 3,
        "Organisation & planning": 2,
        "Numbers & money": 0,
        "Basic digital (email, documents, phone apps)": 1,
        "Advanced digital or technical": 0,
        "Creativity & design": 2,
        "Teaching & training": 3,
        "Sales & persuasion": 0,
        "Leading people": 1
      },
      "remote": false,
      "partTime": true,
      "flexible": false,
      "firstStep": "Visit two local schools or day-care centres and ask about openings.",
      "skillBuilding": "Certificate in early childhood development."
    },
    {
      "role": "Online tutor",
      "interestArea": "Helping & caring",
      "skillWeights": {
        "Communication": 3,
        "Caring & empathy": 2,
        "Organisation & planning": 2,
        "Numbers & money": 1,
        "Basic digital (email, documents, phone apps)": 2,
        "Advanced digital or technical": 1,
        "Creativity & design": 1,
        "Teaching & training": 3,
        "Sales & persuasion": 0,
        "Leading people": 0
      },
      "remote": true,
      "partTime": true,
      "flexible": true,
      "firstStep": "Create a tutoring profile listing your subjects and set your hours.",
      "skillBuilding": "Short course in online teaching tools."
    },
    {
      "role": "Virtual or administrative assistant",
      "interestArea": "Organising",
      "skillWeights": {
        "Communication": 2,
        "Caring & empathy": 0,
        "Organisation & planning": 3,
        "Numbers & money": 1,
        "Basic digital (email, documents, phone apps)": 3,
        "Advanced digital or technical": 1,
        "Creativity & design": 0,
        "Teaching & training": 0,
        "Sales & persuasion": 0,
        "Leading people": 0
      },
      "remote": true,
      "partTime": true,
      "flexible": true,
      "firstStep": "Offer admin support to two small businesses or NGOs you know.",
      "skillBuilding": "Course in office software and online productivity tools."
    },
    {
      "role": "Bookkeeper or accounts assistant",
      "interestArea": "Analysing",
      "skillWeights": {
        "Communication": 1,
        "Caring & empathy": 0,
        "Organisation & planning": 2,
        "Numbers & money": 3,
        "Basic digital (email, documents, phone apps)": 2,
        "Advanced digital or technical": 1,
        "Creativity & design": 0,
        "Teaching & training": 0,
        "Sales & persuasion": 0,
        "Leading people": 0
      },
      "remote": true,
      "partTime": true,
      "flexible": true,
      "firstStep": "Offer bookkeeping to one small business to build a recent reference.",
      "skillBuilding": "Bookkeeping or accounting software certificate."
    },
    {
      "role": "Customer support agent",
      "interestArea": "Organising",
      "skillWeights": {
        "Communication": 3,
        "Caring & empathy": 2,
        "Organisation & planning": 1,
        "Numbers & money": 0,
        "Basic digital (email, documents, phone apps)": 2,
        "Advanced digital or technical": 1,
        "Creativity & design": 0,
        "Teaching & training": 0,
        "Sales & persuasion": 1,
        "Leading people": 0
      },
      "remote": true,
      "partTime": true,
      "flexible": false,
      "firstStep": "Apply to two companies hiring remote or shift-based support agents.",
      "skillBuilding": "Customer service skills course."
    },
    {
      "role": "Social media or content manager",
      "interestArea": "Creating",
      "skillWeights": {
        "Communication": 3,
        "Caring & empathy": 0,
        "Organisation & planning": 2,
        "Numbers & money": 0,
        "Basic digital (email, documents, phone apps)": 2,
        "Advanced digital or technical": 1,
        "Creativity & design": 3,
        "Teaching & training": 0,
        "Sales & persuasion": 2,
        "Leading people": 0
      },
      "remote": true,
      "partTime": true,
      "flexible": true,
      "firstStep": "Build a small portfolio by running social media for one local business.",
      "skillBuilding": "Digital marketing short course."
    },
    {
      "role": "Graphic designer",
      "interestArea": "Creating",
      "skillWeights": {
        "Communication": 1,
        "Caring & empathy": 0,
        "Organisation & planning": 1,
        "Numbers & money": 0,
        "Basic digital (email, documents, phone apps)": 2,
        "Advanced digital or technical": 2,
        "Creativity & design": 3,
        "Teaching & training": 0,
        "Sales & persuasion": 1,
        "Leading people": 0
      },
      "remote": true,
      "partTime": true,
      "flexible": true,
      "firstStep": "Put five of your designs into an online portfolio.",
      "skillBuilding": "Design software course."
    },
    {
      "role": "Junior web or software developer",
      "interestArea": "Analysing",
      "skillWeights": {
        "Communication": 1,
        "Caring & empathy": 0,
        "Organisation & planning": 2,
        "Numbers & money": 1,
        "Basic digital (email, documents, phone apps)": 2,
        "Advanced digital or technical": 3,
        "Creativity & design": 1,
        "Teaching & training": 0,
        "Sales & persuasion": 0,
        "Leading people": 0
      },
      "remote": true,
      "partTime": true,
      "flexible": true,
      "firstStep": "Build one small project and share it online.",
      "skillBuilding": "Coding bootcamp or structured online course."
    },
    {
      "role": "Data or research assistant",
      "interestArea": "Analysing",
      "skillWeights": {
        "Communication": 2,
        "Caring & empathy": 0,
        "Organisation & planning": 2,
        "Numbers & money": 2,
        "Basic digital (email, documents, phone apps)": 2,
        "Advanced digital or technical": 2,
        "Creativity & design": 0,
        "Teaching & training": 0,
        "Sales & persuasion": 0,
        "Leading people": 0
      },
      "remote": true,
      "partTime": true,
      "flexible": true,
      "firstStep": "Offer data collection or analysis support to a local research or NGO team.",
      "skillBuilding": "Course in spreadsheets and data analysis."
    },
    {
      "role": "Programme or project officer (NGO)",
      "interestArea": "Organising",
      "skillWeights": {
        "Communication": 3,
        "Caring & empathy": 1,
        "Organisation & planning": 3,
        "Numbers & money": 1,
        "Basic digital (email, documents, phone apps)": 2,
        "Advanced digital or technical": 0,
        "Creativity & design": 0,
        "Teaching & training": 1,
        "Sales & persuasion": 1,
        "Leading people": 2
      },
      "remote": false,
      "partTime": false,
      "flexible": true,
      "firstStep": "Reconnect with NGOs you know and ask about upcoming programmes.",
      "skillBuilding": "Project management short course."
    },
    {
      "role": "HR or recruitment assistant",
      "interestArea": "Organising",
      "skillWeights": {
        "Communication": 3,
        "Caring & empathy": 2,
        "Organisation & planning": 3,
        "Numbers & money": 0,
        "Basic digital (email, documents, phone apps)": 2,
        "Advanced digital or technical": 0,
        "Creativity & design": 0,
        "Teaching & training": 1,
        "Sales & persuasion": 1,
        "Leading people": 1
      },
      "remote": false,
      "partTime": true,
      "flexible": true,
      "firstStep": "Join a professional HR network and attend one event.",
      "skillBuilding": "HR or recruitment certificate."
    },
    {
      "role": "Sales or business development",
      "interestArea": "Leading & persuading",
      "skillWeights": {
        "Communication": 3,
        "Caring & empathy": 1,
        "Organisation & planning": 1,
        "Numbers & money": 1,
        "Basic digital (email, documents, phone apps)": 1,
        "Advanced digital or technical": 0,
        "Creativity & design": 0,
        "Teaching & training": 0,
        "Sales & persuasion": 3,
        "Leading people": 1
      },
      "remote": false,
      "partTime": true,
      "flexible": true,
      "firstStep": "List ten people or businesses who might need what you could sell.",
      "skillBuilding": "Sales and negotiation course."
    },
    {
      "role": "Small business owner (food, tailoring, retail)",
      "interestArea": "Leading & persuading",
      "skillWeights": {
        "Communication": 2,
        "Caring & empathy": 1,
        "Organisation & planning": 2,
        "Numbers & money": 2,
        "Basic digital (email, documents, phone apps)": 1,
        "Advanced digital or technical": 0,
        "Creativity & design": 2,
        "Teaching & training": 0,
        "Sales & persuasion": 3,
        "Leading people": 1
      },
      "remote": false,
      "partTime": true,
      "flexible": true,
      "firstStep": "Test your idea by selling to ten customers in your network.",
      "skillBuilding": "Small business or entrepreneurship course."
    },
    {
      "role": "Agribusiness or urban farming",
      "interestArea": "Practical & hands-on",
      "skillWeights": {
        "Communication": 1,
        "Caring & empathy": 0,
        "Organisation & planning": 2,
        "Numbers & money": 2,
        "Basic digital (email, documents, phone apps)": 1,
        "Advanced digital or technical": 0,
        "Creativity & design": 0,
        "Teaching & training": 0,
        "Sales & persuasion": 2,
        "Leading people": 1
      },
      "remote": false,
      "partTime": true,
      "flexible": true,
      "firstStep": "Visit a local farmers' group or cooperative to learn about markets.",
      "skillBuilding": "Agribusiness or value-addition training."
    }
  ]
};
