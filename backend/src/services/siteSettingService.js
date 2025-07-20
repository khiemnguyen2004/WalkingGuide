const AppDataSource = require("../data-source");
function getRepo() {
  return AppDataSource.getRepository("SiteSetting");
}

module.exports = {
  async getFooterSettings() {
    const setting = await getRepo().findOneBy({ key: "footer" });
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
    let setting = await getRepo().findOneBy({ key: "footer" });
    if (!setting) {
      setting = getRepo().create({ key: "footer", value: JSON.stringify(data) });
    } else {
      setting.value = JSON.stringify(data);
      setting.updated_at = new Date();
    }
    await getRepo().save(setting);
    return JSON.parse(setting.value);
  },
}; 