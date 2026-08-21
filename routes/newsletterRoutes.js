const express = require("express");

const router = express.Router();

const adminMiddleware = require("../middleware/adminmiddleware");

const {
    subscribeNewsletter,
    getNewsletterSubscribers,
    deleteNewsletterSubscriber
} = require("../controllers/newslettercontroller");


/* =====================================================
   SUBSCRIBE TO NEWSLETTER
===================================================== */

router.post(
    "/subscribe",
    subscribeNewsletter
);


/* =====================================================
   GET ALL NEWSLETTER SUBSCRIBERS
===================================================== */

router.get(
    "/",
    adminMiddleware,
    getNewsletterSubscribers
);


/* =====================================================
   DELETE NEWSLETTER SUBSCRIBER
===================================================== */

router.delete(
    "/:id",
    adminMiddleware,
    deleteNewsletterSubscriber
);


module.exports = router;