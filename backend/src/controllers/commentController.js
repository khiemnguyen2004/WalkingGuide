const express = require("express");
const router = express.Router();
const commentService = require("../services/commentService");

router.get("/", async (req, res) => res.json(await commentService.findAll()));
router.get("/:id", async (req, res) => {
  const result = await commentService.findById(req.params.id);
  result ? res.json(result) : res.status(404).json({ message: "Not found" });
});
router.post("/", async (req, res) => res.status(201).json(await commentService.create(req.body)));
router.put("/:id", async (req, res) => res.json(await commentService.update(req.params.id, req.body)));
router.delete("/:id", async (req, res) => { await commentService.remove(req.params.id); res.status(204).end(); });

module.exports = router;
