import express from "express";
import {
  getPhoto,
  getAllPhotos,
  createPhoto,
  updatePhoto,
  deletePhoto,
} from "../controllers/photos.controller";
import uploadMiddleware from "../middlewares/upload.middleware";

const photosRouter = express.Router();
const upload = uploadMiddleware("photos");

photosRouter.get("/", getAllPhotos);

photosRouter.get("/:id", getPhoto);

photosRouter.post("/", upload.single("img"), createPhoto);

photosRouter.put("/:id", updatePhoto);

photosRouter.delete("/:id", deletePhoto);

export default photosRouter;
