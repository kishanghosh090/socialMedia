import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

// middlewares-----------------------------------
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("../public"));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
// routes---------------------------------------
import register from "./routes/user.routes.js";
import createFeed from "./routes/createFeed.routes.js";
import searchUser from "./routes/searchUser.routes.js";
app.use("/api/v1/users", register);
app.use("/api/v1/post", createFeed);
app.use("/api/v1/users", searchUser);
export { app };
