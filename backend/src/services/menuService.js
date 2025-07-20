const AppDataSource = require("../data-source");
function getMenuRepo() {
  return AppDataSource.getRepository("Menu");
}
function getMenuItemRepo() {
  return AppDataSource.getRepository("MenuItem");
}

module.exports = {
  // Menu
  createMenu: (data) => getMenuRepo().save(getMenuRepo().create(data)),
  getMenusByRestaurant: (restaurant_id) => getMenuRepo().find({ where: { restaurant_id } }),
  getMenuById: (id) => getMenuRepo().findOneBy({ id }),
  updateMenu: async (id, data) => { await getMenuRepo().update(id, data); return getMenuRepo().findOneBy({ id }); },
  deleteMenu: (id) => getMenuRepo().delete(id),

  // MenuItem
  createMenuItem: (data) => getMenuItemRepo().save(getMenuItemRepo().create(data)),
  getMenuItemsByMenu: (menu_id) => getMenuItemRepo().find({ where: { menu_id } }),
  getMenuItemById: (id) => getMenuItemRepo().findOneBy({ id }),
  updateMenuItem: async (id, data) => { await getMenuItemRepo().update(id, data); return getMenuItemRepo().findOneBy({ id }); },
  deleteMenuItem: (id) => getMenuItemRepo().delete(id),
}; 