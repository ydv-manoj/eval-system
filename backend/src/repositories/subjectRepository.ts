import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { getConnection } from '../config/database';
import { Subject, CreateSubjectRequest, UpdateSubjectRequest } from '../models/Subject';
import { DatabaseError } from '../exceptions/DatabaseError';
import { logger } from '../config/logger';

interface SubjectRow extends RowDataPacket {
  id: number;
  name: string;
  description: string | null;
  created_at: Date;
  updated_at: Date;
}

export class SubjectRepository {
  private static mapRowToSubject(row: SubjectRow): Subject {
    return {
      id: row.id,
      name: row.name,
      description: row.description || undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  static async findAll(): Promise<Subject[]> {
    try {
      const connection = getConnection();
      const [rows] = await connection.execute<SubjectRow[]>(
        'SELECT * FROM subjects ORDER BY created_at DESC'
      );

      logger.debug('Retrieved all subjects', { count: rows.length });
      return rows.map(this.mapRowToSubject);
    } catch (error) {
      logger.error('Error retrieving subjects', { error });
      throw new DatabaseError('Failed to retrieve subjects');
    }
  }

  static async findById(id: number): Promise<Subject | null> {
    try {
      const connection = getConnection();
      const [rows] = await connection.execute<SubjectRow[]>(
        'SELECT * FROM subjects WHERE id = ?',
        [id]
      );

      if (rows.length === 0) {
        logger.debug('Subject not found', { subjectId: id });
        return null;
      }

      logger.debug('Retrieved subject by ID', { subjectId: id });
      return this.mapRowToSubject(rows[0]);
    } catch (error) {
      logger.error('Error retrieving subject by ID', { subjectId: id, error });
      throw new DatabaseError('Failed to retrieve subject');
    }
  }

  static async findByName(name: string): Promise<Subject | null> {
    try {
      const connection = getConnection();
      const [rows] = await connection.execute<SubjectRow[]>(
        'SELECT * FROM subjects WHERE name = ?',
        [name]
      );

      if (rows.length === 0) {
        return null;
      }

      return this.mapRowToSubject(rows[0]);
    } catch (error) {
      logger.error('Error retrieving subject by name', { name, error });
      throw new DatabaseError('Failed to retrieve subject');
    }
  }

  static async create(subject: CreateSubjectRequest): Promise<Subject> {
    try {
      const connection = getConnection();
      const [result] = await connection.execute<ResultSetHeader>(
        'INSERT INTO subjects (name, description) VALUES (?, ?)',
        [subject.name, subject.description || null]
      );

      const createdSubject = await this.findById(result.insertId);
      if (!createdSubject) {
        throw new DatabaseError('Failed to retrieve created subject');
      }

      logger.info('Subject created successfully', { 
        subjectId: result.insertId, 
        name: subject.name 
      });

      return createdSubject;
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        logger.warn('Attempted to create duplicate subject', { name: subject.name });
        throw new DatabaseError('Subject with this name already exists');
      }
      logger.error('Error creating subject', { subject, error });
      throw new DatabaseError('Failed to create subject');
    }
  }

  static async update(id: number, updates: UpdateSubjectRequest): Promise<Subject | null> {
    try {
      const connection = getConnection();
      
      const setParts: string[] = [];
      const values: any[] = [];

      if (updates.name !== undefined) {
        setParts.push('name = ?');
        values.push(updates.name);
      }

      if (updates.description !== undefined) {
        setParts.push('description = ?');
        values.push(updates.description || null);
      }

      if (setParts.length === 0) {
        return await this.findById(id);
      }

      values.push(id);

      const [result] = await connection.execute<ResultSetHeader>(
        `UPDATE subjects SET ${setParts.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        values
      );

      if (result.affectedRows === 0) {
        logger.debug('No subject found to update', { subjectId: id });
        return null;
      }

      const updatedSubject = await this.findById(id);
      logger.info('Subject updated successfully', { subjectId: id });
      
      return updatedSubject;
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        logger.warn('Attempted to update subject with duplicate name', { 
          subjectId: id, 
          name: updates.name 
        });
        throw new DatabaseError('Subject with this name already exists');
      }
      logger.error('Error updating subject', { subjectId: id, updates, error });
      throw new DatabaseError('Failed to update subject');
    }
  }

  static async delete(id: number): Promise<boolean> {
    try {
      const connection = getConnection();
      const [result] = await connection.execute<ResultSetHeader>(
        'DELETE FROM subjects WHERE id = ?',
        [id]
      );

      const deleted = result.affectedRows > 0;
      
      if (deleted) {
        logger.info('Subject deleted successfully', { subjectId: id });
      } else {
        logger.debug('No subject found to delete', { subjectId: id });
      }

      return deleted;
    } catch (error) {
      logger.error('Error deleting subject', { subjectId: id, error });
      throw new DatabaseError('Failed to delete subject');
    }
  }

  static async exists(id: number): Promise<boolean> {
    try {
      const connection = getConnection();
      const [rows] = await connection.execute<RowDataPacket[]>(
        'SELECT 1 FROM subjects WHERE id = ? LIMIT 1',
        [id]
      );

      return rows.length > 0;
    } catch (error) {
      logger.error('Error checking subject existence', { subjectId: id, error });
      throw new DatabaseError('Failed to check subject existence');
    }
  }
}