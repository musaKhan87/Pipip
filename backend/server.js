const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173", // Development
      "https://pipip-frontend.onrender.com/", // Production frontend URL
    ],
    credentials: true,
  })
);



app.use("/api/rentals", require("./routes/RentalRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
