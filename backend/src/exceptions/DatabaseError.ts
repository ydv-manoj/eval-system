import { CustomError } from './CustomError';

export class DatabaseError extends CustomError {
  statusCode = 500;

  constructor(message: string) {
    super(`Database operation failed: ${message}`);
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }

  serialize() {
    return {
      message: 'Internal server error occurred',
    };
  }
}