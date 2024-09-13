import express from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPost,
  updatePost,
} from "../controllers/posts.controller";
import uploadMiddleware from "../middlewares/upload.middleware";

const postsRouter = express.Router();
const upload = uploadMiddleware("photos");

postsRouter.get("/", getAllPosts);
postsRouter.get("/:id", getPost);
postsRouter.post("/", upload.array("photos[]", 4), createPost);
postsRouter.put("/:id", updatePost);
postsRouter.delete("/:id", deletePost);

export default postsRouter;
