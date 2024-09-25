import express from "express";
import {
  createComment,
  createPost,
  deletePost,
  getAllPosts,
  getCurrentUserLike,
  getFollowingPosts,
  getPost,
  likePost,
  unlikePost,
  updatePost,
} from "../controllers/posts.controller";
import uploadMiddleware from "../middlewares/upload.middleware";

const postsRouter = express.Router();
const upload = uploadMiddleware("photos");

postsRouter.get("/", getAllPosts);
postsRouter.get("/following", getFollowingPosts);
postsRouter.get("/:id", getPost);
postsRouter.post("/", upload.array("photos[]", 4), createPost);
postsRouter.put("/:id", updatePost);
postsRouter.delete("/:id", deletePost);

postsRouter.get("/:targetId/like", getCurrentUserLike);
postsRouter.post("/:targetId/like", likePost);
postsRouter.delete("/:targetId/like", unlikePost);

postsRouter.post("/:targetId/comment", createComment);

export default postsRouter;
