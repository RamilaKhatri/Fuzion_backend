const Team = require("../models/Team");


/* =====================================================
   GET ACTIVE TEAM MEMBERS
   GET /api/team
===================================================== */

const getTeamMembers = async (
    req,
    res
) => {

    try {

        const team =
            await Team.findAll({

                where: {
                    status: "Active"
                },

                order: [
                    ["id", "ASC"]
                ]

            });


        return res.status(200).json({
            team
        });

    } catch (error) {

        console.error(
            "Error fetching team members:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to fetch team members"
        });
    }
};


/* =====================================================
   GET ALL TEAM MEMBERS - ADMIN
   GET /api/team/all
===================================================== */

const getAllTeamMembers = async (
    req,
    res
) => {

    try {

        const team =
            await Team.findAll({

                order: [
                    ["id", "ASC"]
                ]

            });


        return res.status(200).json({
            team
        });

    } catch (error) {

        console.error(
            "Error fetching all team members:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to fetch team members"
        });
    }
};


/* =====================================================
   CREATE TEAM MEMBER
   POST /api/team
===================================================== */

const createTeamMember = async (
    req,
    res
) => {

    try {

        const {
            name,
            position,
            image,
            status
        } = req.body;


        /* =============================================
           VALIDATION
        ============================================= */

        if (!name || !String(name).trim()) {

            return res.status(400).json({
                message:
                    "Name is required"
            });
        }


        if (
            !position ||
            !String(position).trim()
        ) {

            return res.status(400).json({
                message:
                    "Position is required"
            });
        }


        if (
            !image ||
            !String(image).trim()
        ) {

            return res.status(400).json({
                message:
                    "Team image is required"
            });
        }


        /* =============================================
           CREATE
        ============================================= */

        const member =
            await Team.create({

                name:
                    String(name).trim(),

                position:
                    String(position).trim(),

                image:
                    String(image).trim(),

                status:
                    status
                        ? String(status).trim()
                        : "Active"

            });


        return res.status(201).json({

            message:
                "Team member added successfully",

            team:
                member

        });

    } catch (error) {

        console.error(
            "Error creating team member:",
            error
        );

        return res.status(500).json({

            message:
                "Failed to add team member",

            error:
                error.message

        });
    }
};


/* =====================================================
   UPDATE TEAM MEMBER
   PUT /api/team/:id
===================================================== */

const updateTeamMember = async (
    req,
    res
) => {

    try {

        const { id } =
            req.params;


        const member =
            await Team.findByPk(id);


        if (!member) {

            return res.status(404).json({
                message:
                    "Team member not found"
            });
        }


        const {
            name,
            position,
            image,
            status
        } = req.body;


        /* =============================================
           VALIDATION
        ============================================= */

        if (
            !name ||
            !String(name).trim()
        ) {

            return res.status(400).json({
                message:
                    "Name is required"
            });
        }


        if (
            !position ||
            !String(position).trim()
        ) {

            return res.status(400).json({
                message:
                    "Position is required"
            });
        }


        /* =============================================
           UPDATE DATA
        ============================================= */

        const updateData = {

            name:
                String(name).trim(),

            position:
                String(position).trim(),

            status:
                status !== undefined
                    ? String(status).trim()
                    : member.status

        };


        /*
         * Only replace image when a
         * new UploadThing URL is sent.
         */

        if (
            image !== undefined &&
            image !== null &&
            String(image).trim() !== ""
        ) {

            updateData.image =
                String(image).trim();

        }


        await member.update(
            updateData
        );


        return res.status(200).json({

            message:
                "Team member updated successfully",

            team:
                member

        });

    } catch (error) {

        console.error(
            "Error updating team member:",
            error
        );

        return res.status(500).json({

            message:
                "Failed to update team member",

            error:
                error.message

        });
    }
};


/* =====================================================
   DELETE TEAM MEMBER
   DELETE /api/team/:id
===================================================== */

const deleteTeamMember = async (
    req,
    res
) => {

    try {

        const { id } =
            req.params;


        const member =
            await Team.findByPk(id);


        if (!member) {

            return res.status(404).json({

                message:
                    "Team member not found"

            });
        }


        /*
         * Image is stored on UploadThing.
         * We only remove the database record.
         */

        await member.destroy();


        return res.status(200).json({

            message:
                "Team member deleted successfully"

        });

    } catch (error) {

        console.error(
            "Error deleting team member:",
            error
        );

        return res.status(500).json({

            message:
                "Failed to delete team member"

        });
    }
};


/* =====================================================
   EXPORT
===================================================== */

module.exports = {

    getTeamMembers,

    getAllTeamMembers,

    createTeamMember,

    updateTeamMember,

    deleteTeamMember

};