import express from "express";
import {
  follow,
  getCurrentUserFollow,
  getFollowers,
  getFollowing,
  unfollow,
} from "../controllers/follows.controller";
import validateResource from "../middlewares/validateResource.middleware";
import {
  followSchema,
  getCurrentUserFollowSchema,
  getFollowersSchema,
  getFollowingSchema,
  unfollowSchema,
} from "../schema/follow.schema";
import { authorize } from "../middlewares/auth.middleware";

const followsRouter = express.Router();

followsRouter.get(
  "/:targetId",
  [authorize, validateResource(getCurrentUserFollowSchema)],
  getCurrentUserFollow
);
followsRouter.get(
  "/:targetId/followers",
  validateResource(getFollowersSchema),
  getFollowers
);
followsRouter.get(
  "/:followerId/following",
  validateResource(getFollowingSchema),
  getFollowing
);
followsRouter.post(
  "/:targetId",
  [authorize, validateResource(followSchema)],
  follow
);
followsRouter.delete(
  "/:targetId",
  [authorize, validateResource(unfollowSchema)],
  unfollow
);

export default followsRouter;
