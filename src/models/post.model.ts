import mongoose, { Schema, Types } from "mongoose";
import { IPhoto, photoSchema } from "./photo.model";
import { commentSchema, IComment } from "./comment.model";

interface IPost {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  photos: IPhoto[];
  caption: string;
  likes: number;
  comments: IComment[];
  hideLikes: boolean;
  commentsOff: boolean;
}

type PostInput = {
  user: IPost["user"];
  photos: IPost["photos"];
  caption: IPost["caption"];
  hideLikes: IPost["hideLikes"];
  commentsOff: IPost["commentsOff"];
};

const postSchema = new Schema<IPost>(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    photos: [photoSchema],
    caption: {
      type: Schema.Types.String,
      required: true,
    },
    likes: {
      type: Schema.Types.Number,
      required: true,
      default: 0,
    },
    comments: [commentSchema],
    hideLikes: {
      type: Schema.Types.Boolean,
      required: true,
      default: false,
    },
    commentsOff: {
      type: Schema.Types.Boolean,
      required: true,
      default: false,
    },
  },
  {
    collection: "posts",
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);

export { IPost, PostInput };
export default Post;
