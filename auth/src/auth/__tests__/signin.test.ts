import request from "supertest";
import { app } from "../../app";

it("fails when email doesnot exists is supplied", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({ email: "test@test.com", password: "password" })
    .expect(400);
});

it("fail when incorrect password is given", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "password2" })
    .expect(201);
  await request(app)
    .post("/api/users/signin")
    .send({ email: "test@test.com", password: "password3" })
    .expect(400);
});

it("pass when credentials are okay and cookie is defined", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "password2" })
    .expect(201);
  const response = await request(app)
    .post("/api/users/signin")
    .send({ email: "test@test.com", password: "password2" })
    .expect(201);
  expect(response.get("Set-Cookie")).toBeDefined();
});
