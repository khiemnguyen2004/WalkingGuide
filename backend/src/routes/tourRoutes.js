const express = require("express");
const router = express.Router();
const tourController = require("../controllers/tourController");

router.get("/", tourController.getAllTours);
router.post("/", tourController.createTour);
router.put("/:id", tourController.editTour);
router.delete("/:id", tourController.deleteTour);

module.exports = router;
