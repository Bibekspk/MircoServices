import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
  id: string;
  email: string;
}

//if you cannot modify the Request interface directly then this
// is better approach else can use extend Request to a new type
declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    return next();
  }
  try {
    const currentUser = jwt.verify(
      req.session?.jwt,
      process.env.JWT_KEY!
    ) as UserPayload;
    req.user = currentUser;
  } catch (err) {}
  next();
};
