import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import {
  createFeedGET,
  createFeedPOST,
  viewPostGET,
} from "../controllers/createFeed.controllers.js";
const router = Router();

// create feed or post
router.route("/createFeed").get(createFeedGET);
router.route("/createFeed").post(upload.single("postImage"), createFeedPOST);

// view post
router.route("/viewPost").get(viewPostGET);
export default router;
