const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Review = sequelize.define(
    "Review",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false
        },

        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,

            validate: {
                min: 1,
                max: 5
            }
        },

        comment: {
            type: DataTypes.TEXT,
            allowNull: false
        },

        status: {
            type: DataTypes.ENUM(
                "Approved",
                "Rejected"
            ),

            allowNull: false,

            // Customer le submit gareko review
            // immediately live hunchha.
            defaultValue: "Approved"
        },

        adminReply: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },

    {
        tableName: "reviews",
        timestamps: true
    }
);

module.exports = Review;