const restaurantBookingService = require("../services/restaurantBookingService");

module.exports = {
  // User books a table at a restaurant
  createBooking: async (req, res) => {
    try {
      const { restaurant_id, booking_time, number_of_people, special_requests } = req.body;
      const user_id = req.user?.id || req.body.user_id; // from auth or body
      if (!user_id || !restaurant_id || !booking_time) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
      }
      const booking = await restaurantBookingService.create({
        user_id,
        restaurant_id,
        booking_time,
        number_of_people: number_of_people || 1,
        special_requests,
        status: "pending",
      });
      res.status(201).json({ success: true, data: booking });
    } catch (err) {
      res.status(500).json({ success: false, message: "Failed to create booking", error: err.message });
    }
  },

  // Get all bookings for a restaurant (admin)
  getBookingsByRestaurant: async (req, res) => {
    try {
      const { restaurantId } = req.params;
      const bookings = await restaurantBookingService.findByRestaurantId(restaurantId);
      res.json({ success: true, data: bookings });
    } catch (err) {
      res.status(500).json({ success: false, message: "Failed to fetch bookings", error: err.message });
    }
  },

  // Get all bookings for a user
  getBookingsByUser: async (req, res) => {
    try {
      const { userId } = req.params;
      const bookings = await restaurantBookingService.findByUserId(userId);
      res.json({ success: true, data: bookings });
    } catch (err) {
      res.status(500).json({ success: false, message: "Failed to fetch bookings", error: err.message });
    }
  },

  // Update booking status (admin or user cancel)
  updateBookingStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!status) return res.status(400).json({ success: false, message: "Missing status" });
      const booking = await restaurantBookingService.updateStatus(id, status);
      res.json({ success: true, data: booking });
    } catch (err) {
      res.status(500).json({ success: false, message: "Failed to update booking", error: err.message });
    }
  },

  // Admin: get all bookings
  getAllBookings: async (req, res) => {
    try {
      const bookings = await restaurantBookingService.findAll();
      res.json({ success: true, data: bookings });
    } catch (err) {
      res.status(500).json({ success: false, message: "Failed to fetch bookings", error: err.message });
    }
  },
}; 