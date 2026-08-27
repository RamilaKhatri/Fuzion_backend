const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const sequelize = require("./config/database");

/* =====================================================
   UPLOADTHING
===================================================== */

const {
    createRouteHandler
} = require("uploadthing/express");

const {
    uploadRouter
} = require("./uploadthing");


/* =====================================================
   ENVIRONMENT CHECK
===================================================== */

if (!process.env.JWT_SECRET) {

    console.error(
        "JWT_SECRET is missing. Create a .env file before starting the server."
    );

    process.exit(1);
}


/*
   UploadThing token is required.
*/

if (!process.env.UPLOADTHING_TOKEN) {

    console.error(
        "UPLOADTHING_TOKEN is missing. Add it to your .env file."
    );

    process.exit(1);
}


/* =====================================================
   LOAD MODELS
===================================================== */

require("./models/User");
require("./models/Project");
require("./models/Enquiry");
require("./models/Team");
require("./models/Booking");
require("./models/MenuItem");
require("./models/Order");
require("./models/Gallery");
require("./models/Newsletter");
require("./models/Review");

/* =====================================================
   LOAD ROUTES
===================================================== */

const authRoutes =
    require("./routes/authroutes");

const profileRoutes =
    require("./routes/profileroutes");

const projectRoutes =
    require("./routes/projectroutes");

const enquiryRoutes =
    require("./routes/enquiryRoutes");

const bookingRoutes =
    require("./routes/bookingRoutes");

const adminRoutes =
    require("./routes/adminRoutes");

const menuRoutes =
    require("./routes/menuroutes");

const teamRoutes =
    require("./routes/teamRoutes");

const orderRoutes =
    require("./routes/orderRoutes");

const userRoutes =
    require("./routes/userRoutes");

const galleryRoutes =
    require("./routes/galleryRoutes");

const newsletterRoutes =
    require("./routes/newsletterRoutes");

const statsRoutes = 
    require("./routes/statsRoutes");


const reviewRoutes =
    require("./routes/reviewRoutes");

/* =====================================================
   CREATE EXPRESS APP
===================================================== */

const app = express();


/* =====================================================
   CORS
===================================================== */

app.use(
    cors({
        origin: true,
        credentials: true
    })
);


/* =====================================================
   BODY PARSERS
===================================================== */

app.use(
    express.json({
        limit: "1mb"
    })
);

app.use(
    express.urlencoded({
        extended: true
    })
);


/* =====================================================
   STATIC FRONTEND
===================================================== */

app.use(
    express.static(
        path.join(
            __dirname,
            "public"
        )
    )
);


/* =====================================================
   OLD LOCAL UPLOADS
   -----------------------------------------------
   Temporarily kept because your existing
   gallery controller / Multer still uses it.
===================================================== */

app.use(
    "/uploads",
    express.static(
        path.join(
            __dirname,
            "uploads"
        )
    )
);


/* =====================================================
   UPLOADTHING ROUTE
   -----------------------------------------------
   Frontend UploadThing requests go here:

   /api/uploadthing
===================================================== */

app.use(
    "/api/uploadthing",
    createRouteHandler({
        router: uploadRouter
    })
);


/* =====================================================
   HEALTH CHECK
===================================================== */

app.get(
    "/api/health",
    (req, res) => {

        res.json({

            status: "OK",

            message:
                "Fuzion Cafe API is running"

        });

    }
);


/* =====================================================
   API ROUTES
===================================================== */

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/profile",
    profileRoutes
);

app.use(
    "/api/projects",
    projectRoutes
);

app.use(
    "/api/enquiries",
    enquiryRoutes
);

app.use(
    "/api/bookings",
    bookingRoutes
);

app.use(
    "/api/admin",
    adminRoutes
);

app.use(
    "/api/menu",
    menuRoutes
);

app.use(
    "/api/team",
    teamRoutes
);

app.use(
    "/api/orders",
    orderRoutes
);

app.use(
    "/api/users",
    userRoutes
);

app.use(
    "/api/gallery",
    galleryRoutes
);

app.use(
    "/api/newsletter",
    newsletterRoutes
);

app.use(
    "/api/stats",
     statsRoutes
    );

app.use(
    "/api/reviews",
    reviewRoutes
);

/* =====================================================
   CONTACT
===================================================== */

app.use(
    "/api/contact",
    enquiryRoutes
);


/* =====================================================
   HOME PAGE
===================================================== */

app.get(
    "/",
    (req, res) => {

        res.sendFile(
            path.join(
                __dirname,
                "public",
                "login.html"
            )
        );

    }
);


/* =====================================================
   API 404
===================================================== */

app.use(
    "/api",
    (req, res) => {

        res.status(404).json({

            message:
                "API endpoint not found"

        });

    }
);


/* =====================================================
   GLOBAL ERROR HANDLER
===================================================== */

app.use(
    (err, req, res, next) => {

        console.error(
            "SERVER ERROR:",
            err
        );


        /* Sequelize validation */

        if (
            err.name ===
            "SequelizeValidationError"
        ) {

            return res.status(400).json({

                message:
                    "Validation failed",

                errors:
                    err.errors.map(
                        error => ({

                            field:
                                error.path,

                            message:
                                error.message

                        })
                    )

            });

        }


        /* Sequelize unique */

        if (
            err.name ===
            "SequelizeUniqueConstraintError"
        ) {

            return res.status(409).json({

                message:
                    "A record with this value already exists"

            });

        }


        /* UploadThing / other errors */

        return res.status(500).json({

            message:
                err.message ||
                "Internal server error"

        });

    }
);


/* =====================================================
   START SERVER
===================================================== */

const PORT =
    process.env.PORT || 5000;


sequelize
    .sync({
        alter: true
    })

    .then(
        async () => {

            console.log(
                "Database synced successfully"
            );


            app.listen(
                PORT,
                () => {

                    console.log(
                        `Fuzion Cafe Backend & Admin Panel running on port ${PORT}`
                    );

                    console.log(
                        `UploadThing endpoint: http://localhost:${PORT}/api/uploadthing`
                    );

                }
            );

        }
    )

    .catch(
        error => {

            console.error(
                "Database error:",
                error
            );

            process.exit(1);

        }
    );