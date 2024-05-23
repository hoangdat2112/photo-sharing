const { mongoose, Schema } = require("mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  address: {
    type: String,
    trim: true,
  },
  isAccepted: {
    type: Boolean,
    required: true,
  },
  profilePicture: {
    type: String,
    default:
      "https://static.vecteezy.com/system/resources/thumbnails/005/129/844/small_2x/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg",
  },
});

module.exports = mongoose.model("User", userSchema);
