import Local from "passport-local";
import User from "../models/user.model";
import passport from "passport";
import { Types } from "mongoose";

declare global {
  namespace Express {
    interface User {
      _id?: Types.ObjectId;
      name: string;
      email: string;
    }
  }
}

const authStrategyLocal = new Local.Strategy(
  {
    usernameField: "userId",
    passwordField: "password",
    passReqToCallback: false,
  },
  async (username, password, done) => {
    User.findOne({ $or: [{ name: username }, { email: username }] })
      .then(async (user) => {
        if (user && (await user.comparePassword(password))) {
          done(null, user);
        } else {
          done(null, false);
        }
      })
      .catch((error) => {
        done(error);
      });
  }
);

passport.serializeUser(function (user, cb) {
  cb(null, user._id);
});
passport.deserializeUser(function (uid, cb) {
  User.findById(uid)
    .then((user) => {
      cb(null, user);
    })
    .catch((error) => {
      cb(error);
    });
});

export default authStrategyLocal;
