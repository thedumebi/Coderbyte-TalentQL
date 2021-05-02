const express = require("express");
const { registerUser, authUser } = require("../../controllers/Users");
const { protect } = require("../../middlewares/Auth");

const users = express.Router();

users.post("/", registerUser);
users.post("/login", authUser);

module.exports = users;
