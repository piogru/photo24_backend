import multer from "multer";
import cloudinary from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { Options } from "multer-storage-cloudinary";

declare interface cloudinaryOptions extends Options {
  params: {
    folder: string;
  };
}

const ALLOWED_FILE_TYPES = ["image/png", "image/jpeg", "image/jpg"];
const IMAGE_MAX_SIZE = 5 * 1024 * 1024;
const IMAGE_LIMIT = Number(process.env.CLOUDINARY_IMAGE_LIMIT);

export default function uploadMiddleware(folderName: string) {
  const multerOpts: cloudinaryOptions = {
    cloudinary: cloudinary.v2,
    params: {
      folder: folderName,
    },
  };
  const storage = new CloudinaryStorage(multerOpts);

  return multer({
    storage: storage,
    limits: {
      fileSize: IMAGE_MAX_SIZE,
    },
    fileFilter: (req, file, cb) => {
      if (Array.isArray(req.files) && req.files.length > IMAGE_LIMIT) {
        cb(new Error(`Maximum of ${IMAGE_LIMIT} photos allowed.`));
      } else {
        if (ALLOWED_FILE_TYPES.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error("Image upload error"));
        }
      }
    },
  });
}
