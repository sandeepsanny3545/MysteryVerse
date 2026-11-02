import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';

// Zod Schema to strictly validate Gemini-generated mystery
export const GeminiMysteryResponseSchema = z.object({
  title: z.string().min(3),
  story: z.string().min(20),
  suspects: z.array(z.object({
    id: z.string().min(1),
    name: z.string().min(2),
    role: z.string().min(2),
    alibi: z.string().min(5),
    statement: z.string().min(5),
    initialStress: z.coerce.number().min(0).max(100).optional().default(25),
    behavioralTell: z.string().optional().default('Nervously shifts weight and avoids eye contact.'),
    avatar: z.string().optional()
  })),
  clues: z.array(z.object({
    id: z.string().min(1),
    title: z.string().min(2),
    category: z.string().optional().default('Physical Evidence'),
    location: z.string().min(2),
    description: z.string().min(5),
    forensicReport: z.string().min(5),
    isSmokingGun: z.boolean().optional().default(false)
  })),
  hints: z.array(z.object({
    id: z.union([
      z.number().int(),
      z.string().transform(val => {
        const parsed = parseInt(val.replace(/\D/g, ''), 10);
        return isNaN(parsed) ? 1 : parsed;
      })
    ]),
    title: z.string().min(2),
    content: z.string().min(5)
  })),
  culpritId: z.string().min(1),
  solutionExplanation: z.string().min(10)
});

// Required structure by difficulty level
export const DIFFICULTY_CONFIG = {
  Easy: { suspectsCount: 3, cluesCount: 5, hintsCount: 2 },
  Medium: { suspectsCount: 4, cluesCount: 7, hintsCount: 3 },
  Hard: { suspectsCount: 5, cluesCount: 9, hintsCount: 3 }
};

/**
 * Generate a complete mystery case using Google Gemini API with Zod validation.
 * Falls back gracefully to the procedural generator if API key is absent or API fails.
 */
