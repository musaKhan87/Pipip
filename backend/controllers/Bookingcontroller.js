// controllers/booking.controller.js
const Bike = require("../models/Bike");
const Booking = require("../models/Booking");
const { sendOrderAlerts } = require("./notificationController");

exports.createBooking = async (req, res) => {
  // const booking = await Booking.create(req.body);
  // res.status(201).json(booking);
  try {
    // Force the source to "online" so your database knows it came from the website
    const bookingData = {
      ...req.body,
      booking_source: "online",
    };

    const booking = await Booking.create(bookingData);

    // 2. 🔥 CRITICAL HOOK: Trigger the live websocket and smartphone push notification stream!
    // This transmits the fresh document down to your admin panel dashboard screens.
    sendOrderAlerts(booking, req.app.get("io"));

    res.status(201).json(booking);
  } catch (error) {
    console.error("Website Booking Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// exports.createBooking = async (req, res) => {
//   try {
//     const { booking_type, area_id, ...rest } = req.body;

//     if (booking_type === "scooter_pool") {
//       // bike_id is null — admin will assign later
//       const booking = await Booking.create({
//         ...rest,
//         bike_id: null,
//         booking_type: "scooter_pool",
//         area_id: area_id || null,
//         status: "pending",
//       });
//       return res.status(201).json(booking);
//     }

//     // Regular booking (existing logic)
//     const booking = await Booking.create(req.body);
//     res.status(201).json(booking);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

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

      total_amount: manual_total_amount,
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

    // In adminCreateBooking
    let start_datetime_ist = start_datetime;
    if (!start_datetime.includes("Z") && !start_datetime.includes("+")) {
      start_datetime_ist = `${start_datetime}+05:30`;
    }
    const start = new Date(start_datetime_ist);

    let end_datetime_ist = end_datetime;
    if (!end_datetime.includes("Z") && !end_datetime.includes("+")) {
      end_datetime_ist = `${end_datetime}+05:30`;
    }
    const end = new Date(end_datetime_ist);

    // ✅ Safety check
    if (end <= start) {
      return res
        .status(400)
        .json({ message: "End date must be after start date" });
    }

    const totalHours = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60)));

    // let total_amount = 0;

    // const hourlyRate = Number(bike.price_per_hour || 0);
    // const dailyRate = Number(bike.price_per_day || 0);

    // if (totalHours >= 24 && dailyRate > 0) {
    //   const days = Math.floor(totalHours / 24);
    //   const remainingHours = totalHours % 24;

    //   total_amount = days * dailyRate + remainingHours * hourlyRate;

    //   if (remainingHours * hourlyRate > dailyRate) {
    //     total_amount = (days + 1) * dailyRate;
    //   }
    // } else {
    //   total_amount = totalHours * hourlyRate;
    // }

    // ✅ Replaced the old calculation block with this:
    let final_total_amount = 0;

    if (
      manual_total_amount !== undefined &&
      manual_total_amount !== null &&
      manual_total_amount !== ""
    ) {
      final_total_amount = Number(manual_total_amount);
    } else {
      const totalHours = Math.max(
        1,
        Math.ceil((end - start) / (1000 * 60 * 60)),
      );
      const hourlyRate = Number(bike.price_per_hour || 0);
      const dailyRate = Number(bike.price_per_day || 0);

      if (totalHours >= 24 && dailyRate > 0) {
        const days = Math.floor(totalHours / 24);
        const remainingHours = totalHours % 24;
        final_total_amount = days * dailyRate + remainingHours * hourlyRate;

        if (remainingHours * hourlyRate > dailyRate) {
          final_total_amount = (days + 1) * dailyRate;
        }
      } else {
        final_total_amount = totalHours * hourlyRate;
      }
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

      total_amount: final_total_amount, // ✅ Changed from total_amount to final_total_amount
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

/**
 * GET ALL BOOKINGS (ADMIN)
 */
// exports.getAllBookings = async (req, res) => {
//   try {
//     const bookings = await Booking.find()
//       .populate("customer_id", "name phone email")
//       .populate("bike_id", "model number_plate")
//       .sort({ createdAt: -1 });

//     const formatted = bookings.map((b) => ({
//       ...b.toObject(),
//       customers: b.customer_id,
      
//       bikes: b.bike_id,
//     }));

//     res.json(formatted);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("customer_id", "name phone email")
      .populate("bike_id", "model number_plate")
      .sort({ createdAt: -1 });

    const formatted = bookings.map((b) => {
      const bookingObj = b.toObject();

      // ✅ Add formatted IST strings for the frontend to display easily
      return {
        ...bookingObj,
        customers: b.customer_id,
        bikes: b.bike_id,
        // Format for display: "21/04/2026, 7:00:00 pm"
        start_datetime_display: b.start_datetime.toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour12: true,
        }),
        end_datetime_display: b.end_datetime.toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour12: true,
        }),
      };
    });

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
    console.log("BODY:", req.body); // ✅ debug
    console.log("FILE:", req.file); // ✅ debug

    const body = req.body || {}; // ✅ SAFE FIX

    const updateData = {
      ...body,

      fuel_out_liters:
        body.fuel_out_liters !== undefined
          ? Number(body.fuel_out_liters)
          : undefined,

      fuel_in_liters:
        body.fuel_in_liters !== undefined
          ? Number(body.fuel_in_liters)
          : undefined,

      penalty_amount:
        body.penalty_amount !== undefined
          ? Number(body.penalty_amount)
          : undefined,

      challan_amount:
        body.challan_amount !== undefined
          ? Number(body.challan_amount)
          : undefined,

      damage_cost:
        body.damage_cost !== undefined ? Number(body.damage_cost) : undefined,
    };

    // ✅ IMAGE SAVE
    if (req.file) {
      updateData.payment_screenshot = req.file.path;
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      {
        new: true,
        runValidators: false,
      },
    );

    res.status(200).json(booking);
  } catch (error) {
    console.error("Update Booking Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// exports.updateBooking = async (req, res) => {
//   try {
//     const updateData = {
//       ...req.body,

//       fuel_out_liters:
//         req.body.fuel_out_liters !== undefined
//           ? Number(req.body.fuel_out_liters)
//           : undefined,

//       fuel_in_liters:
//         req.body.fuel_in_liters !== undefined
//           ? Number(req.body.fuel_in_liters)
//           : undefined,

//       penalty_amount:
//         req.body.penalty_amount !== undefined
//           ? Number(req.body.penalty_amount)
//           : undefined,

//       challan_amount:
//         req.body.challan_amount !== undefined
//           ? Number(req.body.challan_amount)
//           : undefined,

//       damage_cost:
//         req.body.damage_cost !== undefined
//           ? Number(req.body.damage_cost)
//           : undefined,
//     };

//     const booking = await Booking.findByIdAndUpdate(
//       req.params.id,
//       { $set: updateData }, // ✅ IMPORTANT
//       {
//         new: true,
//         runValidators: false, // ✅ IMPORTANT
//       },
//     );

//     res.status(200).json(booking);
//   } catch (error) {
//     console.error("Update Booking Error:", error);
//     res.status(500).json({ message: error.message });
//   }
// };
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


/**
 * ASSIGN BIKE TO SCOOTER POOL BOOKING (ADMIN)
 */
// exports.assignBikeToBooking = async (req, res) => {
//   try {
//     const { bike_id } = req.body;

//     const booking = await Booking.findById(req.params.id);
//     if (!booking) return res.status(404).json({ message: "Booking not found" });

//     if (booking.booking_type !== "scooter_pool") {
//       return res.status(400).json({ message: "Not a scooter pool booking" });
//     }

//     const bike = await Bike.findById(bike_id);
//     if (!bike) return res.status(404).json({ message: "Bike not found" });
//     if (bike.status !== "available") {
//       return res.status(400).json({ message: "Bike is not available" });
//     }

//     // Assign bike, confirm booking, mark bike as booked
//     booking.bike_id = bike_id;
//     booking.status = "confirmed";
//     booking.updated_by_admin = true;
//     await booking.save();

//     bike.status = "booked";
//     await bike.save();

//     const populated = await Booking.findById(booking._id)
//       .populate("customer_id", "name phone email")
//       .populate("bike_id", "model number_plate");

//     res.json({ message: "Bike assigned successfully", booking: populated });
//   } catch (err) {
//     console.error("Assign Bike Error:", err);
//     res.status(500).json({ message: err.message });
//   }
// };
