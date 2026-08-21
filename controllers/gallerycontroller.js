const Gallery =
    require("../models/Gallery");


/* =====================================================
   ALLOWED VALUES
===================================================== */

const allowedCategories = [

    "food",

    "drinks",

    "events",

    "ambiance",

    "customer-memory",

    "behind-scenes"

];


const allowedStatuses = [

    "Active",

    "Inactive"

];


/* =====================================================
   CREATE GALLERY
   POST /api/gallery
===================================================== */

const createGallery =
    async (
        req,
        res,
        next
    ) => {

        try {

            const title =
                req.body.title
                    ? String(
                        req.body.title
                    ).trim()
                    : "";


            const category =
                req.body.category
                    ? String(
                        req.body.category
                    ).trim()
                    : "food";


            const description =
                req.body.description
                    ? String(
                        req.body.description
                    ).trim()
                    : null;


            const status =
                req.body.status
                    ? String(
                        req.body.status
                    ).trim()
                    : "Active";


            const imageUrl =
                req.body.imageUrl
                    ? String(
                        req.body.imageUrl
                    ).trim()
                    : "";


            /* ==========================================
               VALIDATION
            ========================================== */

            if (!title) {

                return res.status(400).json({

                    message:
                        "Title is required."

                });

            }


            if (
                !allowedCategories.includes(
                    category
                )
            ) {

                return res.status(400).json({

                    message:
                        "Invalid gallery category."

                });

            }


            if (
                !allowedStatuses.includes(
                    status
                )
            ) {

                return res.status(400).json({

                    message:
                        "Invalid gallery status."

                });

            }


            if (!imageUrl) {

                return res.status(400).json({

                    message:
                        "Gallery image is required."

                });

            }


            /* ==========================================
               CREATE DATABASE RECORD
            ========================================== */

            const item =
                await Gallery.create({

                    title,

                    imageUrl,

                    category,

                    description:
                        description || null,

                    status

                });


            return res.status(201).json({

                message:
                    "Gallery item created successfully.",

                item

            });

        }

        catch (error) {

            next(error);

        }

    };


/* =====================================================
   GET PUBLIC GALLERY
   GET /api/gallery
===================================================== */

const getGallery =
    async (
        req,
        res,
        next
    ) => {

        try {

            const images =
                await Gallery.findAll({

                    where: {

                        status:
                            "Active"

                    },

                    order: [

                        [
                            "id",
                            "ASC"
                        ]

                    ]

                });


            return res.status(200).json(
                images
            );

        }

        catch (error) {

            next(error);

        }

    };


/* =====================================================
   GET ALL GALLERY FOR ADMIN
   GET /api/gallery/admin/all
===================================================== */

const getAllGalleryForAdmin =
    async (
        req,
        res,
        next
    ) => {

        try {

            const images =
                await Gallery.findAll({

                    order: [

                        [
                            "id",
                            "ASC"
                        ]

                    ]

                });


            return res.status(200).json(
                images
            );

        }

        catch (error) {

            next(error);

        }

    };


/* =====================================================
   GET SINGLE GALLERY
   GET /api/gallery/:id
===================================================== */

const getGalleryById =
    async (
        req,
        res,
        next
    ) => {

        try {

            const item =
                await Gallery.findByPk(
                    req.params.id
                );


            if (!item) {

                return res.status(404).json({

                    message:
                        "Gallery item not found."

                });

            }


            return res.status(200).json(
                item
            );

        }

        catch (error) {

            next(error);

        }

    };


/* =====================================================
   GET SINGLE GALLERY FOR ADMIN
===================================================== */

const getGalleryByIdForAdmin =
    async (
        req,
        res,
        next
    ) => {

        try {

            const item =
                await Gallery.findByPk(
                    req.params.id
                );


            if (!item) {

                return res.status(404).json({

                    message:
                        "Gallery item not found."

                });

            }


            return res.status(200).json(
                item
            );

        }

        catch (error) {

            next(error);

        }

    };


/* =====================================================
   UPDATE GALLERY
   PUT /api/gallery/:id
===================================================== */

const updateGallery =
    async (
        req,
        res,
        next
    ) => {

        try {

            const item =
                await Gallery.findByPk(
                    req.params.id
                );


            if (!item) {

                return res.status(404).json({

                    message:
                        "Gallery item not found."

                });

            }


            const title =
                req.body.title !== undefined
                    ? String(
                        req.body.title
                    ).trim()
                    : item.title;


            const category =
                req.body.category !== undefined
                    ? String(
                        req.body.category
                    ).trim()
                    : item.category;


            const description =
                req.body.description !== undefined
                    ? String(
                        req.body.description
                    ).trim()
                    : item.description;


            const status =
                req.body.status !== undefined
                    ? String(
                        req.body.status
                    ).trim()
                    : item.status;


            const imageUrl =
                req.body.imageUrl !== undefined
                    ? String(
                        req.body.imageUrl
                    ).trim()
                    : item.imageUrl;


            /* ==========================================
               VALIDATION
            ========================================== */

            if (!title) {

                return res.status(400).json({

                    message:
                        "Title is required."

                });

            }


            if (
                !allowedCategories.includes(
                    category
                )
            ) {

                return res.status(400).json({

                    message:
                        "Invalid gallery category."

                });

            }


            if (
                !allowedStatuses.includes(
                    status
                )
            ) {

                return res.status(400).json({

                    message:
                        "Invalid gallery status."

                });

            }


            if (!imageUrl) {

                return res.status(400).json({

                    message:
                        "Gallery image is required."

                });

            }


            /* ==========================================
               UPDATE
            ========================================== */

            await item.update({

                title,

                imageUrl,

                category,

                description:
                    description || null,

                status

            });


            return res.status(200).json({

                message:
                    "Gallery item updated successfully.",

                item

            });

        }

        catch (error) {

            next(error);

        }

    };


/* =====================================================
   DELETE GALLERY
===================================================== */

const deleteGallery =
    async (
        req,
        res,
        next
    ) => {

        try {

            const item =
                await Gallery.findByPk(
                    req.params.id
                );


            if (!item) {

                return res.status(404).json({

                    message:
                        "Gallery item not found."

                });

            }


            await item.destroy();


            /*
               IMPORTANT:

               Image is stored on UploadThing.
               We do NOT delete the physical
               local file here.
            */


            return res.status(200).json({

                message:
                    "Gallery item deleted successfully."

            });

        }

        catch (error) {

            next(error);

        }

    };


/* =====================================================
   EXPORT
===================================================== */

module.exports = {

    createGallery,

    getGallery,

    getAllGalleryForAdmin,

    getGalleryById,

    getGalleryByIdForAdmin,

    updateGallery,

    deleteGallery

};