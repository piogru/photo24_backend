import { RequestHandler, Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import photosRouter from "./photos.route";
import authRouter from "./auth.route";
import userRouter from "./user.route";

export interface Route {
  url: string;
  middlewares: RequestHandler[];
  router: Router;
}

const routes: Route[] = [
  { url: "/auth", middlewares: [], router: authRouter },
  { url: "/photos", middlewares: [authenticate], router: photosRouter },
  {
    url: "/users",
    middlewares: [authenticate],
    router: userRouter,
  },
];

export default routes;
