import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI!);
    console.log("✅ Database connected:", connectionInstance.connection.name);
  } catch (error) {
    console.error("❌ Database connection error:", error);
    process.exit(1);
  }
};
