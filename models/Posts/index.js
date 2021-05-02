const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    owner: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Users",
    },
  },
  { timestamps: true }
);

const Posts = mongoose.model("Posts", postSchema);

module.exports = Posts;
