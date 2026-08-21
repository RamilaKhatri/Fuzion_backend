const Enquiry = require("../models/Enquiry");


/* =====================================================
   GET ALL ENQUIRIES
   Admin only
===================================================== */

const getEnquiries = async (req, res, next) => {
    try {
        const enquiries = await Enquiry.findAll({
            order: [["createdAt", "DESC"]]
        });

        res.status(200).json(enquiries);

    } catch (error) {
        console.error("GET ENQUIRIES ERROR:", error);
        next(error);
    }
};


/* =====================================================
   GET SINGLE ENQUIRY
   Admin only
===================================================== */

const getEnquiryById = async (req, res, next) => {
    try {
        const enquiry = await Enquiry.findByPk(req.params.id);

        if (!enquiry) {
            return res.status(404).json({
                message: "Enquiry not found"
            });
        }

        res.status(200).json(enquiry);

    } catch (error) {
        console.error("GET ENQUIRY BY ID ERROR:", error);
        next(error);
    }
};


/* =====================================================
   CREATE ENQUIRY
   Public - Contact Form
===================================================== */

const createEnquiry = async (req, res, next) => {
    try {

        const {
            name,
            email,
            subject,
            message
        } = req.body;


        /* ==========================================
           REQUIRED FIELD VALIDATION
        ========================================== */

        if (!name || !email || !message) {
            return res.status(400).json({
                message: "Name, email and message are required"
            });
        }


        /* ==========================================
           CLEAN INPUT
        ========================================== */

        const cleanName = String(name).trim();
        const cleanEmail = String(email).trim().toLowerCase();
        const cleanSubject = subject
            ? String(subject).trim()
            : null;
        const cleanMessage = String(message).trim();


        /* ==========================================
           NAME VALIDATION
        ========================================== */

        if (cleanName.length < 3) {
            return res.status(400).json({
                message: "Name must be at least 3 characters"
            });
        }


        /* ==========================================
           EMAIL VALIDATION
        ========================================== */

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(cleanEmail)) {
            return res.status(400).json({
                message: "Please enter a valid email address"
            });
        }


        /* ==========================================
           SUBJECT VALIDATION
        ========================================== */

        if (
            cleanSubject &&
            cleanSubject.length < 5
        ) {
            return res.status(400).json({
                message: "Subject must be at least 5 characters"
            });
        }


        /* ==========================================
           MESSAGE VALIDATION
        ========================================== */

        if (cleanMessage.length < 10) {
            return res.status(400).json({
                message: "Message must be at least 10 characters"
            });
        }


        /* ==========================================
           MESSAGE MAXIMUM LENGTH
        ========================================== */

        if (cleanMessage.length > 500) {
            return res.status(400).json({
                message: "Message cannot exceed 500 characters"
            });
        }


        /* ==========================================
           CREATE ENQUIRY
           
           IMPORTANT:
           Status is NOT taken from customer.
           It automatically becomes Pending.
        ========================================== */

        const enquiry = await Enquiry.create({
            name: cleanName,
            email: cleanEmail,
            subject: cleanSubject,
            message: cleanMessage,
            status: "Pending"
        });


        /* ==========================================
           SUCCESS RESPONSE
        ========================================== */

        res.status(201).json({
            message:
                "Enquiry submitted successfully",
            enquiry
        });

    } catch (error) {

        console.error(
            "CREATE ENQUIRY ERROR:",
            error
        );

        next(error);
    }
};


/* =====================================================
   UPDATE ENQUIRY
   Admin only
===================================================== */

const updateEnquiry = async (req, res, next) => {
    try {

        const enquiry =
            await Enquiry.findByPk(req.params.id);


        /* ==========================================
           CHECK EXISTENCE
        ========================================== */

        if (!enquiry) {
            return res.status(404).json({
                message: "Enquiry not found"
            });
        }


        const {
            name,
            email,
            subject,
            message,
            status
        } = req.body;


        /* ==========================================
           VALIDATE EMAIL
        ========================================== */

        if (email !== undefined) {

            const cleanEmail =
                String(email).trim().toLowerCase();

            const emailRegex =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(cleanEmail)) {
                return res.status(400).json({
                    message:
                        "Please enter a valid email address"
                });
            }
        }


        /* ==========================================
           VALIDATE STATUS
        ========================================== */

        if (status !== undefined) {

            const validStatuses = [
                "Pending",
                "Read",
                "Resolved",
                "Rejected"
            ];

            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    message:
                        "Invalid enquiry status"
                });
            }
        }


        /* ==========================================
           UPDATE DATA
        ========================================== */

        const updateData = {};


        if (name !== undefined) {

            const cleanName =
                String(name).trim();

            if (cleanName.length < 3) {
                return res.status(400).json({
                    message:
                        "Name must be at least 3 characters"
                });
            }

            updateData.name = cleanName;
        }


        if (email !== undefined) {

            updateData.email =
                String(email)
                    .trim()
                    .toLowerCase();
        }


        if (subject !== undefined) {

            updateData.subject =
                subject
                    ? String(subject).trim()
                    : null;
        }


        if (message !== undefined) {

            const cleanMessage =
                String(message).trim();

            if (cleanMessage.length < 10) {
                return res.status(400).json({
                    message:
                        "Message must be at least 10 characters"
                });
            }

            if (cleanMessage.length > 500) {
                return res.status(400).json({
                    message:
                        "Message cannot exceed 500 characters"
                });
            }

            updateData.message =
                cleanMessage;
        }


        if (status !== undefined) {
            updateData.status = status;
        }


        /* ==========================================
           SAVE UPDATE
        ========================================== */

        await enquiry.update(updateData);


        /* ==========================================
           SUCCESS RESPONSE
        ========================================== */

        res.status(200).json({
            message:
                "Enquiry updated successfully",
            enquiry
        });

    } catch (error) {

        console.error(
            "UPDATE ENQUIRY ERROR:",
            error
        );

        next(error);
    }
};


/* =====================================================
   DELETE ENQUIRY
   Admin only
===================================================== */

const deleteEnquiry = async (req, res, next) => {
    try {

        const enquiry =
            await Enquiry.findByPk(req.params.id);


        /* ==========================================
           CHECK EXISTENCE
        ========================================== */

        if (!enquiry) {
            return res.status(404).json({
                message: "Enquiry not found"
            });
        }


        /* ==========================================
           DELETE
        ========================================== */

        await enquiry.destroy();


        /* ==========================================
           SUCCESS RESPONSE
        ========================================== */

        res.status(200).json({
            message:
                "Enquiry deleted successfully"
        });

    } catch (error) {

        console.error(
            "DELETE ENQUIRY ERROR:",
            error
        );

        next(error);
    }
};


/* =====================================================
   EXPORT
===================================================== */

module.exports = {
    getEnquiries,
    getEnquiryById,
    createEnquiry,
    updateEnquiry,
    deleteEnquiry
};