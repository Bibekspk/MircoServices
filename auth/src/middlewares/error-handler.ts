import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/custom-error";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // The instanceof operator in JavaScript and TypeScript is used to determine whether an object is an instance of a particular class or constructor function. It returns a boolean value (true or false) based on whether the object is an instance of the specified class.
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.seralizeError() });
  }
  console.log(err);

  res.status(400).send({ errors: [{ message: "Something went wrong" }] });
};
