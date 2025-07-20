const express = require("express");
const router = express.Router();
const hotelController = require("../controllers/hotelController");
const hotelBookingService = require("../services/hotelBookingService");
const notiService = require("../services/notificationService");

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
    const { user_id, hotel_id, tour_id, check_in, check_out, room_type } = req.body;
    if (!user_id || !hotel_id || !check_in || !check_out) {
      return res.status(400).json({ error: "Thiếu thông tin đặt phòng" });
    }
    const booking = await hotelBookingService.create({ user_id, hotel_id, tour_id, check_in, check_out, room_type });
    // Create notification for hotel booking
    await notiService.create({
      user_id,
      type: 'hotel_booking_success',
      content: `Bạn đã đặt phòng khách sạn thành công!`,
      is_read: false,
      // Optionally add hotel_id or booking_id if you want to link
    });
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
    // Fetch hotel names and images for each booking
    const Hotel = require("../models/Hotel");
    const HotelImage = require("../models/HotelImage");
    const AppDataSource = require("../data-source");
    const hotelRepo = AppDataSource.getRepository("Hotel");
    const hotelImageRepo = AppDataSource.getRepository("HotelImage");
    const hotelIds = [...new Set(bookings.map(b => b.hotel_id))];
    const hotels = await hotelRepo.findByIds ? await hotelRepo.findByIds(hotelIds) : await hotelRepo.find({ where: hotelIds.map(id => ({ id })) });
    const hotelImages = await hotelImageRepo.find({ where: hotelIds.map(id => ({ hotel_id: id })) });
    const hotelMap = {};
    hotels.forEach(h => { hotelMap[h.id] = h.name; });
    const hotelImageMap = {};
    hotelImages.forEach(img => {
      if (!hotelImageMap[img.hotel_id] || img.is_primary) {
        hotelImageMap[img.hotel_id] = img.image_url;
      }
    });
    const bookingsWithHotelInfo = bookings.map(b => ({
      ...b,
      hotel_name: hotelMap[b.hotel_id] || null,
      hotel_image_url: hotelImageMap[b.hotel_id] || null
    }));
    res.json(bookingsWithHotelInfo);
  } catch (err) {
    console.error("Error fetching hotel bookings:", err);
    res.status(500).json({ error: "Lỗi server khi lấy danh sách đặt phòng" });
  }
});

// Delete hotel booking (cancel booking)
router.delete("/hotel-bookings/:id", async (req, res) => {
  try {
    const bookingId = parseInt(req.params.id);
    const booking = await hotelBookingService.findById(bookingId);
    
    if (!booking) {
      return res.status(404).json({ error: "Không tìm thấy đặt phòng khách sạn" });
    }
    
    await hotelBookingService.delete(bookingId);
    
    res.json({ message: "Đã hủy đặt phòng khách sạn thành công!" });
  } catch (err) {
    console.error("Error deleting hotel booking:", err);
    res.status(500).json({ error: "Lỗi server khi hủy đặt phòng khách sạn" });
  }
});

module.exports = router; 