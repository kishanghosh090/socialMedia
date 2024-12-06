import { upload } from "../middlewares/multer.middlewares.js";
import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { sendOTP } from "../utils/mailer.js";
import { Feed } from "../models/feed.models.js";
import { log } from "console";
// Register User (GET)
const registerUserGET = (req, res) => {
  try {
    if (req.cookies.token != undefined) {
      res.redirect("/api/v1/users/home");
    }
    res.render("register");
  } catch (error) {
    console.error("Error rendering register page:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Register User (POST)
const registerUserPOST = async (req, res) => {
  try {
    const { username, email, password, phonenumber } = req.body;

    // Check for missing fields
    if (!username || !email || !password) {
      return res.status(400).send("Please enter all fields");
    }

    // Check if user already exists
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      res.json({ message: "User already exists" }); // Redirect to login if user exists
      return;
    }

    // Create a new user
    const user = await User.create({
      username,
      email,
      phonenumber,
      password,
      avatar:
        "https://res.cloudinary.com/kishanrana/image/upload/v1733372156/b3yjw5mo25gg5ialymhh.jpg",
    });

    // Handle failure to create a user
    if (!user) {
      return res.status(500).send("User not created. Please try again.");
    }

    // Redirect to login after successful registration
    res.json({ user });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Login User (GET)
const loginUserGET = (req, res) => {
  try {
    if (req.cookies.token) {
      res.redirect("/api/v1/users/home");
      return;
    }
    res.render("login");
  } catch (error) {
    console.error("Error rendering login page:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Login User (POST)
const loginUserPOST = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    // Validate input
    if (!emailOrPhone || !password) {
      return res.status(400).send("Please enter both email and password");
    }

    // Check if user exists --------------
    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phonenumber: emailOrPhone }],
    });

    if (!user) {
      return res.json({ message: "user does not exist" });
    }

    // Verify password (assuming you use bcrypt for password hashing)
    const isMatch = await user.isPasswordMatched(password);
    if (!isMatch) {
      return res.json({ message: "incorrect password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    await user.updateOne({ refreshToken: token });
    // Set cookie with token
    res.cookie("token", token);
    res.json({ user }); // Redirect to dashboard or any protected route
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).send("Internal Server Error");
  }
};

// home page(GET)
const gotoHomeGET = async (req, res) => {
  if (!req.cookies.token) {
    res.redirect("/api/v1/users/login");
    return;
  }
  const token = req.cookies.token;
  const user = await User.findOne({ refreshToken: token });
  if (!user) {
    res.render("login");
    return;
  }
  const post = await Feed.find({ user: user._id });

  res.render("home", { user, post });
};

// logout user(POST)
const userLogout = async (req, res) => {
  try {
    res.clearCookie("token");
    await User.updateOne({ refreshToken: "" });
    res.redirect("/api/v1/users/login");
  } catch (error) {
    console.error("Error logging out user:", error);
    res.status(500).send("Internal Server Error");
  }
};

// forgot password take email from user for otp(GET)
const getOTPGET = async (req, res) => {
  try {
    if (req.cookies.token != undefined) {
      res.redirect("/api/v1/users/home");
      return;
    }
    res.render("forgetPass");
  } catch (error) {
    console.error("Error rendering forgot password page:", error);
    res.status(500).send("Internal Server Error");
  }
};
// forgot password take email from user for otp(POST)
const getOTPPOST = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ message: "user does not exist" });
  }
  const otp = Math.floor(Math.random() * 10000);
  await user.updateOne({ otp: otp });
  await sendOTP(email, otp);
  req.user = user;
  res.render("otpVeri", { user });
  return;
};

// otp verification page(GET)
const otpVerificationGET = async (req, res) => {
  if (req.cookies.token != undefined) {
    res.redirect("/api/v1/users/home");
    return;
  }

  res.render("otpVeri");
  return;
};

// otp verification page(POST)
const otpVerificationPOST = async (req, res) => {
  const { one, two, three, four, email } = req.body;
  const data = one + two + three + four;
  const OTP = parseInt(data);
  const user = await User.findOne({ email });

  if (!user) {
    return res.json({ message: "user does not exist" });
  }
  if (parseInt(user.otp) != OTP) {
    return res.json({ message: "incorrect otp" });
  }
  user.otp = "";
  await user.save({ validateBeforeSave: false });

  res.json({ user });
  return;
};

