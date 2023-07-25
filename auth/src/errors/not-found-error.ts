import { CustomError } from "./custom-error";

export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor() {
    super("Route Not found");
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  seralizeError() {
    return [{ message: "Not found" }];
  }
}
