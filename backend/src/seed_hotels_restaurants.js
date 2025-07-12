const { AppDataSource } = require("./data-source");

const Hotel = AppDataSource.getRepository("Hotel");
const HotelImage = AppDataSource.getRepository("HotelImage");
const Restaurant = AppDataSource.getRepository("Restaurant");
const RestaurantImage = AppDataSource.getRepository("RestaurantImage");

const sampleHotels = [
  {
    name: "Sofitel Legend Metropole Hanoi",
    description: "A historic luxury hotel in the heart of Hanoi, featuring French colonial architecture and world-class amenities.",
    latitude: 21.0245,
    longitude: 105.8412,
    city: "Hanoi",
    address: "15 Ngo Quyen Street, Hoan Kiem District, Hanoi",
    phone: "+84 24 3826 6919",
    email: "h1555@sofitel.com",
    website: "https://www.sofitel-legend-metropole-hanoi.com",
    price_range: "$$$$",
    min_price: 200,
    max_price: 500,
    amenities: JSON.stringify([
      "Swimming Pool", "Spa", "Fitness Center", "Restaurant", "Bar", "Concierge", "Room Service", "Free WiFi"
    ]),
    room_types: JSON.stringify([
      "Deluxe Room", "Executive Suite", "Metropole Suite", "Presidential Suite"
    ]),
    check_in_time: "15:00",
    check_out_time: "12:00",
    stars: 5,
    images: [
      {
        url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
        caption: "Historic facade of Sofitel Metropole",
        is_primary: true
      },
      {
        url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
        caption: "Luxury lobby area"
      },
      {
        url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
        caption: "Deluxe room interior"
      }
    ]
  },
  {
    name: "Hanoi La Siesta Hotel & Spa",
    description: "Boutique hotel offering authentic Vietnamese hospitality with modern comforts in the Old Quarter.",
    latitude: 21.0285,
    longitude: 105.8542,
    city: "Hanoi",
    address: "32 Lo Su Street, Hoan Kiem District, Hanoi",
    phone: "+84 24 3935 1632",
    email: "info@hanoilasiesta.com",
    website: "https://hanoilasiesta.com",
    price_range: "$$$",
    min_price: 80,
    max_price: 150,
    amenities: JSON.stringify([
      "Spa", "Restaurant", "Bar", "Free WiFi", "Bicycle Rental", "Tour Desk"
    ]),
    room_types: JSON.stringify([
      "Deluxe Room", "Suite", "Family Room"
    ]),
    check_in_time: "14:00",
    check_out_time: "12:00",
    stars: 4,
    images: [
      {
        url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
        caption: "Boutique hotel entrance",
        is_primary: true
      },
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
        caption: "Cozy room with Vietnamese decor"
      }
    ]
  },
  {
    name: "InterContinental Hanoi Westlake",
    description: "Lakeside luxury hotel offering stunning views of West Lake and the city skyline.",
    latitude: 21.0455,
    longitude: 105.8142,
    city: "Hanoi",
    address: "5 Tu Hoa Street, Tay Ho District, Hanoi",
    phone: "+84 24 6270 8888",
    email: "hanoi@ihg.com",
    website: "https://www.ihg.com/intercontinental/hotels/us/en/hanoi/hanhb",
    price_range: "$$$$",
    min_price: 180,
    max_price: 400,
    amenities: JSON.stringify([
      "Swimming Pool", "Spa", "Fitness Center", "Restaurant", "Bar", "Lakeside Terrace", "Free WiFi"
    ]),
    room_types: JSON.stringify([
      "Deluxe Room", "Executive Room", "Suite", "Presidential Suite"
    ]),
    check_in_time: "15:00",
    check_out_time: "12:00",
    stars: 5,
    images: [
      {
        url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
        caption: "Lakeside hotel view",
        is_primary: true
      },
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
        caption: "Luxury suite with lake view"
      }
    ]
  }
];

