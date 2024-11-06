import { z } from "zod";
import { userSchema } from "./user.schema";

export const signupUserSchema = z.object({
  body: z
    .object({
      email: z.string().email().max(128),
      name: z.string().max(128),
      password: z.string().max(128),
    })
    .strict(),
});

export const loginUserSchema = z.object({
  body: z
    .object({
      userId: z.string().max(128),
      password: z.string().max(128),
    })
    .strict(),
});

export const loginAnonymousSchema = z.object({
  body: z.object({}).strict(),
});

export const getUserSchema = z.object({
  user: userSchema.required(),
});
