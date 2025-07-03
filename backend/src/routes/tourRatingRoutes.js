const express = require("express");
const router = express.Router();
const tourRatingController = require("../controllers/tourRatingController");
const auth = require("../middlewares/authMiddleware");

router.post("/rate", auth.verifyToken, tourRatingController.rateTour);
router.get("/average", tourRatingController.getTourAverageRating);
router.get("/user", auth.verifyToken, tourRatingController.getUserTourRating);

module.exports = router; 