import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus,
} from "@bibekorg/common";
import { Order } from "../models/order";

const router = express.Router();

router.post(
  "/api/payments",
  (req: any, res: any, next: any) => {
    console.log("req is s", req.session);
    next();
  },
  requireAuth,
  (req: any, res: any, next: any) => {
    console.log("req is secondle", req.session);
    next();
  },
  [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.user!.id) {
      throw new NotAuthorizedError();
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("Order already cancelled");
    }

    res.send({ success: true });
  }
);

export { router as createChargeRouter };
