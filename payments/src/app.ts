import express, { NextFunction, Request, Response } from "express";
import "express-async-errors";
import { json } from "body-parser";
import { createChargeRouter } from "./routes/new";
import {
  errorHandlers,
  NotFoundError,
  currentUser,
} from "@bibekorg/common";
import cookieSession from "cookie-session";

const app = express();
//Telling express that it is behind the proxy
//Since traffic is being proxied through ingress nginx
//By default express doesnot allow/trust the proxy
// so adding this to tell it is behind proxy
app.set("trust proxy", true);

app.use(json());

app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test", //must be on https connection
  })
);

// app.use("*", () => {
//   throw new NotFoundError();
// }); /// this will work as long as the function is synchronous.
//If we make a function asynchronous then it will be in pending state

app.use(createChargeRouter);
app.use(errorHandlers);
//which is why we should use next function
app.use("*", async (req: Request, res: Response, next: NextFunction) => {
  throw new NotFoundError();
});
export { app };
