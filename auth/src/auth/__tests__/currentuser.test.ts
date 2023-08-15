import request from "supertest";
import { app } from "../../app";

it("responds with details about current user", async () => {
  const cookie = await global.signin();
  console.log("cookie", cookie);
  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send()
    .expect(200);
  console.log(response.body);
  expect(response.body.currentUser.email).toEqual("test@test.com");
});

it("responds with null in not authenticated", async () => {
  const response = await request(app)
    .get("/api/users/currentuser")
    .send()
    .expect(200);
  expect(response.body.currentUser).toEqual(null);
});
