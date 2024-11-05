import express from "express";
import {
  signupUser,
  getUser,
  logoutUser,
  loginUser,
  loginAnonymous,
} from "../controllers/auth.controller";
import validateResource from "../middlewares/validateResource.middleware";
import { getUserSchema } from "../schema/user.schema";
import {
  loginAnonymousSchema,
  loginUserSchema,
  signupUserSchema,
} from "../schema/auth.schema";
import passport from "passport";

const router = express.Router();

router.get(
  "/me",
  [
    validateResource(getUserSchema),
    passport.authenticate(["session", "anonymous"]),
  ],
  getUser
);
router.post("/signup", validateResource(signupUserSchema), signupUser);
router.post("/login", validateResource(loginUserSchema), loginUser);
router.post(
  "/guest",
  [validateResource(loginAnonymousSchema), passport.authenticate("anonymous")],
  loginAnonymous
);
router.post(
  "/logout",
  passport.authenticate(["session", "anonymous"]),
  logoutUser
);

export default router;
