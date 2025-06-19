const { AppDataSource } = require("../data-source");
const placeRepo = AppDataSource.getRepository("Place");
const tourRepo = AppDataSource.getRepository("Tour");
const tourStepRepo = AppDataSource.getRepository("TourStep");

module.exports = {
  
  generateTour: async (req, res) => {
    try {
      const { interests, budget, days, user_id } = req.body;
      if (!user_id || !days) {
        return res.status(400).json({ error: "Thiếu dữ liệu đầu vào" });
      }
      // Lấy tất cả địa điểm (không lọc city)
      const allPlaces = await placeRepo.find();
      if (allPlaces.length === 0) {
        return res.status(404).json({ error: "Không tìm thấy địa điểm phù hợp" });
      }
      // Tạo tour
      const tour = await tourRepo.save({
        name: `Tour AI tự động`,
        description: `Gợi ý từ AI với sở thích: ${interests?.join(", ")}`,
        user_id: user_id,
        total_cost: 0
      });
      // Tạo các bước tour
      const steps = allPlaces.slice(0, days * 2).map((p, i) => ({
        tour_id: tour.id,
        place_id: p.id,
        step_order: i + 1,
        stay_duration: 120
      }));
      await tourStepRepo.save(steps);
      // Lấy lại steps kèm thông tin Place
      const stepsWithPlace = await Promise.all(
        steps.map(async (step) => {
          const place = await placeRepo.findOneBy({ id: step.place_id });
          return { ...step, place };
        })
      );
      res.status(201).json({ tour, steps: stepsWithPlace });
    } catch (err) {
      console.error("AI generateTour error:", err);
      res.status(500).json({ error: "Server lỗi khi tạo tour" });
    }
  }
};
