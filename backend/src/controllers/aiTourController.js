const { AppDataSource } = require("../data-source");
const placeRepo = AppDataSource.getRepository("Place");
const tourRepo = AppDataSource.getRepository("Tour");
const tourStepRepo = AppDataSource.getRepository("TourStep");
const tagRepo = AppDataSource.getRepository("Tag");

module.exports = {
  
  generateTour: async (req, res) => {
    try {
      const { interests, budget, days, user_id, tag_ids, start_time, end_time } = req.body;
      if (!user_id) {
        return res.status(400).json({ error: "Thiếu dữ liệu đầu vào" });
      }

      // Calculate days based on start and end dates
      let totalDays = 1;
      if (start_time && end_time) {
        const startDate = new Date(start_time);
        const endDate = new Date(end_time);
        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        totalDays = Math.max(1, diffDays);
      } else {
        totalDays = parseInt(days) || 1;
      }

      let matchedTagIds = Array.isArray(tag_ids) ? [...tag_ids] : [];

      // 1. Analyze user interests and match to tags
      if (interests && interests.length > 0) {
        for (const interest of interests) {
          // Find tags whose name contains the interest keyword (case-insensitive)
          const foundTags = await tagRepo
            .createQueryBuilder("tag")
            .where("LOWER(tag.name) LIKE :kw", { kw: `%${interest.toLowerCase()}%` })
            .getMany();
          matchedTagIds.push(...foundTags.map(t => t.id));
        }
        // Remove duplicates
        matchedTagIds = [...new Set(matchedTagIds)];
      }

      // 2. Filter places by matchedTagIds (if any)
      let allPlaces;
      if (matchedTagIds.length > 0) {
        allPlaces = await placeRepo
          .createQueryBuilder("place")
          .innerJoin("place_tags", "pt", "pt.place_id = place.id")
          .where("pt.tag_id IN (:...tagIds)", { tagIds: matchedTagIds })
          .getMany();
      } else {
        allPlaces = await placeRepo.find();
      }

      if (allPlaces.length === 0) {
        return res.status(404).json({ error: "Không tìm thấy địa điểm phù hợp" });
      }

      const tour = {
        name: `Tour AI tự động`,
        description: `Gợi ý từ AI với sở thích: ${interests?.join(", ")}`,
        user_id: user_id,
        total_cost: 0,
        start_time: start_time || null,
        end_time: end_time || null
      };
      
      // Generate more places (3-4 per day instead of fixed 2)
      const placesPerDay = 3; // Allow more places per day
      const totalPlaces = Math.min(allPlaces.length, totalDays * placesPerDay);
      const stepsPerDay = Math.ceil(totalPlaces / totalDays);
      
      const steps = allPlaces.slice(0, totalPlaces).map((p, i) => ({
        place_id: p.id,
        step_order: i + 1,
        stay_duration: 120,
        day: Math.floor(i / stepsPerDay) + 1, // Distribute evenly across calculated days
        place: p
      }));
      
      res.status(200).json({ tour, steps });
    } catch (err) {
      console.error("AI generateTour error:", err);
      res.status(500).json({ error: "Server lỗi khi tạo tour" });
    }
  }
};
