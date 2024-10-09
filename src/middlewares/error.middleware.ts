import { NextFunction, Request, Response } from "express";

const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(error.stack);

  if (error instanceof AuthenticationError) {
    res.status(401).json({ message: "Unauthorized: " + error.message });
  } else {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
  }
}

export { errorHandler, AuthenticationError };
