import mongoose from "mongoose";

const connectionString = process.env.DB_URI || "";

export async function connectDatabase() {
  mongoose
    .connect(connectionString, {})
    .then(() => {
      console.log("Connected to DB");
    })
    .catch((error) => {
      console.error(error.message);
      process.exit(1);
    });
}
