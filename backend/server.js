// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const http = require("http"); // 👈 NEW: Required to attach Socket.io to Express
// const { Server } = require("socket.io");
// const connectDB = require("./config/db");
// dotenv.config();

// const AreaRouter = require("./routes/AreaRoutes");
// const BikeRouter = require("./routes/BikeRoutes");

// connectDB();

// const app = express();

// // 1. CORS should be one of the first things defined
// app.use(
//   cors({
//     origin: ["http://localhost:5173", "https://pipip-frontend.onrender.com"],
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   }),
// );

// // 2. WEBHOOK ROUTE MUST COME BEFORE express.json()
// // This is required for Cashfree/Stripe signature verification
// app.use("/api/payment/webhook", express.raw({ type: "application/json" }));

// // 3. Global Parsers
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // 4. Routes
// app.use("/api/rentals", require("./routes/RentalRoutes"));
// app.use("/api/bikes", BikeRouter);
// app.use("/api/areas", AreaRouter);
// app.use("/api/customers", require("./routes/CustomerRoutes"));
// app.use("/api/bookings", require("./routes/BookingRoutes"));
// app.use("/api/availability", require("./routes/AvailablityRoutes"));
// app.use("/api/reports", require("./routes/reportRoutes"));
// app.use("/api/auth", require("./routes/authRoutes"));
// app.use("/api/payment", require("./routes/paymentRoutes"));

// // 5. Global Error Handler (Highly Recommended)
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({
//     success: false,
//     message: err.message || "Internal Server Error",
//   });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });




const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http"); // 👈 NEW: Required to attach Socket.io to Express
const { Server } = require("socket.io"); // 👈 NEW: Socket.io Server import
const connectDB = require("./config/db");
dotenv.config();

const AreaRouter = require("./routes/AreaRoutes");
const BikeRouter = require("./routes/BikeRoutes");
const notificationRoutes = require("./routes/notificationRoutes"); // 👈 NEW: Notification routes import

connectDB();

const app = express();
const server = http.createServer(app); // 👈 NEW: Wrap Express app in HTTP server

// Initialize Socket.io with your exact CORS rules
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://pipip-frontend.onrender.com"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  },
});

// Pass the active io instance context globally so controllers can use it via req.app.get("io")
app.set("io", io);

// 1. CORS should be one of the first things defined
app.use(
  cors({
    origin: ["http://localhost:5173", "https://pipip-frontend.onrender.com"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// 2. WEBHOOK ROUTE MUST COME BEFORE express.json()
// This is required for Cashfree/Stripe signature verification
app.use("/api/payment/webhook", express.raw({ type: "application/json" }));

// 3. Global Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Routes
app.use("/api/rentals", require("./routes/RentalRoutes"));
app.use("/api/bikes", BikeRouter);
app.use("/api/areas", AreaRouter);
app.use("/api/customers", require("./routes/CustomerRoutes"));
app.use("/api/bookings", require("./routes/BookingRoutes"));
app.use("/api/availability", require("./routes/AvailablityRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/payment", require("./routes/paymentRoutes"));
app.use("/api/notifications", notificationRoutes); // 👈 NEW: Notification routes mounted

// 5. Socket.io Connection Monitoring Log
io.on("connection", (socket) => {
  console.log(`🔌 Admin dashboard socket connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`❌ Admin dashboard socket disconnected: ${socket.id}`);
  });
});

// 6. Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;

// ❌ Change app.listen to server.listen so both HTTP and WebSockets run on the same port!
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
