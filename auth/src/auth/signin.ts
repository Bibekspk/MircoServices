import express, { Request, Response } from "express";
import { body } from "express-validator";

import { User } from "../models/user";
import { validateRequest } from "@bibekorg/common";
import { BadRequestError } from "@bibekorg/common";
import { Password } from "../services/password";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password must not be empty"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      throw new BadRequestError("Invalid credentials");
    }

    const passwordmatch = await Password.compare(
      existingUser?.password,
      password
    );

    if (!passwordmatch) {
      throw new BadRequestError("Invalid credentials");
    }

    const jwtsign = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );

    req.session = {
      jwt: jwtsign,
    };

    res.status(201).send(existingUser);
  }
);

export { router as signInRouter };
