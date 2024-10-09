import express from "express";
import {
  signupUser,
  getUser,
  logoutUser,
  loginUser,
} from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";
import validateResource from "../middlewares/validateResource.middleware";
import { getUserSchema } from "../schema/user.schema";
import { loginUserSchema, signupUserSchema } from "../schema/auth.schema";

const router = express.Router();

router.get("/me", [validateResource(getUserSchema), authenticate], getUser);
router.post("/signup", validateResource(signupUserSchema), signupUser);
router.post("/login", validateResource(loginUserSchema), loginUser);
router.post("/logout", logoutUser);

export default router;
