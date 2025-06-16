const express = require("express");
const router = express.Router();
const favoriteService = require("../services/favoritePlaceService");

router.get("/", async (req, res) => res.json(await favoriteService.findAll()));
router.get("/:id", async (req, res) => {
  const result = await favoriteService.findById(req.params.id);
  result ? res.json(result) : res.status(404).json({ message: "Not found" });
});
router.post("/", async (req, res) => res.status(201).json(await favoriteService.create(req.body)));
router.put("/:id", async (req, res) => res.json(await favoriteService.update(req.params.id, req.body)));
router.delete("/:id", async (req, res) => { await favoriteService.remove(req.params.id); res.status(204).end(); });

module.exports = router;
