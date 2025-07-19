import { apiService } from './api';
import { Subject, CreateSubjectRequest, UpdateSubjectRequest } from '../types/Subject';
import { API_ENDPOINTS } from '../utils/constants';

export class SubjectService {
  static async getAll(): Promise<Subject[]> {
    return apiService.get<Subject[]>(API_ENDPOINTS.SUBJECTS);
  }

  static async getById(id: number): Promise<Subject> {
    return apiService.get<Subject>(`${API_ENDPOINTS.SUBJECTS}/${id}`);
  }

  static async create(data: CreateSubjectRequest): Promise<Subject> {
    return apiService.post<Subject>(API_ENDPOINTS.SUBJECTS, data);
  }

  static async update(id: number, data: UpdateSubjectRequest): Promise<Subject> {
    return apiService.put<Subject>(`${API_ENDPOINTS.SUBJECTS}/${id}`, data);
  }

  static async delete(id: number): Promise<void> {
    return apiService.delete<void>(`${API_ENDPOINTS.SUBJECTS}/${id}`);
  }
}
