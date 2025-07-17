const express = require("express");
const router = express.Router();
const hotelRatingController = require("../controllers/hotelRatingController");
const auth = require("../middlewares/authMiddleware");

router.post("/rate", auth.verifyToken, hotelRatingController.rateHotel);
router.get("/average", hotelRatingController.getHotelAverageRating);
router.get("/user", auth.verifyToken, hotelRatingController.getUserHotelRating);

module.exports = router; 