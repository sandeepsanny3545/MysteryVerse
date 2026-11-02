import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createCaseAPI, 
  discoverClueAPI, 
  requestHintAPI, 
  submitAccusationAPI, 
  getCaseResultAPI 
} from '../services/api';

const MysteryContext = createContext(null);

export function MysteryProvider({ children }) {
  // Active Case state
  const [currentMystery, setCurrentMystery] = useState(null);

  const [discoveredClueIds, setDiscoveredClueIds] = useState([]);
  const [interrogatedSuspectIds, setInterrogatedSuspectIds] = useState([]);
  const [unlockedHintIds, setUnlockedHintIds] = useState([]);
  const [suspectStress, setSuspectStress] = useState({});
  const [interrogationLogs, setInterrogationLogs] = useState({});
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Loading & Error States
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [isSubmittingAccusation, setIsSubmittingAccusation] = useState(false);

  // Accusation & Verdict state
  const [accusationData, setAccusationData] = useState({
    suspectId: null,
    motive: '',
    reasoning: '',
    selectedEvidenceIds: []
  });

  const [verdictResult, setVerdictResult] = useState(null);

  // Timer tick
  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Helper to normalize backend case to the consistent UI structure
  function normalizeCase(caseObj) {
    if (!caseObj) return null;

    const normalized = {
      ...caseObj,
      _id: caseObj._id || caseObj.id,
      title: caseObj.title,
      difficulty: caseObj.difficulty || 'Medium',
      location: caseObj.location || 'High-Security Crime Scene',
      dispatchTime: caseObj.dispatchTime || 'ACTIVE INCIDENT',
      briefing: caseObj.briefing || {
        synopsis: caseObj.story || caseObj.premise,
        autopsy: `Coroner Initial Report: Fatal incident occurred under locked-room or deceptive circumstances. Specific forensic indicators correlate with key physical clues on the scene.`,
        victim: {
          name: 'The Deceased Subject',
          age: 'Unknown',
          role: 'Victim of the Incident',
          knownFeuds: 'Reportedly involved in conflicts with one or more of the prime suspects.'
        }
      },
      suspects: (caseObj.suspects || []).map((s, idx) => ({
        ...s,
        initialStress: s.initialStress || 25,
        statement: s.statement || `I have nothing to hide, Detective. I was nowhere near the scene.`,
        behavioralTell: s.behavioralTell || 'Nervously glances around and avoids direct eye contact.',
        avatar: s.avatar || getCuratedAvatar(idx),
        dialogueResponses: s.dialogueResponses || [
          {
            query: 'Where were you when the crime occurred?',
            answer: s.alibi || 'I was reviewing documents in my private quarters alone.'
          },
          {
            query: 'Did you harbor any resentment toward the victim?',
            answer: 'We had disagreements over professional direction, but nothing that would warrant violence!'
          }
        ]
      })),
      clues: (caseObj.clues || []).map(c => ({
        ...c,
        category: c.category || 'Physical Evidence',
        location: c.location || 'Crime Scene Area',
        description: c.description || 'Evidence item found during forensic search.',
        forensicReport: c.forensicReport || 'Laboratory testing confirms biological or chemical traces consistent with the crime scene.',
        isSmokingGun: Boolean(c.isSmokingGun)
      })),
      hints: (caseObj.hints || []).map((h, i) => ({
        ...h,
        id: typeof h.id === 'number' ? h.id : i + 1,
        title: h.title || `Inspector Directive #${i + 1}`,
        content: h.content,
        penalty: 10
      }))
    };

    return normalized;
  }

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

  // Start or reset with a given case
  const initializeCase = (caseObj) => {
    const normalized = normalizeCase(caseObj);
    setCurrentMystery(normalized);
    setDiscoveredClueIds(normalized.discoveredClues || []);
    setInterrogatedSuspectIds([]);
    setUnlockedHintIds(normalized.hintsUsed || []);
    setTimerSeconds(0);
    setIsTimerRunning(true);
    setApiError(null);
    setAccusationData({
      suspectId: null,
      motive: '',
      reasoning: '',
      selectedEvidenceIds: []
    });
    setVerdictResult(null);

    // Initialize suspect stresses and logs
    const initialStress = {};
    const initialLogs = {};
    if (normalized && normalized.suspects) {
      normalized.suspects.forEach(s => {
        initialStress[s.id] = s.initialStress || 20;
        initialLogs[s.id] = [
          {
            sender: 'suspect',
            text: s.statement,
            timestamp: 'Initial Statement',
            stressAfter: s.initialStress || 20
          }
        ];
      });
    }
    setSuspectStress(initialStress);
    setInterrogationLogs(initialLogs);
  };

  // Inspect a clue and synchronize with backend
  const inspectClue = async (clueId) => {
    if (!discoveredClueIds.includes(clueId)) {
      setDiscoveredClueIds(prev => [...prev, clueId]);
    }

    if (!currentMystery?._id) {
      throw new Error('No active case ID found. Cannot log clue to backend.');
    }

    try {
      const res = await discoverClueAPI(currentMystery._id, clueId);
      if (res?.discoveredClues) {
        setDiscoveredClueIds(res.discoveredClues);
      }
    } catch (err) {
      console.error('[Clue API Error]', err.message);
      setApiError(`Failed to sync clue to backend: ${err.message}`);
      throw err;
    }
  };

  // Ask a suspect a question
  const askSuspectQuestion = (suspectId, questionText, customAnswer = null) => {
    if (!interrogatedSuspectIds.includes(suspectId)) {
      setInterrogatedSuspectIds(prev => [...prev, suspectId]);
    }

    const suspect = currentMystery?.suspects?.find(s => s.id === suspectId);
    let answerText = customAnswer;

    if (!answerText) {
      const matched = suspect?.dialogueResponses?.find(d => 
        questionText.toLowerCase().includes(d.query.toLowerCase().slice(0, 15))
      );
      if (matched) {
        answerText = matched.answer;
      } else {
        if (suspect?.isGuilty) {
          answerText = `*(Eyes narrow defensively)* I have already made my position clear, Detective. Why are you harassing me when there are far more suspicious characters in this building?`;
        } else {
          answerText = `I have told you everything I can recall truthfully, Detective. I hope you catch the monster responsible for this.`;
        }
      }
    }

    const currentLevel = suspectStress[suspectId] || 25;
    const stressIncrease = Math.floor(Math.random() * 8) + 4;
    const newStress = Math.min(100, currentLevel + stressIncrease);

    setSuspectStress(prev => ({
      ...prev,
      [suspectId]: newStress
    }));

    const newEntries = [
      {
        sender: 'detective',
        text: questionText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      {
        sender: 'suspect',
        text: answerText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        stressAfter: newStress
      }
    ];

    setInterrogationLogs(prev => ({
      ...prev,
      [suspectId]: [...(prev[suspectId] || []), ...newEntries]
    }));
  };

  // Unlock hint and synchronize with backend
  const unlockHint = async (hintId) => {
    if (!currentMystery?._id) {
      throw new Error('No active case found. Cannot request hint from backend.');
    }

    try {
      const res = await requestHintAPI(currentMystery._id);
      if (res.hint) {
        if (!unlockedHintIds.includes(hintId)) {
          setUnlockedHintIds(res.hintsUsed || [...unlockedHintIds, hintId]);
        }
        // Update the decrypted content for this hint in state
        setCurrentMystery(prev => ({
          ...prev,
          hints: prev.hints.map(h => h.id === hintId ? { ...h, content: res.hint.content, isUnlocked: true } : h)
        }));
      }
    } catch (err) {
      console.error('[Hint API Error]', err.message);
      setApiError(`Failed to request hint from backend: ${err.message}`);
      throw err;
    }
  };

  // Submit accusation: strictly requires backend Express API response
  const submitAccusation = async ({ suspectId, motive, reasoning, selectedEvidenceIds }) => {
    setIsSubmittingAccusation(true);
    setIsTimerRunning(false);
    setApiError(null);

    if (!currentMystery?._id) {
      setIsSubmittingAccusation(false);
      throw new Error('No active backend case found. Cannot submit accusation.');
    }

    try {
      const accuseRes = await submitAccusationAPI(currentMystery._id, {
        accusedId: suspectId,
        motive: motive || 'Financial gain and fear of exposure',
        reasoning: reasoning || 'Physical evidence and alibi contradictions confirm guilt.'
      });

      // Fetch final revealed solution and score breakdown directly from backend
      const resultRes = await getCaseResultAPI(currentMystery._id);

      const accused = currentMystery.suspects.find(s => s.id === suspectId);
      const isCorrect = accuseRes.isCorrect;
      const finalScore = accuseRes.score;

      // Rank award calibrated to backend scoring
      let rank = 'Rookie Sleuth';
      if (finalScore >= 180) rank = 'Sherlock Grade';
      else if (finalScore >= 130) rank = 'Master Sleuth';
      else if (finalScore >= 90) rank = 'Senior Inspector';
      else if (finalScore >= 50) rank = 'Patrol Detective';

      const result = {
        isCorrect,
        score: finalScore,
        scoreBreakdown: accuseRes.scoreBreakdown || {
          basePoints: isCorrect ? 150 : 0,
          clueBonus: discoveredClueIds.length * 5,
          hintPenalty: unlockedHintIds.length * 10,
          totalScore: finalScore
        },
        rank,
        accusedName: accused?.name || 'Unknown Suspect',
        accusedRole: accused?.role || 'Unknown',
        trueCulpritName: resultRes.culprit?.name || 'The Perpetrator',
        trueCulpritRole: resultRes.culprit?.role || 'Person of Interest',
        murderWeapon: currentMystery.solution?.weapon || 'Forensic Weapon',
        motive: motive || 'Greed and concealment of criminal conduct',
        explanation: resultRes.solutionExplanation,
        playerMotive: motive,
        playerReasoning: reasoning,
        timeTakenFormatted: `${Math.floor(timerSeconds / 60)}m ${timerSeconds % 60}s`,
        cluesFoundCount: resultRes.cluesDiscovered || discoveredClueIds.length,
        totalCluesCount: resultRes.totalClues || currentMystery.clues?.length || 0,
        hintsUsedCount: resultRes.hintsUsed || unlockedHintIds.length
      };

      setVerdictResult(result);
      setAccusationData({ suspectId, motive, reasoning, selectedEvidenceIds });
      setIsSubmittingAccusation(false);
      return result;
    } catch (err) {
      console.error('[Accusation API Error]', err.message);
      setApiError(`Backend Accusation Error: ${err.message}`);
      setIsSubmittingAccusation(false);
      throw err;
    }
  };

  // Create a new mystery: calls backend Gemini API (/api/cases) directly without silent mock fallback
  const createMystery = async ({ premise, difficulty, presetId = null }) => {
    setIsLoading(true);
    setApiError(null);

    let targetPremise = premise;
    if (presetId) {
      const presetPremises = {
        'preset-1': 'The Midnight Masquerade: Lord Sterling found poisoned in locked study during masked ball.',
        'preset-2': 'The Neon Cipher Murder: Dr. Thorne poisoned inside airtight quantum server vault.',
        'preset-3': 'The Crimson Velvet Express: Renowned art appraiser fatally stabbed on vintage train stranded in blizzard.'
      };
      targetPremise = presetPremises[presetId] || premise;
    }

    try {
      console.log('[MysteryContext] Dispatching POST /api/cases to backend Gemini API...');
      const res = await createCaseAPI({
        premise: targetPremise || 'A high-profile locked-room murder mystery under active investigation.',
        difficulty: difficulty || 'Medium'
      });

      if (!res?.case) {
        throw new Error('Invalid response received from MysteryVerse backend server.');
      }

      console.log('[MysteryContext] Mystery successfully generated by Gemini & stored in Atlas:', res.case.title);
      initializeCase(res.case);
      setIsLoading(false);
      return res.case;
    } catch (err) {
      console.error('[MysteryContext] Backend case generation failed:', err.message);
      setApiError(`Backend Connection Failed: ${err.message}. Please verify the MysteryVerse server is running.`);
      setIsLoading(false);
      // REJECT/THROW: Does NOT silently fall back to mock data!
      throw err;
    }
  };

  // Progress metrics (0 to 100%)
  const totalClues = currentMystery?.clues?.length || 1;
  const totalSuspects = currentMystery?.suspects?.length || 1;
  const progressPercent = Math.min(
    100,
    Math.round(
      ((discoveredClueIds.length / totalClues) * 0.6 +
        (interrogatedSuspectIds.length / totalSuspects) * 0.4) *
        100
    )
  );

  return (
    <MysteryContext.Provider
      value={{
        currentMystery,
        discoveredClueIds,
        interrogatedSuspectIds,
        unlockedHintIds,
        suspectStress,
        interrogationLogs,
        timerSeconds,
        isTimerRunning,
        accusationData,
        verdictResult,
        progressPercent,
        isLoading,
        apiError,
        isSubmittingAccusation,
        initializeCase,
        inspectClue,
        askSuspectQuestion,
        unlockHint,
        submitAccusation,
        createMystery
      }}
    >
      {children}
    </MysteryContext.Provider>
  );
}

export function useMystery() {
  const context = useContext(MysteryContext);
  if (!context) {
    throw new Error('useMystery must be used within a MysteryProvider');
  }
  return context;
}
