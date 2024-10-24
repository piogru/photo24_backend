import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../models/user.model";
import passport from "passport";
import { assertHasUser } from "../utils/user.util";

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
    req.login(user, async () => {
      res.status(201).json({ id: user.id, name: user.name, email: user.email });
    });
  } else {
    res
      .status(400)
      .json({ message: "An error occurred while creating the user" });
  }
});

const loginUser = asyncHandler(async (req, res, next) => {
  passport.authenticate(
    "local",
    async (err: Error, user: Express.User | false | null) => {
      if (err || !user) {
        return res.status(422).json({ message: "Incorrect password" });
      }
      req.login(user, async () => {
        return res.json({ id: user._id, name: user.name, email: user.email });
      });
    }
  )(req, res, next);
});

// /me
const getUser = asyncHandler(async (req: Request, res: Response) => {
  assertHasUser(req, res);
  const user = await User.findById(req.user?._id);

  if (user) {
    res.status(200).json(user);
  } else {
    res
      .status(400)
      .json({ message: "An error occurred while fetching the user" });
  }
});

const logoutUser = asyncHandler(
  (req: Request, res: Response, next: NextFunction) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.status(200).json({ message: "User logged out" });
    });
  }
);

export { signupUser, loginUser, getUser, logoutUser };
