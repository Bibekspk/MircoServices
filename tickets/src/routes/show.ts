import express, { NextFunction, Request, Response } from "express";
import {
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@bibekorg/common";
import { param } from "express-validator";
import { Ticket } from "../models/tickets";
const router = express.Router();

router.get(
  "/api/tickets/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("req.params.id", req.params.id);
    const ticket = await Ticket.find({ _id: req.params.id });
    console.log("ticket is", ticket);
    if (!ticket.length) {
      throw new NotFoundError();
    }
    res.send(ticket);
  }
);

export { router as showTicketRouter };
