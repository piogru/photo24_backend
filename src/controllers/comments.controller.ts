import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Comment from "../models/comment.model";

const getAllUserComments = asyncHandler(async (req: Request, res: Response) => {
  res.status(501).json({ message: "Not implemented" });
});

const getComment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const comment = await Comment.findOne({ _id: id });

  if (!comment) {
    res.status(404).json({ message: `comment with id "${id}" not found.` });
  }

  res.status(200).json(comment);
});

const updateComment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { content } = req.body;

  const comment = await Comment.findOne({ _id: id });

  if (!comment) {
    res.status(404).json({ message: `Comment with id "${id}" not found.` });
  }

  await Comment.updateOne({ _id: id }, { content: content });

  const updatedDocument = await Comment.findById(id);

  res.status(200).json(updatedDocument);
});

const deleteComment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  await Comment.findByIdAndDelete(id);

  res.status(200).json({ message: "Comment deleted successfully." });
});

export { getAllUserComments, getComment, updateComment, deleteComment };
