const express = require("express");
const router = express.Router();
const notiService = require("../services/notificationService");

router.get("/", async (req, res) => res.json(await notiService.findAll()));
router.get("/:id", async (req, res) => {
  const result = await notiService.findById(req.params.id);
  result ? res.json(result) : res.status(404).json({ message: "Not found" });
});
router.post("/", async (req, res) => res.status(201).json(await notiService.create(req.body)));
router.put("/:id", async (req, res) => res.json(await notiService.update(req.params.id, req.body)));
router.delete("/:id", async (req, res) => { await notiService.remove(req.params.id); res.status(204).end(); });

module.exports = router;
