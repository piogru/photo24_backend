import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Post, { PostInput } from "../models/post.model";
import { IPhoto } from "../models/photo.model";
import Comment from "../models/comment.model";
import Like from "../models/like.model";
import User from "../models/user.model";
import Follow from "../models/follow.model";

const getAllPosts = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query;
  const posts = await Post.find(query)
    .sort("-createdAt")
    .populate("user", ["_id", "name"])
    .exec();

  res.status(200).json(posts);
});

const getFollowingPosts = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    res.status(401).json({ message: "Could not identify user" });
    return;
  }

  const followsGrouped = await Follow.aggregate([
    { $match: { follower: user._id } },
    { $group: { _id: "", targets: { $push: "$target" } } },
    { $project: { _id: 0, targets: 1 } },
  ]);

  const followedUserIds =
    followsGrouped.length === 1 ? followsGrouped[0].targets : [];

  const posts = await Post.find({
    createdAt: {
      $gte: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 3),
    },
    user: { $in: followedUserIds },
  })
    .sort("-createdAt")
    .populate("user", ["_id", "name", "profilePic"])
    .exec();

  res.status(200).json(posts);
});

const getPost = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const post = await Post.findOne({ _id: id })
    .populate("user", ["_id", "name"])
    .exec();

  if (!post) {
    res.status(404).json({ message: `Post with id "${id}" not found.` });
    return;
  }

  res.status(200).json(post);
});

const createPost = asyncHandler(async (req: Request, res: Response) => {
  const { caption, hideLikes, commentsOff, fileInfo } = req.body;
  const user = req.user;
  const parsedFileInfo = fileInfo.map((stringifiedObj: string) =>
    JSON.parse(stringifiedObj)
  );
  let photos: IPhoto[] = [];

  if (!req.files) {
    res.status(422).json({ message: "No file uploaded" });
    return;
  }
  if (!user) {
    res.status(401).json({ message: "Could not identify user" });
    return;
  }

  if (Array.isArray(req.files)) {
    photos = req.files.map((file, index) => ({
      url: file.path,
      ...parsedFileInfo[index],
    }));
  } else {
    res.status(422).json({ message: "File error" });
    return;
  }

  const postInput: PostInput = {
    user: user._id,
    photos,
    caption,
    hideLikes: JSON.parse(hideLikes),
    commentsOff: JSON.parse(commentsOff),
  };
  const postCreated = await Post.create(postInput);

  await User.findByIdAndUpdate(user._id, { $inc: { posts: 1 } });

  res.status(201).json(postCreated);
});

const updatePost = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { altText } = req.body;

  const post = await Post.findOne({ _id: id });

  if (!post) {
    res.status(404).json({ message: `Post with id "${id}" not found.` });
    return;
  }

  await Post.updateOne({ _id: id }, { altText: altText });

  const photoUpdated = await Post.findById(id, { altText });

  res.status(200).json(photoUpdated);
});

const deletePost = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;

  const post = await Post.findById(id);

  if (!post) {
    res.status(404).json({ message: `Post with id "${id}" not found.` });
    return;
  }
  if (post.user !== user?._id) {
    res.status(401).json({ message: `User is not Post owner.` });
    return;
  }

  await User.findByIdAndUpdate(post.user, { $inc: { posts: -1 } });
  await post.deleteOne();

  res.status(200).json({ message: "Post deleted successfully." });
});

const getCurrentUserLike = asyncHandler(async (req: Request, res: Response) => {
  const { targetId } = req.params;
  const user = req.user;

  if (!targetId) {
    res.status(422).json({ message: "No like target specified" });
    return;
  }
  if (!user) {
    res.status(401).json({ message: "Could not identify user" });
    return;
  }

  const like = await Like.findOne({
    user: user._id,
    target: targetId,
  }).exec();

  res.status(200).json(like);
});

const likePost = asyncHandler(async (req: Request, res: Response) => {
  const { targetId } = req.params;
  const user = req.user;

  if (!user) {
    res.status(401).json({ message: "Could not identify user" });
    return;
  }

  const like = await Like.findOne({ target: targetId, user: user?._id });
  const post = await Post.findById(targetId);

  if (!post) {
    res.status(404).json({ message: `Post with id "${targetId}" not found.` });
    return;
  }
  if (like) {
    res.status(422).json({ message: "Post has already been liked" });
    return;
  }

  const createdDocument = await Like.create({
    user: user?._id,
    target: targetId,
    targetModel: "Post",
  });

  await Post.findByIdAndUpdate(targetId, { $inc: { likes: 1 } });

  res.status(201).json(createdDocument);
});

const unlikePost = asyncHandler(async (req: Request, res: Response) => {
  const { targetId } = req.params;
  const user = req.user;

  const like = await Like.findOne({ target: targetId, user: user?._id });

  if (!like) {
    res.status(422).json({ message: "Post hasn't been liked" });
    return;
  }

  await like.deleteOne().exec();
  await Post.findByIdAndUpdate(targetId, { $inc: { likes: -1 } });

  res.status(200).json({ message: "Like removed successfully." });
});

const createComment = asyncHandler(async (req: Request, res: Response) => {
  const { targetId } = req.params;
  const { content } = req.body;
  const user = req.user;

  if (!req.files) {
    res.status(422).json({ message: "No file uploaded" });
    return;
  }
  if (!user) {
    res.status(401).json({ message: "Could not identify user" });
    return;
  }

  const createdDocument = await Comment.create({
    content,
    target: targetId,
    targetModel: "Post",
  });

  res.status(201).json(createdDocument);
});

export {
  getPost,
  getAllPosts,
  getFollowingPosts,
  createPost,
  updatePost,
  deletePost,
  getCurrentUserLike,
  likePost,
  unlikePost,
  createComment,
};
