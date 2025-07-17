const express = require("express");
const router = express.Router();
const restaurantRatingController = require("../controllers/restaurantRatingController");
const auth = require("../middlewares/authMiddleware");

router.post("/rate", auth.verifyToken, restaurantRatingController.rateRestaurant);
router.get("/average", restaurantRatingController.getRestaurantAverageRating);
router.get("/user", auth.verifyToken, restaurantRatingController.getUserRestaurantRating);

module.exports = router; 