const { ApifyClient } = require("apify-client");
const GoogleReview = require("../models/GoogleReview");

/*
   =====================================================
   GOOGLE REVIEW SYNC SERVICE
   -----------------------------------------------------
   Calls the Apify "Google Maps Reviews Scraper" actor,
   then saves any NEW reviews into our own database.

   This is a background job, not a request handler.
   It should be called:
     - once when the server starts
     - once every 24 hours (see server.js cron)

   Never called directly from the frontend, and never
   called on every page load - the actor costs money
   per run.
   =====================================================
*/

const client = new ApifyClient({
    token: process.env.APIFY_TOKEN
});

const ACTOR_ID = "compass/google-maps-reviews-scraper";

let isSyncRunning = false;

const syncGoogleReviews = async () => {

    if (!process.env.APIFY_TOKEN) {
        console.warn(
            "APIFY_TOKEN is missing. Skipping Google review sync."
        );
        return;
    }

    if (!process.env.GOOGLE_MAPS_PLACE_URL) {
        console.warn(
            "GOOGLE_MAPS_PLACE_URL is missing. Skipping Google review sync."
        );
        return;
    }

    // Avoid overlapping runs if sync is
    // triggered twice close together.
    if (isSyncRunning) {
        console.log("Google review sync already running. Skipping.");
        return;
    }

    isSyncRunning = true;

    try {

        console.log("Starting Google review sync...");

        const input = {
            startUrls: [
                { url: process.env.GOOGLE_MAPS_PLACE_URL }
            ],
            maxReviews: 100,
            language: "en",
            reviewsOrigin: "google"
        };

        const run = await client
            .actor(ACTOR_ID)
            .call(input);

        const { items } = await client
            .dataset(run.defaultDatasetId)
            .listItems();

        console.log(
            `Apify returned ${items.length} reviews.`
        );

        let createdCount = 0;
        let skippedCount = 0;

        for (const item of items) {

            // Reviews with no ID or no star
            // rating are unusable - skip them.
            if (!item.reviewId || !item.stars) {
                skippedCount++;
                continue;
            }

            const [, wasCreated] = await GoogleReview.findOrCreate({
                where: { reviewId: item.reviewId },
                defaults: {
                    reviewId: item.reviewId,
                    reviewerName: item.name || "Google User",
                    reviewerPhotoUrl: item.reviewerPhotoUrl || null,
                    reviewerUrl: item.reviewerUrl || null,
                    isLocalGuide: Boolean(item.isLocalGuide),
                    stars: item.stars,
                    text: item.textTranslated || item.text || null,
                    reviewImageUrls: item.reviewImageUrls || [],
                    responseFromOwnerText: item.responseFromOwnerText || null,
                    reviewUrl: item.reviewUrl || null,
                    publishedAtDate: item.publishedAtDate
                        ? new Date(item.publishedAtDate)
                        : null,
                    status: "Active"
                }
            });

            if (wasCreated) {
                createdCount++;
            } else {
                skippedCount++;
            }
        }

        console.log(
            `Google review sync done. New: ${createdCount}, already existed: ${skippedCount}.`
        );

    } catch (error) {

        console.error(
            "Google review sync failed:",
            error.message
        );

    } finally {
        isSyncRunning = false;
    }
};

module.exports = { syncGoogleReviews };