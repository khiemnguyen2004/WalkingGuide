const AppDataSource = require("../data-source");

function getRestaurantRepo() {
  return AppDataSource.getRepository("Restaurant");
}
function getRestaurantImageRepo() {
  return AppDataSource.getRepository("RestaurantImage");
}

// Get all restaurants with their images
const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await getRestaurantRepo().find({
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
    const restaurant = await getRestaurantRepo().findOne({
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
    const restaurant = getRestaurantRepo().create({
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

    const savedRestaurant = await getRestaurantRepo().save(restaurant);

    // Add images if provided
    if (images && Array.isArray(images) && images.length > 0) {
      const restaurantImages = images.map((image, index) => {
        return getRestaurantImageRepo().create({
          restaurant_id: savedRestaurant.id,
          image_url: image.url,
          caption: image.caption || "",
          is_primary: image.is_primary || (index === 0), // First image is primary by default
          sort_order: index
        });
      });

      await getRestaurantImageRepo().save(restaurantImages);
    }

    // Fetch restaurant with images
    const restaurantWithImages = await getRestaurantRepo().findOne({
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

    console.log('Update request for restaurant ID:', id);
    console.log('Update data:', JSON.stringify(updateData, null, 2));

    const restaurant = await getRestaurantRepo().findOne({
      where: { id: parseInt(id) }
    });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found"
      });
    }

    // Remove images from updateData to handle separately
    const { images, ...restaurantUpdateData } = updateData;

    // Update restaurant data
    Object.assign(restaurant, restaurantUpdateData);
    restaurant.updated_at = new Date();
    
    await getRestaurantRepo().save(restaurant);

    // Update images if provided
    if (images && Array.isArray(images)) {
      console.log('Processing images:', images.length);
      
      // Delete existing images
      await getRestaurantImageRepo().delete({ restaurant_id: parseInt(id) });
      console.log('Deleted existing images for restaurant:', id);

      // Add new images
      if (images.length > 0) {
        const restaurantImages = images.map((image, index) => {
          console.log('Creating image:', index, image);
          
          if (!image.url) {
            throw new Error(`Image at index ${index} is missing URL`);
          }
          
          return getRestaurantImageRepo().create({
            restaurant_id: parseInt(id),
            image_url: image.url,
            caption: image.caption || "",
            is_primary: image.is_primary || (index === 0),
            sort_order: index
          });
        });

        console.log('Saving restaurant images:', restaurantImages.length);
        await getRestaurantImageRepo().save(restaurantImages);
        console.log('Successfully saved restaurant images');
      }
    }

    // Fetch updated restaurant with images
    const updatedRestaurant = await getRestaurantRepo().findOne({
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
    console.error("Error stack:", error.stack);
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
    
    const restaurant = await getRestaurantRepo().findOne({
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
    await getRestaurantRepo().save(restaurant);

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
    
    let query = getRestaurantRepo().createQueryBuilder("restaurant")
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