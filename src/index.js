import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./db/index.js";

// Dotenv configuration
dotenv.config({
  path: "./.env",
});



const PORT = process.env.PORT || 5000;

// Database connection------------------------------
connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
