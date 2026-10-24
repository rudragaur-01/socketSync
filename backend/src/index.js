import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import { sendSuccess } from "./utils/apiResponse.js";
import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import fs from "fs";
import path from "path";
import job from "./lib/cron.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL;

// path builds the absolute path to the frontend's public folder.
const publicDir = path.join(process.cwd(), "public");

app.use(express.json());
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  }),
);

app.use(clerkMiddleware());

console.log(process.cwd());

app.get("/health", (req, res) => {
  return sendSuccess(res, "Server is up and running");
});

// fs checks if the public folder exists before serving frontend files.
if (fs.existsSync(publicDir)) {
  // Serve static files like HTML, CSS, JS, and images from public/.
  app.use(express.static(publicDir));

  // Send index.html for frontend routes (e.g., /dashboard).
  app.get("/{*any}", (req, res, next) => {
    res.sendFile(path.join(publicDir, "index.html"), (err) => next(err));
  });
}

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running at http://localhost:${PORT}`);

  if (process.env.NODE_ENV === "production") {
    job.start();
  }
});
