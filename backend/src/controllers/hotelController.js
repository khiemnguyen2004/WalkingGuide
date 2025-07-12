const { AppDataSource } = require("../data-source");

const Hotel = AppDataSource.getRepository("Hotel");
const HotelImage = AppDataSource.getRepository("HotelImage");

// Get all hotels with their images
const getAllHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find({
      relations: ["images"],
      where: { is_active: true },
      order: { created_at: "DESC" }
    });

    res.json({
      success: true,
      data: hotels
    });
  } catch (error) {
    console.error("Error fetching hotels:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch hotels",
      error: error.message
    });
  }
};

// Get hotel by ID with images
const getHotelById = async (req, res) => {
  try {
    const { id } = req.params;
    const hotel = await Hotel.findOne({
      where: { id: parseInt(id), is_active: true },
      relations: ["images"]
    });

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found"
      });
    }

    res.json({
      success: true,
      data: hotel
    });
  } catch (error) {
    console.error("Error fetching hotel:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch hotel",
      error: error.message
    });
  }
};

// Create new hotel with images
const createHotel = async (req, res) => {
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
      price_range,
      min_price,
      max_price,
      amenities,
      room_types,
      check_in_time,
      check_out_time,
      stars,
      images
    } = req.body;

    // Create hotel
    const hotel = Hotel.create({
      name,
      description,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      city,
      address,
      phone,
      email,
      website,
      price_range,
      min_price: parseFloat(min_price) || 0,
      max_price: parseFloat(max_price) || 0,
      amenities,
      room_types,
      check_in_time,
      check_out_time,
      stars: parseInt(stars) || 0
    });

    const savedHotel = await Hotel.save(hotel);

    // Add images if provided
    if (images && Array.isArray(images) && images.length > 0) {
      const hotelImages = images.map((image, index) => {
        return HotelImage.create({
          hotel_id: savedHotel.id,
          image_url: image.url,
          caption: image.caption || "",
          is_primary: image.is_primary || (index === 0), // First image is primary by default
          sort_order: index
        });
      });

      await HotelImage.save(hotelImages);
    }

    // Fetch hotel with images
    const hotelWithImages = await Hotel.findOne({
      where: { id: savedHotel.id },
      relations: ["images"]
    });

    res.status(201).json({
      success: true,
      message: "Hotel created successfully",
      data: hotelWithImages
    });
  } catch (error) {
    console.error("Error creating hotel:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create hotel",
      error: error.message
    });
  }
};

// Update hotel
const updateHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const hotel = await Hotel.findOne({
      where: { id: parseInt(id) }
    });

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found"
      });
    }

    // Update hotel data
    Object.assign(hotel, updateData);
    hotel.updated_at = new Date();
    
    await Hotel.save(hotel);

    // Update images if provided
    if (updateData.images && Array.isArray(updateData.images)) {
      // Delete existing images
      await HotelImage.delete({ hotel_id: parseInt(id) });

      // Add new images
      const hotelImages = updateData.images.map((image, index) => {
        return HotelImage.create({
          hotel_id: parseInt(id),
          image_url: image.url,
          caption: image.caption || "",
          is_primary: image.is_primary || (index === 0),
          sort_order: index
        });
      });

      await HotelImage.save(hotelImages);
    }

    // Fetch updated hotel with images
    const updatedHotel = await Hotel.findOne({
      where: { id: parseInt(id) },
      relations: ["images"]
    });

    res.json({
      success: true,
      message: "Hotel updated successfully",
      data: updatedHotel
    });
  } catch (error) {
    console.error("Error updating hotel:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update hotel",
      error: error.message
    });
  }
};

// Delete hotel (soft delete)
const deleteHotel = async (req, res) => {
  try {
    const { id } = req.params;
    
    const hotel = await Hotel.findOne({
      where: { id: parseInt(id) }
    });

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found"
      });
    }

    hotel.is_active = false;
    hotel.updated_at = new Date();
    await Hotel.save(hotel);

    res.json({
      success: true,
      message: "Hotel deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting hotel:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete hotel",
      error: error.message
    });
  }
};

// Search hotels by location
const searchHotels = async (req, res) => {
  try {
    const { latitude, longitude, radius = 10, city } = req.query;
    
    let query = Hotel.createQueryBuilder("hotel")
      .leftJoinAndSelect("hotel.images", "images")
      .where("hotel.is_active = :isActive", { isActive: true });

    if (latitude && longitude) {
      // Search by coordinates within radius (in km)
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      const rad = parseFloat(radius);
      
      query = query.andWhere(
        `(6371 * acos(cos(radians(:lat)) * cos(radians(hotel.latitude)) * cos(radians(hotel.longitude) - radians(:lng)) + sin(radians(:lat)) * sin(radians(hotel.latitude)))) <= :radius`,
        { lat, lng, radius: rad }
      );
    } else if (city) {
      query = query.andWhere("LOWER(hotel.city) LIKE LOWER(:city)", { city: `%${city}%` });
    }

    const hotels = await query
      .orderBy("hotel.rating", "DESC")
      .addOrderBy("hotel.created_at", "DESC")
      .getMany();

    res.json({
      success: true,
      data: hotels
    });
  } catch (error) {
    console.error("Error searching hotels:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search hotels",
      error: error.message
    });
  }
};

module.exports = {
  getAllHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
  searchHotels
}; 