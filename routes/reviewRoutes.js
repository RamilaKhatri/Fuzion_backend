const express = require("express");

const router = express.Router();

const {
    createReview,
    getApprovedReviews,
    getAllReviews,
    updateReview,
    deleteReview
} = require("../controllers/reviewcontroller");


/* =====================================================
   PUBLIC
===================================================== */

/*
   Customer submits review
   Automatically Approved
*/

router.post(
    "/",
    createReview
);


/*
   Contact page gets only approved reviews
*/

router.get(
    "/",
    getApprovedReviews
);


/* =====================================================
   ADMIN
===================================================== */

/*
   Get every review
*/

router.get(
    "/admin/all",
    getAllReviews
);


/*
   Admin:
   - approve
   - reject
   - reply
*/

router.put(
    "/:id",
    updateReview
);


/*
   Delete
*/

router.delete(
    "/:id",
    deleteReview
);


module.exports = router;