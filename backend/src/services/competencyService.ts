import { Competency, CreateCompetencyRequest, UpdateCompetencyRequest } from '../models/Competency';
import { CompetencyRepository } from '../repositories/competencyRepository';
import { SubjectRepository } from '../repositories/subjectRepository';
import { NotFoundError } from '../exceptions/NotFoundError';
import { ValidationError } from '../exceptions/ValidationError';
import { ERROR_MESSAGES } from '../utils/constants';
import { logger } from '../config/logger';

export class CompetencyService {
  static async getAllCompetencies(): Promise<Competency[]> {
    logger.debug('Getting all competencies');
    return await CompetencyRepository.findAll();
  }

  static async getCompetenciesBySubjectId(subjectId: number): Promise<Competency[]> {
    logger.debug('Getting competencies by subject ID', { subjectId });
    
    // Verify subject exists
    const subjectExists = await SubjectRepository.exists(subjectId);
    if (!subjectExists) {
      throw new NotFoundError('Subject', subjectId);
    }

    return await CompetencyRepository.findBySubjectId(subjectId);
  }

  static async getCompetencyById(id: number): Promise<Competency> {
    logger.debug('Getting competency by ID', { competencyId: id });
    
    const competency = await CompetencyRepository.findById(id);
    if (!competency) {
      throw new NotFoundError('Competency', id);
    }
    
    return competency;
  }

  static async createCompetency(competencyData: CreateCompetencyRequest): Promise<Competency> {
    logger.debug('Creating new competency', { 
      subjectId: competencyData.subjectId, 
      name: competencyData.name 
    });

    // Verify subject exists
    const subjectExists = await SubjectRepository.exists(competencyData.subjectId);
    if (!subjectExists) {
      throw new NotFoundError('Subject', competencyData.subjectId);
    }

    // Check if competency with same name already exists for this subject
    const existingCompetency = await CompetencyRepository.findBySubjectIdAndName(
      competencyData.subjectId, 
      competencyData.name
    );
    if (existingCompetency) {
      throw new ValidationError(ERROR_MESSAGES.COMPETENCY_NAME_EXISTS, 'name');
    }

    return await CompetencyRepository.create(competencyData);
  }

  static async updateCompetency(id: number, updates: UpdateCompetencyRequest): Promise<Competency> {
    logger.debug('Updating competency', { competencyId: id, updates });

    // Check if competency exists
    const existingCompetency = await CompetencyRepository.findById(id);
    if (!existingCompetency) {
      throw new NotFoundError('Competency', id);
    }

    // Check for name conflicts if name is being updated
    if (updates.name && updates.name !== existingCompetency.name) {
      const competencyWithSameName = await CompetencyRepository.findBySubjectIdAndName(
        existingCompetency.subjectId, 
        updates.name
      );
      if (competencyWithSameName) {
        throw new ValidationError(ERROR_MESSAGES.COMPETENCY_NAME_EXISTS, 'name');
      }
    }

    const updatedCompetency = await CompetencyRepository.update(id, updates);
    if (!updatedCompetency) {
      throw new NotFoundError('Competency', id);
    }

    return updatedCompetency;
  }

  static async deleteCompetency(id: number): Promise<void> {
    logger.debug('Deleting competency', { competencyId: id });

    // Check if competency exists
    const existingCompetency = await CompetencyRepository.findById(id);
    if (!existingCompetency) {
      throw new NotFoundError('Competency', id);
    }

    await CompetencyRepository.delete(id);
  }
}
