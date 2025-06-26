const placeTagService = require("../services/placeTagService");

exports.getAll = async (req, res) => {
  const result = await placeTagService.findAll();
  res.json(result);
};

exports.create = async (req, res) => {
  const created = await placeTagService.create(req.body);
  res.status(201).json(created);
};

exports.remove = async (req, res) => {
  const { place_id, tag_id } = req.body;
  await placeTagService.remove({ place_id, tag_id });
  res.status(204).end();
};
