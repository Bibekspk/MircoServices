import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";

export class RequestValidationError extends CustomError {
  // errors: ValidationError[]
  statusCode = 400;
  constructor(public errors: ValidationError[]) {
    //this.errors=errors; equivalent to adding private variable in the constructor
    super("Validation failed");

    //Only because we are extending built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }
  serializeErrors() {
    return this.errors.map((error) => ({
      message: error.msg,
      fields: error.type,
    }));
  }
}
