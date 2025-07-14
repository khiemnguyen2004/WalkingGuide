const { AppDataSource } = require("../data-source");
const bookingRepo = AppDataSource.getRepository("Booking");
const tourRepo = AppDataSource.getRepository("Tour");
const userRepo = AppDataSource.getRepository("User");

// Get all bookings for admin management
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await bookingRepo.find({
      order: { created_at: 'DESC' }
    });

    // Get related tour and user information
    const bookingsWithDetails = await Promise.all(
      bookings.map(async (booking) => {
        const tour = await tourRepo.findOneBy({ id: booking.tour_id });
        const user = await userRepo.findOneBy({ id: booking.user_id });
        
        return {
          ...booking,
          tour: tour || null,
          user: user ? {
            id: user.id,
            full_name: user.full_name,
            email: user.email
          } : null
        };
      })
    );

    res.json({
      success: true,
      data: bookingsWithDetails
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách đặt tour"
    });
  }
};

// Get bookings by status
exports.getBookingsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const validStatuses = ['pending', 'approved', 'rejected', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Trạng thái không hợp lệ"
      });
    }

    const bookings = await bookingRepo.find({
      where: { status },
      order: { created_at: 'DESC' }
    });

    // Get related tour and user information
    const bookingsWithDetails = await Promise.all(
      bookings.map(async (booking) => {
        const tour = await tourRepo.findOneBy({ id: booking.tour_id });
        const user = await userRepo.findOneBy({ id: booking.user_id });
        
        return {
          ...booking,
          tour: tour || null,
          user: user ? {
            id: user.id,
            full_name: user.full_name,
            email: user.email
          } : null
        };
      })
    );

    res.json({
      success: true,
      data: bookingsWithDetails
    });
  } catch (error) {
    console.error("Error fetching bookings by status:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách đặt tour theo trạng thái"
    });
  }
};

// Approve a booking
exports.approveBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { admin_notes } = req.body;

    const booking = await bookingRepo.findOneBy({ id: parseInt(id) });
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đặt tour"
      });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: "Chỉ có thể phê duyệt đặt tour đang chờ xử lý"
      });
    }

    booking.status = 'approved';
    booking.admin_notes = admin_notes || null;
    booking.updated_at = new Date();

    await bookingRepo.save(booking);

    res.json({
      success: true,
      message: "Đã phê duyệt đặt tour thành công",
      data: booking
    });
  } catch (error) {
    console.error("Error approving booking:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi phê duyệt đặt tour"
    });
  }
};

// Reject a booking
exports.rejectBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { admin_notes } = req.body;

    if (!admin_notes || !admin_notes.trim()) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp lý do từ chối"
      });
    }

    const booking = await bookingRepo.findOneBy({ id: parseInt(id) });
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đặt tour"
      });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: "Chỉ có thể từ chối đặt tour đang chờ xử lý"
      });
    }

    booking.status = 'rejected';
    booking.admin_notes = admin_notes;
    booking.updated_at = new Date();

    await bookingRepo.save(booking);

    res.json({
      success: true,
      message: "Đã từ chối đặt tour thành công",
      data: booking
    });
  } catch (error) {
    console.error("Error rejecting booking:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi từ chối đặt tour"
    });
  }
};

// Cancel a booking (admin can cancel any booking)
exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { admin_notes } = req.body;

    const booking = await bookingRepo.findOneBy({ id: parseInt(id) });
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đặt tour"
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: "Đặt tour đã bị hủy trước đó"
      });
    }

    booking.status = 'cancelled';
    booking.admin_notes = admin_notes || null;
    booking.updated_at = new Date();

    await bookingRepo.save(booking);

    res.json({
      success: true,
      message: "Đã hủy đặt tour thành công",
      data: booking
    });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi hủy đặt tour"
    });
  }
};

// Get booking statistics
exports.getBookingStats = async (req, res) => {
  try {
    const totalBookings = await bookingRepo.count();
    const pendingBookings = await bookingRepo.count({ where: { status: 'pending' } });
    const approvedBookings = await bookingRepo.count({ where: { status: 'approved' } });
    const rejectedBookings = await bookingRepo.count({ where: { status: 'rejected' } });
    const cancelledBookings = await bookingRepo.count({ where: { status: 'cancelled' } });

    res.json({
      success: true,
      data: {
        total: totalBookings,
        pending: pendingBookings,
        approved: approvedBookings,
        rejected: rejectedBookings,
        cancelled: cancelledBookings
      }
    });
  } catch (error) {
    console.error("Error fetching booking stats:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy thống kê đặt tour"
    });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const booking = await bookingRepo.findOneBy({ id });
    if (!booking) return res.status(404).json({ error: "Không tìm thấy booking" });
    await bookingRepo.remove(booking);
    res.json({ message: "Đã hủy đặt tour thành công!" });
  } catch (err) {
    res.status(500).json({ error: "Lỗi server khi hủy đặt tour" });
  }
}; 