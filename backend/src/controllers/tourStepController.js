const express = require("express");
const router = express.Router();
const tourStepService = require("../services/tourStepService");
const { AppDataSource } = require("../data-source");

const tourStepRepo = AppDataSource.getRepository("TourStep");

router.get("/", async (req, res) => res.json(await tourStepService.findAll()));
router.get("/:id", async (req, res) => {
  const result = await tourStepService.findById(req.params.id);
  result ? res.json(result) : res.status(404).json({ message: "Not found" });
});
router.post("/", async (req, res) => res.status(201).json(await tourStepService.create(req.body)));
router.put("/:id", async (req, res) => res.json(await tourStepService.update(req.params.id, req.body)));
router.delete("/:id", async (req, res) => { await tourStepService.remove(req.params.id); res.status(204).end(); });
router.get("/by-tour/:tourId", async (req, res) => {
  try {
    const tourId = parseInt(req.params.tourId);
    const steps = await tourStepRepo.find({ where: { tour_id: tourId } });
    res.json(steps);
  } catch (err) {
    console.error("Lỗi khi lấy các bước tour:", err);
    res.status(500).json({ error: "Lỗi server khi lấy các bước tour" });
  }
});
module.exports = router;
