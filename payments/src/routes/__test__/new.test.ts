import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Order } from "../../models/order";
import { OrderStatus } from "@bibekorg/common";

it("returns a 404 while purchansing order that doesnt exists", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      token: "kjdsjk",
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});
it("returns a 401 while purchansing order that doesnt belong to user", async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 88,
    status: OrderStatus.Created,
  });
  await order.save();
  console.log("order is", order.id);
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      token: "kjdsjk",
      orderId: order.id,
    })
    .expect(401);
});
it("returns a 400 while purchansing cancelled order", async () => {});
