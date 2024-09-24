import mongoose, { Schema, Types } from "mongoose";
import bcrypt from "bcryptjs";
import { IPhoto, photoSchema } from "./photo.model";

interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  description: string;
  profilePic?: IPhoto;
  posts: number;
  followers: number;
  following: number;
  comparePassword: (enteredPassword: string) => boolean;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    email: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    password: {
      type: Schema.Types.String,
      required: true,
    },
    description: {
      type: Schema.Types.String,
      default: "",
    },
    profilePic: { type: photoSchema, required: false },
    posts: {
      type: Schema.Types.Number,
      default: 0,
    },
    followers: {
      type: Schema.Types.Number,
      default: 0,
    },
    following: {
      type: Schema.Types.Number,
      default: 0,
    },
  },
  {
    collection: "users",
    timestamps: true,
    toJSON: {
      versionKey: false,
      transform: function (doc, ret, options) {
        delete ret.password;
        delete ret.email;
        return ret;
      },
    },
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export { IUser, userSchema };
export default User;
