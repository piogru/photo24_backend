import jwt from "jsonwebtoken";
import { Response } from "express";
import { Types } from "mongoose";

const generateToken = (res: Response, userId: string | Types.ObjectId) => {
  const jwtSecret = process.env.JWT_SECRET || "";
  const token = jwt.sign({ userId }, jwtSecret, {
    expiresIn: "1h",
  });

  // Credentials
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "dev",
    sameSite: "none",
    maxAge: 60 * 60 * 1000,
  });
  // Auth expiration, accessible in frontend
  res.cookie("auth", "", {
    secure: process.env.NODE_ENV !== "dev",
    sameSite: "none",
    maxAge: 60 * 60 * 1000,
  });
};

const clearToken = (res: Response) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "dev",
    expires: new Date(0),
    sameSite: "none",
  });
  res.cookie("auth", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "dev",
    expires: new Date(0),
    sameSite: "none",
  });
};

export { generateToken, clearToken };
