const {
    createUploadthing
} = require("uploadthing/express");

const f = createUploadthing();

const jwt = require("jsonwebtoken");

const uploadRouter = {

    galleryImage: f({
        image: {
            maxFileSize: "8MB",
            maxFileCount: 1
        }
    })

    .middleware(async ({ req }) => {

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
                userId: decoded.id || decoded.userId
            };

        } catch (error) {

            throw new Error(
                "Invalid or expired token."
            );

        }

    })

    .onUploadComplete(
        async ({ file, metadata }) => {

            console.log(
                "================================="
            );

            console.log(
                "UPLOADTHING IMAGE UPLOADED"
            );

            console.log(
                "File name:",
                file.name
            );

            console.log(
                "File URL:",
                file.ufsUrl
            );

            console.log(
                "Uploaded by:",
                metadata.userId
            );

            console.log(
                "================================="
            );

            return {

                url: file.ufsUrl

            };

        }
    )

};

module.exports = {
    uploadRouter
};