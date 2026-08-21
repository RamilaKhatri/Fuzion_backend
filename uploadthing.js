const {
    createUploadthing
} = require("uploadthing/express");

const f = createUploadthing();

const jwt = require("jsonwebtoken");

const authMiddleware = async ({ req }) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        throw new Error("Authentication required.");
    }

    const token = authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : null;

    if (!token) {
        throw new Error("Invalid authentication token.");
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        return {
            userId: decoded.id || decoded.userId
        };

    } catch (error) {
        throw new Error("Invalid or expired token.");
    }
};

const uploadRouter = {

    galleryImage: f({
        image: {
            maxFileSize: "8MB",
            maxFileCount: 1
        }
    })
        .middleware(authMiddleware)
        .onUploadComplete(async ({ file, metadata }) => {

            console.log("GALLERY UPLOAD:", file.ufsUrl);

            return {
                url: file.ufsUrl
            };
        }),

    menuImage: f({
        image: {
            maxFileSize: "5MB",
            maxFileCount: 1
        }
    })
        .middleware(authMiddleware)
        .onUploadComplete(async ({ file, metadata }) => {

            console.log("MENU UPLOAD:", file.ufsUrl);

            return {
                url: file.ufsUrl
            };
        })

};

module.exports = {
    uploadRouter
};