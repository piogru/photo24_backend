import { Request, Response } from "express";
import { Photo, PhotoInput } from "../models/photo.model";

async function getAllPhotos(req: Request, res: Response) {
  const photos = await Photo.find().sort("-createdAt").exec();

  return res.status(200).json({ data: photos });
}

async function getPhoto(req: Request, res: Response) {
  const { id } = req.params;
  const photo = await Photo.findOne({ _id: id });

  if (!photo) {
    return res
      .status(404)
      .json({ message: `Photo with id "${id}" not found.` });
  }

  return res.status(200).json({ data: photo });
}

async function createPhoto(req: Request, res: Response) {
  const { description, title } = req.body;

  if (!title || !description) {
    return res.status(422).json({
      message: "The fields title and description are required",
    });
  }
  if (!req.file) {
    return res.status(422).json({ message: "No file uploaded" });
  }

  const imgUrl = req.file.path; // URL of the uploaded file in Cloudinary
  const photoInput: PhotoInput = {
    title,
    description,
    imgUrl,
  };
  const photoCreated = await Photo.create(photoInput);

  return res.status(201).json({ data: photoCreated });
}

async function updatePhoto(req: Request, res: Response) {
  const { id } = req.params;
  const { description, title } = req.body;

  const photo = await Photo.findOne({ _id: id });

  if (!photo) {
    return res
      .status(404)
      .json({ message: `Photo with id "${id}" not found.` });
  }

  if (!title || !description) {
    return res
      .status(422)
      .json({ message: "The fields name and description are required" });
  }

  await Photo.updateOne({ _id: id }, { name: title, description });

  const photoUpdated = await Photo.findById(id, { name: title, description });

  return res.status(200).json({ data: photoUpdated });
}

async function deletePhoto(req: Request, res: Response) {
  const { id } = req.params;

  await Photo.findByIdAndDelete(id);

  return res.status(200).json({ message: "Photo deleted successfully." });
}

export { getPhoto, getAllPhotos, createPhoto, updatePhoto, deletePhoto };
