import { motion } from "framer-motion";
import { MapPin, Calendar, Clock, ChevronDown, Sparkles } from "lucide-react";
import { Check, IndianRupee } from "lucide-react";
import heroImage from "../assets/hero-scooter.jpg";
import { Button } from "./ui/Button";
import { useEffect, useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { useActiveAreas } from "../hooks/useAreas";

const Hero = () => {
  const navigate = useNavigate();
  const { data: areas = [] } = useActiveAreas();

  const [selectedArea, setSelectedArea] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("12:00"); // Added Time State
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("12:00"); // Added Time State
  const [isAreaOpen, setIsAreaOpen] = useState(false);

  const handleSearch = () => {
    if (!selectedArea) {
      toast.error("Please select a pickup location");
      return;
    }

    const params = new URLSearchParams();
    params.set("area", selectedArea);
    // Combine date and time for the search
    if (startDate) params.set("start", `${startDate}T${startTime}`);
    if (endDate) params.set("end", `${endDate}T${endTime}`);

    navigate(`/catalog?${params.toString()}`);
  };

  const toast = {
    error: (msg) => {
      const el = document.getElementById("area-error");
      if (el) {
        el.textContent = msg;
        el.classList.remove("hidden");
        setTimeout(() => el.classList.add("hidden"), 3000);
      }
    },
  };

  const selectedAreaName =
    areas.find((a) => a._id === selectedArea)?.name || "Select Location";
  const features = [
    "Self-Drive Scooters",
    "Save Time & Money",
    "Freedom to Explore",
  ];

  useEffect(() => {
    const getServer = async () => {
      try {
        await axios.get("https://pipip-backend.onrender.com/api/rentals");
      } catch (err) {
        console.error("Server ping failed", err);
      }
    };
    getServer();
  }, []);
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-[140px] overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Pipip Scooter in Mumbai"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/50" />
      </div>

      {/* Stars decoration */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-foreground/60 rounded-full animate-twinkle"
            style={{
              top: `${Math.random() * 50}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Add a Grid wrapper here */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Side: Text Content */}
          {/* 2. Removed 'max-w-2xl' from here to let it breathe, added lg:w-1/2 */}
          <div className="w-full lg:w-1/2">
            {/* Logo */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-display text-6xl md:text-8xl text-gradient-sunset mb-6"
            >
              Pipip
            </motion.h1>

            {/* Tagline */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl md:text-5xl font-bold text-foreground mb-6"
            >
              Explore Mumbai{" "}
              <span className="text-gradient-teal">Your Way!</span>
            </motion.h2>

            {/* Features */}
            <motion.ul
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-3 mb-6"
            >
              {features.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 text-lg text-foreground/90"
                >
                  <Check className="w-5 h-5 text-secondary" />
                  {feature}
                </li>
              ))}
            </motion.ul>

            {/* Location */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex items-center gap-2 text-muted-foreground mb-8"
            >
              <MapPin className="w-5 h-5 text-primary" />
              <span>Bhendi Bazar, Mumbai-400003</span>
            </motion.div>

            {/* Pricing Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="inline-flex items-center gap-4 bg-card/80 backdrop-blur-sm border border-primary/30 rounded-2xl p-4 mb-8"
            >
              <div className="w-10 h-10 rounded-full gradient-sunset flex items-center justify-center">
                <IndianRupee className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-foreground font-semibold">
                  Scooters from{" "}
                  <span className="text-primary">Rs. 600/day</span> &{" "}
                  <span className="text-primary">Rs. 100/hour</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Pick up and drop available @ Rs. 100
                </p>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <NavLink to="/catalog">
                <Button variant="hero" size="xl">
                  Rent a Scooter
                </Button>
              </NavLink>
              <a href="#pricing">
                <Button variant="glass" size="xl">
                  View Pricing
                </Button>
              </a>
            </motion.div>

            {/* Payment info */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-6 text-secondary font-medium"
            >
              💳 Payment at delivery available
            </motion.p>
          </div>

          {/* Right Side - Search Card (Boongg Style) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full lg:w-auto max-w-md lg:ml-auto"
          >
            {/* Changed bg-card/95 to bg-white/5 for glass effect */}
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg gradient-sunset flex items-center justify-center">
                  🛵
                </span>
                Find Your Ride
              </h3>

              {/* Location Dropdown */}
              <div className="mb-4">
                <label className="text-sm text-gray-300 mb-2 block">
                  Pickup Location
                </label>
                <div className="relative">
                  <button
                    onClick={() => setIsAreaOpen(!isAreaOpen)}
                    className="w-full flex items-center justify-between bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-left hover:border-primary transition-colors text-white"
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-primary" />
                      <span
                        className={
                          selectedArea ? "text-white" : "text-gray-400"
                        }
                      >
                        {selectedAreaName}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        isAreaOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isAreaOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-xl z-50 max-h-60 overflow-auto"
                    >
                      {areas.map((area) => (
                        <button
                          key={area._id}
                          onClick={() => {
                            setSelectedArea(area._id);
                            setIsAreaOpen(false);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-muted transition-colors flex items-center gap-3 first:rounded-t-xl last:rounded-b-xl"
                        >
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="text-foreground">{area.name}</span>
                          <span className="text-xs text-muted-foreground ml-auto">
                            {area.city}
                          </span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
                <p
                  id="area-error"
                  className="hidden text-xs text-red-500 mt-1"
                ></p>
              </div>

              {/* Date/Time Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Apply these classes to ALL 4 inputs below */}
                {[
                  {
                    label: "Start Date",
                    val: startDate,
                    set: setStartDate,
                    type: "date",
                  },
                  {
                    label: "End Date",
                    val: endDate,
                    set: setEndDate,
                    type: "date",
                  },
                  {
                    label: "Start Time",
                    val: startTime,
                    set: setStartTime,
                    type: "time",
                  },
                  {
                    label: "End Time",
                    val: endTime,
                    set: setEndTime,
                    type: "time",
                  },
                ].map((field, i) => (
                  <div key={i}>
                    <label className="text-sm text-gray-300 mb-2 block">
                      {field.label}
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                      <input
                        type={field.type}
                        value={field.val}
                        onChange={(e) => field.set(e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-primary 
                         [&::-webkit-calendar-picker-indicator]:invert"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <Button
                onClick={handleSearch}
                className="w-full gradient-sunset text-white font-semibold py-6 rounded-xl shadow-lg hover:shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Search Available Bikes
              </Button>

              <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Min 1 hour
                </span>
                <span>•</span>
                <span>💳 Pay at delivery</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
