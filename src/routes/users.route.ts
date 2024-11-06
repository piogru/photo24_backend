import express from "express";
import {
  getReccomendedUsers,
  getUser,
  getUsers,
  deleteProfilePic,
  updateSelf,
} from "../controllers/users.controller";
import uploadMiddleware from "../middlewares/upload.middleware";
import validateResource from "../middlewares/validateResource.middleware";
import {
  deleteProfilePicSchema,
  getRecommendedUsersSchema,
  getUserSchema,
  getUsersSchema,
  updateSelfSchema,
} from "../schema/user.schema";
import { authorize } from "../middlewares/auth.middleware";

const userRouter = express.Router();
const upload = uploadMiddleware("profiles");

userRouter.get("/", validateResource(getUsersSchema), getUsers);
userRouter.get(
  "/recommended",
  [authorize, validateResource(getRecommendedUsersSchema)],
  getReccomendedUsers
);
userRouter.get("/:id", validateResource(getUserSchema), getUser);
userRouter.patch(
  "/self",
  [authorize, validateResource(updateSelfSchema), upload.single("photo")],
  updateSelf
);
userRouter.delete(
  "/self/profilePic",
  [authorize, validateResource(deleteProfilePicSchema)],
  deleteProfilePic
);

export default userRouter;
