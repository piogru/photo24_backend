import mongoose, { Schema, Types } from "mongoose";

interface ILike {
  user: Types.ObjectId;
  target: Types.ObjectId;
  targetModel: "Post" | "Comment";
}

type LikeInput = {
  user: ILike["user"];
  target: ILike["target"];
  targetModel: ILike["targetModel"];
};

const likeSchema = new Schema<ILike>(
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
  },
  {
    collection: "likes",
    timestamps: true,
  }
);

const Like = mongoose.model("Like", likeSchema);

export { ILike, LikeInput };
export default Like;
