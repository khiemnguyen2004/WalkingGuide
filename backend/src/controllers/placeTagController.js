const express = require("express");
const router = express.Router();
const placeTagService = require("../services/placeTagService");

router.get("/", async (req, res) => res.json(await placeTagService.findAll()));
router.get("/:id", async (req, res) => {
  const result = await placeTagService.findById(req.params.id);
  result ? res.json(result) : res.status(404).json({ message: "Not found" });
});
router.post("/", async (req, res) => res.status(201).json(await placeTagService.create(req.body)));
router.put("/:id", async (req, res) => res.json(await placeTagService.update(req.params.id, req.body)));
router.delete("/:id", async (req, res) => { await placeTagService.remove(req.params.id); res.status(204).end(); });
module.exports = router;