import mongoose, { Schema, Model, Document } from "mongoose";

type PhotoDocument = Document & {
  title: string;
  description: string | null;
  imgUrl: string;
};

type PhotoInput = {
  title: PhotoDocument["title"];
  description: PhotoDocument["description"];
  imgUrl: PhotoDocument["imgUrl"];
};

const photoSchema = new Schema(
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

const Photo: Model<PhotoDocument> = mongoose.model<PhotoDocument>(
  "Photo",
  photoSchema
);

export { Photo, PhotoInput, PhotoDocument };
