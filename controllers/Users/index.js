const asyncHandler = require("express-async-handler");
const generateToken = require("../../utils/JWT");

const Users = require("../../models/Users");

// @desc Register a new user
// @route POST /api/users/
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  var { firstName, lastName, phoneNumber, email, password } = req.body;

  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  email =
    email && typeof email === "string" && emailRegex.test(email)
      ? email
      : false;
  password = password && password.length > 0 ? password : false;

  if (email && password) {
    const emailExists = await Users.findOne({ email }).collation({
      locale: "en",
      strength: 2,
    });
    if (emailExists) {
      res.status(400);
      throw new Error("Sorry, provided email already exists");
    }

    const user = await Users.create({
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
    });

    if (user) {
      const newUser = await Users.findById(user._id);
      const { password, ...otherKeys } = newUser._doc;
      res.status(200).json({
        ...otherKeys,
        token: generateToken(newUser.email, newUser.password),
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } else {
    res.status(400);
    throw new Error("Missing one or more required fields (email, password)");
  }
});

// @desc Auth user & get token
// @route POST /api/users/login
// @access Public
const authUser = asyncHandler(async (req, res) => {
  var { email, password } = req.body;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  email =
    email && typeof email === "string" && emailRegex.test(email)
      ? email
      : false;
  password = password && password.length > 0 ? password : false;

  if (email && password) {
    const user = await Users.findOne({ email }).collation({
      locale: "en",
      strength: 2,
    });
    if (user) {
      if (await user.matchPassword(password)) {
        const { password, ...otherKeys } = user._doc;
        res.status(200).json({
          ...otherKeys,
          token: generateToken(user.email, user.password),
        });
      } else {
        res.status(401);
        throw new Error("Invalid Password");
      }
    } else {
      res.status(401);
      throw new Error("Requested user does not exist");
    }
  } else {
    res.status(400);
    throw new Error("Missing one or more required fields (email, password)");
  }
});

module.exports = {
  registerUser,
  authUser,
};
