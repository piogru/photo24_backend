import express, { Application } from "express";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";
import cloudinaryConfig from "./configs/cloudinary.conf";
import routes, { Route } from "./routes";
import { connectDatabase } from "./db/connect.db";
import { errorHandler } from "./middlewares/error.middleware";
import helmet from "helmet";

const useRouters = (app: Application, routes: Route[]) => {
  routes.forEach((route: Route) => {
    app.use("/api" + route.url, route.middlewares, route.router);
  });
};

const app: Application = express();
const port = process.env.APP_PORT || 3000;
const corsOptions: CorsOptions = {
  origin: process.env.CORS_ORIGIN,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(helmet());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.disable("x-powered-by");

connectDatabase();
cloudinary.v2.config(cloudinaryConfig);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

useRouters(app, routes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
