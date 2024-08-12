import express, { Application, NextFunction, Request, Response } from "express";
import cors, { CorsOptions } from "cors";
import cloudinary from "cloudinary";
import cloudinaryConfig from "./configs/cloudinary.conf";
import uploadMiddleware from "./middlewares/upload.middleware";
import routes, { Route } from "./routes";
import { connectDatabase } from "./db/connect.db";

const app: Application = express();
const port = process.env.APP_PORT || (3000 as number);
const corsOptions: CorsOptions = {
  origin: process.env.CORS_ORIGIN,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDatabase();
cloudinary.v2.config(cloudinaryConfig);

const useRouters = (app: Application, routes: Route[]) => {
  routes.forEach((route: Route) => {
    app.use("/api" + route.url, route.router);
  });
};

app.get("/", (req, res) => {
  res.send("Hello World!");
});

useRouters(app, routes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
