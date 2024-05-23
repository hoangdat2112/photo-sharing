const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Comment = require("../models/comment");

router.post(
  "/createComment",
  body("postId").isLength({ min: 1 }).withMessage("Invalid post Id."),
  body("author")
    .isLength({ min: 10 })
    .withMessage("Author ID must be at least 10 characters long"),
  body("authorName")
    .isLength({ min: 5 })
    .withMessage("Name must be at least 5 characters long."),
  body("body")
    .isLength({ min: 2 })
    .withMessage("Comment must be at least 2 characters long."),
  async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(400).json({
        errors: validationErrors.array().map((err) => {
          return err.msg;
        }),
        params: validationErrors.array().map((err) => {
          return err.param;
        }),
      });
    }

    const { postId, author, authorName, body } = req.body;

    const newComment = await Comment.create({
      postId: postId,
      author: author,
      authorName: authorName,
      body: body,
      date: Date.now(),
    });

    res.status(200).json({ newComment });
  }
);

router.get("/:postId", async (req, res) => {
  const postId = req.params.postId;
  const comments = await Comment.find().where("postId").equals(postId);
  res.status(200).json(comments);
});

router.delete("/:commentId", async (req, res) => {
  const commentId = req.params.commentId;
  const comment = await Comment.findById(commentId);
  if (!comment) {
    return res.status(404).json({ msg: "Comment not found." });
  } else {
    await Comment.findByIdAndDelete(commentId); // Delete comment
    res.status(200).json({ msg: "Comment deleted." });
  }
});

module.exports = router;
