const express = require("express");
const router = express.Router();
const hotelController = require("../controllers/hotelController");
const hotelBookingService = require("../services/hotelBookingService");

// Get all hotels
router.get("/", hotelController.getAllHotels);

// Search hotels by city or coordinates
router.get("/search", hotelController.searchHotels);

// Get hotel by ID
router.get("/:id", hotelController.getHotelById);

// Create new hotel
router.post("/", hotelController.createHotel);

// Update hotel
router.put("/:id", hotelController.updateHotel);

// Delete hotel
router.delete("/:id", hotelController.deleteHotel);

// Create hotel booking
router.post("/hotel-bookings", async (req, res) => {
  try {
    const { user_id, hotel_id, tour_id, check_in, check_out } = req.body;
    if (!user_id || !hotel_id || !check_in || !check_out) {
      return res.status(400).json({ error: "Thiếu thông tin đặt phòng" });
    }
    const booking = await hotelBookingService.create({ user_id, hotel_id, tour_id, check_in, check_out });
    res.status(201).json(booking);
  } catch (err) {
    console.error("Error creating hotel booking:", err);
    res.status(500).json({ error: "Lỗi server khi đặt phòng khách sạn" });
  }
});

// Get hotel bookings for a user
router.get("/hotel-bookings/user/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const bookings = await hotelBookingService.findByUserId(userId);
    res.json(bookings);
  } catch (err) {
    console.error("Error fetching hotel bookings:", err);
    res.status(500).json({ error: "Lỗi server khi lấy danh sách đặt phòng" });
  }
});

module.exports = router; 