import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.NODE_ENV === 'production' && process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Helper to initialize Google GenAI lazily
function getAiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const SKILLS_LIST = [
  'Communication',
  'Caring & empathy',
  'Organisation & planning',
  'Numbers & money',
  'Basic digital (email, documents, phone apps)',
  'Advanced digital or technical',
  'Creativity & design',
  'Teaching & training',
  'Sales & persuasion',
  'Leading people',
];

// API 1: Skills from lived experience (Gemini suggestion, user must confirm)
// Non-negotiable: Accepts only the user's typed experience story. Never receives wellbeing/health data.
app.post('/api/suggest-skills', async (req, res) => {
  try {
    const { experience } = req.body;
    if (!experience || typeof experience !== 'string' || experience.trim().length === 0) {
      return res.status(400).json({ error: 'Experience description is required.' });
    }

    const ai = getAiClient();
    if (!ai) {
      return res.status(503).json({ error: 'Gemini API key is not configured.' });
    }

    const prompt = `A woman returning to work shared this personal story of what she is proud of (across work, home, family, or community):
"${experience.trim()}"

Based ONLY on this lived experience description, suggest a reasonable proficiency rating (integer from 1 to 5, where 1=Not yet, 2=Some, 3=Good, 4=Strong, 5=Expert) for each of these 10 specific skills, along with a brief one-line reason (under 15 words) citing what in her story reflects that rating:
${SKILLS_LIST.map((s, idx) => `${idx + 1}. ${s}`).join('\n')}

Be generous and encouraging in recognizing caregiving, home management, resilience, and community work as valid skills, but keep ratings realistic (mostly 2 to 4 unless strong evidence). Return an array of all 10 skills.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'You are an empathetic career mentor assessing transferable skills from women and mothers. You output structured JSON only.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              skill: { type: Type.STRING },
              rating: { type: Type.INTEGER, description: 'Rating 1 to 5' },
              reason: { type: Type.STRING, description: 'One-line reason under 15 words' },
            },
            required: ['skill', 'rating', 'reason'],
          },
        },
      },
    });

    const text = response.text || '[]';
    const parsed = JSON.parse(text);
    return res.json({ suggestions: parsed });
  } catch (err: any) {
    console.error('Error generating skills suggestion:', err);
    return res.status(500).json({
      error: 'Failed to generate skills suggestion.',
      details: err?.message || String(err),
    });
  }
});

// API 2: Plan narrative
// Non-negotiable: Receives ONLY career parameters (firstName, paceName, topRole, skillGaps, planSteps).
// NEVER receives health answers or wellbeing scores.
app.post('/api/plan-narrative', async (req, res) => {
  try {
    const { firstName, paceName, topRole, skillGaps, planSteps } = req.body;

    if (!topRole || !paceName) {
      return res.status(400).json({ error: 'topRole and paceName are required.' });
    }

    const ai = getAiClient();
    if (!ai) {
      return res.status(503).json({ error: 'Gemini API key is not configured.' });
    }

    const greeting = firstName ? `for ${firstName}` : 'for her';
    const gapsList = Array.isArray(skillGaps) && skillGaps.length > 0 ? skillGaps.join(', ') : 'none identified yet';
    const stepsSummary = Array.isArray(planSteps) ? planSteps.join('; ') : '';

    const prompt = `Write a warm, plain-language paragraph introducing a 24-week return-to-work plan ${greeting}.
Key plan details:
- Top career match: ${topRole}
- Return pace: ${paceName}
- Key skills to build: ${gapsList}
- Plan overview: ${stepsSummary}

STRICT CONSTRAINTS:
1. Maximum 120 words.
2. Tone: warm, respectful, plain, practical and encouraging. Short sentences.
3. Absolutely DO NOT change the return pace (${paceName}).
4. Absolutely DO NOT add medical, clinical, psychiatric or therapy advice.
5. Absolutely DO NOT mention any screening scores, questionnaire numbers, or clinical terms.
6. Focus on honoring her existing strengths, taking gradual manageable steps, and pacing herself.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'You are an AI career guide. You speak warmly, concisely, and practically to women returning to work. Never give medical advice or diagnose.',
      },
    });

    const narrative = response.text?.trim() || '';
    return res.json({ narrative });
  } catch (err: any) {
    console.error('Error generating plan narrative:', err);
    return res.status(500).json({
      error: 'Failed to generate plan narrative.',
      details: err?.message || String(err),
    });
  }
});

// Vite middleware or static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Wellness Conversations for working mothers server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
