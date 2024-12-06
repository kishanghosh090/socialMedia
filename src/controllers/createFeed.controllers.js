import { User } from "../models/user.models.js";
import { Feed } from "../models/feed.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { log } from "console";
const createFeedGET = async (req, res) => {
  res.render("createFeed");
};

const createFeedPOST = async (req, res) => {
  try {
    const { description } = req.body;
    const user = await User.findOne({ refreshToken: req.cookies.token });
    const postImgPath = req.file.path;
    // console.log(postImgPath);

    const postImg = await uploadOnCloudinary(postImgPath);
    console.log("postImg", postImg.url);

    const post = await Feed.create({
      user: user._id,
      description,
      postImage: postImg?.url,
    });

    if (!post) {
      return res.json({ message: "faild to create post" });
    }
    res.redirect("/api/v1/users/home");
  } catch (error) {
    console.log(error);
    return;
  }
};

// view post (GET)
const viewPostGET = async (req, res) => {
  try {
    const posts = await Feed.find().sort({ createdAt: -1 });
    // console.log(posts[0].user);
    // const user = await User.findById(posts[0].user);
    // console.log(user);

    let users = [];
    let user;

    async function getUser() {
      for (let i = 0; i < posts.length; i++) {
        user = await User.findById(posts[i].user);
        users.push(user);
      }
    }

    await getUser();
    
    

    res.render("viewPost", { posts, users });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).send("Server Error");
  }
};

export { createFeedPOST, createFeedGET, viewPostGET };
