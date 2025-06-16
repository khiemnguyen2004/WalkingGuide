module.exports = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "123456",
  database: "walking_guide",
  synchronize: false,
  logging: false,
  entities: ["src/models/*.js"],
  migrations: ["src/migrations/*.js"],
  cli: {
    entitiesDir: "src/models",
    migrationsDir: "src/migrations"
  }
};
