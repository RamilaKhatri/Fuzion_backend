const express = require("express");

const router = express.Router();

const {
    getTeamMembers,
    getAllTeamMembers,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember
} = require("../controllers/teamController");

const upload = require("../middleware/teamUpload");


/* PUBLIC */

router.get("/", getTeamMembers);


/* ADMIN */

router.get("/all", getAllTeamMembers);


router.post(
    "/",
    upload.single("image"),
    createTeamMember
);


router.put(
    "/:id",
    upload.single("image"),
    updateTeamMember
);


router.delete(
    "/:id",
    deleteTeamMember
);


module.exports = router;