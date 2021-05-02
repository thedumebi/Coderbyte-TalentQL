require("dotenv").config();
const express = require("express");
const connectDB = require("./config/DB");
const { notFound, errorHandler } = require("./middlewares/Error");
const userRoutes = require("./routes/Users");
const postRoutes = require("./routes/Posts");

// connect to database
connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// make uploads folder static
app.use("/upload", express.static(__dirname + "/uploads"));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

// Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