export async function generateMysteryCase({ premise, difficulty = 'Medium' }) {
  const config = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.Medium;
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey.trim() && apiKey !== 'your_gemini_api_key_here') {
    try {
      console.log(`[Gemini] Calling Gemini API for difficulty: ${difficulty}...`);
      const ai = new GoogleGenAI({ apiKey });

      const prompt = `
You are the master crime novelist and forensic game designer for "MysteryVerse".
Create a cohesive, immersive murder mystery based on the following premise and difficulty.

PREMISE: "${premise || 'A high-profile locked-room crime in a secluded setting.'}"
DIFFICULTY: ${difficulty}

EXACT GENERATION REQUIREMENTS:
- Generate EXACTLY ${config.suspectsCount} distinct suspects.
- Generate EXACTLY ${config.cluesCount} forensic crime scene clues.
- Generate EXACTLY ${config.hintsCount} progressive detective hints (IDs: 1, 2, ...).
- Select EXACTLY ONE of the suspect IDs as the "culpritId".
- Provide a detailed "solutionExplanation" detailing the timeline, murder weapon/method, motive, and how the clues expose the culprit.

You MUST respond in valid JSON matching this schema:
{
  "title": "A captivating, atmospheric title",
  "story": "Detailed 2-3 paragraph background and incident report",
  "suspects": [
    {
      "id": "suspect-1",
      "name": "Full Name",
      "role": "Relationship/Occupation",
      "alibi": "Claimed alibi and whereabouts at time of crime",
      "statement": "Spoken quote when initially questioned",
      "initialStress": 25,
      "behavioralTell": "Physical tell or nervous reaction"
    }
  ],
  "clues": [
    {
      "id": "clue-1",
      "title": "Evidence Title",
      "category": "Toxicology / Weapon / Document / Digital / Forensic Trace",
      "location": "Where it was discovered",
      "description": "Initial physical observation",
      "forensicReport": "Detailed laboratory or forensic analysis findings",
      "isSmokingGun": true
    }
  ],
  "hints": [
    {
      "id": 1,
      "title": "Hint Title",
      "content": "Subtle clue directing the investigator without immediately revealing the killer"
    }
  ],
  "culpritId": "suspect-1",
  "solutionExplanation": "Complete canonical reveal explaining the killer's plan, motives, weapon, and how the clues prove guilt."
}
`;

      const response = await ai.models.generateContent({
        model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      let responseText = '';
      if (typeof response.text === 'function') {
        responseText = response.text();
      } else if (typeof response.text === 'string') {
        responseText = response.text;
      } else if (response.candidates?.[0]?.content?.parts?.[0]?.text) {
        responseText = response.candidates[0].content.parts[0].text;
      }

      if (responseText) {
        // Strip markdown backticks if present
        const cleaned = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
        let parsed;
        try {
          parsed = JSON.parse(cleaned);
        } catch (parseErr) {
          // If parsing failed due to unescaped control characters inside strings, sanitize them
          try {
            const sanitized = cleaned.replace(/"([^"\\]*(\\.[^"\\]*)*)"/gs, (match) => {
              return match
                .replace(/(?<!\\)\n/g, '\\n')
                .replace(/(?<!\\)\r/g, '\\r')
                .replace(/(?<!\\)\t/g, '\\t');
            });
            parsed = JSON.parse(sanitized);
          } catch {
            throw parseErr;
          }
        }

        // Zod validation
        const validated = GeminiMysteryResponseSchema.parse(parsed);

        // Ensure culpritId exists among suspects
        const suspectIds = validated.suspects.map(s => s.id);
        if (!suspectIds.includes(validated.culpritId)) {
          validated.culpritId = suspectIds[0];
        }

        // Map avatars and mark guilty suspect internally
        validated.suspects = validated.suspects.map((s, idx) => ({
          ...s,
          isGuilty: s.id === validated.culpritId,
          avatar: s.avatar || getCuratedAvatar(idx)
        }));

        console.log(`[Gemini] Successfully generated and validated mystery: "${validated.title}"`);
        return {
          ...validated,
          premise: premise || validated.title,
          difficulty
        };
      }
    } catch (err) {
      console.warn(`[Gemini] API generation error (${err.message}). Activating procedural generator fallback...`);
    }
  } else {
    console.log(`[Gemini] No GEMINI_API_KEY configured. Using procedural generator for "${difficulty}" case...`);
  }

  // Fallback procedural mystery generator that strictly adheres to the exact count and Zod schema
  return generateProceduralMystery(premise, difficulty, config);
}

// Curated avatar list for suspects
function getCuratedAvatar(index) {
  const avatars = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=500&q=80'
  ];
  return avatars[index % avatars.length];
}

/**
 * High-quality fallback generator producing cases that strictly conform to:
 * Easy: 3 suspects, 5 clues, 2 hints
 * Medium: 4 suspects, 7 clues, 3 hints
 * Hard: 5 suspects, 9 clues, 3 hints
 */
export function generateProceduralMystery(premise, difficulty, config) {
  const timestamp = Date.now();
  const caseThemes = [
    { title: 'The Obsidian Manor Enigma', setting: 'Obsidian Manor' },
    { title: 'The Gilded Cipher Poisoning', setting: 'Gilded Vault' },
    { title: 'The Silver Line Express Murder', setting: 'Silver Line Sleeper Carriage' },
    { title: 'The Midnight Gallery Homicide', setting: 'Belmont Art Gallery' }
  ];
  const theme = caseThemes[Math.floor(Math.random() * caseThemes.length)];

  const suspectsPool = [
    {
      id: 'suspect-1',
      name: 'Arthur Blackwood',
      role: 'Business Associate & Financial Trustee',
      alibi: 'Reviewing offshore merger accounts in the secondary library until midnight.',
      statement: 'I managed the investments, Detective, but I would never spill blood over ledgers.',
      initialStress: 75,
      behavioralTell: 'Avoids looking toward the study doorway; persistently twists a heavy gold signet ring.'
    },
    {
      id: 'suspect-2',
      name: 'Elena Rostova',
      role: 'Private Secretary & Head Archivist',
      alibi: 'Filing catalog records in the central hall.',
      statement: 'Everything appeared normal until the security alarms were triggered at 11:35 PM.',
      initialStress: 35,
      behavioralTell: 'Speaks with calculated calm, fingers tapping in strict rhythm.'
    },
    {
      id: 'suspect-3',
      name: 'Captain Vance',
      role: 'Chief of Security',
      alibi: 'Conducting perimeter security rounds on the ground floor.',
      statement: 'The perimeter remained secure. Whoever struck held authorized insider keycard access.',
      initialStress: 45,
      behavioralTell: 'Rigid military posture, glances nervously toward the security monitors.'
    },
    {
      id: 'suspect-4',
      name: 'Dr. Julian Sterling',
      role: 'Personal Physician',
      alibi: 'Preparing prescription dosages in the medical dispensary.',
      statement: 'I administered the evening cardiac treatment at 10:15 PM and retired to my quarters.',
      initialStress: 60,
      behavioralTell: 'Perspiration visible on brow; continually wipes spectacles with a monogrammed handkerchief.'
    },
    {
      id: 'suspect-5',
      name: 'Corinne Chen',
      role: 'Rival Collector & Beneficiary',
      alibi: 'Conversing with guests in the grand dining salon.',
      statement: 'We had commercial rivalries, but civilized people resolve disputes through contracts, not murder.',
      initialStress: 40,
      behavioralTell: 'Folds arms defensively and raises chin in defiance.'
    }
  ];

  const cluesPool = [
    {
      id: 'clue-1',
      title: 'Tainted Port Goblet',
      category: 'Toxicology',
      location: 'Victim\'s Study Desk',
      description: 'A heavy crystal goblet containing port wine residue and an oily chemical surface sheen.',
      forensicReport: 'Chemical analysis reveals concentrated potassium cyanide dissolved in the vintage port.',
      isSmokingGun: true
    },
    {
      id: 'clue-2',
      title: 'Monogrammed Signet Ring Imprint',
      category: 'Forensic Trace',
      location: 'Study Safe Handle',
      description: 'A fine brass transfer smudge on the polished chrome dial of the floor safe.',
      forensicReport: 'Metal residue and indentation match the custom signet ring worn by Arthur Blackwood.',
      isSmokingGun: true
    },
    {
      id: 'clue-3',
      title: 'Charred Financial Ledger Sheet',
      category: 'Document',
      location: 'Dispensary Hearth Grate',
      description: 'A half-burned balance sheet showing an unauthorized £120,000 transfer.',
      forensicReport: 'The transfer routed company liquidity into offshore accounts held under Blackwood\'s control.',
      isSmokingGun: false
    },
    {
      id: 'clue-4',
      title: 'Overridden Security Keycard Log',
      category: 'Digital Log',
      location: 'Central Security Terminal',
      description: 'Audit trail of timestamped electronic door unlock events.',
      forensicReport: 'Master administrative badge was swiped at the study door at 11:32 PM.',
      isSmokingGun: false
    },
    {
      id: 'clue-5',
      title: 'Coroner\'s Preliminary Report',
      category: 'Forensic Trace',
      location: 'On-Scene Medical Desk',
      description: 'Medical examiner initial findings regarding time and mechanics of demise.',
      forensicReport: 'Time of death established between 11:30 PM and 11:45 PM via asphyxiation and respiratory arrest.',
      isSmokingGun: false
    },
    {
      id: 'clue-6',
      title: 'Discarded Latex Glove',
      category: 'Forensic Trace',
      location: 'East Terrace Planter',
      description: 'A medical-grade examination glove discarded among ferns near the balcony fire escape.',
      forensicReport: 'Traces of toxic crystalline residue detected on the glove fingertips.',
      isSmokingGun: false
    },
    {
      id: 'clue-7',
      title: 'Threatening Correspondence Note',
      category: 'Document',
      location: 'Inside Victim\'s Coat Pocket',
      description: 'A typed memo demanding an immediate audit halt under threat of exposure.',
      forensicReport: 'Typewriter typeface matches the machine located in Arthur Blackwood\'s office.',
      isSmokingGun: true
    },
    {
      id: 'clue-8',
      title: 'Pocket Watch with Broken Crystal',
      category: 'Physical Evidence',
      location: 'Beneath the Study Mahogany Desk',
      description: 'An antique gold pocket watch stopped abruptly with damaged internal gears.',
      forensicReport: 'Impact damage halted the watch hands precisely at 11:34 PM during a brief physical altercation.',
      isSmokingGun: false
    },
    {
      id: 'clue-9',
      title: 'Security Camera Blindspot Map',
      category: 'Digital Log',
      location: 'Maintenance Sub-Basement',
      description: 'Handwritten diagram detailing which hallway cameras were undergoing maintenance cycles.',
      forensicReport: 'Only an insider with executive clearance possessed knowledge of the maintenance schedule.',
      isSmokingGun: false
    }
  ];

  const hintsPool = [
    {
      id: 1,
      title: 'Scrutinize the Financial Motive',
      content: 'Follow the audit trail: examine who stood to face immediate bankruptcy or prison if the accounts were reviewed on Monday.'
    },
    {
      id: 2,
      title: 'Match the Physical Safe Markings',
      content: 'Inspect the safe dial closely. The metallic residue transferred during the burglary matches personal jewelry worn by one specific suspect.'
    },
    {
      id: 3,
      title: 'Cross-Reference the Timestamp of Death',
      content: 'The broken pocket watch establishes the struggle occurred at 11:34 PM. Compare this against Arthur Blackwood\'s claimed library alibi.'
    }
  ];

  const selectedSuspects = suspectsPool.slice(0, config.suspectsCount).map((s, idx) => ({
    ...s,
    avatar: getCuratedAvatar(idx),
    isGuilty: s.id === 'suspect-1'
  }));

  const selectedClues = cluesPool.slice(0, config.cluesCount);
  const selectedHints = hintsPool.slice(0, config.hintsCount);

  const rawCase = {
    title: theme.title,
    story: premise
      ? `${premise}\n\nForensic investigators arrived on the scene at 23:45 HRS to find all entrances sealed. Preliminary observations suggest the perpetrator had intimate familiarity with the victim's habits and security measures.`
      : `At ${theme.setting}, an unexpected death occurred under locked-room circumstances. The victim was discovered slumped over their desk with a tainted glass of vintage port, while several persons of interest were observed in the vicinity shortly before the incident was reported.`,
    suspects: selectedSuspects,
    clues: selectedClues,
    hints: selectedHints,
    culpritId: 'suspect-1',
    solutionExplanation: `Arthur Blackwood orchestrated the murder to conceal an embezzlement of £120,000 from company accounts. Facing an audit on Monday morning, Blackwood utilized his administrative access to slip into the study at 11:32 PM, laced the victim's port with potassium cyanide, and burglarized the desk safe. His alibi collapsed when his signet ring left metallic transfer residue on the safe dial and his typewriter typeface matched the blackmail correspondence.`
  };

  // Validate with Zod before returning
  const validated = GeminiMysteryResponseSchema.parse(rawCase);
  return {
    ...validated,
    premise: premise || validated.title,
    difficulty
  };
}

