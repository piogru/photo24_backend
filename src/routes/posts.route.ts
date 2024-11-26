import express from "express";
import {
  createComment,
  createPost,
  deletePost,
  getAllPosts,
  getCurrentUserLike,
  getFollowingPosts,
  getForYouPosts,
  getPost,
  likePost,
  unlikePost,
  updatePost,
} from "../controllers/posts.controller";
import uploadMiddleware from "../middlewares/upload.middleware";
import validateResource from "../middlewares/validateResource.middleware";
import {
  createCommentSchema,
  createPostSchema,
  deletePostSchema,
  getAllPostsSchema,
  getCurrentUserLikeSchema,
  getFollowingPostsSchema,
  getPostSchema,
  likePostSchema,
  unlikePostSchema,
  updatePostSchema,
} from "../schema/post.schema";
import { authorize } from "../middlewares/auth.middleware";

const postsRouter = express.Router();
const upload = uploadMiddleware("photos");

postsRouter.get("/", validateResource(getAllPostsSchema), getAllPosts);
postsRouter.get("/for-you", getForYouPosts);
postsRouter.get(
  "/following",
  [authorize, validateResource(getFollowingPostsSchema)],
  getFollowingPosts
);
postsRouter.get("/:id", validateResource(getPostSchema), getPost);
postsRouter.post(
  "/",
  [authorize, upload.array("photos[]"), validateResource(createPostSchema)],
  createPost
);
postsRouter.put(
  "/:id",
  [authorize, validateResource(updatePostSchema)],
  updatePost
);
postsRouter.delete(
  "/:id",
  [authorize, validateResource(deletePostSchema)],
  deletePost
);

postsRouter.get(
  "/:targetId/like",
  [authorize, validateResource(getCurrentUserLikeSchema)],
  getCurrentUserLike
);
postsRouter.post(
  "/:targetId/like",
  [authorize, validateResource(likePostSchema)],
  likePost
);
postsRouter.delete(
  "/:targetId/like",
  [authorize, validateResource(unlikePostSchema)],
  unlikePost
);

postsRouter.post(
  "/:targetId/comment",
  [authorize, validateResource(createCommentSchema)],
  createComment
);

export default postsRouter;
