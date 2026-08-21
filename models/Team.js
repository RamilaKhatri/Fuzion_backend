const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Team = sequelize.define(
    "Team",
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

        position: {
            type: DataTypes.STRING,
            allowNull: false
        },

        image: {
            type: DataTypes.STRING,
            allowNull: false
        },

        status: {
            type: DataTypes.STRING,
            defaultValue: "Active"
        }
    },
    {
        tableName: "teams"
    }
);

module.exports = Team;