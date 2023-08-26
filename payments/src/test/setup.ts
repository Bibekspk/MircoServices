import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";
import request from "supertest";
import jwt from "jsonwebtoken";
jest.mock("../nats-wrapper");

declare global {
  namespace globalThis {
    //this name space is optional here
    function signin(): string[];
  }
}

let mongo: any;
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
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});

global.signin = () => {
  //Build a jwt payload
  const payload = {
    email: "abcd@test.com",
    id: new mongoose.Types.ObjectId().toHexString(),
  };
  //Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  //Build session object
  const session = { jwt: token };

  //turn that session into json
  const sessionJson = JSON.stringify(session);

  //Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJson).toString("base64");

  //return a string thats the cookie with the encoded data
  return [`session=${base64}`];
};
