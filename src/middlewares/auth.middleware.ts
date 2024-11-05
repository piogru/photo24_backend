import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { AuthenticationError } from "./error.middleware";

const authorize = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
      return next();
    }

    throw new AuthenticationError("Login to access this resource");
  }
);

export { authorize };
