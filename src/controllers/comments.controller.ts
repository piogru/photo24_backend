import { Request, Response } from "express";
import Comment from "../models/comment.model";

async function getAllUserComments(req: Request, res: Response) {
  return res.status(501).json({ message: "Not implemented" });
}

async function getComment(req: Request, res: Response) {
  const { id } = req.params;
  const comment = await Comment.findOne({ _id: id });

  if (!comment) {
    return res
      .status(404)
      .json({ message: `comment with id "${id}" not found.` });
  }

  return res.status(200).json(comment);
}

async function updateComment(req: Request, res: Response) {
  const { id } = req.params;
  const { content } = req.body;

  const comment = await Comment.findOne({ _id: id });

  if (!comment) {
    return res
      .status(404)
      .json({ message: `Comment with id "${id}" not found.` });
  }

  await Comment.updateOne({ _id: id }, { content: content });

  const updatedDocument = await Comment.findById(id);

  return res.status(200).json(updatedDocument);
}

async function deleteComment(req: Request, res: Response) {
  const { id } = req.params;

  await Comment.findByIdAndDelete(id);

  return res.status(200).json({ message: "Comment deleted successfully." });
}

export { getAllUserComments, getComment, updateComment, deleteComment };
