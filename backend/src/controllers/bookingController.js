const { AppDataSource } = require("../data-source");
const bookingRepo = AppDataSource.getRepository("Booking");

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