const express = require("express");

const router = express.Router();


/* =====================================================
   MIDDLEWARE
===================================================== */

const authMiddleware =
    require(
        "../middleware/authmiddleware"
    );

const adminMiddleware =
    require(
        "../middleware/adminmiddleware"
    );


/* =====================================================
   CONTROLLER
===================================================== */

const {

    getTeamMembers,

    getAllTeamMembers,

    createTeamMember,

    updateTeamMember,

    deleteTeamMember

} = require(
    "../controllers/teamController"
);


/* =====================================================
   PUBLIC
===================================================== */

router.get(
    "/",
    getTeamMembers
);


/* =====================================================
   ADMIN - ALL
===================================================== */

router.get(
    "/all",

    authMiddleware,

    adminMiddleware,

    getAllTeamMembers
);


/* =====================================================
   ADMIN - CREATE
===================================================== */

router.post(

    "/",

    authMiddleware,

    adminMiddleware,

    createTeamMember

);


/* =====================================================
   ADMIN - UPDATE
===================================================== */

router.put(

    "/:id",

    authMiddleware,

    adminMiddleware,

    updateTeamMember

);


/* =====================================================
   ADMIN - DELETE
===================================================== */

router.delete(

    "/:id",

    authMiddleware,

    adminMiddleware,

    deleteTeamMember

);


/* =====================================================
   EXPORT
===================================================== */

module.exports = router;