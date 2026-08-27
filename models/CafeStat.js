// models/CafeStat.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // adjust path to your sequelize instance

const CafeStat = sequelize.define(
    "CafeStat",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        icon: {
            // Font Awesome class, e.g. "fa-solid fa-calendar-days"
            type: DataTypes.STRING,
            allowNull: false,
        },
        targetValue: {
            // the number the counter animates up to (2, 10, 100, 10000...)
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        suffix: {
            // e.g. "+"
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: "+",
        },
        label: {
            // e.g. "Years Experience"
            type: DataTypes.STRING,
            allowNull: false,
        },
        order: {
            // controls display order on homepage
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    },
    {
        tableName: "cafe_stats",
        timestamps: true,
    }
);

module.exports = CafeStat;
