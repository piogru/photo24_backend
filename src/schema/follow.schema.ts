import { z } from "zod";
import { userSchema } from "./user.schema";

export const getCurrentUserFollowSchema = z.object({
  params: z
    .object({
      targetId: z.string({
        required_error: "No follow target specified",
      }),
    })
    .strict(),
  user: userSchema.required(),
});

export const getFollowersSchema = z
  .object({
    params: z.object({
      targetId: z.string({
        required_error: "No user specified",
      }),
    }),
  })
  .strict();

export const getFollowingSchema = z.object({
  params: z
    .object({
      followerId: z.string({
        required_error: "No user specified",
      }),
    })
    .strict(),
});

// todo: Move req.user._id - targetId comparison here
export const followSchema = z.object({
  params: z
    .object({
      targetId: z.string({
        required_error: "No follow target specified",
      }),
    })
    .strict(),
});

export const unfollowSchema = z.object({
  params: z
    .object({
      targetId: z.string({
        required_error: "No follow target specified",
      }),
    })
    .strict(),
});
