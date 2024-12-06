import { Router } from "express";
const router = Router();
import { searchUserPOST } from "../controllers/search.controllers.js";
router.route("/searchUser").post(searchUserPOST);
export default router;
