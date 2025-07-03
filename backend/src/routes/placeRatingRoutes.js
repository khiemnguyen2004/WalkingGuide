const express = require("express");
const router = express.Router();
const placeRatingController = require("../controllers/placeRatingController");
const auth = require("../middlewares/authMiddleware");

router.post("/rate", auth.verifyToken, placeRatingController.ratePlace);
router.get("/average", placeRatingController.getPlaceAverageRating);
router.get("/user", auth.verifyToken, placeRatingController.getUserPlaceRating);

module.exports = router; 