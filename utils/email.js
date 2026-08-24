const { Resend } = require("resend");


/* =====================================================
   RESEND CLIENT
===================================================== */

const resend = new Resend(process.env.RESEND_API_KEY);


/* =====================================================
   SEND ENQUIRY NOTIFICATION EMAIL
   Called when a customer submits the contact form.
   Sends a notification to the café's contact email.
===================================================== */

const sendEnquiryNotification = async (enquiry) => {

    if (!process.env.RESEND_API_KEY) {

        console.warn(
            "RESEND_API_KEY not set — skipping enquiry email."
        );

        return;
    }


    if (!process.env.CAFE_CONTACT_EMAIL) {

        console.warn(
            "CAFE_CONTACT_EMAIL not set — skipping enquiry email."
        );

        return;
    }


    try {

        await resend.emails.send({

            from: "Fuzion Cafe <onboarding@resend.dev>",

            to: process.env.CAFE_CONTACT_EMAIL,

            replyTo: enquiry.email,

            subject:
                `New Enquiry: ${enquiry.subject || "Contact Form"}`,

            html: `

                <div style="font-family: Arial, sans-serif; max-width: 600px;">

                    <h2 style="color:#5e1712;">
                        New Contact Form Enquiry
                    </h2>

                    <p><strong>Name:</strong> ${enquiry.name}</p>
                    <p><strong>Phone:</strong> ${enquiry.phone}</p>
                    <p><strong>Email:</strong> ${enquiry.email}</p>
                    ${
                        enquiry.subject
                            ? `<p><strong>Subject:</strong> ${enquiry.subject}</p>`
                            : ""
                    }

                    <p><strong>Message:</strong></p>
                    <p style="white-space: pre-wrap; background:#f7f3ec; padding:12px; border-radius:8px;">
                        ${enquiry.message}
                    </p>

                </div>

            `

        });


        console.log(
            "Enquiry notification email sent."
        );


    } catch (error) {

        console.error(
            "Failed to send enquiry email:",
            error
        );

    }

};


module.exports = {
    sendEnquiryNotification
};