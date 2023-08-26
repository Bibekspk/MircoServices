import mongoose from "mongoose";

if (!process.env.JWT_KEY) throw new Error("Jwt key is not defined");
if (!process.env.MONGO_URI) throw new Error("Mongo uri is not defined");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Db connected successfully with auth");
  })
  .catch(() => {
    console.log("error while connecting");
  });
