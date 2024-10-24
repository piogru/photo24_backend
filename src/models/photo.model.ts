import mongoose, { Schema } from "mongoose";

interface IPhoto {
  publicId: string;
  url: string;
  altText?: string;
  aspectRatio?: string;
  hwRatio: string;
  width: number;
  height: number;
}

type PhotoInput = {
  url: IPhoto["url"];
  altText: IPhoto["altText"];
};

const photoSchema = new Schema<IPhoto>(
  {
    publicId: {
      type: Schema.Types.String,
      required: true,
      unique: true,
      sparse: true,
    },
    url: {
      type: Schema.Types.String,
      required: true,
      unique: true,
      sparse: true,
    },
    altText: {
      type: Schema.Types.String,
      required: false,
      default: "",
    },
    aspectRatio: {
      type: Schema.Types.String,
      enum: ["16/9", "4/3"],
      required: false,
    },
    hwRatio: {
      type: Schema.Types.String,
      required: true,
      default: "100%",
    },
    width: {
      type: Schema.Types.Number,
      required: true,
    },
    height: {
      type: Schema.Types.Number,
      required: true,
    },
  },
  {
    collection: "photos",
    timestamps: true,
  }
);

const Photo = mongoose.model("Photo", photoSchema);

export { IPhoto, PhotoInput, photoSchema };
export default Photo;
