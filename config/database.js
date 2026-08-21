const { Sequelize } = require("sequelize");
const path = require("path");

let sequelize;

if (process.env.DATABASE_URL) {
  // Render PostgreSQL
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });
} else {
  // Local development: SQLite
  const dbPath =
    process.env.DATABASE_PATH ||
    path.join(__dirname, "..", "database.sqlite");

  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: dbPath,
    logging: false
  });
}

module.exports = sequelize;