const express = require("express");
const router = express.Router();

const userRoutes = require("./userRoutes");
const placeLikeRoutes = require("./placeLikeRoutes");
const placeRatingRoutes = require("./placeRatingRoutes");
const commentRoutes = require("./commentRoutes");
const tourLikeRoutes = require("./tourLikeRoutes");
const tourRatingRoutes = require("./tourRatingRoutes");
const articleLikeRoutes = require("./articleLikeRoutes");
const articleCommentRoutes = require("./articleCommentRoutes");
const articleReportRoutes = require("./articleReportRoutes");
const authRoutes = require("./authRoutes");
const hotelRoutes = require("./hotelRoutes");
const restaurantRoutes = require("./restaurantRoutes");

router.use("/users", userRoutes);
router.use("/place-likes", placeLikeRoutes);
router.use("/place-ratings", placeRatingRoutes);
router.use("/comments", commentRoutes);
router.use("/tour-likes", tourLikeRoutes);
router.use("/tour-ratings", tourRatingRoutes);
router.use("/article-likes", articleLikeRoutes);
router.use("/article-comments", articleCommentRoutes);
router.use("/article-reports", articleReportRoutes);
router.use("/auth", authRoutes);
router.use("/hotels", hotelRoutes);
router.use("/restaurants", restaurantRoutes);

module.exports = router;
