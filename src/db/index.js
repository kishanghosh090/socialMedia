import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

// Database connection

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `Database connected successfully.Host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;
