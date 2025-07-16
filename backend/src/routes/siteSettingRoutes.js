const express = require("express");
const router = express.Router();
const siteSettingController = require("../controllers/siteSettingController");

// Public: Get footer settings
router.get("/footer", siteSettingController.getFooter);

// Admin: Update footer settings (add auth middleware as needed)
router.put("/footer", siteSettingController.updateFooter);

module.exports = router; 