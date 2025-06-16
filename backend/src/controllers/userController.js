// src/controllers/userController.js
const userService = require("../services/userService");

module.exports = {
  getAll: async (req, res) => {
    const users = await userService.findAll();
    res.json(users);
  },
  getById: async (req, res) => {
    const user = await userService.findById(req.params.id);
    user ? res.json(user) : res.status(404).json({ message: "Not found" });
  },
  create: async (req, res) => {
    const newUser = await userService.create(req.body);
    res.status(201).json(newUser);
  },
  update: async (req, res) => {
    const updatedUser = await userService.update(req.params.id, req.body);
    res.json(updatedUser);
  },
  delete: async (req, res) => {
    await userService.remove(req.params.id);
    res.status(204).end();
  },
};
