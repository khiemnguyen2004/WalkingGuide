const { AppDataSource } = require("../data-source");

const tourRepo = AppDataSource.getRepository("Tour");
const tourStepRepo = AppDataSource.getRepository("TourStep");

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
  getUserTours: async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const tours = await tourRepo.find({
        where: {
          user_id: userId,
        },
      });
      res.json(tours);
    } catch (err) {
      console.error("Lỗi khi lấy tour người dùng:", err);
      res.status(500).json({ error: "Lỗi server" });
    }
  },

  cloneTour: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.body.user_id;

      const tour = await tourRepo.findOneBy({ id: parseInt(id) });
      if (!tour) return res.status(404).json({ error: "Không tìm thấy tour" });

      const newTour = await tourRepo.save({
        name: tour.name,
        description: tour.description,
        user_id: userId,
        total_cost: tour.total_cost,
      });

      res.status(201).json(newTour);
    } catch (err) {
      console.error("Lỗi khi clone tour:", err);
      res.status(500).json({ error: "Lỗi server khi clone tour" });
    }
  },
  createTour: async (req, res) => {
    try {
      const { name, description, user_id, total_cost = 0, steps = [] } = req.body;

      if (!name || !user_id) {
        return res.status(400).json({ error: "Thiếu tên tour hoặc user_id" });
      }

      // 1. Tạo tour
      const newTour = await tourRepo.save({ name, description, total_cost, user_id });

      // 2. Lưu các bước của tour nếu có
      const savedSteps = [];
      for (const step of steps) {
        const saved = await tourStepRepo.save({
          tour_id: newTour.id,
          place_id: step.place_id,
          step_order: step.step_order,
          stay_duration: step.stay_duration || 60,
        });
        savedSteps.push(saved);
      }

      res.status(201).json({ tour: newTour, steps: savedSteps });
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
