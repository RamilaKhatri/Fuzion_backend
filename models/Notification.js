const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Notification = sequelize.define(
    "Notification",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
            // e.g. review, enquiry, newsletter, booking, order, visitor_milestone
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        read: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        link: {
            type: DataTypes.STRING,
            allowNull: true
            // e.g. /reviews.html, /enquiries.html
        },
        relatedId: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    },
    {
        tableName: "notifications",
        timestamps: true
    }
);

module.exports = Notification;
