import Joi from 'joi';
import { VALIDATION_RULES, ERROR_MESSAGES } from '../utils/constants';

export const createCompetencySchema = Joi.object({
  subjectId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': ERROR_MESSAGES.INVALID_ID,
      'number.integer': ERROR_MESSAGES.INVALID_ID,
      'number.positive': ERROR_MESSAGES.INVALID_ID,
      'any.required': 'Subject ID is required',
    }),
  name: Joi.string()
    .min(VALIDATION_RULES.COMPETENCY_NAME_MIN_LENGTH)
    .max(VALIDATION_RULES.COMPETENCY_NAME_MAX_LENGTH)
    .trim()
    .required()
    .messages({
      'string.empty': ERROR_MESSAGES.REQUIRED_FIELD,
      'string.min': `Competency name must be at least ${VALIDATION_RULES.COMPETENCY_NAME_MIN_LENGTH} characters`,
      'string.max': `Competency name cannot exceed ${VALIDATION_RULES.COMPETENCY_NAME_MAX_LENGTH} characters`,
      'any.required': ERROR_MESSAGES.REQUIRED_FIELD,
    }),
  marks: Joi.number()
    .min(VALIDATION_RULES.MARKS_MIN)
    .max(VALIDATION_RULES.MARKS_MAX)
    .precision(2)
    .required()
    .messages({
      'number.base': 'Marks must be a number',
      'number.min': `Marks must be at least ${VALIDATION_RULES.MARKS_MIN}`,
      'number.max': `Marks cannot exceed ${VALIDATION_RULES.MARKS_MAX}`,
      'any.required': 'Marks are required',
    }),
});

export const updateCompetencySchema = Joi.object({
  name: Joi.string()
    .min(VALIDATION_RULES.COMPETENCY_NAME_MIN_LENGTH)
    .max(VALIDATION_RULES.COMPETENCY_NAME_MAX_LENGTH)
    .trim()
    .optional()
    .messages({
      'string.min': `Competency name must be at least ${VALIDATION_RULES.COMPETENCY_NAME_MIN_LENGTH} characters`,
      'string.max': `Competency name cannot exceed ${VALIDATION_RULES.COMPETENCY_NAME_MAX_LENGTH} characters`,
    }),
  marks: Joi.number()
    .min(VALIDATION_RULES.MARKS_MIN)
    .max(VALIDATION_RULES.MARKS_MAX)
    .precision(2)
    .optional()
    .messages({
      'number.base': 'Marks must be a number',
      'number.min': `Marks must be at least ${VALIDATION_RULES.MARKS_MIN}`,
      'number.max': `Marks cannot exceed ${VALIDATION_RULES.MARKS_MAX}`,
    }),
}).min(1);

export const competencyIdSchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': ERROR_MESSAGES.INVALID_ID,
      'number.integer': ERROR_MESSAGES.INVALID_ID,
      'number.positive': ERROR_MESSAGES.INVALID_ID,
      'any.required': ERROR_MESSAGES.INVALID_ID,
    }),
});