const jwt = require("jsonwebtoken");

const generateToken = (email, password) => {
  return jwt.sign({ email, password }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = generateToken;
