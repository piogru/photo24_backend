import { Request, Response } from "express";
import Post, { PostInput } from "../models/post.model";
import Photo, { IPhoto } from "../models/photo.model";

async function getAllPosts(req: Request, res: Response) {
  const posts = await Post.find().sort("-createdAt").exec();

  return res.status(200).json({ data: posts });
}

async function getPost(req: Request, res: Response) {
  const { id } = req.params;
  const post = await Post.findOne({ _id: id });

  if (!post) {
    return res.status(404).json({ message: `Post with id "${id}" not found.` });
  }

  return res.status(200).json({ data: post });
}

async function createPost(req: Request, res: Response) {
  const { caption, hideLikes, commentsOff, fileInfo } = req.body;
  const parsedFileInfo = fileInfo.map((stringifiedObj: string) =>
    JSON.parse(stringifiedObj)
  );
  let photos: IPhoto[] = [];

  if (!req.files) {
    return res.status(422).json({ message: "No file uploaded" });
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
    photos,
    caption,
    hideLikes: JSON.parse(hideLikes),
    commentsOff: JSON.parse(commentsOff),
  };
  const postCreated = await Post.create(postInput);

  console.log(postCreated);

  return res.status(201).json({ data: postCreated });
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

  return res.status(200).json({ data: photoUpdated });
}

async function deletePost(req: Request, res: Response) {
  const { id } = req.params;

  await Post.findByIdAndDelete(id);

  return res.status(200).json({ message: "Post deleted successfully." });
}

export { getPost, getAllPosts, createPost, updatePost, deletePost };
