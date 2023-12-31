import express, { Request, Response } from "express";
import { body } from "express-validator";
import { DataBaseConnectionError } from "../errors/database-connection-error";
import { User } from "../models/user";
import { BadRequestError } from "../errors/bad-request-error";
import jwt from "jsonwebtoken";
import { validateRequest } from "../middlewares/validate-request";
const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 to 20"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      throw new BadRequestError("Email in use");
    }

    const user = User.build({ email, password });
    await user.save();

    //generate json web token
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );
    //! says typescript to not check here bcoz we havre already in index

    //store it into session
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  }
);

export { router as signupRouter };
