import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";
import request from "supertest";

let mongo: any;

declare global {
  namespace globalThis {
    function signin(): Promise<string[]>;
  }
}

//runs before all out test start
beforeAll(async () => {
  process.env.JWT_KEY = "itissecret";

  //like db server
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

//before each test start
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});

global.signin = async () => {
  const email = "test@gmail.com";
  const password = "123456";

  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email,
      password,
    })
    .expect(201);

  const cokkie = response.get("Set-Cookie");

  return cokkie;
};
