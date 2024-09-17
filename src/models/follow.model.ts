import mongoose, { Schema, Types } from "mongoose";

interface IFollow {
  follower: Types.ObjectId;
  target: Types.ObjectId;
}

type FollowInput = {
  follower: IFollow["follower"];
  target: IFollow["target"];
};

const followSchema = new Schema<IFollow>(
  {
    follower: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    target: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  },
  {
    collection: "follows",
    timestamps: true,
  }
);

const Follow = mongoose.model("Follow", followSchema);

export { IFollow, FollowInput };
export default Follow;
