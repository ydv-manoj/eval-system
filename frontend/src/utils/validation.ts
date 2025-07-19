import { VALIDATION_RULES } from './constants';

export const validateSubjectName = (name: string): string | null => {
  if (!name.trim()) {
    return 'Subject name is required';
  }
  if (name.length < VALIDATION_RULES.SUBJECT_NAME_MIN_LENGTH) {
    return `Subject name must be at least ${VALIDATION_RULES.SUBJECT_NAME_MIN_LENGTH} characters`;
  }
  if (name.length > VALIDATION_RULES.SUBJECT_NAME_MAX_LENGTH) {
    return `Subject name cannot exceed ${VALIDATION_RULES.SUBJECT_NAME_MAX_LENGTH} characters`;
  }
  return null;
};

export const validateCompetencyTitle = (title: string): string | null => {
  if (!title.trim()) {
    return 'Competency title is required';
  }
  if (title.length < VALIDATION_RULES.COMPETENCY_TITLE_MIN_LENGTH) {
    return `Competency title must be at least ${VALIDATION_RULES.COMPETENCY_TITLE_MIN_LENGTH} characters`;
  }
  if (title.length > VALIDATION_RULES.COMPETENCY_TITLE_MAX_LENGTH) {
    return `Competency title cannot exceed ${VALIDATION_RULES.COMPETENCY_TITLE_MAX_LENGTH} characters`;
  }
  return null;
};

export const validateDescription = (description: string): string | null => {
  if (description && description.length > VALIDATION_RULES.DESCRIPTION_MAX_LENGTH) {
    return `Description cannot exceed ${VALIDATION_RULES.DESCRIPTION_MAX_LENGTH} characters`;
  }
  return null;
};