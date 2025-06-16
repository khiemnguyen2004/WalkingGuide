const express = require("express");
const router = express.Router();
const articleService = require("../services/articleService");

router.get("/", async (req, res) => res.json(await articleService.findAll()));
router.get("/:id", async (req, res) => {
  const result = await articleService.findById(req.params.id);
  result ? res.json(result) : res.status(404).json({ message: "Not found" });
});
router.post("/", async (req, res) => res.status(201).json(await articleService.create(req.body)));
router.put("/:id", async (req, res) => res.json(await articleService.update(req.params.id, req.body)));
router.delete("/:id", async (req, res) => { await articleService.remove(req.params.id); res.status(204).end(); });

module.exports = router;
