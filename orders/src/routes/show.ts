import express, { Response, Request } from "express";
import { Order } from "../models/order";
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from "@sporganization/commonauth";

const router = express.Router();

router.get(
  "/api/orders/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id).populate("ticket");
    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.user!.id) {
      throw new NotAuthorizedError();
    }

    res.status(200).send(order);
  }
);

export { router as updaterderRouter };
