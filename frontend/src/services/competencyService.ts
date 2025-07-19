import { apiService } from './api';
import { Competency, CreateCompetencyRequest, UpdateCompetencyRequest } from '../types/Competency';
import { API_ENDPOINTS } from '../utils/constants';

export class CompetencyService {
  static async getAll(): Promise<Competency[]> {
    return apiService.get<Competency[]>(API_ENDPOINTS.COMPETENCIES);
  }

  static async getBySubjectId(subjectId: number): Promise<Competency[]> {
    return apiService.get<Competency[]>(`${API_ENDPOINTS.COMPETENCIES}/subject/${subjectId}`);
  }

  static async getById(id: number): Promise<Competency> {
    return apiService.get<Competency>(`${API_ENDPOINTS.COMPETENCIES}/${id}`);
  }

  static async create(data: CreateCompetencyRequest): Promise<Competency> {
    return apiService.post<Competency>(API_ENDPOINTS.COMPETENCIES, data);
  }

  static async update(id: number, data: UpdateCompetencyRequest): Promise<Competency> {
    return apiService.put<Competency>(`${API_ENDPOINTS.COMPETENCIES}/${id}`, data);
  }

  static async delete(id: number): Promise<void> {
    return apiService.delete<void>(`${API_ENDPOINTS.COMPETENCIES}/${id}`);
  }
}