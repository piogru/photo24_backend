import express from "express";
import {
  signupUser,
  authenticateUser,
  logoutUser,
} from "../controllers/auth.controller";

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", authenticateUser);
router.post("/logout", logoutUser);

export default router;
