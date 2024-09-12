import mongoose, { Schema } from "mongoose";
import Photo, { IPhoto, photoSchema } from "./photo.model";

interface IPost {
  photos: IPhoto[];
  caption: string;
  hideLikes: boolean;
  commentsOff: boolean;
}

type PostInput = {
  photos: IPost["photos"];
  caption: IPost["caption"];
  hideLikes: IPost["hideLikes"];
  commentsOff: IPost["commentsOff"];
};

const postSchema = new Schema<IPost>(
  {
    photos: [photoSchema],
    caption: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
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
