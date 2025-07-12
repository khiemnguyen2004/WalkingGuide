const express = require("express");
const router = express.Router();
const hotelController = require("../controllers/hotelController");

// Get all hotels
router.get("/", hotelController.getAllHotels);

// Search hotels by location
router.get("/search", hotelController.searchHotels);

// Get hotel by ID
router.get("/:id", hotelController.getHotelById);

// Create new hotel
router.post("/", hotelController.createHotel);

// Update hotel
router.put("/:id", hotelController.updateHotel);

// Delete hotel
router.delete("/:id", hotelController.deleteHotel);

module.exports = router; 