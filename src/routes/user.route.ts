import express from "express";
import { getUser, getUsers } from "../controllers/users.controller";

const userRouter = express.Router();

userRouter.get("/", getUsers);
userRouter.get("/:id", getUser);

export default userRouter;
