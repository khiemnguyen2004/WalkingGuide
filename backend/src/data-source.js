const { DataSource } = require("typeorm");
const path = require("path");

const entitiesPath = [
  path.join(__dirname, "models", "*.js"), // dev: src/models/*.js
  path.join(__dirname, "..", "dist", "models", "*.js"), // prod: dist/models/*.js
];

const migrationsPath = [
  path.join(__dirname, "migrations", "*.js"), // dev: src/migrations/*.js
  path.join(__dirname, "..", "dist", "migrations", "*.js"), // prod: dist/migrations/*.js
];

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "123456",
  database: process.env.DB_NAME || "walking_guide",
  synchronize: false,
  logging: false,
  entities: entitiesPath,
  migrations: migrationsPath,
  cli: {
    entitiesDir: "src/models",
    migrationsDir: "src/migrations"
  }
});

module.exports = AppDataSource;

