// ===== src/middleware/logger.ts =====
import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  
  // Log request
  logger.info('Incoming request', {
    method: req.method,
    path: req.path,
    query: req.query,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
  });

  // Override res.end to log response
  const originalEnd = res.end.bind(res);
  
  res.end = function(chunk?: any, encoding?: BufferEncoding | (() => void), cb?: () => void): Response {
    const duration = Date.now() - start;
    
    logger.info('Request completed', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
    });

    // Handle different overloads
    if (arguments.length === 0) {
      return originalEnd();
    } else if (arguments.length === 1) {
      if (typeof chunk === 'function') {
        return originalEnd(chunk);
      }
      return originalEnd(chunk);
    } else if (arguments.length === 2) {
      if (typeof encoding === 'function') {
        return originalEnd(chunk, encoding);
      }
      return originalEnd(chunk, encoding as BufferEncoding);
    } else {
      return originalEnd(chunk, encoding as BufferEncoding, cb);
    }
  };

  next();
};