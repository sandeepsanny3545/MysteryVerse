import { z } from 'zod';

export const createCaseInputSchema = z.object({
  premise: z.string().optional().default('A high-profile locked-room crime under mysterious circumstances.'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).optional().default('Medium')
});

export const accuseInputSchema = z.object({
  accusedId: z.string({ required_error: 'accusedId is required' }).min(1, 'accusedId cannot be empty'),
  motive: z.string().optional().default('Financial gain and fear of exposure'),
  reasoning: z.string().optional().default('The forensic evidence confirms guilt beyond reasonable doubt.')
});

export function validateBody(schema) {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
        });
      }
      next(error);
    }
  };
}
