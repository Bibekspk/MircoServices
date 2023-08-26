import express, { Request, Response } from "express";
import { currentUser } from "@sporganization/commonauth";
const router = express.Router();

router.get(
  "/api/users/currentuser",
  currentUser,
  (req: Request, res: Response) => {
    res.send({ currentUser: req.user || null });
  }
);

export { router as currentUserRouter };
