import request from "supertest";
import { app } from "../../app";

it("fails when a email that doens not exist is suplied", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "tes@gmail.com",
      password: "123456",
    })
    .expect(400);
});

it("fails when an incorrect password is suplied", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@gmail.com",
      password: "123456",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@gmail.com",
      password: "12345",
    })
    .expect(400);
});

it("responds with a cokkie when given valid creds", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@gmail.com",
      password: "123456",
    })
    .expect(201);

  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@gmail.com",
      password: "123456",
    })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});
