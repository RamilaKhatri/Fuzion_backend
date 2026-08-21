const Team = require("../models/Team");


/* =====================================================
   GET ALL TEAM MEMBERS
===================================================== */

const getTeamMembers = async (req, res) => {

    try {

        const team = await Team.findAll({
            where: {
                status: "Active"
            },
            order: [
                ["id", "ASC"]
            ]
        });

        res.status(200).json({
            team
        });

    } catch (error) {

        console.error(
            "Error fetching team members:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch team members"
        });
    }
};


/* =====================================================
   GET ALL TEAM MEMBERS - ADMIN
===================================================== */

const getAllTeamMembers = async (req, res) => {

    try {

        const team = await Team.findAll({
            order: [
                ["id", "ASC"]
            ]
        });

        res.status(200).json({
            team
        });

    } catch (error) {

        console.error(
            "Error fetching all team members:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch team members"
        });
    }
};


/* =====================================================
   CREATE TEAM MEMBER
===================================================== */

const createTeamMember = async (req, res) => {

    try {

        const {
            name,
            position,
            status
        } = req.body;


        if (!name || !position) {

            return res.status(400).json({
                message: "Name and position are required"
            });

        }


        if (!req.file) {

            return res.status(400).json({
                message: "Team image is required"
            });

        }


        const image =
            `/uploads/team/${req.file.filename}`;


        const member = await Team.create({

            name,
            position,
            image,
            status: status || "Active"

        });


        res.status(201).json({

            message:
                "Team member added successfully",

            team: member

        });

    } catch (error) {

        console.error(
            "Error creating team member:",
            error
        );

        res.status(500).json({

            message:
                "Failed to add team member"

        });

    }
};


/* =====================================================
   UPDATE TEAM MEMBER
===================================================== */

const updateTeamMember = async (req, res) => {

    try {

        const { id } = req.params;

        const member =
            await Team.findByPk(id);


        if (!member) {

            return res.status(404).json({
                message: "Team member not found"
            });

        }


        const updateData = {

            name:
                req.body.name,

            position:
                req.body.position,

            status:
                req.body.status || "Active"

        };


        /* New image uploaded */

        if (req.file) {

            updateData.image =
                `/uploads/team/${req.file.filename}`;

        }


        await member.update(updateData);


        res.status(200).json({

            message:
                "Team member updated successfully",

            team: member

        });

    } catch (error) {

        console.error(
            "Error updating team member:",
            error
        );

        res.status(500).json({

            message:
                "Failed to update team member"

        });

    }
};


/* =====================================================
   DELETE TEAM MEMBER
===================================================== */

const deleteTeamMember = async (req, res) => {

    try {

        const { id } = req.params;

        const member =
            await Team.findByPk(id);


        if (!member) {

            return res.status(404).json({
                message:
                    "Team member not found"
            });

        }


        await member.destroy();


        res.status(200).json({

            message:
                "Team member deleted successfully"

        });

    } catch (error) {

        console.error(
            "Error deleting team member:",
            error
        );

        res.status(500).json({
            message:
                "Failed to delete team member"
        });
    }
};


module.exports = {
    getTeamMembers,
    getAllTeamMembers,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember
};