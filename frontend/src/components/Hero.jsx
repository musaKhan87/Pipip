import { motion } from "framer-motion";
import { Check, MapPin, IndianRupee } from "lucide-react";
import heroImage from "../assets/hero-scooter.jpg";
import { Button } from "./ui/Button";
import { useEffect } from "react";
import axios from "axios";

const Hero = () => {
  const features = [
    "Self-Drive Scooters",
    "Save Time & Money",
    "Freedom to Explore",
  ];


  const getServer = async () => {
    const response = await axios.get(
      "https://pipip-backend.onrender.com/api/rentals"
    );
  };

  
  useEffect(() => {
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
        <div className="max-w-2xl">
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
            Explore Mumbai <span className="text-gradient-teal">Your Way!</span>
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
                Scooters from <span className="text-primary">Rs. 600/day</span>{" "}
                & <span className="text-primary">Rs. 100/hour</span>
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
            <a href="#rent">
              <Button variant="hero" size="xl">
                Rent a Scooter
              </Button>
            </a>
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
      </div>
    </section>
  );
};

export default Hero;
