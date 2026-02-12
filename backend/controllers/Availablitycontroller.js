const Booking = require("../models/Booking");

exports.checkAvailability = async (req, res) => {
  const { bikeId, start_datetime, end_datetime } = req.body;

  if (!bikeId || !start_datetime || !end_datetime) {
    return res.status(400).json({
      isAvailable: false,
      message: "Missing required fields",
    });
  }

  const start = new Date(start_datetime);
  const end = new Date(end_datetime);

  const conflict = await Booking.findOne({
    bike_id: bikeId,
    status: { $ne: "cancelled" },
    start_datetime: { $lt: end },
    end_datetime: { $gt: start },
  });

  if (conflict) {
    return res.json({
      isAvailable: false,
      message: "Bike already booked",
      bookedFrom: conflict.start_datetime,
      bookedTo: conflict.end_datetime,
    });
  }

  res.json({
    isAvailable: true,
    message: "Bike is available 🎉",
  });
};
