import { Request, Response, NextFunction } from 'express';
import { CompetencyService } from '../services/competencyService';
import { ResponseHelper } from '../utils/responseHelper';
import { HTTP_STATUS } from '../utils/constants';
import { logger } from '../config/logger';

export class CompetencyController {
  static async getAllCompetencies(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const competencies = await CompetencyService.getAllCompetencies();
      ResponseHelper.success(res, competencies, 'Competencies retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getCompetenciesBySubjectId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const subjectId = parseInt(req.params.subjectId);
      const competencies = await CompetencyService.getCompetenciesBySubjectId(subjectId);
      ResponseHelper.success(res, competencies, 'Competencies retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getCompetencyById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const competencyId = parseInt(req.params.id);
      const competency = await CompetencyService.getCompetencyById(competencyId);
      ResponseHelper.success(res, competency, 'Competency retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async createCompetency(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const competency = await CompetencyService.createCompetency(req.body);
      ResponseHelper.success(
        res, 
        competency, 
        'Competency created successfully', 
        HTTP_STATUS.CREATED
      );
    } catch (error) {
      next(error);
    }
  }

  static async updateCompetency(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const competencyId = parseInt(req.params.id);
      const competency = await CompetencyService.updateCompetency(competencyId, req.body);
      ResponseHelper.success(res, competency, 'Competency updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async deleteCompetency(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const competencyId = parseInt(req.params.id);
      await CompetencyService.deleteCompetency(competencyId);
      ResponseHelper.success(res, null, 'Competency deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}