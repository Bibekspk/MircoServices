import request from "supertest";
import { app } from "../../app";

it("responds with the details about the current user", async () => {
  const cokkie = await signin();
  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cokkie)
    .send()
    .expect(200);
  expect(response.body.currentUser.email).toEqual("test@gmail.com");
});

it("responds with thenull if not authenticated", async () => {
  const response = await request(app)
    .get("/api/users/currentuser")
    .send()
    .expect(200);
  expect(response.body.currentUser).toBeNull();
});
