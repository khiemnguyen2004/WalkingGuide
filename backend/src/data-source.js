const { DataSource } = require("typeorm");

const User = require("./models/User");
const Place = require("./models/Place");
const Tag = require("./models/Tag");
const PlaceTag = require("./models/Place_Tag");
const Tour = require("./models/Tour");
const TourStep = require("./models/Tour_Step");
const Article = require("./models/Article");
const Comment = require("./models/Comment");
const FavoriteTour = require("./models/Favorite_Tour");
const Notification = require("./models/Notification");
const PlaceLike = require("./models/PlaceLike");
const PlaceRating = require("./models/PlaceRating");
const TourLike = require("./models/TourLike");
const TourRating = require("./models/TourRating");
const ArticleLike = require("./models/ArticleLike");
const ArticleComment = require("./models/ArticleComment");
const Booking = require("./models/Booking");
const Hotel = require("./models/Hotel");
const HotelBooking = require("./models/HotelBooking");
const Restaurant = require("./models/Restaurant");
const HotelImage = require("./models/HotelImage");
const RestaurantImage = require("./models/RestaurantImage");
const ArticleReport = require("./models/ArticleReport");
const SiteSetting = require("./models/SiteSetting");
const RestaurantBooking = require("./models/RestaurantBooking");
const Menu = require("./models/Menu");
const MenuItem = require("./models/MenuItem");
const HotelRating = require("./models/HotelRating");
const RestaurantRating = require("./models/RestaurantRating");

const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL, // Sử dụng chuỗi kết nối từ Render
  synchronize: false, // Đặt false trong production
  logging: false,
  entities: [
    User,
    Place,
    Tag,
    PlaceTag,
    Tour,
    TourStep,
    Article,
    ArticleReport,
    Comment,
    FavoriteTour,
    Notification,
    PlaceLike,
    PlaceRating,
    TourLike,
    TourRating,
    ArticleLike,
    ArticleComment,
    Booking,
    Hotel,
    HotelBooking,
    Restaurant,
    HotelImage,
    RestaurantImage,
    SiteSetting,
    RestaurantBooking,
    Menu,
    MenuItem,
    HotelRating,
    RestaurantRating,
  ],
  migrations: [
    "src/migrations/1752500000000-create-hotel-bookings.js",
    "src/migrations/1759000000001-create-hotel-ratings.js",
    "src/migrations/1759000000002-create-restaurant-ratings.js",
  ],
  subscribers: [],
  ssl: { rejectUnauthorized: false }, // Bật SSL cho Render
});

module.exports = { AppDataSource };
console.log("Entities loaded:", AppDataSource.options.entities.map(e => e.name));