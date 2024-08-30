import express from "express";
import {
  signupUser,
  authenticateUser,
  logoutUser,
  loginUser,
} from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/me", [authenticate], authenticateUser);
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

export default router;
