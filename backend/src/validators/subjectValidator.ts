import Joi from 'joi';
import { VALIDATION_RULES, ERROR_MESSAGES } from '../utils/constants';

export const createSubjectSchema = Joi.object({
  name: Joi.string()
    .min(VALIDATION_RULES.SUBJECT_NAME_MIN_LENGTH)
    .max(VALIDATION_RULES.SUBJECT_NAME_MAX_LENGTH)
    .trim()
    .required()
    .messages({
      'string.empty': ERROR_MESSAGES.REQUIRED_FIELD,
      'string.min': `Subject name must be at least ${VALIDATION_RULES.SUBJECT_NAME_MIN_LENGTH} characters`,
      'string.max': `Subject name cannot exceed ${VALIDATION_RULES.SUBJECT_NAME_MAX_LENGTH} characters`,
      'any.required': ERROR_MESSAGES.REQUIRED_FIELD,
    }),
  description: Joi.string()
    .max(VALIDATION_RULES.DESCRIPTION_MAX_LENGTH)
    .trim()
    .optional()
    .allow('')
    .messages({
      'string.max': `Description cannot exceed ${VALIDATION_RULES.DESCRIPTION_MAX_LENGTH} characters`,
    }),
});

export const updateSubjectSchema = Joi.object({
  name: Joi.string()
    .min(VALIDATION_RULES.SUBJECT_NAME_MIN_LENGTH)
    .max(VALIDATION_RULES.SUBJECT_NAME_MAX_LENGTH)
    .trim()
    .optional()
    .messages({
      'string.min': `Subject name must be at least ${VALIDATION_RULES.SUBJECT_NAME_MIN_LENGTH} characters`,
      'string.max': `Subject name cannot exceed ${VALIDATION_RULES.SUBJECT_NAME_MAX_LENGTH} characters`,
    }),
  description: Joi.string()
    .max(VALIDATION_RULES.DESCRIPTION_MAX_LENGTH)
    .trim()
    .optional()
    .allow('')
    .messages({
      'string.max': `Description cannot exceed ${VALIDATION_RULES.DESCRIPTION_MAX_LENGTH} characters`,
    }),
}).min(1);

export const subjectIdSchema = Joi.object({
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
