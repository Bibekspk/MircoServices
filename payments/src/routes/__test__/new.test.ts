import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Order } from "../../models/order";
import { OrderStatus } from "@bibekorg/common";

//jest will import the mock one
import { stripe } from '../../stripe'
import { Payment } from "../../models/payment";

//import mock stripe
// jest.mock('../../stripe');

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
it("returns a 400 while purchasing cancelled order", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString()
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: userId,
    version: 0,
    price: 88,
    status: OrderStatus.Cancelled,
  });

  order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({
      token: "kjdsjk",
      orderId: order.id,
    })
    .expect(400);

});

it("returns 201 with valid inputs", async () => {
  const price = Math.floor(Math.random() * 100000)
  const userId = new mongoose.Types.ObjectId().toHexString()
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: userId,
    version: 0,
    price,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({
      token: "tok_visa",
      orderId: order.id,
    })
    .expect(201);

  //getting real stripe data to check
  const { data } = await stripe.charges.list({ limit: 50 })

  //as the amount will be in cents
  const stripeCharge = data.find((item) => item.amount === price * 100);

  expect(stripeCharge).toBeDefined()
  expect(stripeCharge?.currency).toEqual('usd');

  //if we use the mock stripe one we need to rename stripe.ts.old -->> stripe.ts
  //doing this, that mock stripe will be imported here
  // //as jest.MOck means that this is mock function and getting body from .calls[0][0]
  // in api we pass amount source and currency in createfn so this is checking those args if it is same or not
  // const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0]
  // expect(chargeOptions.amount).toEqual(order.price * 100)
  // expect(chargeOptions.source).toEqual('tok_visa')
  // expect(chargeOptions.currency).toEqual('usd')

  const paymentInfo = await Payment.findOne({ orderId: order.id, stripeId: stripeCharge!.id });

  // if record is not found it will give null as you can see by hovering over paymentInfo
  expect(paymentInfo).not.toBeNull()

})

