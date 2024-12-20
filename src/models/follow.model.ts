import mongoose, { Schema, Types } from "mongoose";

interface IFollow {
  _id: Types.ObjectId;
  follower: Types.ObjectId;
  target: Types.ObjectId;
}

type FollowInput = {
  follower: IFollow["follower"] | string | number;
  target: IFollow["target"] | string | number;
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
