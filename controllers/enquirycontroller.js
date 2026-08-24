const Enquiry = require("../models/Enquiry");
const { sendEnquiryNotification } = require("../utils/email");


/* =====================================================
   GET ALL ENQUIRIES
   Admin only
===================================================== */

const getEnquiries = async (
    req,
    res,
    next
) => {

    try {

        const enquiries =
            await Enquiry.findAll({

                order: [
                    ["createdAt", "DESC"]
                ]

            });

        return res.status(200).json(
            enquiries
        );

    } catch (error) {

        console.error(
            "GET ENQUIRIES ERROR:",
            error
        );

        next(error);
    }
};


/* =====================================================
   GET SINGLE ENQUIRY
   Admin only
===================================================== */

const getEnquiryById = async (
    req,
    res,
    next
) => {

    try {

        const enquiry =
            await Enquiry.findByPk(
                req.params.id
            );


        if (!enquiry) {

            return res.status(404).json({
                message:
                    "Enquiry not found"
            });
        }


        return res.status(200).json(
            enquiry
        );

    } catch (error) {

        console.error(
            "GET ENQUIRY BY ID ERROR:",
            error
        );

        next(error);
    }
};


/* =====================================================
   CREATE ENQUIRY
   Public - Contact Form
===================================================== */

const createEnquiry = async (
    req,
    res,
    next
) => {

    try {

        const {
            name,
            phone,
            email,
            subject,
            message
        } = req.body;


        /* ==========================================
           REQUIRED FIELD VALIDATION
        ========================================== */

        if (
            !name ||
            !phone ||
            !email ||
            !message
        ) {

            return res.status(400).json({

                message:
                    "Name, phone, email and message are required"

            });
        }


        /* ==========================================
           CLEAN INPUT
        ========================================== */

        const cleanName =
            String(name).trim();


        const cleanPhone =
            String(phone).trim();


        const cleanEmail =
            String(email)
                .trim()
                .toLowerCase();


        const cleanSubject =
            subject
                ? String(subject).trim()
                : null;


        const cleanMessage =
            String(message).trim();


        /* ==========================================
           NAME VALIDATION
        ========================================== */

        if (
            cleanName.length < 3
        ) {

            return res.status(400).json({

                message:
                    "Name must be at least 3 characters"

            });
        }


        /* ==========================================
           PHONE VALIDATION
        ========================================== */

        const phoneRegex =
            /^[\d\s\-+()]{10,}$/;


        if (
            !phoneRegex.test(
                cleanPhone
            )
        ) {

            return res.status(400).json({

                message:
                    "Please enter a valid phone number"

            });
        }


        /* ==========================================
           EMAIL VALIDATION
        ========================================== */

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (
            !emailRegex.test(
                cleanEmail
            )
        ) {

            return res.status(400).json({

                message:
                    "Please enter a valid email address"

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

                message:
                    "Subject must be at least 5 characters"

            });
        }


        /* ==========================================
           MESSAGE VALIDATION
        ========================================== */

        if (
            cleanMessage.length < 10
        ) {

            return res.status(400).json({

                message:
                    "Message must be at least 10 characters"

            });
        }


        /* ==========================================
           MESSAGE MAXIMUM LENGTH
        ========================================== */

        if (
            cleanMessage.length > 500
        ) {

            return res.status(400).json({

                message:
                    "Message cannot exceed 500 characters"

            });
        }


        /* ==========================================
           CREATE ENQUIRY
        ========================================== */

        const enquiry =
            await Enquiry.create({

                name:
                    cleanName,

                phone:
                    cleanPhone,

                email:
                    cleanEmail,

                subject:
                    cleanSubject,

                message:
                    cleanMessage,

                status:
                    "Pending"

            });


        /* ==========================================
           SEND EMAIL NOTIFICATION
           If this fails, the enquiry is still saved —
           email is a nice-to-have, not a requirement.
        ========================================== */

        sendEnquiryNotification(
            enquiry
        );


        /* ==========================================
           SUCCESS
        ========================================== */

        return res.status(201).json({

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

const updateEnquiry = async (
    req,
    res,
    next
) => {

    try {

        const enquiry =
            await Enquiry.findByPk(
                req.params.id
            );


        if (!enquiry) {

            return res.status(404).json({

                message:
                    "Enquiry not found"

            });
        }


        const {
            name,
            phone,
            email,
            subject,
            message,
            status
        } = req.body;


        /* ==========================================
           UPDATE DATA
        ========================================== */

        const updateData = {};


        /* ==========================================
           NAME
        ========================================== */

        if (
            name !== undefined
        ) {

            const cleanName =
                String(name).trim();


            if (
                cleanName.length < 3
            ) {

                return res.status(400).json({

                    message:
                        "Name must be at least 3 characters"

                });
            }


            updateData.name =
                cleanName;
        }


        /* ==========================================
           PHONE
        ========================================== */

        if (
            phone !== undefined
        ) {

            const cleanPhone =
                String(phone).trim();


            const phoneRegex =
                /^[\d\s\-+()]{10,}$/;


            if (
                !phoneRegex.test(
                    cleanPhone
                )
            ) {

                return res.status(400).json({

                    message:
                        "Please enter a valid phone number"

                });
            }


            updateData.phone =
                cleanPhone;
        }


        /* ==========================================
           EMAIL
        ========================================== */

        if (
            email !== undefined
        ) {

            const cleanEmail =
                String(email)
                    .trim()
                    .toLowerCase();


            const emailRegex =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (
                !emailRegex.test(
                    cleanEmail
                )
            ) {

                return res.status(400).json({

                    message:
                        "Please enter a valid email address"

                });
            }


            updateData.email =
                cleanEmail;
        }


        /* ==========================================
           SUBJECT
        ========================================== */

        if (
            subject !== undefined
        ) {

            updateData.subject =
                subject
                    ? String(subject).trim()
                    : null;
        }


        /* ==========================================
           MESSAGE
        ========================================== */

        if (
            message !== undefined
        ) {

            const cleanMessage =
                String(message).trim();


            if (
                cleanMessage.length < 10
            ) {

                return res.status(400).json({

                    message:
                        "Message must be at least 10 characters"

                });
            }


            if (
                cleanMessage.length > 500
            ) {

                return res.status(400).json({

                    message:
                        "Message cannot exceed 500 characters"

                });
            }


            updateData.message =
                cleanMessage;
        }


        /* ==========================================
           STATUS
        ========================================== */

        if (
            status !== undefined
        ) {

            const validStatuses = [

                "Pending",
                "Read",
                "Resolved",
                "Rejected"

            ];


            if (
                !validStatuses.includes(
                    status
                )
            ) {

                return res.status(400).json({

                    message:
                        "Invalid enquiry status"

                });
            }


            updateData.status =
                status;
        }


        /* ==========================================
           SAVE
        ========================================== */

        await enquiry.update(
            updateData
        );


        return res.status(200).json({

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

const deleteEnquiry = async (
    req,
    res,
    next
) => {

    try {

        const enquiry =
            await Enquiry.findByPk(
                req.params.id
            );


        if (!enquiry) {

            return res.status(404).json({

                message:
                    "Enquiry not found"

            });
        }


        await enquiry.destroy();


        return res.status(200).json({

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