import { CustomError } from "./custom-error";

export class DataBaseConnectionError extends CustomError {
  statusCode = 500;
  reason = "Error connecting to Database";
  constructor() {
    super("Invalid DB or DB related error");
    //passing meesage inside super for logging purpose jsut like throw new Error('Invalid DB or DB related error')

    Object.setPrototypeOf(this, DataBaseConnectionError.prototype);
  }

  seralizeError() {
    return [
      {
        message: this.reason,
      },
    ];
  }
}
