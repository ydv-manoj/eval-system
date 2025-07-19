import { Request, Response, NextFunction } from 'express';
import { SubjectService } from '../services/subjectService';
import { ResponseHelper } from '../utils/responseHelper';
import { HTTP_STATUS } from '../utils/constants';
import { logger } from '../config/logger';

export class SubjectController {
  static async getAllSubjects(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const subjects = await SubjectService.getAllSubjects();
      ResponseHelper.success(res, subjects, 'Subjects retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getSubjectById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const subjectId = parseInt(req.params.id);
      const subject = await SubjectService.getSubjectById(subjectId);
      ResponseHelper.success(res, subject, 'Subject retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async createSubject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const subject = await SubjectService.createSubject(req.body);
      ResponseHelper.success(
        res, 
        subject, 
        'Subject created successfully', 
        HTTP_STATUS.CREATED
      );
    } catch (error) {
      next(error);
    }
  }

  static async updateSubject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const subjectId = parseInt(req.params.id);
      const subject = await SubjectService.updateSubject(subjectId, req.body);
      ResponseHelper.success(res, subject, 'Subject updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async deleteSubject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const subjectId = parseInt(req.params.id);
      await SubjectService.deleteSubject(subjectId);
      ResponseHelper.success(res, null, 'Subject deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}
