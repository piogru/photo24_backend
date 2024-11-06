import mongoose, { Schema, Types } from "mongoose";

interface IGuestSession {
  _id: string;
  expires: Date;
  session: string;
}

type GuestSessionInput = {
  expires: IGuestSession["expires"];
  session: IGuestSession["session"];
};

const guestSessionSchema = new Schema<IGuestSession>(
  {
    _id: { type: Schema.Types.String, required: true },
    expires: { type: Schema.Types.Date, required: true },
    session: { type: Schema.Types.String, required: true },
  },
  {
    collection: "guestSessions",
    timestamps: false,
  }
);

const GuestSession = mongoose.model("GuestSession", guestSessionSchema);

export { IGuestSession, GuestSessionInput };
export default GuestSession;
