import express, { Express, Request, Response } from "express";
import cors, { CorsOptions } from "cors";

const app = express();
const port = process.env.APP_PORT;
const corsOptions: CorsOptions = {
  origin: process.env.CORS_ORIGIN,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