const sampleRestaurants = [
  {
    name: "Pho Thin",
    description: "Famous for its traditional pho with beef and herbs, a must-visit for authentic Vietnamese cuisine.",
    latitude: 21.0285,
    longitude: 105.8542,
    city: "Hanoi",
    address: "13 Lo Duc Street, Hai Ba Trung District, Hanoi",
    phone: "+84 24 3942 8169",
    email: "info@phothin.com",
    website: "https://phothin.com",
    cuisine_type: "Vietnamese",
    price_range: "$",
    min_price: 5,
    max_price: 15,
    opening_hours: JSON.stringify({
      "Monday": "06:00-22:00",
      "Tuesday": "06:00-22:00",
      "Wednesday": "06:00-22:00",
      "Thursday": "06:00-22:00",
      "Friday": "06:00-22:00",
      "Saturday": "06:00-22:00",
      "Sunday": "06:00-22:00"
    }),
    delivery_available: true,
    takeout_available: true,
    dine_in_available: true,
    dietary_options: JSON.stringify(["Halal", "Vegetarian"]),
    features: JSON.stringify(["Traditional", "Local Favorite", "Quick Service"]),
    images: [
      {
        url: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800",
        caption: "Traditional pho bowl",
        is_primary: true
      },
      {
        url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800",
        caption: "Restaurant interior"
      }
    ]
  },
  {
    name: "La Badiane",
    description: "French-Vietnamese fusion restaurant in a beautiful colonial villa setting.",
    latitude: 21.0245,
    longitude: 105.8412,
    city: "Hanoi",
    address: "10 Nam Ngu Street, Hoan Kiem District, Hanoi",
    phone: "+84 24 3942 4509",
    email: "info@labadiane-hanoi.com",
    website: "https://labadiane-hanoi.com",
    cuisine_type: "French-Vietnamese Fusion",
    price_range: "$$$",
    min_price: 25,
    max_price: 60,
    opening_hours: JSON.stringify({
      "Monday": "11:30-14:00, 18:00-22:00",
      "Tuesday": "11:30-14:00, 18:00-22:00",
      "Wednesday": "11:30-14:00, 18:00-22:00",
      "Thursday": "11:30-14:00, 18:00-22:00",
      "Friday": "11:30-14:00, 18:00-22:00",
      "Saturday": "11:30-14:00, 18:00-22:00",
      "Sunday": "11:30-14:00, 18:00-22:00"
    }),
    delivery_available: false,
    takeout_available: true,
    dine_in_available: true,
    dietary_options: JSON.stringify(["Vegetarian", "Vegan", "Gluten-Free"]),
    features: JSON.stringify(["Fine Dining", "Garden Setting", "Wine Pairing"]),
    images: [
      {
        url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
        caption: "Elegant dining room",
        is_primary: true
      },
      {
        url: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800",
        caption: "Fusion cuisine presentation"
      }
    ]
  },
  {
    name: "Bun Cha Huong Lien",
    description: "Famous bun cha restaurant where President Obama dined, serving authentic Hanoi street food.",
    latitude: 21.0285,
    longitude: 105.8542,
    city: "Hanoi",
    address: "24 Le Van Huu Street, Hai Ba Trung District, Hanoi",
    phone: "+84 24 3943 4103",
    email: "info@bunchahuonglien.com",
    website: "https://bunchahuonglien.com",
    cuisine_type: "Vietnamese Street Food",
    price_range: "$",
    min_price: 3,
    max_price: 10,
    opening_hours: JSON.stringify({
      "Monday": "07:00-21:00",
      "Tuesday": "07:00-21:00",
      "Wednesday": "07:00-21:00",
      "Thursday": "07:00-21:00",
      "Friday": "07:00-21:00",
      "Saturday": "07:00-21:00",
      "Sunday": "07:00-21:00"
    }),
    delivery_available: true,
    takeout_available: true,
    dine_in_available: true,
    dietary_options: JSON.stringify(["Halal"]),
    features: JSON.stringify(["Street Food", "Local Favorite", "Historic"]),
    images: [
      {
        url: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800",
        caption: "Famous bun cha dish",
        is_primary: true
      },
      {
        url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800",
        caption: "Simple street food setting"
      }
    ]
  }
];

const seedHotelsAndRestaurants = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Database connected successfully");

    // Check if data already exists
    const existingHotels = await Hotel.count();
    const existingRestaurants = await Restaurant.count();
    
    if (existingHotels > 0 || existingRestaurants > 0) {
      console.log("Hotels and restaurants data already exists. Skipping seed.");
      process.exit(0);
    }

    console.log("Starting to seed hotels and restaurants...");

    // Seed hotels
    for (const hotelData of sampleHotels) {
      const { images, ...hotelInfo } = hotelData;
      
      const hotel = Hotel.create(hotelInfo);
      const savedHotel = await Hotel.save(hotel);

      // Add images
      if (images && images.length > 0) {
        const hotelImages = images.map((image, index) => {
          return HotelImage.create({
            hotel_id: savedHotel.id,
            image_url: image.url,
            caption: image.caption,
            is_primary: image.is_primary || (index === 0),
            sort_order: index
          });
        });

        await HotelImage.save(hotelImages);
      }

      console.log(`Created hotel: ${savedHotel.name}`);
    }

    // Seed restaurants
    for (const restaurantData of sampleRestaurants) {
      const { images, ...restaurantInfo } = restaurantData;
      
      const restaurant = Restaurant.create(restaurantInfo);
      const savedRestaurant = await Restaurant.save(restaurant);

      // Add images
      if (images && images.length > 0) {
        const restaurantImages = images.map((image, index) => {
          return RestaurantImage.create({
            restaurant_id: savedRestaurant.id,
            image_url: image.url,
            caption: image.caption,
            is_primary: image.is_primary || (index === 0),
            sort_order: index
          });
        });

        await RestaurantImage.save(restaurantImages);
      }

      console.log(`Created restaurant: ${savedRestaurant.name}`);
    }

    console.log("✅ Hotels and restaurants seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding hotels and restaurants:", error);
    process.exit(1);
  }
};

seedHotelsAndRestaurants(); 