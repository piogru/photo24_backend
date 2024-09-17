import { Request, Response } from "express";
import Post, { PostInput } from "../models/post.model";
import { IPhoto } from "../models/photo.model";
import Comment from "../models/comment.model";
import Like from "../models/like.model";

async function getAllPosts(req: Request, res: Response) {
  const posts = await Post.find().sort("-createdAt").exec();

  return res.status(200).json(posts);
}

async function getPost(req: Request, res: Response) {
  const { id } = req.params;
  const post = await Post.findOne({ _id: id });

  if (!post) {
    return res.status(404).json({ message: `Post with id "${id}" not found.` });
  }

  return res.status(200).json(post);
}

async function createPost(req: Request, res: Response) {
  const { caption, hideLikes, commentsOff, fileInfo } = req.body;
  const user = req.user;
  const parsedFileInfo = fileInfo.map((stringifiedObj: string) =>
    JSON.parse(stringifiedObj)
  );
  let photos: IPhoto[] = [];

  if (!req.files) {
    return res.status(422).json({ message: "No file uploaded" });
  }
  if (!user) {
    return res.status(401).json({ message: "Could not identify user" });
  }

  if (Array.isArray(req.files)) {
    photos = req.files.map((file, index) => ({
      url: file.path,
      ...parsedFileInfo[index],
    }));
  } else {
    return res.status(422).json({ message: "File error" });
  }

  const postInput: PostInput = {
    user: user._id,
    photos,
    caption,
    hideLikes: JSON.parse(hideLikes),
    commentsOff: JSON.parse(commentsOff),
  };
  const postCreated = await Post.create(postInput);

  return res.status(201).json(postCreated);
}

async function updatePost(req: Request, res: Response) {
  const { id } = req.params;
  const { altText } = req.body;

  const post = await Post.findOne({ _id: id });

  if (!post) {
    return res.status(404).json({ message: `Post with id "${id}" not found.` });
  }

  await Post.updateOne({ _id: id }, { altText: altText });

  const photoUpdated = await Post.findById(id, { altText });

  return res.status(200).json(photoUpdated);
}

async function deletePost(req: Request, res: Response) {
  const { id } = req.params;

  await Post.findByIdAndDelete(id);

  return res.status(200).json({ message: "Post deleted successfully." });
}

async function likePost(req: Request, res: Response) {
  const { id } = req.params;
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "Could not identify user" });
  }

  const like = await Like.findOne({ target: id, user: user?._id });
  const post = await Post.findById(id);

  if (!post) {
    return res.status(404).json({ message: `Post with id "${id}" not found.` });
  }
  if (like) {
    return res.status(422).json({ message: "Post has already been liked" });
  }

  const createdDocument = await Like.create({
    user: user?._id,
    target: id,
    targetModel: "Post",
  });

  return res.status(201).json(createdDocument);
}

async function unlikePost(req: Request, res: Response) {
  const { id } = req.params;
  const user = req.user;

  const like = await Like.findOne({ target: id, user: user?._id });

  if (!like) {
    return res.status(422).json({ message: "Post hasn't been liked" });
  }

  return res.status(200).json({ message: "Like removed successfully." });
}

async function createComment(req: Request, res: Response) {
  const { id } = req.params;
  const { content } = req.body;
  const user = req.user;

  if (!req.files) {
    return res.status(422).json({ message: "No file uploaded" });
  }
  if (!user) {
    return res.status(401).json({ message: "Could not identify user" });
  }

  const createdDocument = await Comment.create({
    content,
    target: id,
    targetModel: "Post",
  });

  return res.status(201).json(createdDocument);
}

export {
  getPost,
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  createComment,
};
