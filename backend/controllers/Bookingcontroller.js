// controllers/booking.controller.js
const Bike = require("../models/Bike");
const Booking = require("../models/Booking");

exports.createBooking = async (req, res) => {
  const booking = await Booking.create(req.body);
  res.status(201).json(booking);
};

exports.adminCreateBooking = async (req, res) => {
  try {
    const {
      bike_id,
      start_datetime,
      end_datetime,
      customer_id,

      customer_name,
      contact_number,
      customer_email,
      customer_location,

      lead_source,
      source_name,

      vehicle_make_model,
      rental_type,

      deposit_amount,

      reference_partner_share,
      reference_partner_share_given,

      provider_partner_share,
      provider_partner_share_given,

      fuel_quantity,
      account_manager,

      remarks,
      notes,

      payment_method,

      // ✅ NEW FIELDS (added)
      fuel_out_liters,
      fuel_in_liters,
      penalty_amount,
      challan_amount,
      damage_cost,
    } = req.body;

    const bike = await Bike.findById(bike_id);

    if (!bike) {
      return res.status(404).json({ message: "Bike not found" });
    }

    const start = new Date(start_datetime);
    const end = new Date(end_datetime);

    // ✅ Safety check
    if (end <= start) {
      return res
        .status(400)
        .json({ message: "End date must be after start date" });
    }

    const totalHours = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60)));

    let total_amount = 0;

    const hourlyRate = Number(bike.price_per_hour || 0);
    const dailyRate = Number(bike.price_per_day || 0);

    if (totalHours >= 24 && dailyRate > 0) {
      const days = Math.floor(totalHours / 24);
      const remainingHours = totalHours % 24;

      total_amount = days * dailyRate + remainingHours * hourlyRate;

      if (remainingHours * hourlyRate > dailyRate) {
        total_amount = (days + 1) * dailyRate;
      }
    } else {
      total_amount = totalHours * hourlyRate;
    }

    const booking = await Booking.create({
      customer_id,
      bike_id,

      customer_name,
      contact_number,
      customer_email,
      customer_location,

      lead_source,
      source_name,

      vehicle_make_model,
      rental_type,

      start_datetime: start,
      end_datetime: end,

      total_amount,

      // ✅ SAFE NUMBER CONVERSION
      deposit_amount: Number(deposit_amount) || 0,

      reference_partner_share: Number(reference_partner_share) || 0,
      reference_partner_share_given: reference_partner_share_given || false,

      provider_partner_share: Number(provider_partner_share) || 0,
      provider_partner_share_given: provider_partner_share_given || false,

      fuel_quantity: Number(fuel_quantity) || 0,

      // ✅ NEW FIELDS ADDED
      fuel_out_liters:
        fuel_out_liters !== undefined ? Number(fuel_out_liters) : undefined,
      fuel_in_liters:
        fuel_in_liters !== undefined ? Number(fuel_in_liters) : undefined,

      penalty_amount: Number(penalty_amount) || 0,
      challan_amount: Number(challan_amount) || 0,
      damage_cost: Number(damage_cost) || 0,

      account_manager,
      booking_source: "admin",
      remarks,
      notes,

      payment_method,

      status: "confirmed",
      updated_by_admin: true,
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error("Booking Error:", error);

    res.status(500).json({
      message: "Server error creating booking",
    });
  }
};

// exports.adminCreateBooking = async (req, res) => {
//   try {
//     // 1. Get file paths from multer (req.files)
//     const licenseFiles =
//       req.files
//         ?.filter((f) => f.fieldname === "customer_license_files")
//         .map((f) => f.path) || [];

//     const idFiles =
//       req.files
//         ?.filter((f) => f.fieldname === "customer_id_proof_files")
//         .map((f) => f.path) || [];

//     // 2. Destructure body
//     const {
//       bike_id,
//       start_datetime,
//       end_datetime,
//       customer_id,
//       customer_name,
//       contact_number,
//       lead_source,
//       source_name,
//       vehicle_make_model,
//       rental_type,
//       deposit_amount,
//       account_manager,
//       remarks,
//       notes,
//       payment_method,
//     } = req.body;

//     // 3. Create booking with explicit Type Conversion for numbers
//     const booking = await Booking.create({
//       ...req.body,
//       start_datetime: new Date(start_datetime),
//       end_datetime: new Date(end_datetime),
//       deposit_amount: Number(deposit_amount) || 0,
//       // Calculate total_amount here or ensure it's passed from frontend
//       total_amount: Number(req.body.total_amount) || 0,
//       customer_license_files: licenseFiles,
//       customer_id_proof_files: idFiles,
//       status: "confirmed",
//       updated_by_admin: true,
//     });

//     res.status(201).json(booking);
//   } catch (error) {
//     console.error("Booking Error:", error);
//     res.status(400).json({ message: error.message }); // Send exact validation error
//   }
// };

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
// exports.updateBooking = async (req, res) => {
//   try {
//     const booking = await Booking.findById(req.params.id);

//     if (!booking) {
//       return res.status(404).json({ message: "Booking not found" });
//     }

//     const { start_datetime, end_datetime, total_amount, notes } = req.body;

//     if (start_datetime !== undefined) booking.start_datetime = start_datetime;

//     if (end_datetime !== undefined) booking.end_datetime = end_datetime;

//     if (total_amount !== undefined) booking.total_amount = total_amount;

//     if (notes !== undefined) booking.notes = notes;

//     booking.updated_by_admin = true;

//     await booking.save();

//     res.json({
//       message: "Booking updated successfully",
//       booking,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

exports.updateBooking = async (req, res) => {
  try {
    const updateData = {
      ...req.body,

      fuel_out_liters:
        req.body.fuel_out_liters !== undefined
          ? Number(req.body.fuel_out_liters)
          : undefined,

      fuel_in_liters:
        req.body.fuel_in_liters !== undefined
          ? Number(req.body.fuel_in_liters)
          : undefined,

      penalty_amount:
        req.body.penalty_amount !== undefined
          ? Number(req.body.penalty_amount)
          : undefined,

      challan_amount:
        req.body.challan_amount !== undefined
          ? Number(req.body.challan_amount)
          : undefined,

      damage_cost:
        req.body.damage_cost !== undefined
          ? Number(req.body.damage_cost)
          : undefined,
    };

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { $set: updateData }, // ✅ IMPORTANT
      {
        new: true,
        runValidators: false, // ✅ IMPORTANT
      },
    );

    res.status(200).json(booking);
  } catch (error) {
    console.error("Update Booking Error:", error);
    res.status(500).json({ message: error.message });
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

