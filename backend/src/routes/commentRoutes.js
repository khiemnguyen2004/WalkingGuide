const express = require("express");
const router = express.Router();
const commentService = require("../services/commentService");

router.get("/place/:place_id", async (req, res) => {
  const comments = await commentService.findByPlaceId(req.params.place_id);
  res.json(comments);
});

router.post("/", async (req, res) => {
  const comment = await commentService.create(req.body);
  res.status(201).json(comment);
});

router.delete("/:id", async (req, res) => {
  await commentService.remove(req.params.id);
  res.status(204).end();
});

module.exports = router; 