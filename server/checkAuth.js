const express = require("express");
const jwt = require("jsonwebtoken");

module.exports = async function checkAuth(req, res, next) {
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(403).json({
      errors: ["No authorization provided."],
    });
  }

  try {
    const user = await jwt.verify(token, `${process.env.JWT_SECRET_KEY}`);
    req.user = user.email;
    next();
  } catch (err) {
    return res.status(401).json({
      errors: ["Incorrect token provided."],
    });
  }
};
