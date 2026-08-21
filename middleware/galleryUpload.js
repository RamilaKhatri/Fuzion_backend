/* DEPRECATED: Gallery uploads now use UploadThing. This Multer middleware is retained only for legacy compatibility. */
const multer = require("multer");
const path = require("path");
const fs = require("fs");

/* =====================================================
   GALLERY UPLOAD DIRECTORY
===================================================== */

const uploadDir = path.join(
    __dirname,
    "..",
    "uploads",
    "gallery"
);


/* =====================================================
   CREATE DIRECTORY IF NOT EXISTS
===================================================== */

fs.mkdirSync(uploadDir, {
    recursive: true
});


/* =====================================================
   STORAGE CONFIGURATION
===================================================== */

const storage = multer.diskStorage({

    destination: (_req, _file, cb) => {

        cb(null, uploadDir);

    },


    filename: (_req, file, cb) => {

        const ext =
            path
                .extname(file.originalname)
                .toLowerCase();


        const safeBase =
            path
                .basename(
                    file.originalname,
                    ext
                )
                .replace(
                    /[^a-z0-9-_]/gi,
                    "-"
                )
                .replace(
                    /-+/g,
                    "-"
                )
                .toLowerCase()
                .slice(0, 50)
                || "gallery-image";


        cb(
            null,
            `${Date.now()}-${safeBase}${ext}`
        );

    }

});


/* =====================================================
   MULTER CONFIGURATION
===================================================== */

const upload = multer({

    storage,

    limits: {

        fileSize:
            5 * 1024 * 1024

    },


    fileFilter: (_req, file, cb) => {

        const allowedExtensions = [
            ".jpg",
            ".jpeg",
            ".png",
            ".webp",
            ".gif"
        ];


        const ext =
            path
                .extname(file.originalname)
                .toLowerCase();


        if (
            !allowedExtensions.includes(ext)
        ) {

            return cb(
                new Error(
                    "Only JPG, JPEG, PNG, WEBP and GIF images are allowed."
                )
            );

        }


        cb(null, true);

    }

});


/* =====================================================
   GALLERY IMAGE UPLOAD MIDDLEWARE
===================================================== */

const uploadGalleryImage = (
    req,
    res,
    next
) => {

    upload.single("image")(
        req,
        res,
        (error) => {

            if (!error) {

                return next();

            }


            /* File too large */

            if (
                error instanceof multer.MulterError &&
                error.code === "LIMIT_FILE_SIZE"
            ) {

                return res.status(400).json({

                    message:
                        "Image is too large. Maximum size is 5MB."

                });

            }


            /* Other upload errors */

            return res.status(400).json({

                message:
                    error.message ||
                    "Gallery image upload failed."

            });

        }
    );

};


module.exports =
    uploadGalleryImage;