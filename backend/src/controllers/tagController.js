const express = require("express");
const router = express.Router();
const tagService = require("../services/tagService");

exports.getAllTags = async (req, res) => res.json(await tagService.findAll());
exports.getTagById = async (req, res) => {
  const tag = await tagService.findById(req.params.id);
  tag ? res.json(tag) : res.status(404).json({ message: "Not found" });
};
exports.createTag = async (req, res) => res.status(201).json(await tagService.create(req.body));
exports.updateTag = async (req, res) => res.json(await tagService.update(req.params.id, req.body));
exports.deleteTag = async (req, res) => { await tagService.remove(req.params.id); res.status(204).end(); };

router.get("/", exports.getAllTags);
router.get("/:id", exports.getTagById);
router.post("/", exports.createTag);
router.put("/:id", exports.updateTag);
router.delete("/:id", exports.deleteTag);