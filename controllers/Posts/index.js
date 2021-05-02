const asyncHandler = require("express-async-handler");
const Posts = require("../../models/Posts");
const Users = require("../../models/Users");
const postUtils = require("../../utils/Posts");

// @desc Create a new Post
// @route POST /api/posts/
// @access Private
const createPost = asyncHandler(async (req, res) => {
  var { content } = req.body;
  content =
    content && typeof content === "string" && content.length > 0
      ? content
      : false;

  if (content) {
    const post = await Posts.create({
      content,
      owner: req.user.id,
    });

    if (post) {
      try {
        const owner = await Users.findByIdAndUpdate(
          req.user.id,
          { $push: { posts: post } },
          { new: true }
        );
        if (owner) res.status(200).json(post);
      } catch (e) {
        throw e;
      }
    } else {
      res.status(400);
      throw new Error("Invalid post data");
    }
  } else {
    res.status(400);
    throw new Error("Missing required field");
  }
});

// @desc Get all Posts
// @route GET /api/posts/
// @access Private
const getPosts = asyncHandler(async (req, res) => {
  const posts = await Posts.find({ owner: req.user.id }).sort({
    createdAt: -1,
  });

  const formattedPostsPromise = posts.map(async (post) => {
    return await postUtils.transformPosts(post);
  });

  const formattedPosts = await Promise.all(formattedPostsPromise);
  res.status(200).json(formattedPosts);
});

// @desc Get a Post
// @route GET /api/posts/:id
// @access Private
const getPostById = asyncHandler(async (req, res) => {
  const post = await Posts.findById(req.params.id);
  if (post) {
    const formattedPost = await postUtils.transformPosts(post);
    res.status(200).json(formattedPost);
  } else {
    res.status(404);
    throw new Error("Post not found");
  }
});

// @desc Delete Post
// @route DELETE /api/posts/:id
// @access Private/Admin
const deletePost = asyncHandler(async (req, res) => {
  const post = await Posts.findById(req.params.id);
  if (post && post.owner == req.user.id) {
    await post.remove();
    await Users.findByIdAndUpdate(
      req.user.id,
      { $pull: { posts: req.params.id } },
      { new: true }
    );
    res.status(200).json({ message: "Post deleted" });
  } else {
    res.status(404);
    throw new Error("Post not found");
  }
});

// @desc Update a Post
// @route PATCH /api/posts/:id
// @access Private
const updatePost = asyncHandler(async (req, res) => {
  const post = await Posts.findById(req.params.id);
  if (post && post.owner == req.user.id) {
    const updatedPost = await Posts.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } else {
    res.status(404);
    throw new Error("Post not Found");
  }
});

module.exports = {
  createPost,
  getPosts,
  getPostById,
  deletePost,
  updatePost,
};
