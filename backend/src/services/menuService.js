const { AppDataSource } = require("../data-source");
const menuRepo = AppDataSource.getRepository("Menu");
const menuItemRepo = AppDataSource.getRepository("MenuItem");

module.exports = {
  // Menu
  createMenu: (data) => menuRepo.save(menuRepo.create(data)),
  getMenusByRestaurant: (restaurant_id) => menuRepo.find({ where: { restaurant_id } }),
  getMenuById: (id) => menuRepo.findOneBy({ id }),
  updateMenu: async (id, data) => { await menuRepo.update(id, data); return menuRepo.findOneBy({ id }); },
  deleteMenu: (id) => menuRepo.delete(id),

  // MenuItem
  createMenuItem: (data) => menuItemRepo.save(menuItemRepo.create(data)),
  getMenuItemsByMenu: (menu_id) => menuItemRepo.find({ where: { menu_id } }),
  getMenuItemById: (id) => menuItemRepo.findOneBy({ id }),
  updateMenuItem: async (id, data) => { await menuItemRepo.update(id, data); return menuItemRepo.findOneBy({ id }); },
  deleteMenuItem: (id) => menuItemRepo.delete(id),
}; 