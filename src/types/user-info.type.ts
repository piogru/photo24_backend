import { Types } from "mongoose";

interface UserInfo {
  _id: Types.ObjectId;
  name: string;
  email: string;
}

export default UserInfo;
