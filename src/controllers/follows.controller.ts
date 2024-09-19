import { Request, Response } from "express";
import Follow, { FollowInput } from "../models/follow.model";

async function getCurrentUserFollow(req: Request, res: Response) {
  const { targetId } = req.params;
  const user = req.user;

  if (!targetId) {
    return res.status(422).json({ message: "No follow target specified" });
  }
  if (!user) {
    return res.status(401).json({ message: "Could not identify user" });
  }

  const follow = await Follow.find({
    follower: user._id,
    target: targetId,
  }).exec();

  return res.status(200).json(follow);
}

// get followers of target user
async function getFollowers(req: Request, res: Response) {
  const { targetId } = req.params;
  const followers = await Follow.find({ target: targetId }).exec();

  return res.status(200).json(followers);
}

// get targets that user (follower) is following
async function getFollowing(req: Request, res: Response) {
  const { followerId } = req.params;

  const followers = await Follow.find({ follower: followerId }).exec();

  return res.status(200).json(followers);
}

async function follow(req: Request, res: Response) {
  const { targetId } = req.body;
  const user = req.user;

  if (!targetId) {
    return res.status(422).json({ message: "No follow target specified" });
  }
  if (!user) {
    return res.status(401).json({ message: "Could not identify user" });
  }

  const follow = await Follow.findOne({
    follower: user._id,
    target: targetId,
  }).exec();
  if (follow) {
    return res.status(422).json({ message: "User is already being followed" });
  }

  const followInput: FollowInput = {
    follower: user._id,
    target: targetId,
  };
  const created = await Follow.create(followInput);

  return res.status(201).json(created);
}

async function unfollow(req: Request, res: Response) {
  const { targetId } = req.params;
  const user = req.user;

  await Follow.findOneAndDelete({ follower: user?._id, target: targetId });

  return res.status(200).json({ message: "Post deleted successfully." });
}

export { getCurrentUserFollow, getFollowers, getFollowing, follow, unfollow };
