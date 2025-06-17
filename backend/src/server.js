const express = require("express");
require("dotenv").config(); 
const { AppDataSource } = require("./data-source");

const app = express();
const userRoutes = require("./routes/userRoutes");
const placeRoutes = require("./routes/placeRoutes");
const articleRoutes = require("./routes/articleRoutes");
const tourRoutes = require("./routes/tourRoutes");
const authRoutes = require("./routes/authRoutes");
const uploadRoutes = require("./routes/uploadRoutes");


const cors = require("cors");
app.use(cors());

app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    app.use("/api/users", userRoutes);
    app.use("/api/places", placeRoutes);
    app.use("/api/articles", articleRoutes);
    app.use("/api/tours", tourRoutes);
    app.use("/api/auth", authRoutes);
    app.use("/api/upload", uploadRoutes);
    app.use("/uploads", express.static("uploads"));
    app.listen(3000, () => console.log("Server is running on port 3000"));
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });
