const Booking = require("../models/Booking");
const Customer = require("../models/Customer");

exports.createCustomer = async (req, res) => {
  try {
    const aadhaarImage = req.files?.aadhaar_image?.[0]?.path || null;

    const licenseImage = req.files?.license_image?.[0]?.path || null;

    // ❌ At least one document required
    if (!aadhaarImage && !licenseImage) {
      return res.status(400).json({
        message: "Upload Aadhaar and License (both required)",
      });
    }



    const customer = await Customer.create({
      ...req.body,
      aadhaar_image_url: aadhaarImage,
      license_image_url: licenseImage,
    });

    
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCustomer= async (req, res) => {
  const search = req.query.search || "";

  const customers = await Customer.find({
    $or: [
      { name: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ],
  });

  res.json(customers);
}

/* ================= UPDATE CUSTOMER ================= */
exports.updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= DELETE CUSTOMER ================= */
exports.deleteCustomer = async (req, res) => {
  try {
    const bookingCount = await Booking.countDocuments({
      customer_id: req.params.id,
    });

    if (bookingCount > 0) {
      return res.status(400).json({
        message: "Cannot delete customer with existing bookings",
      });
    }

    await Customer.findByIdAndDelete(req.params.id);
    res.json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= CUSTOMER BOOKING HISTORY ================= */
exports.getCustomerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      customer_id: req.params.id,
    })
      .populate("bike_id")
      .sort({ start_datetime: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};