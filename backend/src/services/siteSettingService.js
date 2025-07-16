const { AppDataSource } = require("../data-source");
const repo = AppDataSource.getRepository("SiteSetting");

module.exports = {
  async getFooterSettings() {
    const setting = await repo.findOneBy({ key: "footer" });
    if (setting && setting.value) {
      try {
        return JSON.parse(setting.value);
      } catch {
        return {};
      }
    }
    return {};
  },

  async updateFooterSettings(data) {
    let setting = await repo.findOneBy({ key: "footer" });
    if (!setting) {
      setting = repo.create({ key: "footer", value: JSON.stringify(data) });
    } else {
      setting.value = JSON.stringify(data);
      setting.updated_at = new Date();
    }
    await repo.save(setting);
    return JSON.parse(setting.value);
  },
}; 