const express = require("express");
const router = express.Router();
const restaurantController = require("../controllers/restaurantController");
const restaurantBookingController = require("../controllers/restaurantBookingController");
const menuController = require("../controllers/menuController");

// Restaurant CRUD
router.get("/", restaurantController.getAllRestaurants);
router.get("/search", restaurantController.searchRestaurants);
router.get("/:id", restaurantController.getRestaurantById);
router.post("/", restaurantController.createRestaurant);
router.put("/:id", restaurantController.updateRestaurant);
router.delete("/:id", restaurantController.deleteRestaurant);

// Restaurant Bookings
router.post("/:id/bookings", restaurantBookingController.createBooking); // Book a table
router.get("/:restaurantId/bookings", restaurantBookingController.getBookingsByRestaurant); // Admin: all bookings for a restaurant
router.get("/bookings/user/:userId", restaurantBookingController.getBookingsByUser); // User: their bookings
router.put("/bookings/:id", restaurantBookingController.updateBookingStatus); // Update/cancel booking
router.get("/bookings", restaurantBookingController.getAllBookings); // Admin: all bookings

// Menu
router.get("/:restaurantId/menus", menuController.getMenusByRestaurant);
router.post("/menus", menuController.createMenu);
router.put("/menus/:id", menuController.updateMenu);
router.delete("/menus/:id", menuController.deleteMenu);

// Menu Items
router.get("/menus/:menuId/items", menuController.getMenuItemsByMenu);
router.post("/menu-items", menuController.createMenuItem);
router.put("/menu-items/:id", menuController.updateMenuItem);
router.delete("/menu-items/:id", menuController.deleteMenuItem);

module.exports = router; 