import express from "express";
import {
  follow,
  getCurrentUserFollow,
  getFollowers,
  getFollowing,
  unfollow,
} from "../controllers/follows.controller";

const followsRouter = express.Router();

followsRouter.get("/:targetId", getCurrentUserFollow);
followsRouter.get("/:targetId/followers", getFollowers);
followsRouter.get("/:followerId/following", getFollowing);
followsRouter.post("/:targetId", follow);
followsRouter.delete("/:targetId", unfollow);

export default followsRouter;
