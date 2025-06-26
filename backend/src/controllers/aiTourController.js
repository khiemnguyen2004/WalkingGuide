const { AppDataSource } = require("../data-source");
const placeRepo = AppDataSource.getRepository("Place");
const tourRepo = AppDataSource.getRepository("Tour");
const tourStepRepo = AppDataSource.getRepository("TourStep");
const tagRepo = AppDataSource.getRepository("Tag");

module.exports = {
  
  generateTour: async (req, res) => {
    try {
      const { interests, budget, days, user_id, tag_ids } = req.body;
      if (!user_id || !days) {
        return res.status(400).json({ error: "Thiếu dữ liệu đầu vào" });
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
        total_cost: 0
      };
      const steps = allPlaces.slice(0, days * 2).map((p, i) => ({
        place_id: p.id,
        step_order: i + 1,
        stay_duration: 120,
        place: p
      }));
      res.status(200).json({ tour, steps });
    } catch (err) {
      console.error("AI generateTour error:", err);
      res.status(500).json({ error: "Server lỗi khi tạo tour" });
    }
  }
};
