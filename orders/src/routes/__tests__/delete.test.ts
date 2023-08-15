import request from "supertest";
import { Ticket } from "../../models/ticket";
import { Order, OrderStatus } from "../../models/order";
import { app } from "../../app";
import { natsWrapper } from "../../nats-wrapper";
import mongoose from "mongoose";

it("cancels the order", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const user = global.signin();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  const response = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send();
  expect(response.body.status).toEqual(OrderStatus.Cancelled);
});

it("emits delete event", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const user = global.signin();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  const response = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send();
  expect(response.body.status).toEqual(OrderStatus.Cancelled);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
