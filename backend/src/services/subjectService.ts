import { Subject, CreateSubjectRequest, UpdateSubjectRequest } from '../models/Subject';
import { SubjectRepository } from '../repositories/subjectRepository';
import { CompetencyRepository } from '../repositories/competencyRepository';
import { NotFoundError } from '../exceptions/NotFoundError';
import { ValidationError } from '../exceptions/ValidationError';
import { ERROR_MESSAGES } from '../utils/constants';
import { logger } from '../config/logger';

export class SubjectService {
  static async getAllSubjects(): Promise<Subject[]> {
    logger.debug('Getting all subjects');
    return await SubjectRepository.findAll();
  }

  static async getSubjectById(id: number): Promise<Subject> {
    logger.debug('Getting subject by ID', { subjectId: id });
    
    const subject = await SubjectRepository.findById(id);
    if (!subject) {
      throw new NotFoundError('Subject', id);
    }
    
    return subject;
  }

  static async createSubject(subjectData: CreateSubjectRequest): Promise<Subject> {
    logger.debug('Creating new subject', { name: subjectData.name });

    // Check if subject with same name already exists
    const existingSubject = await SubjectRepository.findByName(subjectData.name);
    if (existingSubject) {
      throw new ValidationError(ERROR_MESSAGES.SUBJECT_NAME_EXISTS, 'name');
    }

    return await SubjectRepository.create(subjectData);
  }

  static async updateSubject(id: number, updates: UpdateSubjectRequest): Promise<Subject> {
    logger.debug('Updating subject', { subjectId: id, updates });

    // Check if subject exists
    const existingSubject = await SubjectRepository.findById(id);
    if (!existingSubject) {
      throw new NotFoundError('Subject', id);
    }

    // Check for name conflicts if name is being updated
    if (updates.name && updates.name !== existingSubject.name) {
      const subjectWithSameName = await SubjectRepository.findByName(updates.name);
      if (subjectWithSameName) {
        throw new ValidationError(ERROR_MESSAGES.SUBJECT_NAME_EXISTS, 'name');
      }
    }

    const updatedSubject = await SubjectRepository.update(id, updates);
    if (!updatedSubject) {
      throw new NotFoundError('Subject', id);
    }

    return updatedSubject;
  }

  static async deleteSubject(id: number): Promise<void> {
    logger.debug('Deleting subject', { subjectId: id });

    // Check if subject exists
    const existingSubject = await SubjectRepository.findById(id);
    if (!existingSubject) {
      throw new NotFoundError('Subject', id);
    }

    // Get competencies count for logging
    const competencies = await CompetencyRepository.findBySubjectId(id);
    logger.info('Deleting subject and its competencies', { 
      subjectId: id, 
      competenciesCount: competencies.length 
    });

    // Delete subject (competencies will be cascade deleted by database)
    await SubjectRepository.delete(id);
  }

  static async checkSubjectExists(id: number): Promise<boolean> {
    return await SubjectRepository.exists(id);
  }
}
