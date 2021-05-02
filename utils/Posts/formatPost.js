const Users = require("../../models/Users");

const user = async (userId) => {
  try {
    const user = await Users.findById(userId).select("-password");
    if (user) {
      return user.email;
    } else {
      throw new Error("Post user does not exist");
    }
  } catch (error) {
    console.log(error);
  }
};

const transformPosts = async (post) => {
  return {
    ...post._doc,
    owner: await user.bind(this, post.owner)(),
  };
};

module.exports = {
  transformPosts,
};
