const { AppDataSource } = require("../data-source");
const notiService = require("../services/notificationService");

const tourRepo = AppDataSource.getRepository("Tour");
const tourStepRepo = AppDataSource.getRepository("TourStep");

module.exports = {
  getAllTours: async (req, res) => {
    try {
      // Only return tours created by ADMIN
      const tours = await tourRepo
        .createQueryBuilder("tour")
        .innerJoin("users", "user", "tour.user_id = user.id")
        .where("user.role = :role", { role: "ADMIN" })
        .getMany();
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
        image_url: tour.image_url,
        user_id: userId,
        total_cost: tour.total_cost,
      });

      // Clone steps from the original tour
      const originalSteps = await tourStepRepo.find({ where: { tour_id: tour.id } });
      const newSteps = [];
      for (const step of originalSteps) {
        const newStep = await tourStepRepo.save({
          tour_id: newTour.id,
          place_id: step.place_id,
          step_order: step.step_order,
          stay_duration: step.stay_duration,
          start_time: step.start_time,
          end_time: step.end_time,
          day: step.day,
        });
        newSteps.push(newStep);
      }

      // Create notification for cloned tour
      await notiService.createTourCreated(userId, newTour.name);

      res.status(201).json({ tour: newTour, steps: newSteps });
    } catch (err) {
      console.error("Lỗi khi clone tour:", err);
      res.status(500).json({ error: "Lỗi server khi clone tour" });
    }
  },
  createTour: async (req, res) => {
    try {
      const { name, description, image_url, user_id, total_cost = 0, steps = [], start_time, end_time } = req.body;

      if (!name || !user_id) {
        return res.status(400).json({ error: "Thiếu tên tour hoặc user_id" });
      }

      // 1. Tạo tour
      const newTour = await tourRepo.save({ name, description, image_url, total_cost, user_id, start_time, end_time });

      // 2. Lưu các bước của tour nếu có
      const savedSteps = [];
      for (const step of steps) {
        const saved = await tourStepRepo.save({
          tour_id: newTour.id,
          place_id: step.place_id,
          step_order: step.step_order,
          stay_duration: step.stay_duration || 60,
          start_time: step.start_time,
          end_time: step.end_time,
          day: step.day || 1
        });
        savedSteps.push(saved);
      }

      // 3. Create notification for new tour
      await notiService.createTourCreated(user_id, newTour.name);

      // 4. Create tour reminder if start_time is provided
      if (start_time) {
        // Create immediate reminder notification
        await notiService.createTourReminder(user_id, newTour.id, newTour.name, start_time);
        
        // Create a reminder 1 day before if the tour is more than 1 day away
        const tourStartDate = new Date(start_time);
        const now = new Date();
        const daysUntilTour = Math.ceil((tourStartDate - now) / (1000 * 60 * 60 * 24));
        
        if (daysUntilTour > 1) {
          // Create a reminder for 1 day before
          const reminderDate = new Date(tourStartDate);
          reminderDate.setDate(reminderDate.getDate() - 1);
          
          await notiService.create({
            user_id: user_id,
            content: `Nhắc nhở: Tour "${newTour.name}" sẽ bắt đầu vào ngày mai (${start_time}). Hãy chuẩn bị sẵn sàng!`,
            type: 'tour_reminder',
            tour_id: newTour.id,
            is_read: false
          });
        }
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
      const { name, description, image_url, steps } = req.body;
      const tour = await tourRepo.findOneBy({ id: parseInt(id) });
      if (!tour) return res.status(404).json({ error: "Không tìm thấy tour" });
      if (name !== undefined) tour.name = name;
      if (description !== undefined) tour.description = description;
      if (image_url !== undefined) tour.image_url = image_url;
      await tourRepo.save(tour);
      // Update steps if provided
      if (Array.isArray(steps)) {
        // Delete old steps
        await tourStepRepo.delete({ tour_id: tour.id });
        // Insert new steps
        for (const step of steps) {
          await tourStepRepo.save({
            tour_id: tour.id,
            place_id: step.place_id,
            step_order: step.step_order,
            stay_duration: step.stay_duration || 60,
            start_time: step.start_time,
            end_time: step.end_time,
            day: step.day || 1
          });
        }
      }
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

  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const tour = await tourRepo.findOneBy({ id: parseInt(id) });
      if (!tour) return res.status(404).json({ error: "Không tìm thấy tour" });
      // Fetch steps for this tour
      const steps = await tourStepRepo.find({ where: { tour_id: tour.id } });
      res.json({ ...tour, steps });
    } catch (err) {
      console.error("Lỗi khi lấy chi tiết tour:", err);
      res.status(500).json({ error: "Lỗi server khi lấy chi tiết tour" });
    }
  },
};
