import mongoose, { Schema, Types } from "mongoose";

interface ILike {
  target: Types.ObjectId;
  targetModel: "Post" | "Comment";
}

type LikeInput = {
  target: ILike["target"];
  targetModel: ILike["targetModel"];
};

const likeSchema = new Schema<ILike>(
  {
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
