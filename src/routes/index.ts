import { Router } from "express";
import photosRouter from "./photos.route";

export interface Route {
  url: string;
  router: Router;
}

const routes: Route[] = [{ url: "/photos", router: photosRouter }];

export default routes;
