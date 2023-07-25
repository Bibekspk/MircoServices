import { CustomError } from "./custom-error";

export class BadRequestError extends CustomError {
  statusCode = 400;
  constructor(public message: string) {
    super(message);

    //typescript jumps ater super is called as public message is kept in BadRequestError
    this.message;
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
  seralizeError() {
    return [{ message: this.message }];
  }
}
