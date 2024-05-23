const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

router.put(
  "/:user",
 

  async (req, res) => {
    /* Throw errors if validation errors */
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(400).json({
        errors: validationErrors.array().map((err) => err.msg),
        params: validationErrors.array().map((err) => err.param),
      });
    }

    let { user } = req.params;
    user = user.split("=")[1];

    // Check if user exists
    let findUser = await User.findById(user);
    if (!findUser) {
      return res.status(404).json({
        errors: ["User not found"],
      });
    }

    const {
      fullName,
      email,
      address,
      oldPassword,
      newPassword,
      profilePicture,
    } = req.body;

    const isMatch = await bcrypt.compare(oldPassword, findUser.password);

    if (!isMatch) {
      return res.status(400).json({
        errors: ["Old Password is incorrect."],
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    findUser = await User.findByIdAndUpdate(
      { _id: user },
      {
        fullName,
        email,
        address,
        password: hashedPassword,
        profilePicture,
      }
    ).lean();

    const updatedUser = await User.findById(user).select("-password").lean();

    res.json({ updatedUser });
  }
);

router.get("/users", async (req, res) => {
  const users = await User.find({}, "-password").lean();
  return res.json(users);
});

module.exports = router;
