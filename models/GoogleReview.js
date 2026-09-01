const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

/*
   Stores reviews pulled from the
   Apify "Google Maps Reviews Scraper" actor.

   This table is populated by a background
   job (services/googleReviewSync.js), never
   directly by users.
*/

const GoogleReview = sequelize.define(
    "GoogleReview",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        // Apify's unique review ID.
        // Used to avoid saving duplicates
        // on every sync run.
        reviewId: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },

        reviewerName: {
            type: DataTypes.STRING,
            allowNull: false
        },

        reviewerPhotoUrl: {
            type: DataTypes.STRING,
            allowNull: true
        },

        reviewerUrl: {
            type: DataTypes.STRING,
            allowNull: true
        },

        isLocalGuide: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },

        stars: {
            type: DataTypes.INTEGER,
            allowNull: false,

            validate: {
                min: 1,
                max: 5
            }
        },

        text: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        reviewImageUrls: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: []
        },

        responseFromOwnerText: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        reviewUrl: {
            type: DataTypes.STRING,
            allowNull: true
        },

        publishedAtDate: {
            type: DataTypes.DATE,
            allowNull: true
        },

        // Hide/show without deleting the row.
        // Lets admin moderate Google reviews
        // just like manual ones.
        status: {
            type: DataTypes.ENUM(
                "Active",
                "Hidden"
            ),
            allowNull: false,
            defaultValue: "Active"
        }
    },

    {
        tableName: "google_reviews",
        timestamps: true
    }
);

module.exports = GoogleReview;