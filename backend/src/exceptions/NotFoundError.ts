import { CustomError } from './CustomError';

export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor(resource: string, id?: string | number) {
    super(`${resource}${id ? ` with ID ${id}` : ''} not found`);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serialize() {
    return {
      message: this.message,
    };
  }
}