import { RequestHandler, Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
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
  // { url: "/follows", middlewares: [authenticate], router: followsRouter },
  // { url: "/photos", middlewares: [authenticate], router: photosRouter },
  // { url: "/posts", middlewares: [authenticate], router: postsRouter },
  // {
  //   url: "/users",
  //   middlewares: [authenticate],
  //   router: userRouter,
  // },
];

export default routes;
