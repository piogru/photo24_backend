import express from "express";
import {
  follow,
  getFollowers,
  getFollowing,
  unfollow,
} from "../controllers/follows.controller";

const followsRouter = express.Router();

followsRouter.get("/:targetId", getFollowers);
followsRouter.get("/:followerId", getFollowing);
followsRouter.post("/:target", follow);
followsRouter.delete("/:target", unfollow);

export default followsRouter;
