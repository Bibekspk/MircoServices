import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";

export class RequestValidationError extends CustomError {
  statusCode = 400;
  // The private keyword before errors is an accessibility modifier, making the errors property private within the class. This means it can only be accessed within the class itself.
  constructor(public errors: ValidationError[]) {
    //passing no property in super will create an empty object of error with message inherited form Error class
    super("Invalid Request Error");
    //passing meesage inside super for logging purpose

    // only because we are extending a built in class
    // This line is setting the prototype of the current instance (this) to be the prototype of the RequestValidationError class. This step is done to ensure that the instance inherits the methods and properties of the RequestValidationError class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  seralizeError() {
    return this.errors.map((error) => ({
      message: error.msg,
      field: error.type,
    }));
  }
}
