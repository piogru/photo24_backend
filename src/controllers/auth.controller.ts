import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../models/user.model";
import { clearToken, generateToken } from "../utils/auth.util";

const signupUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({
    $or: [{ name: name }, { email: email }],
  });

  if (userExists) {
    res.status(400).json({ message: "The user already exists" });
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res
      .status(400)
      .json({ message: "An error occurred while creating the user" });
  }
});

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { userId, password } = req.body; // userId = email/username
  const user = await User.findOne({
    $or: [{ name: userId }, { email: userId }],
  });

  if (user && (await user.comparePassword(password))) {
    generateToken(res, user._id);
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(401).json({ message: "User not found / password incorrect" });
  }
});

// /me
const getUser = async (req: Request, res: Response) => {
  res.status(200).json({ user: req.user });
};

const logoutUser = (req: Request, res: Response) => {
  clearToken(res);
  res.status(200).json({ message: "User logged out" });
};

export { signupUser, loginUser, getUser as authenticateUser, logoutUser };
