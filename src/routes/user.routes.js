import { Router } from "express";
import {
  registerUserPOST,
  registerUserGET,
  loginUserPOST,
  loginUserGET,
  gotoHomeGET,
  userLogout,
  getOTPGET,
  getOTPPOST,
  profilePicUploadGET,
  profilePicUploadPOST,
  editProfileGET,
  editUserNamePOST,
  editPasswordPOST,
  editProfilePicPOST,
  otpVerificationGET,
  otpVerificationPOST,
  newPasswordGET,
  newPasswordPOST,
  viewAnotherProfileGET,
} from "../controllers/user.controllers.js";

import { upload } from "../middlewares/multer.middlewares.js";
const router = Router();

// register user(GET)
router.route("/register").get(registerUserGET);
// register user(POST)
router.route("/register").post(registerUserPOST);

// login user(GET)
router.route("/login").get(loginUserGET);
// login user(POST)
router.route("/login").post(loginUserPOST);

// home page(GET)
router.route("/home").get(gotoHomeGET);

//logout user(POST)
router.route("/logout").post(userLogout);

// forgot password
router.route("/forgotpassword").get(getOTPGET);
router.route("/forgotpassword").post(getOTPPOST);

// new password
router.route("/newPassword").get(newPasswordGET);
router.route("/newPassword").post(newPasswordPOST);

// profile pic
router.route("/profilePic").get(profilePicUploadGET);
router
  .route("/profilePic")
  .post(upload.fields([{ name: "avatar", maxCount: 1 }]), profilePicUploadPOST);

// edit profile
router.route("/editProfile").get(editProfileGET);

// edit username
router.route("/editUserName").post(editUserNamePOST);

// edit password
router.route("/editPassword").post(editPasswordPOST);
// edit profile pic
router
  .route("/editProfilePic")
  .post(upload.single("avatar"), editProfilePicPOST);
// otp verification
router.route("/otpVerification").get(otpVerificationGET);
router.route("/otpVerification").post(otpVerificationPOST);
// view another profile
router.route("/viewAnotherUser/:id").get(viewAnotherProfileGET);
export default router;
