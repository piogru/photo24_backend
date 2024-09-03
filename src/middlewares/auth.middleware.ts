import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { AuthenticationError } from "./error.middleware";

const authenticate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
      return next();
    } else {
      throw new AuthenticationError("User not found");
    }
  }
);

export { authenticate };
