import express from "express";
import {
  signupUser,
  getUser,
  logoutUser,
  loginUser,
} from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/me", [authenticate], getUser);
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

export default router;
