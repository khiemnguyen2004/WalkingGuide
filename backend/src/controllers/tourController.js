const { AppDataSource } = require("../data-source");

const tourRepo = AppDataSource.getRepository("Tour");

module.exports = {
  getAllTours: async (req, res) => {
    try {
      const tours = await tourRepo.find();
      res.json(tours);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách tour:", err);
      res.status(500).json({ error: "Lỗi server" });
    }
  }
};
