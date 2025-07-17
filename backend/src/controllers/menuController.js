const menuService = require("../services/menuService");

module.exports = {
  // Get all menus for a restaurant
  getMenusByRestaurant: async (req, res) => {
    try {
      const { restaurantId } = req.params;
      const menus = await menuService.getMenusByRestaurant(restaurantId);
      res.json({ success: true, data: menus });
    } catch (err) {
      res.status(500).json({ success: false, message: "Failed to fetch menus", error: err.message });
    }
  },

  // Create a menu for a restaurant
  createMenu: async (req, res) => {
    try {
      const { restaurant_id, name, description } = req.body;
      if (!restaurant_id || !name) return res.status(400).json({ success: false, message: "Missing required fields" });
      const menu = await menuService.createMenu({ restaurant_id, name, description });
      res.status(201).json({ success: true, data: menu });
    } catch (err) {
      res.status(500).json({ success: false, message: "Failed to create menu", error: err.message });
    }
  },

  // Update a menu
  updateMenu: async (req, res) => {
    try {
      const { id } = req.params;
      const menu = await menuService.updateMenu(id, req.body);
      res.json({ success: true, data: menu });
    } catch (err) {
      res.status(500).json({ success: false, message: "Failed to update menu", error: err.message });
    }
  },

  // Delete a menu
  deleteMenu: async (req, res) => {
    try {
      const { id } = req.params;
      await menuService.deleteMenu(id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ success: false, message: "Failed to delete menu", error: err.message });
    }
  },

  // Get menu items by menu
  getMenuItemsByMenu: async (req, res) => {
    try {
      const { menuId } = req.params;
      const items = await menuService.getMenuItemsByMenu(menuId);
      res.json({ success: true, data: items });
    } catch (err) {
      res.status(500).json({ success: false, message: "Failed to fetch menu items", error: err.message });
    }
  },

  // Create menu item
  createMenuItem: async (req, res) => {
    try {
      const { menu_id, name, price, description, image_url } = req.body;
      if (!menu_id || !name) return res.status(400).json({ success: false, message: "Missing required fields" });
      const item = await menuService.createMenuItem({ menu_id, name, price, description, image_url });
      res.status(201).json({ success: true, data: item });
    } catch (err) {
      res.status(500).json({ success: false, message: "Failed to create menu item", error: err.message });
    }
  },

  // Update menu item
  updateMenuItem: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await menuService.updateMenuItem(id, req.body);
      res.json({ success: true, data: item });
    } catch (err) {
      res.status(500).json({ success: false, message: "Failed to update menu item", error: err.message });
    }
  },

  // Delete menu item
  deleteMenuItem: async (req, res) => {
    try {
      const { id } = req.params;
      await menuService.deleteMenuItem(id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ success: false, message: "Failed to delete menu item", error: err.message });
    }
  },
}; 