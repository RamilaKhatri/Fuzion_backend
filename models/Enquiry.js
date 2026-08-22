const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Enquiry = sequelize.define(
    "Enquiry",
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

        phone: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ""
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false
        },

        subject: {
            type: DataTypes.STRING,
            allowNull: true
        },

        message: {
            type: DataTypes.TEXT,
            allowNull: false
        },

        status: {
            type: DataTypes.ENUM(
                "Pending",
                "Read",
                "Resolved",
                "Rejected"
            ),
            allowNull: false,
            defaultValue: "Pending"
        }
    },
    {
        timestamps: true
    }
);

module.exports = Enquiry;