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
  },

  createTour: async (req, res) => {
    try {
      const { name, description, user_id } = req.body;

      if (!name || !user_id) {
        return res.status(400).json({ error: "Thiếu tên tour hoặc user_id" });
      }

      const newTour = await tourRepo.save({ name, description, user_id });
      res.status(201).json(newTour);
    } catch (err) {
      console.error("Lỗi khi tạo tour:", err);
      res.status(500).json({ error: "Lỗi server khi tạo tour" });
    }
  },

  editTour: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      const tour = await tourRepo.findOneBy({ id: parseInt(id) });
      if (!tour) return res.status(404).json({ error: "Không tìm thấy tour" });
      if (name !== undefined) tour.name = name;
      if (description !== undefined) tour.description = description;
      await tourRepo.save(tour);
      res.json(tour);
    } catch (err) {
      console.error("Lỗi khi sửa tour:", err);
      res.status(500).json({ error: "Lỗi server" });
    }
  },

  deleteTour: async (req, res) => {
    try {
      const { id } = req.params;
      const tour = await tourRepo.findOneBy({ id: parseInt(id) });
      if (!tour) return res.status(404).json({ error: "Không tìm thấy tour" });
      await tourRepo.remove(tour);
      res.json({ message: "Đã xóa tour" });
    } catch (err) {
      console.error("Lỗi khi xóa tour:", err);
      res.status(500).json({ error: "Lỗi server" });
    }
  },
};

