import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../models/user.model";

type UserFilters = {
  email?: string;
};

const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await User.find(req.query);

  if (!users) {
    res.status(400);
  }

  res.status(200).json(users);
});

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

export { getUsers, getReccomendedUsers, getUser };
