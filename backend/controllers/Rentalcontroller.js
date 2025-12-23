const RentalRequest = require("../models/RentalForm");
const nodemailer = require("nodemailer");

const getServer = async (req, res) => {
  try {
    return res.status(200).json("Server started");
  } catch (error) {}
};

const createRentalRequest = async (req, res) => {
  try {
    const { name, phone, pickupLocation, date, duration } = req.body;

    if (!name || !phone || !pickupLocation || !date || !duration) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    const rental = await RentalRequest.create(req.body);

    // -------------------------
    // Send notification email
    // -------------------------
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.verify(); // verify connection

    await transporter.sendMail({
      from: `"Vehicle Booking System" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: "New Vehicle Request",
      text: `A new vehicle request has been submitted by ${name}. Please check the admin panel.`,
    });

    res.status(201).json({ message: "Request submitted successfully", rental });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getAllRentalRequests = async (req, res) => {
  try {
    const rentals = await RentalRequest.find().sort({ createdAt: -1 });
    res.status(200).json(rentals);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
const updateRentalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // validate status
    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const rental = await RentalRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!rental) {
      return res.status(404).json({ message: "Rental request not found" });
    }

    res.status(200).json({
      message: "Status updated successfully",
      rental,
    });
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = {
  createRentalRequest,
  getAllRentalRequests,
  updateRentalStatus,
  getServer,
};
