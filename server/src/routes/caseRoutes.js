import { Router } from 'express';
import { 
  createCase, 
  getCaseById, 
  discoverClue, 
  requestHint, 
  submitAccusation, 
  getCaseResult 
} from '../controllers/caseController.js';
import { validateBody, createCaseInputSchema, accuseInputSchema } from '../middleware/validate.js';

const router = Router();

// POST /api/cases – Generate mystery using Gemini
router.post('/', validateBody(createCaseInputSchema), createCase);

// GET /api/cases/:id – Get mystery without revealing culprit or solution
router.get('/:id', getCaseById);

// POST /api/cases/:id/clues/:clueId/discover – Discover clue
router.post('/:id/clues/:clueId/discover', discoverClue);

// POST /api/cases/:id/hints – Request hint
router.post('/:id/hints', requestHint);

// POST /api/cases/:id/accuse – Submit accusation and calculate score
router.post('/:id/accuse', validateBody(accuseInputSchema), submitAccusation);

// GET /api/cases/:id/result – Get final result after accusation
router.get('/:id/result', getCaseResult);

export default router;
