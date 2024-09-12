import { RequestHandler, Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import photosRouter from "./photos.route";
import authRouter from "./auth.route";
import userRouter from "./user.route";
import postsRouter from "./posts.route";

export interface Route {
  url: string;
  middlewares: RequestHandler[];
  router: Router;
}

const routes: Route[] = [
  { url: "/auth", middlewares: [], router: authRouter },
  { url: "/photos", middlewares: [authenticate], router: photosRouter },
  { url: "/posts", middlewares: [authenticate], router: postsRouter },
  {
    url: "/users",
    middlewares: [authenticate],
    router: userRouter,
  },
];

export default routes;
