const express = require("express");

const router = express.Router();

const adminMiddleware =
    require("../middleware/adminmiddleware");

const {
    getEnquiries,
    getEnquiryById,
    createEnquiry,
    updateEnquiry,
    deleteEnquiry
} = require("../controllers/enquirycontroller");


/* =====================================================
   PUBLIC ROUTE
   Contact form submits enquiry
===================================================== */

router.post(
    "/",
    createEnquiry
);


/* =====================================================
   ADMIN ROUTES
===================================================== */

/* Get all enquiries */

router.get(
    "/",
    adminMiddleware,
    getEnquiries
);


/* Get single enquiry */

router.get(
    "/:id",
    adminMiddleware,
    getEnquiryById
);


/* Update enquiry */

router.put(
    "/:id",
    adminMiddleware,
    updateEnquiry
);


/* Delete enquiry */

router.delete(
    "/:id",
    adminMiddleware,
    deleteEnquiry
);


module.exports = router;