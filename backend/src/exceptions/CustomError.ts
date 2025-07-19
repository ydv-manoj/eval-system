export abstract class CustomError extends Error {
  abstract statusCode: number;
  abstract serialize(): { message: string; field?: string };

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}