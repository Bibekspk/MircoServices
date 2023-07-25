import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
  id: string;
  email: string;
}

//for declaring it globally so that it can be used insdie project
declare global {
  //extending the type of express library here we are extenidn the type of Request
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currentUserPayload = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const payload = jwt.verify(
      req.session?.jwt,
      process.env.JWT_KEY!
    ) as UserPayload;
    req.currentUser = payload;
  } catch (e) {}

  next();
};
