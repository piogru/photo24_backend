import express, { Application } from "express";
import cors, { CorsOptions } from "cors";
import cloudinary from "cloudinary";
import cloudinaryConfig from "./configs/cloudinary.conf";
import routes, { Route } from "./routes";
import { connectDatabase } from "./db/connect.db";
import { errorHandler } from "./middlewares/error.middleware";
import helmet from "helmet";
import passport from "passport";
import authStrategyLocal from "./utils/passport.util";
import session from "express-session";
import mongoStore from "./db/store.db";

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

passport.use("local", authStrategyLocal);

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: mongoStore,
    cookie: {
      secure: process.env.APP_ENV !== "dev",
      sameSite: "none",
      httpOnly: true,
    },
  })
);
app.use(passport.authenticate("session"));

app.disable("x-powered-by");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

useRouters(app, routes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
