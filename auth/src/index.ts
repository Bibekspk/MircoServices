import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("Secret is not found");
  }
  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth", {
      // useNewUrlParses: true,
      // useUnifiedTopology: true,
      // useCreateIndex: true,
    });
    console.log("Connected to MongoDB");
  } catch (e) {
    console.error(e);
  }

  app.listen(3000, () => {
    console.log("Server listening in 3000");
  });
};
start();
