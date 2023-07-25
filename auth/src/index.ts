import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import { currentuserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signupRouter } from "./routes/signup";
import { signoutRouter } from "./routes/signout";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";
import mongoose from "mongoose";
import cookieSession from "cookie-session";

const app = express();

app.set("trust proxy", true);

app.use(json());
app.use(
  cookieSession({
    signed: false, // not securing as it is for only first req because after that JWT is on the way to check it
    secure: true, // accepts only https request
  })
);

app.use(currentuserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

//for any silly route
//we can use next for async error or
// we can use express-async-errors to handle async routes too and its error
app.all("*", async () => {
  throw new NotFoundError();
});

//this is also fine if using next
// app.all("*", (req, res, next) => {
//   return next(new NotFoundError());
// });

app.use(errorHandler);

//new version for async await
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
