// ===== src/types/Competency.ts =====
export interface Competency {
  id?: number;
  subjectId: number;
  name: string;
  marks: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCompetencyRequest {
  subjectId: number;
  name: string;
  marks: number;
}

export interface UpdateCompetencyRequest {
  name?: string;
  marks?: number;
}