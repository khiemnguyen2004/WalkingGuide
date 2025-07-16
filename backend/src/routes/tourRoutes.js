const express = require("express");
const router = express.Router();
const tourController = require("../controllers/tourController");

router.get("/", tourController.getAllTours);
router.get("/user/:userId", tourController.getUserTours);
// POST /api/tours - Create a new tour
// Accepts: name, description, image_url, user_id, total_cost, steps, start_time, end_time, start_from
router.post("/", tourController.createTour);
router.put("/:id", tourController.editTour);
router.delete("/:id", tourController.deleteTour);
router.post("/:id/clone", tourController.cloneTour);
router.get("/:id", tourController.getById);
router.post("/:id/book", tourController.bookTour);
router.get("/bookings/user/:userId", tourController.getUserBookedTours);

module.exports = router;
