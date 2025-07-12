const express = require("express");
const router = express.Router();
const restaurantController = require("../controllers/restaurantController");

// Get all restaurants
router.get("/", restaurantController.getAllRestaurants);

// Search restaurants by location and cuisine
router.get("/search", restaurantController.searchRestaurants);

// Get restaurant by ID
router.get("/:id", restaurantController.getRestaurantById);

// Create new restaurant
router.post("/", restaurantController.createRestaurant);

// Update restaurant
router.put("/:id", restaurantController.updateRestaurant);

// Delete restaurant
router.delete("/:id", restaurantController.deleteRestaurant);

module.exports = router; 