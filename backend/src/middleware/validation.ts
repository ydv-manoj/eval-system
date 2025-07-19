import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { ValidationError } from '../exceptions/ValidationError';
import { ResponseHelper } from '../utils/responseHelper';
import { HTTP_STATUS } from '../utils/constants';
import { logger } from '../config/logger';

export const validateBody = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, { 
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details[0].message;
      const fieldName = error.details[0].path.join('.');
      
      logger.warn('Validation error in request body', { 
        path: req.path, 
        method: req.method,
        error: errorMessage,
        field: fieldName 
      });

      ResponseHelper.error(
        res, 
        errorMessage, 
        HTTP_STATUS.BAD_REQUEST,
        'Validation failed'
      );
      return;
    }

    req.body = value;
    next();
  };
};

export const validateParams = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.params, { 
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details[0].message;
      const fieldName = error.details[0].path.join('.');
      
      logger.warn('Validation error in request params', { 
        path: req.path, 
        method: req.method,
        error: errorMessage,
        field: fieldName 
      });

      ResponseHelper.error(
        res, 
        errorMessage, 
        HTTP_STATUS.BAD_REQUEST,
        'Invalid parameter'
      );
      return;
    }

    req.params = value;
    next();
  };
};
