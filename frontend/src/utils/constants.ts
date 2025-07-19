export const API_ENDPOINTS = {
  SUBJECTS: '/subjects',
  COMPETENCIES: '/competencies',
  HEALTH: '/health',
} as const;

export const VALIDATION_RULES = {
  SUBJECT_NAME_MIN_LENGTH: 2,
  SUBJECT_NAME_MAX_LENGTH: 100,
  COMPETENCY_NAME_MIN_LENGTH: 2,
  COMPETENCY_NAME_MAX_LENGTH: 100,
  MARKS_MIN: 0,
  MARKS_MAX: 10,
  DESCRIPTION_MAX_LENGTH: 500,
} as const;

export const MESSAGES = {
  SUCCESS: {
    SUBJECT_CREATED: 'Subject created successfully',
    SUBJECT_UPDATED: 'Subject updated successfully',
    SUBJECT_DELETED: 'Subject deleted successfully',
    COMPETENCY_CREATED: 'Competency created successfully',
    COMPETENCY_UPDATED: 'Competency updated successfully',
    COMPETENCY_DELETED: 'Competency deleted successfully',
  },
  ERROR: {
    GENERIC: 'Something went wrong. Please try again.',
    NETWORK: 'Network error. Please check your connection.',
    VALIDATION: 'Please fix the validation errors.',
  },
} as const;