import express from "express";
import { currentUserPayload } from "../middlewares/current-user-payload";

const router = express.Router();

router.get("/api/users/currentuser", currentUserPayload, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentuserRouter };
