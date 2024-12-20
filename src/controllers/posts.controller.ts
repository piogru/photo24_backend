import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import cloudinary from "cloudinary";
import Post, { PostInput } from "../models/post.model";
import { IPhoto } from "../models/photo.model";
import Comment from "../models/comment.model";
import Like from "../models/like.model";
import User from "../models/user.model";
import Follow from "../models/follow.model";
import { assertHasUser } from "../utils/user.util";
import { Types } from "mongoose";

const getAllPosts = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query;
  const posts = await Post.find(query)
    .sort("-createdAt")
    .populate("user", ["_id", "name", "profilePic"])
    .exec();

  res.status(200).json(posts);
});

const getForYouPosts = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;
  let userFilter: Types.ObjectId[] = [];

  if (user) {
    userFilter = [user._id];
  }

  const posts = await Post.find({
    createdAt: {
      $gte: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 3),
    },
    user: { $nin: userFilter },
  })
    .sort("-createdAt")
    .populate("user", ["_id", "name", "profilePic"])
    .exec();

  res.status(200).json(posts);
});

const getFollowingPosts = asyncHandler(async (req: Request, res: Response) => {
  assertHasUser(req, res);
  const user = req.user;

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
    .populate("user", ["_id", "name", "profilePic"])
    .exec();

  if (!post) {
    res.status(404).json({ message: `Post with id "${id}" not found.` });
    return;
  }

  res.status(200).json(post);
});

const createPost = asyncHandler(async (req: Request, res: Response) => {
  assertHasUser(req, res);
  const { caption, hideLikes, commentsOff, fileInfo } = req.body;
  const user = req.user;
  const parsedFileInfo = fileInfo.map((stringifiedObj: string) =>
    JSON.parse(stringifiedObj)
  );
  let photos: IPhoto[] = [];

  if (Array.isArray(req.files)) {
    photos = await Promise.all(
      req.files.map(async (file, index) => {
        const metadata = await cloudinary.v2.uploader
          .explicit(file.filename, { type: "upload", resource_type: "image" })
          .then((res) => {
            return res;
          })
          .catch((error) => {
            res.status(502).json({ message: "Unable to upload file" });
            return;
          });

        return {
          url: file.path,
          publicId: file.filename,
          altText: parsedFileInfo[index].altText,
          width: metadata.width,
          height: metadata.height,
          hwRatio: `${(metadata.height / metadata.width) * 100}%`,
        };
      })
    );
  } else {
    res.status(422).json({ message: "No files provided" });
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
  assertHasUser(req, res);
  const { id } = req.params;
  const { caption } = req.body;
  const user = req.user;

  const post = await Post.findOne({ _id: id });

  if (!post) {
    res.status(404).json({ message: `Post with id "${id}" not found.` });
    return;
  }
  if (!post.user.equals(user?._id)) {
    res.status(401).json({ message: `User is not Post owner.` });
    return;
  }

  const photoUpdated = await Post.updateOne(
    { _id: id },
    { caption: caption },
    { new: true }
  );

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
  if (!post.user.equals(user?._id)) {
    res.status(401).json({ message: `User is not Post owner.` });
    return;
  }

  const destroyPromises = post.photos.map((photo) => {
    return cloudinary.v2.uploader.destroy(photo.publicId);
  });

  await Promise.all(destroyPromises)
    .then((res) => {})
    .catch((error) => {
      res
        .status(502)
        .json({ message: `Failed to delete one or more photos from post.` });
      return;
    });

  await User.findByIdAndUpdate(post.user, { $inc: { posts: -1 } });
  await post.deleteOne();

  res.status(200).json({ message: "Post deleted successfully." });
});

const getCurrentUserLike = asyncHandler(async (req: Request, res: Response) => {
  assertHasUser(req, res);
  const { targetId } = req.params;
  const user = req.user;

  const like = await Like.findOne({
    user: user._id,
    target: targetId,
  }).exec();

  res.status(200).json(like);
});

const likePost = asyncHandler(async (req: Request, res: Response) => {
  assertHasUser(req, res);
  const { targetId } = req.params;
  const user = req.user;

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
  assertHasUser(req, res);
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
  res.status(501).json({ message: "Not implemented" });
  return;
  assertHasUser(req, res);
  const { targetId } = req.params;
  const { content } = req.body;
  const user = req.user;

  // todo: Add user to document
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
  getForYouPosts,
  getFollowingPosts,
  createPost,
  updatePost,
  deletePost,
  getCurrentUserLike,
  likePost,
  unlikePost,
  createComment,
};
