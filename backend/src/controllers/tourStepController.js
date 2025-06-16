const express = require("express");
const router = express.Router();
const tourStepService = require("../services/tourStepService");

router.get("/", async (req, res) => res.json(await tourStepService.findAll()));
router.get("/:id", async (req, res) => {
  const result = await tourStepService.findById(req.params.id);
  result ? res.json(result) : res.status(404).json({ message: "Not found" });
});
router.post("/", async (req, res) => res.status(201).json(await tourStepService.create(req.body)));
router.put("/:id", async (req, res) => res.json(await tourStepService.update(req.params.id, req.body)));
router.delete("/:id", async (req, res) => { await tourStepService.remove(req.params.id); res.status(204).end(); });
module.exports = router;
