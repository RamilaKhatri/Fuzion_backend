const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const MenuItem = sequelize.define("MenuItem", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  // Image uploaded by the admin. The value is a public URL path such as:
  // /uploads/menu/menu-123456789.jpg
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  available: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

module.exports = MenuItem;
