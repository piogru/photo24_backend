import UserInfo from "./user-info.type";

declare namespace Express {
  interface Request {
    user?: UserInfo | null;
  }
}
