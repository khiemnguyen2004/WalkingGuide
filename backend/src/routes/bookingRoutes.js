const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');
const bookingController = require('../controllers/bookingController');

// Get all tours booked by a user
router.get('/user/:userId', tourController.getUserBookedTours);
router.delete('/:id', bookingController.deleteBooking);

module.exports = router; 