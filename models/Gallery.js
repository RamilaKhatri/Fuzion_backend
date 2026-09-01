const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Gallery = sequelize.define(
    "Gallery",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        title: {
            type: DataTypes.STRING,
            allowNull: false
        },

        imageUrl: {
            type: DataTypes.TEXT,
            allowNull: false
        },

        category: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "food"
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        eventType: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        },

        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "Active"
        },

        // ==========================================
        // SHOW ON HOME
        // ==========================================

        showOnHome: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    },
    {
        tableName: "galleries",
        timestamps: true
    }
);

module.exports = Gallery;