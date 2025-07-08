const placeController = require("./controllers/placeController");
app.use("/api/places", placeController);
const bookingRoutes = require('./routes/bookingRoutes');
app.use('/api/bookings', bookingRoutes);
