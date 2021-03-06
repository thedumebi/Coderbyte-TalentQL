const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
    },
    firstName: String,
    lastName: String,
    phoneNumber: String,
    posts: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Posts",
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.pre("findOneAndUpdate", async function () {
  if (this._update.$set && this._update.$set.password) {
    const salt = await bcrypt.genSalt();
    this._update.$set.password = await bcrypt.hash(
      this._update.$set.password,
      salt
    );
  }
});

const Users = mongoose.model("Users", userSchema);

module.exports = Users;
