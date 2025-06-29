const { DataSource } = require("typeorm");

const User = require("./models/User");
const Place = require("./models/Place");
const Tag = require("./models/Tag");
const PlaceTag = require("./models/Place_Tag");
const Tour = require("./models/Tour");
const TourStep = require("./models/Tour_Step");
const Article = require("./models/Article");
const Comment = require("./models/Comment");
const FavoritePlace = require("./models/Favorite_Place");
const Notification = require("./models/Notification");

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
    FavoritePlace,
    Notification,
  ],
  migrations: [
    "src/migrations/1751163195304-UpdatePlaces.js",
    "src/migrations/1751164000000-UpdateNotifications.js"
  ],
  subscribers: [],
});

module.exports = { AppDataSource };
console.log("Entities loaded:", AppDataSource.options.entities.map(e => e.name));

