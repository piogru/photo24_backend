import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Follow, { FollowInput } from "../models/follow.model";
import User from "../models/user.model";

const getCurrentUserFollow = asyncHandler(
  async (req: Request, res: Response) => {
    const { targetId } = req.params;
    const user = req.user;

    if (!targetId) {
      res.status(422).json({ message: "No follow target specified" });
      return;
    }
    if (!user) {
      res.status(401).json({ message: "Could not identify user" });
      return;
    }

    const follow = await Follow.findOne({
      follower: user._id,
      target: targetId,
    }).exec();

    res.status(200).json(follow);
  }
);

// get followers of target user
const getFollowers = asyncHandler(async (req: Request, res: Response) => {
  const { targetId } = req.params;
  const followers = await Follow.find({ target: targetId }).exec();

  res.status(200).json(followers);
});

// get targets that user (follower) is following
const getFollowing = asyncHandler(async (req: Request, res: Response) => {
  const { followerId } = req.params;

  const followers = await Follow.find({ follower: followerId }).exec();

  res.status(200).json(followers);
});

const follow = asyncHandler(async (req: Request, res: Response) => {
  const { targetId } = req.params;
  const user = req.user;

  if (!targetId) {
    res.status(422).json({ message: "No follow target specified" });
    return;
  }
  if (!user) {
    res.status(401).json({ message: "Could not identify user" });
    return;
  }

  const follow = await Follow.findOne({
    follower: user._id,
    target: targetId,
  }).exec();
  if (follow) {
    res.status(422).json({ message: "User is already being followed" });
    return;
  }

  const followInput: FollowInput = {
    follower: user._id,
    target: targetId,
  };
  const created = await Follow.create(followInput);

  await User.findOneAndUpdate({ _id: user._id }, { $inc: { following: 1 } });
  await User.findOneAndUpdate({ _id: targetId }, { $inc: { followers: 1 } });

  res.status(201).json(created);
});

const unfollow = asyncHandler(async (req: Request, res: Response) => {
  const { targetId } = req.params;
  const user = req.user;

  if (!targetId) {
    res.status(422).json({ message: "No follow target specified" });
    return;
  }
  if (!user) {
    res.status(401).json({ message: "Could not identify user" });
    return;
  }

  await Follow.findOneAndDelete({ follower: user?._id, target: targetId });
  await User.findOneAndUpdate({ _id: user._id }, { $dec: { following: -1 } });
  await User.findOneAndUpdate({ _id: targetId }, { $inc: { followers: -1 } });

  res.status(200).json({ message: "Post deleted successfully." });
});

export { getCurrentUserFollow, getFollowers, getFollowing, follow, unfollow };
