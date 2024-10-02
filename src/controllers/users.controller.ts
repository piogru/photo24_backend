import { Request, Response } from "express";
import cloudinary from "cloudinary";
import asyncHandler from "express-async-handler";
import User from "../models/user.model";
import { parseBoolean } from "../utils/query.util";

type UserFilters = {
  email?: string;
  name?: string;
  partial?: string;
};

const getUsers = asyncHandler(
  async (req: Request<{}, {}, {}, UserFilters>, res: Response) => {
    const { partial, ...rest } = req.query;
    const partialSearch = parseBoolean(partial);

    const users = partialSearch
      ? await User.find({
          name: { $regex: rest.name, $options: "i" },
        })
          .limit(10)
          .maxTimeMS(5000)
          .exec()
      : await User.find(rest);

    if (!users) {
      res.status(400);
    }

    res.status(200).json(users);
  }
);

const getReccomendedUsers = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user;

    if (!user) {
      res.status(401).json({ message: "Could not identify user" });
      return;
    }

    const recommendedUsers = await User.aggregate([
      { $match: { _id: { $nin: [user._id] } } },
      { $sample: { size: 5 } },
      {
        $lookup: {
          from: "follows",
          localField: "_id",
          foreignField: "target",
          as: "follow",
          pipeline: [
            {
              $match: { follower: user._id },
            },
          ],
        },
      },
      { $project: { _id: 1, name: 1, profilePic: 1, follow: 1 } },
      { $unwind: { path: "$follow", preserveNullAndEmptyArrays: true } },
    ]).exec();

    if (!recommendedUsers) {
      res
        .status(400)
        .json({ message: "Unable to create a list of recommended users" });
    }

    res.status(200).json(recommendedUsers);
  }
);

const getUser = asyncHandler(async (req: Request, res: Response) => {
  res.status(501).json({ message: "Not implemented" });
});

const updateSelf = asyncHandler(async (req: Request, res: Response) => {
  const { description } = req.body;
  const file = req.file;
  const user = await User.findById(req.user?._id);

  if (!req.file) {
    res.status(422).json({ message: "No file uploaded" });
    return;
  }
  if (!user) {
    res.status(401).json({ message: "Could not identify user" });
    return;
  }

  // if file changes - remove old photo from Cloudinary
  if (file && user.profilePic) {
    await cloudinary.v2.uploader
      .destroy(user.profilePic.publicId)
      .then(() => {})
      .catch(() => {
        res
          .status(502)
          .json({ message: `Failed to delete old profile picture.` });
        return;
      });
  }

  // update user
  const updateObject = {
    ...(description && { description }),
    ...(file && {
      profilePic: {
        url: file.path,
        publicId: file.filename,
      },
    }),
  };
  await user.updateOne(updateObject);

  const userUpdated = await User.findById(user._id);

  res.status(200).json(userUpdated);
});

const deleteProfilePic = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user?._id);

  if (!user) {
    res.status(401).json({ message: "Could not identify user." });
    return;
  }
  if (!user.profilePic) {
    res.status(404).json({ message: "User has no profile picture." });
    return;
  }

  await cloudinary.v2.uploader
    .destroy(user.profilePic.publicId)
    .then(() => {})
    .catch(() => {
      res.status(502).json({ message: `Failed to delete profile picture.` });
      return;
    });

  user.profilePic = undefined;
  await user.save();

  res.status(200).json(user);
});

export { getUsers, getReccomendedUsers, getUser, updateSelf, deleteProfilePic };
