const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const checkAuth = require("../checkAuth");
const User = require("../models/user");

const router = express.Router();
router.post(
  "/signup",
  body("fullName").isLength({ min: 2 }).withMessage("Full name is invalid."),
  body("email").isEmail().withMessage("Email is invalid."),
  body("password").isLength({ min: 3 }).withMessage("Password must be at least 3 characters long."),
  body("dateOfBirth").isDate().withMessage("Date of birth is invalid."),
  body("address").optional().isLength({ min: 5 }).withMessage("Address is invalid."),
  body("isAccepted").isBoolean().withMessage("Terms must be accepted."),
  async function (req, res) {
    /* Throw errors if validation errors */
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

    const { fullName, email, password,dateOfBirth,address,isAccepted } = req.body;
    const findUser = await User.findOne({ email: email });

    if (findUser) {
      return res.status(401).json({
        errors: ["Email already exists."],
      });
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      fullName: fullName,
      email: email,
      password: hashedPassword,
      dateOfBirth:dateOfBirth,
      address:address,
      isAccepted:isAccepted,
    });

    const token = await jwt.sign(
      { email: newUser.email },
      `${process.env.JWT_SECRET_KEY}`,
      {
        expiresIn: "1h",
      },
    );

    res.status(200).json({
      token,
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
      },
    });
  },
);
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const findUser = await User.findOne({ email: email });

  if (!findUser) {
    return res.status(401).json({
      errors: ["Email is not registered."],
    });
  }

  const isMatch = await bcrypt.compare(password, findUser.password);

  if (!isMatch) {
    return res.status(400).json({
      errors: ["Password is incorrect."],
    });
  }

  const token = await jwt.sign(
    { email: findUser.email },
    `${process.env.JWT_SECRET_KEY}`,
    {
      expiresIn: "1h",
    },
  );

  res.status(200).json({
    token,
    user: {
      id: findUser._id,
      fullName: findUser.fullName,
      email: findUser.email,
      profilePicture: findUser.profilePicture,
    },
  });
});
router.get("/me", checkAuth, async (req, res) => {
  const user = await User.findOne({ email: req.user });
  res.status(200).json({
    user: {
      id: findUser._id,
      fullName: findUser.fullName,
      email: findUser.email,
      profilePicture: findUser.profilePicture,
    },
  });
});

module.exports = router;
