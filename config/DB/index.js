const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    mongoose.set("returnOriginal", false);
    console.log("\x1b[42m\x1b[30m%s\x1b[0m", "Database connection established");
  } catch (error) {
    console.error("\x1b[31m%s\x1b[0m", `Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
