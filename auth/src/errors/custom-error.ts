export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
    // console.log(message);
  }
  abstract seralizeError(): { message: string; field?: string }[];
}
