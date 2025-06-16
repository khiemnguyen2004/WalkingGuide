// src/controllers/placeController.js
const express = require("express");
const router = express.Router();
const placeService = require("../services/placeService");

router.get("/", async (req, res) => {
  const places = await placeService.findAll();
  res.json(places);
});

router.get("/:id", async (req, res) => {
  const place = await placeService.findById(req.params.id);
  place ? res.json(place) : res.status(404).json({ message: "Not found" });
});

router.post("/", async (req, res) => {
  const newPlace = await placeService.create(req.body);
  res.status(201).json(newPlace);
});

router.put("/:id", async (req, res) => {
  const updated = await placeService.update(req.params.id, req.body);
  res.json(updated);
});

router.delete("/:id", async (req, res) => {
  await placeService.remove(req.params.id);
  res.status(204).end();
});

module.exports = router;
