import { User } from "../models/user.models.js";
const searchUserPOST = async (req, res) => {
  const { emailOrNumber } = req.body;
  const user = await User.findOne({
    $or: [{ email: emailOrNumber }, { phonenumber: emailOrNumber }],
  });
  if (!user) {
    return res.json({ message: "user does not exist" });
  }
  res.json({ user });
  return;
};
export { searchUserPOST };
