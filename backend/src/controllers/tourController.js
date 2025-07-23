const AppDataSource = require("../data-source");
const notiService = require("../services/notificationService");
const tourRatingService = require("../services/tourRatingService");

function getTourRepo() {
  return AppDataSource.getRepository("Tour");
}
function getTourStepRepo() {
  return AppDataSource.getRepository("TourStep");
}
function getBookingRepo() {
  return AppDataSource.getRepository("Booking");
}

module.exports = {
  getAllTours: async (req, res) => {
    try {
      // If adminOnly=true, only show tours created by admin
      if (req.query.adminOnly === 'true') {
        const tours = await getTourRepo()
          .createQueryBuilder("tour")
          .innerJoin("users", "user", "tour.user_id = user.id")
          .where("user.role = :role", { role: "ADMIN" })
          .getMany();
        const toursWithRating = await Promise.all(
          tours.map(async (tour) => {
            const rating = await tourRatingService.getTourAverageRating(tour.id);
            return { ...tour, rating };
          })
        );
        return res.json(toursWithRating);
      }
      // If admin, show all tours; if user, show only approved tours
      const userRole = req.query.role || "USER";
      let query = getTourRepo().createQueryBuilder("tour").innerJoin("users", "user", "tour.user_id = user.id");
      if (userRole === "ADMIN") {
        // Show all tours
      } else {
        // Only show approved tours
        query = query.where("tour.status = :status", { status: "approved" });
      }
      const tours = await query.getMany();
      // Fetch average rating for each tour
      const toursWithRating = await Promise.all(
        tours.map(async (tour) => {
          const rating = await tourRatingService.getTourAverageRating(tour.id);
          return { ...tour, rating };
        })
      );
      res.json(toursWithRating);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách tour:", err);
      res.status(500).json({ error: "Lỗi server" });
    }
  },
  getUserTours: async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const tours = await getTourRepo().find({
        where: {
          user_id: userId,
        },
      });
      // Ensure start_from is included (TypeORM should include it by default, but for clarity)
      res.json(tours.map(tour => ({ ...tour, start_from: tour.start_from })));
    } catch (err) {
      console.error("Lỗi khi lấy tour người dùng:", err);
      res.status(500).json({ error: "Lỗi server" });
    }
  },

  cloneTour: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.body.user_id;

      const tour = await getTourRepo().findOneBy({ id: parseInt(id) });
      if (!tour) return res.status(404).json({ error: "Không tìm thấy tour" });

      const newTour = await getTourRepo().save({
        name: tour.name,
        description: tour.description,
        image_url: tour.image_url,
        user_id: userId,
        total_cost: tour.total_cost,
      });

      // Clone steps from the original tour
      const originalSteps = await getTourStepRepo().find({ where: { tour_id: tour.id } });
      const newSteps = [];
      for (const step of originalSteps) {
        const newStep = await getTourStepRepo().save({
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
      const { name, description, image_url, user_id, total_cost = 0, steps = [], start_time, end_time, start_from } = req.body;

      if (!name || !user_id) {
        return res.status(400).json({ error: "Thiếu tên tour hoặc user_id" });
      }

      // Determine user role
      const userRepo = AppDataSource.getRepository("User");
      const user = await userRepo.findOneBy({ id: user_id });
      let status = "pending";
      if (user && user.role === "ADMIN") {
        status = "approved";
      }

      // 1. Tạo tour
      const newTour = await getTourRepo().save({ name, description, image_url, total_cost, user_id, start_time, end_time, start_from, status });

      // 2. Lưu các bước của tour nếu có
      const savedSteps = [];
      for (const step of steps) {
        const saved = await getTourStepRepo().save({
          tour_id: newTour.id,
          place_id: step.place_id,
          step_order: step.step_order,
          stay_duration: step.stay_duration || 60,
          start_time: step.start_time === "" ? null : step.start_time,
          end_time: step.end_time === "" ? null : step.end_time,
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

      // 5. Create booking for the creator
      let booking = null;
      if (start_time && end_time) {
        booking = await getBookingRepo().save({
          user_id,
          tour_id: newTour.id,
          start_date: start_time,
          end_date: end_time,
          spots: 1,
          total_price: total_cost,
          status: 'pending',
        });
      }

      res.status(201).json({ tour: newTour, steps: savedSteps, booking });
    } catch (err) {
      console.error("Lỗi khi tạo tour:", err);
      res.status(500).json({ error: "Lỗi server khi tạo tour" });
    }
  },

  editTour: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, image_url, total_cost, steps } = req.body;
      const tour = await getTourRepo().findOneBy({ id: parseInt(id) });
      if (!tour) return res.status(404).json({ error: "Không tìm thấy tour" });
      if (name !== undefined) tour.name = name;
      if (description !== undefined) tour.description = description;
      if (image_url !== undefined) tour.image_url = image_url;
      if (total_cost !== undefined) tour.total_cost = parseFloat(total_cost) || 0;
      await getTourRepo().save(tour);
      // Update steps if provided
      if (Array.isArray(steps)) {
        // Delete old steps
        await getTourStepRepo().delete({ tour_id: tour.id });
        // Insert new steps
        for (const step of steps) {
          await getTourStepRepo().save({
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
      const tour = await getTourRepo().findOneBy({ id: parseInt(id) });
      if (!tour) return res.status(404).json({ error: "Không tìm thấy tour" });
      await getTourRepo().remove(tour);
      res.json({ message: "Đã xóa tour" });
    } catch (err) {
      console.error("Lỗi khi xóa tour:", err);
      res.status(500).json({ error: "Lỗi server" });
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const tour = await getTourRepo().findOneBy({ id: parseInt(id) });
      if (!tour) return res.status(404).json({ error: "Không tìm thấy tour" });
      // Fetch steps for this tour
      const steps = await getTourStepRepo().find({ where: { tour_id: tour.id } });
      res.json({ ...tour, start_from: tour.start_from, steps });
    } catch (err) {
      console.error("Lỗi khi lấy chi tiết tour:", err);
      res.status(500).json({ error: "Lỗi server khi lấy chi tiết tour" });
    }
  },

  bookTour: async (req, res) => {
    try {
      const tourId = parseInt(req.params.id);
      const userId = req.body.user_id; // Should be provided in request body or from auth
      const { start_date, end_date, spots = 1 } = req.body;
      if (!userId || !start_date || !end_date) {
        return res.status(400).json({ error: "Thiếu user_id, start_date hoặc end_date" });
      }
      if (new Date(end_date) < new Date(start_date)) {
        return res.status(400).json({ error: "Ngày kết thúc phải sau ngày bắt đầu" });
      }
      // Optionally: check if tour exists
      const tour = await getTourRepo().findOneBy({ id: tourId });
      if (!tour) return res.status(404).json({ error: "Không tìm thấy tour" });
      const safeSpots = spots > 0 ? spots : 1;
      const total_price = safeSpots * (tour.total_cost || 0);
      // Create booking
      const booking = await getBookingRepo().save({
        user_id: userId,
        tour_id: tourId,
        start_date,
        end_date,
        spots: safeSpots,
        total_price,
      });
      // Send booking notification
      const noti = await notiService.create({
        user_id: userId,
        type: 'booking_success',
        content: `Bạn đã đặt tour "${tour.name}" thành công!`,
        is_read: false,
        tour_id: tourId // <-- Fix: include the tour ID
      });
      console.log('Booking notification created:', noti);
      res.status(201).json({ message: "Đặt tour thành công!", booking });
    } catch (err) {
      console.error("Lỗi khi đặt tour:", err);
      res.status(500).json({ error: "Lỗi server khi đặt tour" });
    }
  },

  getUserBookedTours: async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const bookings = await getBookingRepo().find({ where: { user_id: userId } });
      const tourIds = bookings.map(b => b.tour_id);
      let tours = [];
      if (tourIds.length > 0) {
        tours = await getTourRepo().findByIds(tourIds);
      }
      // Attach booking info to each tour
      const toursWithBooking = tours.map(tour => {
        const booking = bookings.find(b => b.tour_id === tour.id);
        return { ...tour, booking };
      });
      res.json(toursWithBooking);
    } catch (err) {
      console.error("Lỗi khi lấy tour đã đặt:", err);
      res.status(500).json({ error: "Lỗi server khi lấy tour đã đặt" });
    }
  },

  // Admin: Get all user-created tours pending approval
  getPendingUserTours: async (req, res) => {
    try {
      const tours = await getTourRepo()
        .createQueryBuilder("tour")
        .innerJoin("users", "user", "tour.user_id = user.id")
        .where("user.role != :role AND tour.status = :status", { role: "ADMIN", status: "pending" })
        .getMany();
      res.json(tours);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách tour chờ duyệt:", err);
      res.status(500).json({ error: "Lỗi server" });
    }
  },

  // Admin: Approve a user-created tour
  approveTour: async (req, res) => {
    try {
      const { id } = req.params;
      const tour = await getTourRepo().findOneBy({ id: parseInt(id) });
      if (!tour) return res.status(404).json({ error: "Không tìm thấy tour" });
      tour.status = "approved";
      await getTourRepo().save(tour);
      res.json({ message: "Tour đã được duyệt", tour });
    } catch (err) {
      console.error("Lỗi khi duyệt tour:", err);
      res.status(500).json({ error: "Lỗi server khi duyệt tour" });
    }
  },

  // Admin: Reject a user-created tour
  rejectTour: async (req, res) => {
    try {
      const { id } = req.params;
      const tour = await getTourRepo().findOneBy({ id: parseInt(id) });
      if (!tour) return res.status(404).json({ error: "Không tìm thấy tour" });
      tour.status = "rejected";
      await getTourRepo().save(tour);
      // Send notification to user about tour refusal
      await notiService.create({
        user_id: tour.user_id,
        type: 'tour_rejected',
        content: `Tour \"${tour.name}\" đã bị từ chối bởi quản trị viên.`,
        is_read: false,
        tour_id: tour.id
      });
      res.json({ message: "Tour đã bị từ chối", tour });
    } catch (err) {
      console.error("Lỗi khi từ chối tour:", err);
      res.status(500).json({ error: "Lỗi server khi từ chối tour" });
    }
  },
};
