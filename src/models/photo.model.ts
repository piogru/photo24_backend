import mongoose, { Schema } from "mongoose";

interface IPhoto {
  url: string;
  altText: string;
}

type PhotoInput = {
  url: IPhoto["url"];
  altText: IPhoto["altText"];
};

const photoSchema = new Schema<IPhoto>(
  {
    url: {
      type: Schema.Types.String,
      required: true,
      unique: true,
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
