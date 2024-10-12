import mongoose, { Schema } from "mongoose";

interface IPhoto {
  publicId: string;
  url: string;
  altText?: string;
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
  },
  {
    collection: "photos",
    timestamps: true,
  }
);

const Photo = mongoose.model("Photo", photoSchema);

export { IPhoto, PhotoInput, photoSchema };
export default Photo;
