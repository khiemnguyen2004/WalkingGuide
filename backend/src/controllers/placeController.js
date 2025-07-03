const placeService = require("../services/placeService");
const placeRatingService = require("../services/placeRatingService");

module.exports = {
  getAll: async (req, res) => {
    const places = await placeService.findAll();
    // Fetch average rating for each place
    const placesWithRating = await Promise.all(
      places.map(async (place) => {
        const rating = await placeRatingService.getPlaceAverageRating(place.id);
        return { ...place, rating };
      })
    );
    res.json(placesWithRating);
  },
  getById: async (req, res) => {
    const place = await placeService.findById(req.params.id);
    place ? res.json(place) : res.status(404).json({ message: "Not found" });
  },
  getByCity: async (req, res) => {
    const { city } = req.query;
    if (!city) {
      return res.status(400).json({ message: "City parameter is required" });
    }
    const places = await placeService.findByCity(city);
    res.json(places);
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