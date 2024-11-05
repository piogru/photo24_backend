import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../models/user.model";
import passport from "passport";
import GuestSession from "../models/guestSession.model";

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
        return res.json({
          id: user._id,
          name: user.name,
          email: user.email,
          role: "User",
        });
      });
    }
  )(req, res, next);
});

const loginAnonymous = asyncHandler(async (req, res, next) => {
  if (req.isAuthenticated()) {
    res.status(400).json({ message: "User already authenticated" });
    return;
  }

  req.session.regenerate((err) => {
    if (err) {
      next(err);
    }
  });
  const session = await GuestSession.findById(req.sessionID);
  if (session) {
    res.status(400).json({ message: "User already authenticated" });
    return;
  }

  const newSession = await GuestSession.create({
    _id: req.sessionID,
    expires: new Date(new Date().getTime() + 1209600000),
    session: JSON.stringify(req.session),
  });

  if (newSession) {
    res.json({ id: null, name: "Guest", email: null, role: "Anonymous" });
    return;
  }
  res.status(500).json({ message: "Failed to create guest session" });
});

// /me
const getUser = asyncHandler(async (req: Request, res: Response) => {
  if (req.user) {
    const user = await User.findById(req.user?._id);
    res.status(200).json(user);
    return;
  } else {
    const session = await GuestSession.findById(req.sessionID);

    if (session) {
      res.json({ id: null, name: "Guest", email: null, role: "Anonymous" });
      return;
    }
  }

  res.status(400).json({ message: "User not logged in" });
});

const logoutUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
      req.logout((err) => {
        if (err) {
          return next(err);
        }

        res.status(200).json({ message: "User logged out" });
        return;
      });
      return;
    } else {
      const session = await GuestSession.findById(req.sessionID);

      if (session) {
        await session.deleteOne();
        req.logout((err) => {
          if (err) {
            return next(err);
          }
        });

        res.status(200).json({ message: "Guest logged out" });
        return;
      }
    }

    res.status(400).json({ message: "No user was logged in" });
    return;
  }
);

export { signupUser, loginUser, loginAnonymous, getUser, logoutUser };
