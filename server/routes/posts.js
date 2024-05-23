const express = require("express");
const { body, validationResult } = require("express-validator");
const Post = require("../models/post");
const User = require("../models/user");

const router = express.Router();



router.post(
  "/createPost",
  async (req, res) => {
    const { author, title, description, date, postPicture } = req.body;

    const findUser = await User.findOne({ _id: author });

    const newPost = await Post.create({
      author: author,
      authorName: findUser.firstName + " " + findUser.lastName,
      authorProfilePicture: findUser.profilePicture,
      title: title,
      description: description,
      date: Date.now(),
      postPicture: postPicture,
    });

    res.status(200).json({ newPost });
  },
);

// router.get("/get-post", async (req, res) => {
//   const {page}=req
//   const posts = await Post.find();
//   res.status(200).json(posts);
// });

router.get("/get-post", async (req, res) => {
  try {
    const { page = 1 } = req.query; // Mặc định trang là 1 nếu không có tham số page
    const limit = 3; // Giới hạn số bài viết mỗi trang

    // Tính toán vị trí bắt đầu
    const startIndex = (page - 1) * limit;
    
    // Lấy bài viết từ cơ sở dữ liệu với phân trang
    const posts = await Post.find().skip(startIndex).limit(limit);

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.delete("/:postId1", async (req, res) => {
  const postId = req.params.postId1;
  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ msg: "Post not found." });
  } else {
    await Post.findByIdAndDelete(postId); // Delete post
    res.status(200).json({ msg: "Post deleted." });
  }
});

module.exports = router;
