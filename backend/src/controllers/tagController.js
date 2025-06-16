const express = require("express");
const router = express.Router();
const tagService = require("../services/tagService");

router.get("/", async (req, res) => res.json(await tagService.findAll()));
router.get("/:id", async (req, res) => {
  const tag = await tagService.findById(req.params.id);
  tag ? res.json(tag) : res.status(404).json({ message: "Not found" });
});
router.post("/", async (req, res) => res.status(201).json(await tagService.create(req.body)));
router.put("/:id", async (req, res) => res.json(await tagService.update(req.params.id, req.body)));
router.delete("/:id", async (req, res) => { await tagService.remove(req.params.id); res.status(204).end(); });
module.exports = router;