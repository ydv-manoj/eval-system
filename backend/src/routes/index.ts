import { Router } from 'express';
import { subjectRoutes } from './subjectRoutes';
import { competencyRoutes } from './competencyRoutes';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'evaluation-backend',
  });
});

// API routes
router.use('/subjects', subjectRoutes);
router.use('/competencies', competencyRoutes);

export { router as apiRoutes };