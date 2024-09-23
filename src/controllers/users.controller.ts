import { Request, Response } from "express";
import User from "../models/user.model";

type UserFilters = {
  email?: string;
};

const getUsers = async (req: Request, res: Response) => {
  const users = await User.find(req.query);

  if (!users) {
    res.status(400);
  }

  res.status(200).json(users);
};

const getUser = async (req: Request, res: Response) => {
  res.status(501).json({ message: "Not implemented" });
};

export { getUsers, getUser };
