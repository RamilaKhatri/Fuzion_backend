const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Visitor = sequelize.define(
    "Visitor",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        visitorHash: {
            type: DataTypes.STRING,
            allowNull: false
        },
        page: {
            type: DataTypes.STRING,
            allowNull: true
        },
        visitedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    },
    {
        tableName: "visitors",
        timestamps: true,
        updatedAt: false
    }
);

Visitor.removeAttribute("updatedAt");

module.exports = Visitor;
