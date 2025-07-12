const { AppDataSource } = require("../data-source");

const Restaurant = AppDataSource.getRepository("Restaurant");
const RestaurantImage = AppDataSource.getRepository("RestaurantImage");

// Get all restaurants with their images
const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({
      relations: ["images"],
      where: { is_active: true },
      order: { created_at: "DESC" }
    });

    res.json({
      success: true,
      data: restaurants
    });
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch restaurants",
      error: error.message
    });
  }
};

// Get restaurant by ID with images
const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findOne({
      where: { id: parseInt(id), is_active: true },
      relations: ["images"]
    });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found"
      });
    }

    res.json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch restaurant",
      error: error.message
    });
  }
};

// Create new restaurant with images
const createRestaurant = async (req, res) => {
  try {
    const {
      name,
      description,
      latitude,
      longitude,
      city,
      address,
      phone,
      email,
      website,
      cuisine_type,
      price_range,
      min_price,
      max_price,
      opening_hours,
      delivery_available,
      takeout_available,
      dine_in_available,
      dietary_options,
      features,
      images
    } = req.body;

    // Create restaurant
    const restaurant = Restaurant.create({
      name,
      description,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      city,
      address,
      phone,
      email,
      website,
      cuisine_type,
      price_range,
      min_price: parseFloat(min_price) || 0,
      max_price: parseFloat(max_price) || 0,
      opening_hours,
      delivery_available: delivery_available || false,
      takeout_available: takeout_available !== false, // Default to true
      dine_in_available: dine_in_available !== false, // Default to true
      dietary_options,
      features
    });

    const savedRestaurant = await Restaurant.save(restaurant);

    // Add images if provided
    if (images && Array.isArray(images) && images.length > 0) {
      const restaurantImages = images.map((image, index) => {
        return RestaurantImage.create({
          restaurant_id: savedRestaurant.id,
          image_url: image.url,
          caption: image.caption || "",
          is_primary: image.is_primary || (index === 0), // First image is primary by default
          sort_order: index
        });
      });

      await RestaurantImage.save(restaurantImages);
    }

    // Fetch restaurant with images
    const restaurantWithImages = await Restaurant.findOne({
      where: { id: savedRestaurant.id },
      relations: ["images"]
    });

    res.status(201).json({
      success: true,
      message: "Restaurant created successfully",
      data: restaurantWithImages
    });
  } catch (error) {
    console.error("Error creating restaurant:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create restaurant",
      error: error.message
    });
  }
};

// Update restaurant
const updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const restaurant = await Restaurant.findOne({
      where: { id: parseInt(id) }
    });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found"
      });
    }

    // Update restaurant data
    Object.assign(restaurant, updateData);
    restaurant.updated_at = new Date();
    
    await Restaurant.save(restaurant);

    // Update images if provided
    if (updateData.images && Array.isArray(updateData.images)) {
      // Delete existing images
      await RestaurantImage.delete({ restaurant_id: parseInt(id) });

      // Add new images
      const restaurantImages = updateData.images.map((image, index) => {
        return RestaurantImage.create({
          restaurant_id: parseInt(id),
          image_url: image.url,
          caption: image.caption || "",
          is_primary: image.is_primary || (index === 0),
          sort_order: index
        });
      });

      await RestaurantImage.save(restaurantImages);
    }

    // Fetch updated restaurant with images
    const updatedRestaurant = await Restaurant.findOne({
      where: { id: parseInt(id) },
      relations: ["images"]
    });

    res.json({
      success: true,
      message: "Restaurant updated successfully",
      data: updatedRestaurant
    });
  } catch (error) {
    console.error("Error updating restaurant:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update restaurant",
      error: error.message
    });
  }
};

// Delete restaurant (soft delete)
const deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    
    const restaurant = await Restaurant.findOne({
      where: { id: parseInt(id) }
    });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found"
      });
    }

    restaurant.is_active = false;
    restaurant.updated_at = new Date();
    await Restaurant.save(restaurant);

    res.json({
      success: true,
      message: "Restaurant deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting restaurant:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete restaurant",
      error: error.message
    });
  }
};

// Search restaurants by location and cuisine
const searchRestaurants = async (req, res) => {
  try {
    const { latitude, longitude, radius = 10, city, cuisine_type } = req.query;
    
    let query = Restaurant.createQueryBuilder("restaurant")
      .leftJoinAndSelect("restaurant.images", "images")
      .where("restaurant.is_active = :isActive", { isActive: true });

    if (latitude && longitude) {
      // Search by coordinates within radius (in km)
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      const rad = parseFloat(radius);
      
      query = query.andWhere(
        `(6371 * acos(cos(radians(:lat)) * cos(radians(restaurant.latitude)) * cos(radians(restaurant.longitude) - radians(:lng)) + sin(radians(:lat)) * sin(radians(restaurant.latitude)))) <= :radius`,
        { lat, lng, radius: rad }
      );
    } else if (city) {
      query = query.andWhere("LOWER(restaurant.city) LIKE LOWER(:city)", { city: `%${city}%` });
    }

    if (cuisine_type) {
      query = query.andWhere("LOWER(restaurant.cuisine_type) LIKE LOWER(:cuisine)", { cuisine: `%${cuisine_type}%` });
    }

    const restaurants = await query
      .orderBy("restaurant.rating", "DESC")
      .addOrderBy("restaurant.created_at", "DESC")
      .getMany();

    res.json({
      success: true,
      data: restaurants
    });
  } catch (error) {
    console.error("Error searching restaurants:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search restaurants",
      error: error.message
    });
  }
};

module.exports = {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  searchRestaurants
}; 