const placeService = require("../services/placeService");

module.exports = {
  getAll: async (req, res) => {
    const places = await placeService.findAll();
    res.json(places);
  },
  getById: async (req, res) => {
    const place = await placeService.findById(req.params.id);
    place ? res.json(place) : res.status(404).json({ message: "Not found" });
  },
  create: async (req, res) => {
    const newPlace = await placeService.create(req.body);
    res.status(201).json(newPlace);
  },
  update: async (req, res) => {
    const updated = await placeService.update(req.params.id, req.body);
    res.json(updated);
  },
  delete: async (req, res) => {
    await placeService.remove(req.params.id);
    res.status(204).end();
  },
};