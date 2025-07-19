export interface Competency {
  id?: number;
  subjectId: number;
  name: string;
  marks: number;
  createdAt?: Date;
  updatedAt?: Date;
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