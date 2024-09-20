import mongoose, { Schema, Types } from "mongoose";
import bcrypt from "bcryptjs";

interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
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
  },
  {
    collection: "users",
    timestamps: true,
    toJSON: {
      versionKey: false,
      transform: function (doc, ret, options) {
        delete ret.password;
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
