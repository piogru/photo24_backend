import express from "express";
import {
  getReccomendedUsers,
  getUser,
  getUsers,
} from "../controllers/users.controller";

const userRouter = express.Router();

userRouter.get("/", getUsers);
userRouter.get("/recommended", getReccomendedUsers);
userRouter.get("/:id", getUser);

export default userRouter;
