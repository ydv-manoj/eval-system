import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../exceptions/CustomError';
import { ResponseHelper } from '../utils/responseHelper';
import { HTTP_STATUS } from '../utils/constants';
import { logger } from '../config/logger';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log the error
  logger.error('Unhandled error occurred', {
    error: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query,
  });

  // Handle custom errors
  if (error instanceof CustomError) {
    const serializedError = error.serialize();
    ResponseHelper.error(
      res,
      serializedError.message,
      error.statusCode,
      serializedError.field
    );
    return;
  }

  // Handle unexpected errors
  ResponseHelper.error(
    res,
    'An unexpected error occurred',
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    'Internal server error'
  );
};

// Handle 404 errors
export const notFoundHandler = (req: Request, res: Response): void => {
  logger.warn('Route not found', { 
    path: req.path, 
    method: req.method 
  });

  ResponseHelper.error(
    res,
    `Route ${req.method} ${req.path} not found`,
    HTTP_STATUS.NOT_FOUND,
    'Route not found'
  );
};

