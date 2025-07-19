import { Router } from 'express';
import { CompetencyController } from '../controllers/competencyController';
import { validateBody, validateParams } from '../middleware/validation';
import { 
  createCompetencySchema, 
  updateCompetencySchema, 
  competencyIdSchema 
} from '../validators/competencyValidator';
import Joi from 'joi';

const router = Router();

// GET /api/competencies - Get all competencies
router.get('/', CompetencyController.getAllCompetencies);

// GET /api/competencies/subject/:subjectId - Get competencies by subject
router.get(
  '/subject/:subjectId',
  validateParams(Joi.object({
    subjectId: Joi.number().integer().positive().required()
  })),
  CompetencyController.getCompetenciesBySubjectId
);

// GET /api/competencies/:id - Get competency by ID
router.get(
  '/:id',
  validateParams(competencyIdSchema),
  CompetencyController.getCompetencyById
);

// POST /api/competencies - Create new competency
router.post(
  '/',
  validateBody(createCompetencySchema),
  CompetencyController.createCompetency
);

// PUT /api/competencies/:id - Update competency
router.put(
  '/:id',
  validateParams(competencyIdSchema),
  validateBody(updateCompetencySchema),
  CompetencyController.updateCompetency
);

// DELETE /api/competencies/:id - Delete competency
router.delete(
  '/:id',
  validateParams(competencyIdSchema),
  CompetencyController.deleteCompetency
);

export { router as competencyRoutes };