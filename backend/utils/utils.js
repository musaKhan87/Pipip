const nodemailer = require("nodemailer");


const createTransporter = () => {
  return nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // app password if 2FA enabled
    },
  });
};

const sendNewRentalNotification = async (name) => {
   if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
     console.log(
       "Email credentials not provided. Skipping email notification."
     );
     return;
   }

  try {
    const transporter = createTransporter();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: "🚗 New Vehicle Rental Request",
      text: `A new vehicle request has been submitted by ${name}. Please check the admin panel.`,
    });

    console.log("✅ Admin notification email sent");
  } catch (error) {
    console.error("❌ Email sending failed:");
    console.error(error); // FULL error (important)
  }
};

module.exports= sendNewRentalNotification;