const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetToken:String,
  expireToken:Date,
  followers: [{ type: ObjectId, ref: "User" }],
  following: [{ type: ObjectId, ref: "User" }],
  photo: {
    type: String,
    default:"https://res.cloudinary.com/dlwbmv3yr/image/upload/v1676096874/photo-1611162616305-c69b3fa7fbe0_sb0qeu.jpg",
  },
});

mongoose.model("User", userSchema);
