const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const postRoutes = require("./routes/posts");
const commentRoutes = require("./routes/comment");
const cors = require("cors");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

app.use(express.static(__dirname + "/build"));

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log("Server is running on port " + port);
  mongoose
    .connect(
      "mongodb+srv://hoangdat2002ty:5Usu7xeliEFRWm6W@cluster0.wpadz5p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    )
    .then(() => {
      app.use("/auth", authRoutes);
      app.use("/profile", profileRoutes);
      app.use("/posts", postRoutes);
      app.use("/comments", commentRoutes);
    })
    // http:::localhost:8080/posts
    .catch((err) => {
      console.log(err);
    });
});
