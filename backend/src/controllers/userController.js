// src/controllers/userController.js
const userService = require("../services/userService");
const bcrypt = require("bcryptjs");

module.exports = {
  getAll: async (req, res) => {
    const users = await userService.findAll();
    res.json(users);
  },
  getById: async (req, res) => {
    const user = await userService.findById(req.params.id);
    user ? res.json(user) : res.status(404).json({ message: "Not found" });
  },
  getProfile: async (req, res) => {
    try {
      // req.user should be set by auth middleware
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const user = await userService.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove sensitive information
      const { password_hash, ...userProfile } = user;
      res.json(userProfile);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },
  create: async (req, res) => {
    const newUser = await userService.create(req.body);
    res.status(201).json(newUser);
  },
  update: async (req, res) => {
    const updatedUser = await userService.update(req.params.id, req.body);
    res.json(updatedUser);
  },
  updateProfile: async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const updatedUser = await userService.update(req.user.id, req.body);
      const { password_hash, ...userProfile } = updatedUser;
      res.json(userProfile);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },
  changePassword: async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current password and new password are required" });
      }

      // Get the current user with password hash
      const user = await userService.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      // Hash new password
      const newPasswordHash = await bcrypt.hash(newPassword, 10);

      // Update password
      const updatedUser = await userService.update(req.user.id, {
        password_hash: newPasswordHash
      });

      const { password_hash, ...userProfile } = updatedUser;
      res.json({ message: "Password updated successfully", user: userProfile });
    } catch (error) {
      console.error("Password change error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  delete: async (req, res) => {
    await userService.remove(req.params.id);
    res.status(204).end();
  },
};
