const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');
const bookingController = require('../controllers/bookingController');

// Admin routes for booking management
router.get('/admin/all', bookingController.getAllBookings);
router.get('/admin/status/:status', bookingController.getBookingsByStatus);
router.get('/admin/stats', bookingController.getBookingStats);
router.put('/admin/:id/approve', bookingController.approveBooking);
router.put('/admin/:id/reject', bookingController.rejectBooking);
router.put('/admin/:id/cancel', bookingController.cancelBooking);

// User routes
router.get('/user/:userId', tourController.getUserBookedTours);
router.delete('/:id', bookingController.deleteBooking);

module.exports = router; 