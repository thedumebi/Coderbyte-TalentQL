const express = require("express");
const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} = require("../../controllers/Posts");
const { protect } = require("../../middlewares/Auth");

const posts = express.Router();

posts.route("/").post(protect, createPost).get(protect, getPosts);
posts
  .route("/:id")
  .get(protect, getPostById)
  .patch(protect, updatePost)
  .delete(protect, deletePost);

module.exports = posts;
