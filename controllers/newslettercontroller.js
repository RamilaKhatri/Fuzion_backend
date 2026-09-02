const Newsletter = require("../models/Newsletter");


/* =====================================================
   SUBSCRIBE TO NEWSLETTER
===================================================== */

const subscribeNewsletter = async (req, res) => {

    try {

        const { email } = req.body;


        /* Validate email */

        if (!email) {

            return res.status(400).json({
                message: "Email is required"
            });

        }


        /* Check if already subscribed */

        const existingSubscriber =
            await Newsletter.findOne({
                where: { email }
            });


        if (existingSubscriber) {

            return res.status(409).json({
                message: "This email is already subscribed"
            });

        }


        /* Create subscriber */

        const subscriber =
            await Newsletter.create({
                email
            });

        try {
            const { createNotification } = require("../services/notificationService");
            createNotification({
                type: "newsletter",
                title: "New Newsletter Subscriber",
                message: "A new customer subscribed to the newsletter.",
                link: "/newsletter.html",
                relatedId: subscriber.id
            });
        } catch (_) {}


        return res.status(201).json({

            message:
                "Successfully subscribed to our newsletter",

            subscriber: {
                id: subscriber.id,
                email: subscriber.email
            }

        });

    } catch (error) {

        console.error(
            "Newsletter subscription error:",
            error
        );


        return res.status(500).json({

            message:
                "Failed to subscribe to newsletter"

        });

    }

};


/* =====================================================
   GET ALL SUBSCRIBERS
===================================================== */

const getNewsletterSubscribers = async (req, res) => {

    try {

        const subscribers =
            await Newsletter.findAll({

                order: [
                    ["createdAt", "DESC"]
                ]

            });


        return res.json({

            subscribers

        });

    } catch (error) {

        console.error(
            "Get newsletter subscribers error:",
            error
        );


        return res.status(500).json({

            message:
                "Failed to fetch newsletter subscribers"

        });

    }

};

/* =====================================================
   DELETE NEWSLETTER SUBSCRIBER
===================================================== */

const deleteNewsletterSubscriber = async (req, res) => {

    try {

        const { id } = req.params;

        const subscriber =
            await Newsletter.findByPk(id);

        if (!subscriber) {

            return res.status(404).json({
                message: "Subscriber not found"
            });

        }

        await subscriber.destroy();

        return res.status(200).json({

            message:
                "Subscriber deleted successfully"

        });

    } catch (error) {

        console.error(
            "Delete newsletter subscriber error:",
            error
        );

        return res.status(500).json({

            message:
                "Failed to delete subscriber"

        });

    }

};


/* =====================================================
   EXPORT CONTROLLERS
===================================================== */

module.exports = {

    subscribeNewsletter,
    getNewsletterSubscribers,
    deleteNewsletterSubscriber

};



// Get all newsletter subscribers
// const getSubscribers = async (req, res) => {
//     try {

//         const subscribers = await Newsletter.findAll({
//             order: [["createdAt", "DESC"]]
//         });

//         res.status(200).json({
//             subscribers
//         });

//     } catch (error) {

//         console.error(
//             "Error fetching newsletter subscribers:",
//             error
//         );

//         res.status(500).json({
//             message: "Failed to fetch newsletter subscribers"
//         });

//     }
// };