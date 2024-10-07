import { Types } from "mongoose";
import { z } from "zod";
import { parseBoolean } from "../utils/query.util";

export const userSchema = z.object(
  {
    _id: z.instanceof(Types.ObjectId),
    name: z.string(),
    email: z.string().email(),
  },
  { required_error: "Could not identify user." }
);

export const getUsersSchema = z.object({
  query: z
    .object({
      partial: z.coerce.boolean().optional(),
      name: z.string().optional(),
    })
    .strict(),
});

export const getRecommendedUsersSchema = z.object({
  user: userSchema.required(),
});

export const getUserSchema = z.object({});

export const updateSelfSchema = z.object({
  body: z
    .object({
      description: z.string().max(1000).optional(),
    })
    .strict(),
  user: userSchema.required(),
});

export const deleteProfilePicSchema = z.object({
  user: userSchema.required(),
});
