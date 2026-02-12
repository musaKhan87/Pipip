// controllers/booking.controller.js
const Bike = require("../models/Bike");
const Booking = require("../models/Booking");

exports.createBooking = async (req, res) => {
  const booking = await Booking.create(req.body);
  res.status(201).json(booking);
};

exports.adminCreateBooking = async (req, res) => {
  try {
    const { bike_id, start_datetime, end_datetime, customer_id, notes } =
      req.body;

    const bike = await Bike.findById(bike_id);
    if (!bike) return res.status(404).json({ message: "Bike not found" });

    const start = new Date(start_datetime);
    const end = new Date(end_datetime);

    // 1. Calculate Total Hours
    const totalHours = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60)));

    let total_amount = 0;
    const hourlyRate = Number(bike.price_per_hour || 0);
    const dailyRate = Number(bike.price_per_day || 0);

    // 2. Logic: If 24 hours or more AND a daily rate exists
    if (totalHours >= 24 && dailyRate > 0) {
      const days = Math.floor(totalHours / 24);
      const remainingHours = totalHours % 24;

      // Calculate: (Full Days * Daily Price) + (Extra Hours * Hourly Price)
      total_amount = days * dailyRate + remainingHours * hourlyRate;

      // Optimization: If remaining hours cost more than another full day,
      // just charge for an extra day (whichever is cheaper)
      if (remainingHours * hourlyRate > dailyRate) {
        total_amount = (days + 1) * dailyRate;
      }
    } else {
      // Logic: Less than 24 hours (or no daily rate set)
      total_amount = totalHours * hourlyRate;
    }

    // 3. Create the Booking
    const booking = await Booking.create({
      customer_id,
      bike_id,
      start_datetime: start,
      end_datetime: end,
      total_amount,
      notes,
      booking_source: "admin",
      status: "confirmed", // Or "active" depending on your flow
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ message: "Server error creating booking" });
  }
};
/**
 * GET ALL BOOKINGS (ADMIN)
 */
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("customer_id", "name phone email")
      .populate("bike_id", "model number_plate")
      .sort({ createdAt: -1 });

    const formatted = bookings.map((b) => ({
      ...b.toObject(),
      customers: b.customer_id,
      bikes: b.bike_id,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET SINGLE BOOKING
 */
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("customer_id", "name phone email")
      .populate("bike_id", "model number_plate");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({
      ...booking.toObject(),
      customers: booking.customer_id,
      bikes: booking.bike_id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * UPDATE BOOKING (ADMIN CAN EDIT DETAILS)
 */
exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const { start_datetime, end_datetime, total_amount, notes } = req.body;

    if (start_datetime !== undefined) booking.start_datetime = start_datetime;

    if (end_datetime !== undefined) booking.end_datetime = end_datetime;

    if (total_amount !== undefined) booking.total_amount = total_amount;

    if (notes !== undefined) booking.notes = notes;

    booking.updated_by_admin = true;

    await booking.save();

    res.json({
      message: "Booking updated successfully",
      booking,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * UPDATE BOOKING STATUS (FAST ADMIN ACTION)
 */
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatus = [
      "pending",
      "confirmed",
      "active",
      "completed",
      "cancelled",
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status, updated_by_admin: true },
      { new: true },
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({
      message: "Booking status updated",
      booking,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * DELETE / CANCEL BOOKING
 */
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    await booking.deleteOne();

    res.json({ message: "Booking deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

