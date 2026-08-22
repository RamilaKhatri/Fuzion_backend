const {
    createUploadthing
} = require("uploadthing/express");

const jwt = require("jsonwebtoken");

const f = createUploadthing();

/* =====================================================
   AUTH MIDDLEWARE
===================================================== */

const authMiddleware = async ({ req }) => {

    const authHeader =
        req.headers.authorization;

    if (!authHeader) {
        throw new Error(
            "Authentication required."
        );
    }

    const token =
        authHeader.startsWith("Bearer ")
            ? authHeader.substring(7)
            : null;

    if (!token) {
        throw new Error(
            "Invalid authentication token."
        );
    }

    try {

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );

        return {
            userId:
                decoded.id ||
                decoded.userId
        };

    } catch (error) {

        throw new Error(
            "Invalid or expired token."
        );
    }
};


/* =====================================================
   UPLOAD ROUTER
===================================================== */

const uploadRouter = {

    /* =================================================
       GALLERY IMAGE
    ================================================= */

    galleryImage: f({
        image: {
            maxFileSize: "8MB",
            maxFileCount: 1
        }
    })

        .middleware(
            authMiddleware
        )

        .onUploadComplete(
            async ({
                file,
                metadata
            }) => {

                console.log(
                    "GALLERY UPLOAD:",
                    file.ufsUrl
                );

                return {
                    url: file.ufsUrl
                };
            }
        ),


    /* =================================================
       MENU IMAGE
    ================================================= */

    menuImage: f({
        image: {
            maxFileSize: "5MB",
            maxFileCount: 1
        }
    })

        .middleware(
            authMiddleware
        )

        .onUploadComplete(
            async ({
                file,
                metadata
            }) => {

                console.log(
                    "MENU UPLOAD:",
                    file.ufsUrl
                );

                return {
                    url: file.ufsUrl
                };
            }
        ),


    /* =================================================
       TEAM IMAGE
    ================================================= */

    teamImage: f({
        image: {
            maxFileSize: "5MB",
            maxFileCount: 1
        }
    })

        .middleware(
            authMiddleware
        )

        .onUploadComplete(
            async ({
                file,
                metadata
            }) => {

                console.log(
                    "TEAM UPLOAD:",
                    file.ufsUrl
                );

                return {
                    url: file.ufsUrl
                };
            }
        )

};


/* =====================================================
   EXPORT
===================================================== */

module.exports = {
    uploadRouter
};