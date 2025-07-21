const axios = require('axios');

const axiosConfig = {
  headers: {
    'User-Agent': 'WalkingGuideApp/1.0 (your-email@example.com)'
  }
};

// Search for address suggestions
const searchAddress = async (req, res) => {
  try {
    const { q, limit = 5, addressdetails = 1 } = req.query;
    
    if (!q || q.length < 3) {
      return res.status(400).json({
        success: false,
        message: "Query must be at least 3 characters long"
      });
    }

    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=${limit}&addressdetails=${addressdetails}`,
      axiosConfig
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error searching address:", error.message, error.response?.data);
    res.status(500).json({
      success: false,
      message: "Failed to search address",
      error: error.message,
      details: error.response?.data
    });
  }
};

// Get coordinates from address
const getCoordinates = async (req, res) => {
  try {
    const { q, limit = 1 } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Query parameter is required"
      });
    }

    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=${limit}`,
      axiosConfig
    );

    if (response.data && response.data.length > 0) {
      const location = response.data[0];
      res.json({
        success: true,
        data: {
          latitude: parseFloat(location.lat),
          longitude: parseFloat(location.lon),
          display_name: location.display_name,
          address: location.address
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No coordinates found for this address"
      });
    }
  } catch (error) {
    console.error("Error getting coordinates:", error.message, error.response?.data);
    res.status(500).json({
      success: false,
      message: "Failed to get coordinates",
      error: error.message,
      details: error.response?.data
    });
  }
};

// Reverse geocoding - get address from coordinates
const reverseGeocode = async (req, res) => {
  try {
    const { lat, lon, format = 'json', addressdetails = 1 } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude parameters are required"
      });
    }

    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=${format}&lat=${lat}&lon=${lon}&addressdetails=${addressdetails}`,
      axiosConfig
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error reverse geocoding:", error.message, error.response?.data);
    res.status(500).json({
      success: false,
      message: "Failed to reverse geocode",
      error: error.message,
      details: error.response?.data
    });
  }
};

module.exports = {
  searchAddress,
  getCoordinates,
  reverseGeocode
}; 