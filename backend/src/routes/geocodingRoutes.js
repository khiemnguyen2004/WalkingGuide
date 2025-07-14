const express = require("express");
const router = express.Router();
const geocodingController = require("../controllers/geocodingController");

// Search for address suggestions
router.get("/search", geocodingController.searchAddress);

// Get coordinates from address
router.get("/coordinates", geocodingController.getCoordinates);

// Reverse geocoding - get address from coordinates
router.get("/reverse", geocodingController.reverseGeocode);

module.exports = router; 