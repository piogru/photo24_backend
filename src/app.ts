import express, { Application, NextFunction, Request, Response } from "express";
import cors, { CorsOptions } from "cors";
import cloudinary from "cloudinary";
import cloudinaryConfig from "./configs/Cloudinary.conf";
import uploadMiddleware from "./middlewares/upload.middleware";

const app: Application = express();
const port = process.env.APP_PORT || (3000 as number);
const corsOptions: CorsOptions = {
  origin: process.env.CORS_ORIGIN,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

cloudinary.v2.config(cloudinaryConfig);
const upload = uploadMiddleware("photos");

const cloudinaryImageUploadMethod = async (file: any) => {
  return new Promise((resolve) => {
    cloudinary.v2.uploader.upload(file, (_err: any, res: any) => {
      resolve({
        res: res.secure_url,
      });
    });
  });
};

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post(
  "/photos",
  upload.single("img"),
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      // No file was uploaded
      return res.status(400).json({ error: "No file uploaded" });
    }

    // File upload successful
    const fileUrl = req.file.path; // URL of the uploaded file in Cloudinary

    // Perform any additional logic or save the file URL to a database
    res.status(200).json({ success: true, fileUrl: fileUrl });
  }
);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
