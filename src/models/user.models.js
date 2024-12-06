import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { type } from "os";
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phonenumber: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  otp: {
    type: Number,
  },
  refreshToken: {
    type: String,
  },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.isPasswordMatched = async function (password) {
  return await bcrypt.compare(password, this.password);
};
export const User = mongoose.model("User", userSchema);
