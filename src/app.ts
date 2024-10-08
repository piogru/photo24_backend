import express, { Application } from "express";
import cors, { CorsOptions } from "cors";
import cloudinary from "cloudinary";
import cloudinaryConfig from "./configs/cloudinary.conf";
import routes, { Route } from "./routes";
import { connectDatabase } from "./db/connect.db";
import { errorHandler } from "./middlewares/error.middleware";
import compression from "compression";
import helmet from "helmet";
import passport from "passport";
import authStrategyLocal from "./utils/passport.util";
import session from "express-session";
import mongoStore from "./db/store.db";
import mongoose from "mongoose";
import rateLimiter from "./configs/rateLimit.conf";

const useRouters = (app: Application, routes: Route[]) => {
  routes.forEach((route: Route) => {
    app.use("/api" + route.url, route.middlewares, route.router);
  });
};

const app: Application = express();
const port = process.env.APP_PORT || 3000;
const sessionSecret = process.env.SESSION_SECRET || "";
const corsOptions: CorsOptions = {
  origin: process.env.CORS_ORIGIN,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true,
};

connectDatabase();
cloudinary.v2.config(cloudinaryConfig);
mongoose.Schema.Types.String.checkRequired((v) => typeof v === "string");

passport.use("local", authStrategyLocal);

app.use(compression());
app.use(helmet());
app.use(cors(corsOptions));
app.use(rateLimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("trust proxy", 1);
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: mongoStore,
    cookie: {
      secure: process.env.NODE_ENV !== "dev",
      sameSite: process.env.NODE_ENV !== "dev" ? "none" : "lax",
      httpOnly: true,
      signed: true,
      partitioned: true,
    },
  })
);
app.use(passport.authenticate("session"));

app.disable("x-powered-by");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

useRouters(app, routes);
app.get("*", function (req, res) {
  res.status(404).send({ message: `${req.path} not found` });
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
