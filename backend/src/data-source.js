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

const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "123456",
  database: "walking_guide",
  synchronize: true,
  logging: false,
  entities: [
    User,
    Place,
    Tag,
    PlaceTag,
    Tour,
    TourStep,
    Article,
    Comment,
    FavoriteTour,
    Notification,
    PlaceLike,
    PlaceRating,
    TourLike,
    TourRating,
    ArticleLike,
    ArticleComment,
  ],
  migrations: [
    "src/migrations/1752300000000-add-password-reset-fields.js",
  ],
  subscribers: [],
});

module.exports = { AppDataSource };
console.log("Entities loaded:", AppDataSource.options.entities.map(e => e.name));

