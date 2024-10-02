import express from "express";
import {
  getReccomendedUsers,
  getUser,
  getUsers,
  deleteProfilePic,
  updateSelf,
} from "../controllers/users.controller";
import uploadMiddleware from "../middlewares/upload.middleware";

const userRouter = express.Router();
const upload = uploadMiddleware("profiles");

userRouter.get("/", getUsers);
userRouter.get("/recommended", getReccomendedUsers);
userRouter.get("/:id", getUser);
userRouter.patch("/self", upload.single("photo"), updateSelf);
userRouter.delete("/self/profilePic", deleteProfilePic);

export default userRouter;
