import { CustomError } from './CustomError';

export class ValidationError extends CustomError {
  statusCode = 400;

  constructor(
    message: string,
    public field?: string
  ) {
    super(message);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }

  serialize() {
    return {
      message: this.message,
      field: this.field,
    };
  }
}