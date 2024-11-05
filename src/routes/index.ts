import { RequestHandler, Router } from "express";
import passport from "passport";
import { authorize } from "../middlewares/auth.middleware";
import photosRouter from "./photos.route";
import authRouter from "./auth.route";
import userRouter from "./users.route";
import postsRouter from "./posts.route";
import followsRouter from "./follows.route";

export interface Route {
  url: string;
  middlewares: RequestHandler[];
  router: Router;
}

const routes: Route[] = [
  { url: "/auth", middlewares: [], router: authRouter },
  {
    url: "/follows",
    middlewares: [passport.authenticate(["session", "anonymous"])],
    router: followsRouter,
  },
  {
    url: "/photos",
    middlewares: [passport.authenticate(["session", "anonymous"], authorize)],
    router: photosRouter,
  },
  {
    url: "/posts",
    middlewares: [passport.authenticate(["session", "anonymous"])],
    router: postsRouter,
  },
  {
    url: "/users",
    middlewares: [passport.authenticate(["session", "anonymous"])],
    router: userRouter,
  },
];

export default routes;
