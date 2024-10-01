import multer from "multer";
import cloudinary from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const allowedFileTypes = ["image/png", "image/jpeg", "image/jpg"];

export default function uploadMiddleware(folderName: string) {
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary.v2,
    params: {
      folder: "photos",
    },
  });

  return multer({
    storage: storage,
    limits: {
      fileSize: 5 * 1024 * 1024, // keep images size < 5 MB
    },
    fileFilter: (req, file, cb) => {
      if (Array.isArray(req.files) && req.files.length > 4) {
        cb(new Error("Maximum of 4 photos allowed."));
      } else {
        if (allowedFileTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error("Upload error"));
        }
      }
    },
  });
}
