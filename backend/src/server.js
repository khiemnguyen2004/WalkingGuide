const express = require("express");
require("dotenv").config(); 
const AppDataSource = require("./data-source");
const mainRouter = require("./routes/index.js");

const app = express();
const userRoutes = require("./routes/userRoutes");
const placeRoutes = require("./routes/placeRoutes");
const articleRoutes = require("./routes/articleRoutes");
const tourRoutes = require("./routes/tourRoutes");
const authRoutes = require("./routes/authRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const aiRoutes = require("./routes/aiRoutes");
const tourStepRoutes = require("./routes/tourStepRoutes");
const tagRoutes = require("./routes/tagRoutes");
const placeTagRoutes = require("./routes/placeTagRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const bookingRoutes = require('./routes/bookingRoutes');
const geocodingRoutes = require('./routes/geocodingRoutes');
const siteSettingRoutes = require("./routes/siteSettingRoutes");

const cors = require("cors");
app.use(cors({
  origin: [
    'https://khiemnguyen2004.github.io',
    'https://khiemnguyen2004.github.io/walking-guide/',
    'https://walking-guide.vercel.app',
    'http://localhost:5173', // for local dev
  ],
  credentials: true
}));

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
    app.use("/api/ai", aiRoutes);
    app.use("/api/tour-steps", tourStepRoutes);
    app.use("/api/tags", tagRoutes);
    app.use("/api/place-tags", placeTagRoutes);
    app.use("/api/notifications", notificationRoutes);
    app.use("/api/geocoding", geocodingRoutes);
    app.use("/api/settings", siteSettingRoutes);
    app.use("/api", mainRouter);
    app.use("/uploads", express.static("uploads"));
    app.use('/api/bookings', bookingRoutes);
    app.listen(3000, () => console.log("Server is running on port 3000"));
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });