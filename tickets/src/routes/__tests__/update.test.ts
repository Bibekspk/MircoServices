import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";
import { Ticket } from "../../models/tickets";

it("updates the existing ticket", async () => {
  const userId = global.signin();
  const response = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", userId)
    .send({
      title: "old title",
      price: 20,
    })
    .expect(200);
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", userId)
    .send({
      title: "new title",
      price: 10,
    })
    .expect(200);

  const getresponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();
  console.log("getresponse", getresponse.body);
  expect(getresponse.body[0].title).toEqual("new title");
  expect(getresponse.body[0].price).toEqual(10);
});

it("returns 404 if id doesnot exists", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin())
    .send({
      title: "ahdhjd",
      price: 20,
    })
    .expect(404);
});
it("returns 401 if user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: "ahdhjd",
      price: 20,
    })
    .expect(401);
});

it("returns 401 if user doesnot own the ticket", async () => {
  const response = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", global.signin())
    .send({
      title: "ahdhjd",
      price: 20,
    })
    .expect(200);
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", global.signin())
    .send({
      title: "ahdhjd",
      price: 20,
    })
    .expect(401);
});

it("returns 400 if user provides an invalid title or price", async () => {
  const userId = global.signin();
  const response = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", userId)
    .send({
      title: "ahdhjd",
      price: 20,
    })
    .expect(200);
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", userId)
    .send({
      title: "ahdhjd",
      price: 0,
    })
    .expect(400);
});

it("publishes an event", async () => {
  const userId = global.signin();
  const response = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", userId)
    .send({
      title: "old title",
      price: 20,
    })
    .expect(200);
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", userId)
    .send({
      title: "new title",
      price: 10,
    })
    .expect(200);

  const getresponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();
  console.log("getresponse", getresponse.body);
  expect(getresponse.body[0].title).toEqual("new title");
  expect(getresponse.body[0].price).toEqual(10);
  expect(natsWrapper.client.publish).toBeCalled();
});

it("it rejects updates if the ticket is reserved", async () => {
  const userId = global.signin();

  const response = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", userId)
    .send({
      title: "old title",
      price: 20,
    })
    .expect(200);

  const ticket = await Ticket.findById(response.body.id);
  ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await ticket!.save();

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", userId)
    .send({
      title: "new title",
      price: 10,
    })
    .expect(400);
});
