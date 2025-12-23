const SibApiV3Sdk = require("sib-api-v3-sdk");

const isEmailConfigured = () => {
  return !!(
    process.env.BREVO_API_KEY &&
    process.env.ADMIN_EMAIL &&
    process.env.SENDER_EMAIL
  );
};

const sendNewRentalNotification = async (name) => {
  if (!isEmailConfigured()) {
    console.warn("Email not configured. Skipping admin notification.");
    return;
  }

  try {
    // Configure Brevo client
    const client = SibApiV3Sdk.ApiClient.instance;
    client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    await apiInstance.sendTransacEmail({
      sender: {
        email: process.env.SENDER_EMAIL,
        name: "Vehicle Booking System",
      },
      to: [
        {
          email: process.env.ADMIN_EMAIL,
        },
      ],
      subject: "🚗 New Vehicle Rental Request",
      textContent: `A new vehicle request has been submitted by ${name}. Please check the admin panel.`,
    });

    console.log("✅ Admin notification email sent via Brevo");
  } catch (error) {
    console.error("❌ Brevo email failed:", error.message);
  }
};

module.exports = sendNewRentalNotification;
