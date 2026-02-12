const Booking = require("../models/Booking"); // Adjust paths as per your project
const Bike = require("../models/Bike");
const mongoose = require("mongoose");
const {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subDays,
} = require("date-fns");

// 1. General Dashboard Stats
exports.getBookingStats = async (req, res) => {
  try {
    const { period = "all" } = req.query;
    let query = {};

    // Date Filtering Logic
    if (period !== "all") {
      let start, end;
      const now = new Date();
      if (period === "today") {
        start = startOfDay(now);
        end = endOfDay(now);
      } else if (period === "week") {
        start = startOfWeek(now);
        end = endOfWeek(now);
      } else if (period === "month") {
        start = startOfMonth(now);
        end = endOfMonth(now);
      }

      query.createdAt = { $gte: start, $lte: end };
    }

    const bookings = await Booking.find(query);

    const stats = {
      total_bookings: bookings.length,
      pending_bookings: bookings.filter((b) => b.status === "pending").length,
      active_bookings: bookings.filter((b) =>
        ["active", "confirmed"].includes(b.status),
      ).length,
      completed_bookings: bookings.filter((b) => b.status === "completed")
        .length,
      cancelled_bookings: bookings.filter((b) => b.status === "cancelled")
        .length,
      total_revenue: bookings
        .filter((b) => b.status === "completed")
        .reduce((sum, b) => sum + (b.total_amount || 0), 0),
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Revenue per Bike (Top Performers)
exports.getBikeRevenueReport = async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;
    let matchQuery = { status: "completed" };

    if (fromDate || toDate) {
      matchQuery.start_datetime = {};
      if (fromDate) matchQuery.start_datetime.$gte = new Date(fromDate);
      if (toDate) matchQuery.start_datetime.$lte = new Date(toDate);
    }

    const report = await Booking.aggregate([
      { $match: matchQuery },
      {
        $lookup: {
          from: "bikes", // Name of your bikes collection
          localField: "bike_id",
          foreignField: "_id",
          as: "bike_info",
        },
      },
      { $unwind: "$bike_info" },
      {
        $group: {
          _id: "$bike_id",
          model: { $first: "$bike_info.model" },
          number_plate: { $first: "$bike_info.number_plate" },
          total_bookings: { $sum: 1 },
          total_revenue: { $sum: "$total_amount" },
          // Calculating hours: (End - Start) / ms_per_hour
          total_hours: {
            $sum: {
              $divide: [
                { $subtract: ["$end_datetime", "$start_datetime"] },
                3600000,
              ],
            },
          },
        },
      },
      { $sort: { total_revenue: -1 } },
    ]);

    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Idle Bikes (No bookings in 30 days)
exports.getIdleBikesReport = async (req, res) => {
  try {
    const thirtyDaysAgo = subDays(new Date(), 30);

    // Find IDs of bikes that HAVE been booked recently
    const activeBookingBikeIds = await Booking.distinct("bike_id", {
      start_datetime: { $gte: thirtyDaysAgo },
      status: { $in: ["confirmed", "active", "completed"] },
    });

    // Find bikes that ARE NOT in that ID list
    const idleBikes = await Bike.find({
      _id: { $nin: activeBookingBikeIds },
    });

    res.json(idleBikes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. Daily Revenue Trend (for Recharts)
exports.getDailyRevenueReport = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const fromDate = subDays(new Date(), days);

    const report = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: fromDate },
          status: "completed",
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          bookings_count: { $sum: 1 },
          revenue: { $sum: "$total_amount" },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          date: "$_id",
          bookings_count: 1,
          revenue: 1,
        },
      },
    ]);

    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get bookings ending in the next 60 minutes
exports.getEndingSoon = async (req, res) => {
  try {
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

    // Find active bookings where end time is between NOW and 1 HOUR from now
    const bookings = await Booking.find({
      status: "active",
      end_datetime: {
        $gte: now,
        $lte: oneHourLater,
      },
    })
      .populate("bike_id", "model number_plate image_url")
      .populate("customer_id", "name phone")
      .sort({ end_datetime: 1 });

    // Calculate minutes remaining on the server for accuracy
    const results = bookings.map((booking) => {
      const remaining = Math.round(
        (new Date(booking.end_datetime).getTime() - now.getTime()) /
          (60 * 1000),
      );

      return {
        ...booking._doc,
        minutesRemaining: remaining > 0 ? remaining : 0,
      };
    });

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a history of bookings that expired in the last 24 hours
exports.getRecentlyExpired = async (req, res) => {
  try {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const expired = await Booking.find({
      end_datetime: { $gte: yesterday, $lt: new Date() },
      status: { $in: ["completed", "active"] }, // Showing recently ended or overdue
    })
      .populate("bike_id", "model number_plate")
      .populate("customer_id", "name phone")
      .sort({ end_datetime: -1 });

    res.json(expired);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};