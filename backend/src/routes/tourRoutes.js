const express = require("express");
const router = express.Router();
const tourController = require("../controllers/tourController");

router.get("/tours", tourController.getAllTours);

module.exports = router;