//  new password take from user page for forget password (GET)
const newPasswordGET = async (req, res) => {
  if (req.cookies.token != undefined) {
    res.redirect("/api/v1/users/home");
    return;
  }
  res.render("newPass");
};

//  new password take from user page for forget password (POST)
const newPasswordPOST = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Validate input
    if (!email || !password) {
      return res.status(400).send("Please enter both email and password");
    }
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "user does not exist" });
    }
    // Update user password
    user.password = password;
    await user.save({ validateBeforeSave: false });
    res.redirect("/api/v1/users/login");
  } catch (error) {
    console.error("Error rendering forgot password page:", error);
    res.status(500).send("Internal Server Error");
  }
};

// profile pic upload page (GET)
const profilePicUploadGET = async (req, res) => {
  if (!req.cookies.token) {
    res.redirect("/api/v1/users/login");
    return;
  }
  const user = await User.findOne({ refreshToken: req.cookies.token });

  if (
    user.avatar ==
    "https://res.cloudinary.com/kishanrana/image/upload/v1733372156/b3yjw5mo25gg5ialymhh.jpg"
  ) {
    res.render("profilePic");
    return;
  }
  const post = await Feed.find({ user: user._id });
  res.render("home", { user, post });

  return;
};

// profile pic upload page (POST)
const profilePicUploadPOST = async (req, res) => {
  const coverImageLocalPath = req.files.avatar[0].path;
  if (!coverImageLocalPath) {
    return res.json({ message: "faild to set profile pic" });
  }

  const token = req.cookies.token;
  const user = await User.findOne({ refreshToken: token });
  const avatar = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    return res.json({ message: "faild to set profile pic" });
  }
  await user.updateOne({ avatar: avatar.url });
  res.redirect("/api/v1/users/home");
  return;
};

// edit profile page (GET)
const editProfileGET = async (req, res) => {
  if (!req.cookies.token) {
    res.redirect("/api/v1/users/login");
    return;
  }
  const token = req.cookies.token;
  const user = await User.findOne({ refreshToken: token });
  res.render("editProfile", { user });
};

// edit username (POST)
const editUserNamePOST = async (req, res) => {
  const { username } = req.body;
  const token = req.cookies.token;
  const user = await User.findOne({ refreshToken: token });
  await user.updateOne({ username: username });
  res.redirect("/api/v1/users/home");
};
// edit password (POST)
const editPasswordPOST = async (req, res) => {
  const { password } = req.body;
  const token = req.cookies.token;
  const user = await User.findOne({ refreshToken: token });
  user.password = password;
  await user.save({ validateBeforeSave: false });
  res.redirect("/api/v1/users/home");
};
// edit profile pic (POST)
const editProfilePicPOST = async (req, res) => {
  const avatarLocalPath = req.file.path;
  if (!avatarLocalPath) {
    return res.json({ message: "faild to set profile pic" });
  }

  const token = req.cookies.token;
  const user = await User.findOne({ refreshToken: token });

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) {
    return res.json({ message: "faild to set profile pic" });
  }
  await user.updateOne({ avatar: avatar.url });
  res.redirect("/api/v1/users/home");
  return;
};

// view another user profile (GET)
const viewAnotherProfileGET = async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId);

  // GET ALL POSTS OF FOLLOWING USERS
  const post = await Feed.find({ user: userId }).sort({ createdAt: -1 });

  res.render("viewAnotherUser", { user, post });
};
// exports all the functions----------------------------------------------
export {
  registerUserGET,
  registerUserPOST,
  loginUserGET,
  loginUserPOST,
  gotoHomeGET,
  userLogout,
  getOTPGET,
  newPasswordGET,
  newPasswordPOST,
  getOTPPOST,
  profilePicUploadGET,
  profilePicUploadPOST,
  editProfileGET,
  editUserNamePOST,
  editPasswordPOST,
  editProfilePicPOST,
  otpVerificationGET,
  otpVerificationPOST,
  viewAnotherProfileGET,
};
