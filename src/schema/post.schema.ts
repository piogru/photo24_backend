import { Types } from "mongoose";
import { z } from "zod";
import { userSchema } from "./user.schema";

export const getAllPostsSchema = z.object({
  query: z
    .object({
      user: z.instanceof(Types.ObjectId).optional(),
    })
    .strict(),
});

export const getForYouPostsSchema = z.object({
  user: userSchema.required(),
});

export const getFollowingPostsSchema = z.object({
  user: userSchema.required(),
});

export const getPostSchema = z.object({
  params: z
    .object({
      id: z.instanceof(Types.ObjectId).optional(),
    })
    .strict(),
});

export const createPostSchema = z.object({
  body: z
    .object({
      caption: z.string().max(2500),
      fileInfo: z.array(
        z.object({
          altText: z.string().max(128).optional(),
        })
      ),
      hideLikes: z.boolean(),
      commentsOff: z.boolean(),
    })
    .strict(),
});

export const updatePostSchema = z.object({
  params: z
    .object({
      id: z.instanceof(Types.ObjectId).optional(),
    })
    .strict(),
  body: z
    .object({
      caption: z.string().max(2500),
      fileInfo: z.array(
        z.object({
          altText: z.string().max(128).optional(),
        })
      ),
      hideLikes: z.boolean(),
      commentsOff: z.boolean(),
    })
    .strict(),
  user: userSchema.required(),
});

export const deletePostSchema = z.object({
  params: z
    .object({
      id: z.instanceof(Types.ObjectId).optional(),
    })
    .strict(),
  user: userSchema.required(),
});

export const getCurrentUserLikeSchema = z.object({
  params: z
    .object({
      targetId: z.instanceof(Types.ObjectId).optional(),
    })
    .strict(),
  user: userSchema.required(),
});

export const likePostSchema = z.object({
  params: z
    .object({
      targetId: z.instanceof(Types.ObjectId).optional(),
    })
    .strict(),
  user: userSchema.required(),
});

export const unlikePostSchema = z.object({
  params: z
    .object({
      targetId: z.instanceof(Types.ObjectId).optional(),
    })
    .strict(),
  user: userSchema.required(),
});

export const createCommentSchema = z.object({
  params: z
    .object({
      targetId: z.instanceof(Types.ObjectId).optional(),
    })
    .strict(),
  body: z
    .object({
      description: z.string().max(2500).optional(),
    })
    .strict(),
});
