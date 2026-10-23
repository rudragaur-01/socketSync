import mongoose from "mongoose";

export async function connectDB() {
  try {
    const mongoUri =
      process.env.MONGO_URI ||
      (() => {
        throw new Error("MONGO_URI is missing");
      })();

    await mongoose.connect(mongoUri);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}
