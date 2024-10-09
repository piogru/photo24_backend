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
  getForYouPostsSchema,
  getPostSchema,
  likePostSchema,
  unlikePostSchema,
  updatePostSchema,
} from "../schema/post.schema";

const postsRouter = express.Router();
const upload = uploadMiddleware("photos");

postsRouter.get("/", validateResource(getAllPostsSchema), getAllPosts);
postsRouter.get(
  "/for-you",
  validateResource(getForYouPostsSchema),
  getForYouPosts
);
postsRouter.get(
  "/following",
  validateResource(getFollowingPostsSchema),
  getFollowingPosts
);
postsRouter.get("/:id", validateResource(getPostSchema), getPost);
postsRouter.post(
  "/",
  [upload.array("photos[]"), validateResource(createPostSchema)],
  createPost
);
postsRouter.put("/:id", validateResource(updatePostSchema), updatePost);
postsRouter.delete("/:id", validateResource(deletePostSchema), deletePost);

postsRouter.get(
  "/:targetId/like",
  validateResource(getCurrentUserLikeSchema),
  getCurrentUserLike
);
postsRouter.post("/:targetId/like", validateResource(likePostSchema), likePost);
postsRouter.delete(
  "/:targetId/like",
  validateResource(unlikePostSchema),
  unlikePost
);

postsRouter.post(
  "/:targetId/comment",
  validateResource(createCommentSchema),
  createComment
);

export default postsRouter;
