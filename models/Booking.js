const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Booking = sequelize.define("Booking", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: true },
  time: { type: DataTypes.STRING, allowNull: true },
  guests: { type: DataTypes.INTEGER, allowNull: true },
  service: { type: DataTypes.STRING, allowNull: true },
  message: { type: DataTypes.TEXT, allowNull: true },
  status: {
    type: DataTypes.ENUM("Pending", "Approved", "Rejected", "Completed", "Cancelled"),
    defaultValue: "Pending",
  },
});

module.exports = Booking;
