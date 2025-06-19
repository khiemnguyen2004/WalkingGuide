const express = require("express");
const router = express.Router();
const aiTourController = require("../controllers/aiTourController");

// Test GET endpoint to verify aiRoutes is working
router.get("/test", (req, res) => {
  res.json({ message: "AI route is working!" });
});

router.post("/generate-tour", aiTourController.generateTour);

module.exports = router;
