const nodemailer = require("nodemailer");

const isEmailConfigured = () => {
  return (
    process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.ADMIN_EMAIL
  );
};

const createTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // TLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // App password
    },
  });
};

const sendNewRentalNotification = async (name) => {
  if (!isEmailConfigured()) {
    console.warn("⚠️ Email env vars missing. Skipping email.");
    return;
  }

  try {
    const transporter = createTransporter();

    await transporter.sendMail({
      from: `"Vehicle Booking System" <${process.env.EMAIL_USER}>`,
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