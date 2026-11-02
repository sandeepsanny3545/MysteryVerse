import { Case } from '../models/Case.js';
import { generateMysteryCase } from '../services/geminiService.js';
import { calculateCaseScore } from '../services/scoringService.js';

/**
 * POST /api/cases
 * Generate a new mystery using Gemini API and store in DB.
 * Returns public case without culprit or solution.
 */
export async function createCase(req, res, next) {
  try {
    const { premise, difficulty } = req.body;

    // Call Gemini API (with Zod validation and procedural fallback)
    const generatedData = await generateMysteryCase({ premise, difficulty });

    // Store in MongoDB
    const newCase = new Case({
      title: generatedData.title,
      premise: premise || generatedData.title,
      story: generatedData.story,
      difficulty: difficulty || 'Medium',
      suspects: generatedData.suspects,
      clues: generatedData.clues,
      hints: generatedData.hints,
      culpritId: generatedData.culpritId,
      solutionExplanation: generatedData.solutionExplanation,
      discoveredClues: [],
      hintsUsed: [],
      score: 0,
      status: 'active'
    });

    await newCase.save();

    // Return sanitized public representation
    res.status(201).json({
      success: true,
      case: newCase.toPublicJSON()
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/cases/:id
 * Retrieve case details without revealing culprit or solution.
 */
export async function getCaseById(req, res, next) {
  try {
    const { id } = req.params;
    const mysteryCase = await Case.findById(id);

    if (!mysteryCase) {
      return res.status(404).json({
        success: false,
        error: 'Case not found'
      });
    }

    res.json({
      success: true,
      case: mysteryCase.toPublicJSON()
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/cases/:id/clues/:clueId/discover
 * Discover a clue and log it in the case session.
 */
export async function discoverClue(req, res, next) {
  try {
    const { id, clueId } = req.params;
    const mysteryCase = await Case.findById(id);

    if (!mysteryCase) {
      return res.status(404).json({
        success: false,
        error: 'Case not found'
      });
    }

    const clue = mysteryCase.clues.find(c => c.id === clueId);
    if (!clue) {
      return res.status(404).json({
        success: false,
        error: `Clue with id "${clueId}" not found in this case`
      });
    }

    let isNewDiscovery = false;
    if (!mysteryCase.discoveredClues.includes(clueId)) {
      mysteryCase.discoveredClues.push(clueId);
      await mysteryCase.save();
      isNewDiscovery = true;
    }

    res.json({
      success: true,
      isNewDiscovery,
      discoveredClues: mysteryCase.discoveredClues,
      clue
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/cases/:id/hints
 * Request the next available hint and apply penalty tracking.
 */
export async function requestHint(req, res, next) {
  try {
    const { id } = req.params;
    const mysteryCase = await Case.findById(id);

    if (!mysteryCase) {
      return res.status(404).json({
        success: false,
        error: 'Case not found'
      });
    }

    // Find the first hint not yet used
    const nextHint = mysteryCase.hints.find(h => !mysteryCase.hintsUsed.includes(h.id));

    if (!nextHint) {
      return res.status(400).json({
        success: false,
        error: 'All available hints for this case have already been unlocked',
        hintsUsed: mysteryCase.hintsUsed
      });
    }

    mysteryCase.hintsUsed.push(nextHint.id);
    await mysteryCase.save();

    res.json({
      success: true,
      hint: {
        id: nextHint.id,
        title: nextHint.title,
        content: nextHint.content,
        isUnlocked: true
      },
      hintsUsed: mysteryCase.hintsUsed,
      hintsRemaining: mysteryCase.hints.length - mysteryCase.hintsUsed.length
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/cases/:id/accuse
 * Submit accusation, calculate final backend score, and set resolution status.
 */
export async function submitAccusation(req, res, next) {
  try {
    const { id } = req.params;
    const { accusedId, motive, reasoning } = req.body;

    const mysteryCase = await Case.findById(id);

    if (!mysteryCase) {
      return res.status(404).json({
        success: false,
        error: 'Case not found'
      });
    }

    if (mysteryCase.status !== 'active') {
      return res.status(400).json({
        success: false,
        error: 'This case has already been resolved with an accusation',
        status: mysteryCase.status
      });
    }

    // Check culprit match strictly on the backend
    const isCorrect = accusedId === mysteryCase.culpritId;

    // Calculate score using backend scoring rules
    const scoreBreakdown = calculateCaseScore({
      difficulty: mysteryCase.difficulty,
      isCorrect,
      discoveredCluesCount: mysteryCase.discoveredClues.length,
      hintsUsedCount: mysteryCase.hintsUsed.length
    });

    mysteryCase.status = isCorrect ? 'solved' : 'failed';
    mysteryCase.score = scoreBreakdown.totalScore;
    mysteryCase.accusation = {
      accusedId,
      motive: motive || 'Motive unstated',
      reasoning: reasoning || 'Reasoning unstated',
      isCorrect,
      submittedAt: new Date()
    };

    await mysteryCase.save();

    res.json({
      success: true,
      isCorrect,
      status: mysteryCase.status,
      score: scoreBreakdown.totalScore,
      scoreBreakdown,
      message: isCorrect
        ? 'Guilty verdict confirmed! Your deduction was spot-on.'
        : 'Wrongful accusation! The real culprit escaped.'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/cases/:id/result
 * Retrieve full case resolution and canonical post-mortem after accusation.
 */
export async function getCaseResult(req, res, next) {
  try {
    const { id } = req.params;
    const mysteryCase = await Case.findById(id);

    if (!mysteryCase) {
      return res.status(404).json({
        success: false,
        error: 'Case not found'
      });
    }

    if (mysteryCase.status === 'active') {
      return res.status(400).json({
        success: false,
        error: 'Accusation has not been submitted yet. Case is still active.'
      });
    }

    const culpritSuspect = mysteryCase.suspects.find(s => s.id === mysteryCase.culpritId);
    const accusedSuspect = mysteryCase.suspects.find(s => s.id === mysteryCase.accusation?.accusedId);

    const scoreBreakdown = calculateCaseScore({
      difficulty: mysteryCase.difficulty,
      isCorrect: mysteryCase.accusation?.isCorrect,
      discoveredCluesCount: mysteryCase.discoveredClues.length,
      hintsUsedCount: mysteryCase.hintsUsed.length
    });

    res.json({
      success: true,
      status: mysteryCase.status,
      isCorrect: mysteryCase.accusation?.isCorrect,
      score: mysteryCase.score,
      scoreBreakdown,
      culprit: {
        id: mysteryCase.culpritId,
        name: culpritSuspect?.name || 'Unknown',
        role: culpritSuspect?.role || 'Unknown',
        avatar: culpritSuspect?.avatar
      },
      accused: {
        id: mysteryCase.accusation?.accusedId,
        name: accusedSuspect?.name || 'Unknown',
        role: accusedSuspect?.role || 'Unknown',
        motiveGiven: mysteryCase.accusation?.motive,
        reasoningGiven: mysteryCase.accusation?.reasoning
      },
      solutionExplanation: mysteryCase.solutionExplanation,
      cluesDiscovered: mysteryCase.discoveredClues.length,
      totalClues: mysteryCase.clues.length,
      hintsUsed: mysteryCase.hintsUsed.length
    });
  } catch (error) {
    next(error);
  }
}
