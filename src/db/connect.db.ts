import mongoose from "mongoose";

const connectionString = process.env.DB_URI || "";

export async function connectDatabase() {
  await mongoose.connect(connectionString, {});
  console.log("Connected to DB");
}
