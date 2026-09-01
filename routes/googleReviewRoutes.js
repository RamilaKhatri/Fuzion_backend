const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authmiddleware");

const {
    getGoogleReviews,
    triggerGoogleReviewSync
} = require("../controllers/googlereviewcontroller");


/* =====================================================
   PUBLIC
===================================================== */

/*
   Frontend gallery/testimonial section
   reads saved Google reviews from here.
*/

router.get(
    "/",
    getGoogleReviews
);


/* =====================================================
   ADMIN
===================================================== */

/*
   Manually re-pull latest reviews from
   Google via Apify, instead of waiting
   for the daily cron job.
*/

router.post(
    "/sync",
    authMiddleware,
    triggerGoogleReviewSync
);


module.exports = router;