const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.get("/", userController.getAll);
router.get("/:id", userController.getById);
router.post("/", userController.create);
router.put("/:id", userController.update);
router.delete("/:id", userController.delete);

// Profile routes (require authentication)
router.get("/profile/me", verifyToken, userController.getProfile);
router.put("/profile/me", verifyToken, userController.updateProfile);
router.put("/profile/change-password", verifyToken, userController.changePassword);

module.exports = router;
