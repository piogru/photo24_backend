import mongoose, { Schema } from "mongoose";

interface IPhoto {
  title: string;
  description: string | null;
  imgUrl: string;
}

type PhotoInput = {
  title: IPhoto["title"];
  description: IPhoto["description"];
  imgUrl: IPhoto["imgUrl"];
};

const photoSchema = new Schema<IPhoto>(
  {
    title: {
      type: Schema.Types.String,
      required: true,
    },
    description: {
      type: Schema.Types.String,
      default: null,
    },
    imgUrl: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
  },
  {
    collection: "photos",
    timestamps: true,
  }
);

const Photo = mongoose.model("Photo", photoSchema);

export { IPhoto, PhotoInput };
export default Photo;
