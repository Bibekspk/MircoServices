import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("return a 404 if there is no ticket", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});
it("return a tiket if there is ticket", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "aa", price: 10 })
    .expect(200);
  let id = response.body.id;
  console.log("id is", id);
  const ticketingResponse: any = await request(app)
    .get(`/api/tickets/${id}`)
    .send();
  console.log("ticketing ", ticketingResponse.body);
  // expect(ticketingResponse.body.title).toEqual("aa");
  // expect(ticketingResponse.body.price).toEqual(10);
});
