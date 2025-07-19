export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
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

export const ERROR_MESSAGES = {
  SUBJECT_NOT_FOUND: 'Subject not found',
  COMPETENCY_NOT_FOUND: 'Competency not found',
  SUBJECT_NAME_EXISTS: 'Subject with this name already exists',
  COMPETENCY_NAME_EXISTS: 'Competency with this name already exists for this subject',
  INVALID_MARKS: 'Marks must be between 0 and 10',
  REQUIRED_FIELD: 'This field is required',
  INVALID_ID: 'Invalid ID provided',
} as const;
