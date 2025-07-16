const siteSettingService = require("../services/siteSettingService");

module.exports = {
  async getFooter(req, res) {
    try {
      const data = await siteSettingService.getFooterSettings();
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch footer settings", error: error.message });
    }
  },

  async updateFooter(req, res) {
    try {
      // Optionally: check admin role here
      const data = await siteSettingService.updateFooterSettings(req.body);
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to update footer settings", error: error.message });
    }
  },
}; 