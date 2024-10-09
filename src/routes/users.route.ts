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

const userRouter = express.Router();
const upload = uploadMiddleware("profiles");

userRouter.get("/", validateResource(getUsersSchema), getUsers);
userRouter.get(
  "/recommended",
  validateResource(getRecommendedUsersSchema),
  getReccomendedUsers
);
userRouter.get("/:id", validateResource(getUserSchema), getUser);
userRouter.patch(
  "/self",
  validateResource(updateSelfSchema),
  upload.single("photo"),
  updateSelf
);
userRouter.delete(
  "/self/profilePic",
  validateResource(deleteProfilePicSchema),
  deleteProfilePic
);

export default userRouter;
