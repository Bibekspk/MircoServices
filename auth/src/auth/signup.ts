import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { body } from "express-validator";

import { validateRequest } from "@bibekorg/common";
import { BadRequestError } from "@bibekorg/common";
import { User } from "../models/user";
const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: any, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError("User already exists");
    }

    const user = User.build({ email, password });
    await user.save();
    const jwtsign = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    req.session = {
      jwt: jwtsign,
    };

    res.status(201).send(user);
  }
);

export { router as signUpRouter };
