const Review = require("../models/Review");
const { createNotification } = require("../services/notificationService");

const createReview = async (req, res, next) => {
    try {
        const { name, email, rating, comment } = req.body;

        if (!name || !email || rating === undefined || !comment) {
            return res.status(400).json({
                message: "Name, email, rating and comment are required"
            });
        }

        const review = await Review.create({
            name: String(name).trim(),
            email: String(email).trim().toLowerCase(),
            rating,
            comment: String(comment).trim()
        });

        createNotification({
            type: "review",
            title: "New Review",
            message: `${review.name} submitted a new review.`,
            link: "/reviews.html",
            relatedId: review.id
        });

        return res.status(201).json(review);
    } catch (error) {
        next(error);
    }
};

const getApprovedReviews = async (req, res, next) => {
    try {
        const reviews = await Review.findAll({
            where: { status: "Approved" },
            order: [["createdAt", "DESC"]]
        });

        return res.status(200).json(reviews);
    } catch (error) {
        next(error);
    }
};

const getAllReviews = async (req, res, next) => {
    try {
        const reviews = await Review.findAll({
            order: [["createdAt", "DESC"]]
        });

        return res.status(200).json(reviews);
    } catch (error) {
        next(error);
    }
};

const updateReview = async (req, res, next) => {
    try {
        const review = await Review.findByPk(req.params.id);

        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        const { status, adminReply } = req.body;
        if (status !== undefined) {
            review.status = status;
        }
        if (adminReply !== undefined) {
            review.adminReply = adminReply;
        }

        await review.save();
        return res.status(200).json(review);
    } catch (error) {
        next(error);
    }
};

const deleteReview = async (req, res, next) => {
    try {
        const review = await Review.findByPk(req.params.id);

        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        await review.destroy();
        return res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createReview,
    getApprovedReviews,
    getAllReviews,
    updateReview,
    deleteReview
};