import mongoose, { Schema, Types } from "mongoose";

interface IComment {
  user: Types.ObjectId;
  target: Types.ObjectId;
  targetModel: "Post" | "Comment";
  content: string;
  likes: number;
  replies: IComment[];
}

type CommentInput = {
  content: IComment["content"];
  target: IComment["target"];
  targetModel: IComment["targetModel"];
};

const commentSchema = new Schema<IComment>(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    target: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "targetModel",
    },
    targetModel: {
      type: Schema.Types.String,
      required: true,
      enum: ["Post", "Comment"],
    },
    content: {
      type: Schema.Types.String,
      required: true,
    },
    likes: {
      type: Schema.Types.Number,
      required: true,
      default: 0,
    },
    // Replies added below due to self reference
  },
  {
    collection: "comments",
    timestamps: true,
  }
);

commentSchema.add({
  replies: [commentSchema],
});

const Post = mongoose.model("Comment", commentSchema);

export { IComment, CommentInput, commentSchema };
export default Post;
