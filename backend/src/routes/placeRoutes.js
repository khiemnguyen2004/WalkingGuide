const express = require("express");
const router = express.Router();
const { AppDataSource } = require("../data-source");
const placeController = require("../controllers/placeController");

router.get("/", async (req, res) => {
  try {
    const placeRepository = AppDataSource.getRepository("Place");
    const places = await placeRepository.find();
    res.json(places);
  } catch (err) {
    console.error("Lỗi khi lấy dữ liệu places:", err);
    res.status(500).json({ error: "Lỗi server khi lấy địa điểm" });
  }
});
router.put("/:id", placeController.update);

module.exports = router;
