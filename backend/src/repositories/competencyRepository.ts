import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { getConnection } from '../config/database';
import { Competency, CreateCompetencyRequest, UpdateCompetencyRequest } from '../models/Competency';
import { DatabaseError } from '../exceptions/DatabaseError';
import { logger } from '../config/logger';

interface CompetencyRow extends RowDataPacket {
  id: number;
  subject_id: number;
  name: string;
  marks: number;
  created_at: Date;
  updated_at: Date;
}

export class CompetencyRepository {
  private static mapRowToCompetency(row: CompetencyRow): Competency {
    return {
      id: row.id,
      subjectId: row.subject_id,
      name: row.name,
      marks: parseFloat(row.marks.toString()),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  static async findAll(): Promise<Competency[]> {
    try {
      const connection = getConnection();
      const [rows] = await connection.execute<CompetencyRow[]>(
        'SELECT * FROM competencies ORDER BY created_at DESC'
      );

      logger.debug('Retrieved all competencies', { count: rows.length });
      return rows.map(this.mapRowToCompetency);
    } catch (error) {
      logger.error('Error retrieving competencies', { error });
      throw new DatabaseError('Failed to retrieve competencies');
    }
  }

  static async findBySubjectId(subjectId: number): Promise<Competency[]> {
    try {
      const connection = getConnection();
      const [rows] = await connection.execute<CompetencyRow[]>(
        'SELECT * FROM competencies WHERE subject_id = ? ORDER BY marks DESC, name ASC',
        [subjectId]
      );

      logger.debug('Retrieved competencies by subject ID', { 
        subjectId, 
        count: rows.length 
      });
      return rows.map(this.mapRowToCompetency);
    } catch (error) {
      logger.error('Error retrieving competencies by subject ID', { 
        subjectId, 
        error 
      });
      throw new DatabaseError('Failed to retrieve competencies');
    }
  }

  static async findById(id: number): Promise<Competency | null> {
    try {
      const connection = getConnection();
      const [rows] = await connection.execute<CompetencyRow[]>(
        'SELECT * FROM competencies WHERE id = ?',
        [id]
      );

      if (rows.length === 0) {
        logger.debug('Competency not found', { competencyId: id });
        return null;
      }

      logger.debug('Retrieved competency by ID', { competencyId: id });
      return this.mapRowToCompetency(rows[0]);
    } catch (error) {
      logger.error('Error retrieving competency by ID', { competencyId: id, error });
      throw new DatabaseError('Failed to retrieve competency');
    }
  }

  static async findBySubjectIdAndName(subjectId: number, name: string): Promise<Competency | null> {
    try {
      const connection = getConnection();
      const [rows] = await connection.execute<CompetencyRow[]>(
        'SELECT * FROM competencies WHERE subject_id = ? AND name = ?',
        [subjectId, name]
      );

      if (rows.length === 0) {
        return null;
      }

      return this.mapRowToCompetency(rows[0]);
    } catch (error) {
      logger.error('Error retrieving competency by subject and name', { 
        subjectId, 
        name, 
        error 
      });
      throw new DatabaseError('Failed to retrieve competency');
    }
  }

  static async create(competency: CreateCompetencyRequest): Promise<Competency> {
    try {
      const connection = getConnection();
      const [result] = await connection.execute<ResultSetHeader>(
        'INSERT INTO competencies (subject_id, name, marks) VALUES (?, ?, ?)',
        [competency.subjectId, competency.name, competency.marks]
      );

      const createdCompetency = await this.findById(result.insertId);
      if (!createdCompetency) {
        throw new DatabaseError('Failed to retrieve created competency');
      }

      logger.info('Competency created successfully', { 
        competencyId: result.insertId, 
        subjectId: competency.subjectId,
        name: competency.name 
      });

      return createdCompetency;
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        logger.warn('Attempted to create duplicate competency', { 
          subjectId: competency.subjectId, 
          name: competency.name 
        });
        throw new DatabaseError('Competency with this name already exists for this subject');
      }
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        logger.warn('Attempted to create competency for non-existent subject', { 
          subjectId: competency.subjectId 
        });
        throw new DatabaseError('Subject does not exist');
      }
      logger.error('Error creating competency', { competency, error });
      throw new DatabaseError('Failed to create competency');
    }
  }

  static async update(id: number, updates: UpdateCompetencyRequest): Promise<Competency | null> {
    try {
      const connection = getConnection();
      
      const setParts: string[] = [];
      const values: any[] = [];

      if (updates.name !== undefined) {
        setParts.push('name = ?');
        values.push(updates.name);
      }

      if (updates.marks !== undefined) {
        setParts.push('marks = ?');
        values.push(updates.marks);
      }

      if (setParts.length === 0) {
        return await this.findById(id);
      }

      values.push(id);

      const [result] = await connection.execute<ResultSetHeader>(
        `UPDATE competencies SET ${setParts.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        values
      );

      if (result.affectedRows === 0) {
        logger.debug('No competency found to update', { competencyId: id });
        return null;
      }

      const updatedCompetency = await this.findById(id);
      logger.info('Competency updated successfully', { competencyId: id });
      
      return updatedCompetency;
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        logger.warn('Attempted to update competency with duplicate name', { 
          competencyId: id, 
          name: updates.name 
        });
        throw new DatabaseError('Competency with this name already exists for this subject');
      }
      logger.error('Error updating competency', { competencyId: id, updates, error });
      throw new DatabaseError('Failed to update competency');
    }
  }

  static async delete(id: number): Promise<boolean> {
    try {
      const connection = getConnection();
      const [result] = await connection.execute<ResultSetHeader>(
        'DELETE FROM competencies WHERE id = ?',
        [id]
      );

      const deleted = result.affectedRows > 0;
      
      if (deleted) {
        logger.info('Competency deleted successfully', { competencyId: id });
      } else {
        logger.debug('No competency found to delete', { competencyId: id });
      }

      return deleted;
    } catch (error) {
      logger.error('Error deleting competency', { competencyId: id, error });
      throw new DatabaseError('Failed to delete competency');
    }
  }

  static async deleteBySubjectId(subjectId: number): Promise<number> {
    try {
      const connection = getConnection();
      const [result] = await connection.execute<ResultSetHeader>(
        'DELETE FROM competencies WHERE subject_id = ?',
        [subjectId]
      );

      logger.info('Competencies deleted by subject ID', { 
        subjectId, 
        deletedCount: result.affectedRows 
      });

      return result.affectedRows;
    } catch (error) {
      logger.error('Error deleting competencies by subject ID', { 
        subjectId, 
        error 
      });
      throw new DatabaseError('Failed to delete competencies');
    }
  }
}