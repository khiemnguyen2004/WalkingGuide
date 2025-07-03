const express = require("express");
const router = express.Router();
const placeLikeController = require("../controllers/placeLikeController");
const auth = require("../middlewares/authMiddleware");

router.post("/like", auth.verifyToken, placeLikeController.likePlace);
router.post("/unlike", auth.verifyToken, placeLikeController.unlikePlace);
router.get("/is-liked", auth.verifyToken, placeLikeController.isPlaceLiked);
router.get("/count", placeLikeController.countPlaceLikes);

module.exports = router; 