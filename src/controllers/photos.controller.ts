import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Photo, { PhotoInput } from "../models/photo.model";

const getAllPhotos = asyncHandler(async (req: Request, res: Response) => {
  const photos = await Photo.find().sort("-createdAt").exec();

  res.status(200).json({ data: photos });
});

const getPhoto = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const photo = await Photo.findOne({ _id: id });

  if (!photo) {
    res.status(404).json({ message: `Photo with id "${id}" not found.` });
    return;
  }

  res.status(200).json({ data: photo });
});

const createPhoto = asyncHandler(async (req: Request, res: Response) => {
  const { altText = "" } = req.body;

  if (!req.file) {
    res.status(422).json({ message: "No file uploaded" });
    return;
  }

  const url = req.file.path; // URL of the uploaded file in Cloudinary
  const photoInput: PhotoInput = {
    altText,
    url,
  };
  const photoCreated = await Photo.create(photoInput);

  res.status(201).json({ data: photoCreated });
});

const updatePhoto = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { altText = "" } = req.body;

  const photo = await Photo.findOne({ _id: id });

  if (!photo) {
    res.status(404).json({ message: `Photo with id "${id}" not found.` });
    return;
  }

  await Photo.updateOne({ _id: id }, { altText: altText });

  const photoUpdated = await Photo.findById(id, { altText });

  res.status(200).json({ data: photoUpdated });
});

const deletePhoto = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  await Photo.findByIdAndDelete(id);

  res.status(200).json({ message: "Photo deleted successfully." });
});

export { getPhoto, getAllPhotos, createPhoto, updatePhoto, deletePhoto };
