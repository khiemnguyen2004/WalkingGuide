const express = require("express");
const router = express.Router();
const tourLikeController = require("../controllers/tourLikeController");
const auth = require("../middlewares/authMiddleware");

router.post("/like", auth.verifyToken, tourLikeController.likeTour);
router.post("/unlike", auth.verifyToken, tourLikeController.unlikeTour);
router.get("/is-liked", auth.verifyToken, tourLikeController.isTourLiked);
router.get("/count", tourLikeController.countTourLikes);

module.exports = router; 