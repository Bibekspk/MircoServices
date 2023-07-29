import request from "supertest";
import { app } from "../../app";

it("clear cookie after signing out", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "abcd@gmail.com",
      password: "1234",
    })
    .expect(201);
  const response = await request(app)
    .post("/api/users/signout")
    .send({})
    .expect(201);
  return expect(response.get("Set-Cookie")[0]).toEqual(
    "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
  );
});
