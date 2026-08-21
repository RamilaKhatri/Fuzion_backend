const express =
    require("express");

const router =
    express.Router();


/* =====================================================
   AUTH MIDDLEWARE
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

    createGallery,

    getGallery,

    getHomeGallery,

    getAllGalleryForAdmin,

    getGalleryById,

    getGalleryByIdForAdmin,

    updateGallery,

    deleteGallery

} = require(
    "../controllers/gallerycontroller"
);


/* =====================================================
   PUBLIC - ALL ACTIVE GALLERY
===================================================== */

router.get(
    "/",
    getGallery
);


/* =====================================================
   PUBLIC - HOME GALLERY
===================================================== */

router.get(
    "/home",
    getHomeGallery
);


/* =====================================================
   ADMIN - ALL
===================================================== */

router.get(
    "/admin/all",

    authMiddleware,

    adminMiddleware,

    getAllGalleryForAdmin
);


/* =====================================================
   ADMIN - SINGLE
===================================================== */

router.get(
    "/admin/:id",

    authMiddleware,

    adminMiddleware,

    getGalleryByIdForAdmin
);


/* =====================================================
   PUBLIC - SINGLE
===================================================== */

router.get(
    "/:id",

    getGalleryById
);


/* =====================================================
   ADMIN - CREATE
===================================================== */

router.post(

    "/",

    authMiddleware,

    adminMiddleware,

    createGallery

);


/* =====================================================
   ADMIN - UPDATE
===================================================== */

router.put(

    "/:id",

    authMiddleware,

    adminMiddleware,

    updateGallery

);


/* =====================================================
   ADMIN - DELETE
===================================================== */

router.delete(

    "/:id",

    authMiddleware,

    adminMiddleware,

    deleteGallery

);


module.exports =
    router;