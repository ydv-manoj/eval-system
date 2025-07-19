import { Router } from 'express';
import { SubjectController } from '../controllers/subjectController';
import { validateBody, validateParams } from '../middleware/validation';
import { 
  createSubjectSchema, 
  updateSubjectSchema, 
  subjectIdSchema 
} from '../validators/subjectValidator';

const router = Router();

// GET /api/subjects - Get all subjects
router.get('/', SubjectController.getAllSubjects);

// GET /api/subjects/:id - Get subject by ID
router.get(
  '/:id',
  validateParams(subjectIdSchema),
  SubjectController.getSubjectById
);

// POST /api/subjects - Create new subject
router.post(
  '/',
  validateBody(createSubjectSchema),
  SubjectController.createSubject
);

// PUT /api/subjects/:id - Update subject
router.put(
  '/:id',
  validateParams(subjectIdSchema),
  validateBody(updateSubjectSchema),
  SubjectController.updateSubject
);

// DELETE /api/subjects/:id - Delete subject
router.delete(
  '/:id',
  validateParams(subjectIdSchema),
  SubjectController.deleteSubject
);

export { router as subjectRoutes };