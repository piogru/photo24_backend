import { Request, Response } from "express";
import UserInfo from "../types/user-info.type";

type RequestWithUser = Request & { user: UserInfo };

export function assertHasUser(
  req: Request,
  res: Response
): asserts req is RequestWithUser {
  if (!("user" in req)) {
    res.status(401).json({ message: "Could not identify user" });
  }
}
