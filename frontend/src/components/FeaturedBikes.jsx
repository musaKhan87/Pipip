import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom"; // Added useSearchParams
import {
  Bike,
  ArrowRight,
  IndianRupee,
  Star,
  MapPin,
  Shield,
} from "lucide-react";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { Skeleton } from "./ui/Skeleton";
import { useBikes } from "../hooks/useBikes";

const FeaturedBikes = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // Hook to get URL params
  const { data: bikes, isLoading } = useBikes();

  // Get current search params to persist them if they exist
  const urlStart = searchParams.get("start");
  const urlEnd = searchParams.get("end");

  const featuredBikes =
    bikes?.filter((bike) => bike.status === "available").slice(0, 4) || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleBookNow = (bikeId) => {
    const params = new URLSearchParams();
    if (urlStart) params.set("start", urlStart);
    if (urlEnd) params.set("end", urlEnd);

    // Redirect to booking page
    navigate(`/book/${bikeId}?${params.toString()}`);
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gradient-sunset mb-2">
              Featured Rides
            </h2>
            <p className="text-muted-foreground">
              Top-rated bikes ready for your next adventure
            </p>
          </div>
          <Button
            variant="ghost"
            className="text-primary hover:text-primary/80 group"
            onClick={() => navigate("/catalog")}
          >
            See All Bikes
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 w-full rounded-2xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {featuredBikes.map((bike) => (
              <motion.div
                key={bike._id}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-golden transition-all cursor-pointer"
                onClick={() => handleBookNow(bike._id)} // Clicking the card also triggers handleBookNow
              >
                {/* Image Container */}
                <div className="relative h-48 bg-muted overflow-hidden">
                  {bike.image_url ? (
                    <img
                      src={bike.image_url}
                      alt={bike.model}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Bike className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                 
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {bike.model}
                      </h3>
                      <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                        {bike.cc}cc
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Shield className="w-3 h-3 text-green-500" />
                      {bike.number_plate}
                    </p>
                  </div>

                  {/* Pricing */}
                  <div className="flex items-center justify-between mb-4 p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-1 text-primary">
                      <IndianRupee className="w-3 h-3" />
                      <span className="font-bold text-base">
                        {bike.price_per_hour}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        /hr
                      </span>
                    </div>
                    <div className="w-px h-4 bg-border" />
                    <div className="flex items-center gap-1 text-secondary">
                      <IndianRupee className="w-3 h-3" />
                      <span className="font-bold text-base">
                        {bike.price_per_day}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        /day
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={(e) => {
                      e.stopPropagation(); // Stop card click from firing
                      handleBookNow(bike._id);
                    }}
                    className="w-full gradient-sunset text-primary-foreground font-medium"
                    disabled={bike.status !== "available"}
                  >
                    {bike.status === "available" ? (
                      <>
                        Book Now
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    ) : (
                      "Unavailable"
                    )}
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default FeaturedBikes;
