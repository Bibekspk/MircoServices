import mongoose from "mongoose";

if (!process.env.JWT_KEY) throw new Error("Jwt key is not defined");

mongoose
  .connect("mongodb://auth-mongo-srv:27017/tickets")
  .then(() => {
    console.log("Db connected successfully with auth");
  })
  .catch(() => {
    console.log("error while connecting");
  });
