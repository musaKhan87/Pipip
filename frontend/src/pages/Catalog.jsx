import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bike,
  IndianRupee,
  MapPin,
  Gauge,
  Star,
  Zap,
  Shield,
  ArrowRight,
  Grid,
  List,
  Filter,
} from "lucide-react";

import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/Select";
import { Skeleton } from "../components/ui/Skeleton";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { useBikes } from "../hooks/useBikes";
import { useActiveAreas } from "../hooks/useAreas";

const Catalog = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const urlAreaId = searchParams.get("area");
  const urlStart = searchParams.get("start");
  const urlEnd = searchParams.get("end");

  const [selectedArea, setSelectedArea] = useState("all");
  const [ccFilter, setCcFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [initialized, setInitialized] = useState(false);
  const [hoveredBike, setHoveredBike] = useState(null);

  const { data: bikes, isLoading: bikesLoading } = useBikes();
  const { data: areas } = useActiveAreas();

  useEffect(() => {
    if (!initialized && areas && areas.length > 0) {
      if (urlAreaId && areas.some((a) => a._id === urlAreaId)) {
        setSelectedArea(urlAreaId);
      }
      setInitialized(true);
    }
  }, [urlAreaId, areas, initialized]);

  const getAreaName = (areaId) => {
    if (!areaId || !areas) return null;
    const area = areas.find((a) => a._id === areaId);
    return area ? area.name : null;
  };

  // Add useMemo to your imports
  const filteredBikes = useMemo(() => {
    return (
      bikes?.filter((bike) => {
        const areaMatch =
          selectedArea === "all" ||
          String(bike.area_id) === String(selectedArea);

        const ccMatch =
          ccFilter === "all" ||
          (ccFilter === "under125" && bike.cc <= 125) ||
          (ccFilter === "125to150" && bike.cc > 125 && bike.cc <= 150) ||
          (ccFilter === "above150" && bike.cc > 150);

        const statusMatch =
          statusFilter === "all" || bike.status === statusFilter;

        return areaMatch && ccMatch && statusMatch;
      }) || []
    );
  }, [bikes, selectedArea, ccFilter, statusFilter]); // Only re-run when filters change

  const handleBookNow = (bikeId) => {
    const params = new URLSearchParams();
    if (urlStart) params.set("start", urlStart);
    if (urlEnd) params.set("end", urlEnd);
    if (selectedArea !== "all") params.set("area", selectedArea);

    navigate(`/book/${bikeId}?${params.toString()}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 120, damping: 16 },
    },
  };
  return (
    <div className="min-h-screen bg-background pt-[60px]">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-4"
            >
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Full Catalog
              </span>
            </motion.div>
            <h1 className="font-display text-4xl md:text-5xl text-gradient-sunset mb-4">
              Bike Catalog
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Browse our complete collection of scooters and bikes available for
              rent
            </p>
          </motion.div>

          {/* Filters Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card/80 backdrop-blur-md border border-border rounded-2xl p-6 mb-10 shadow-golden"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Area Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    Location
                  </label>
                  <Select
                    key={selectedArea}
                    value={selectedArea}
                    onValueChange={setSelectedArea}
                  >
                    <SelectTrigger className="bg-input border-border h-12">
                      <SelectValue placeholder="All Areas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Areas</SelectItem>
                      {areas?.map((area) => (
                        <SelectItem key={area._id} value={area._id}>
                          {area.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* CC Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-secondary" />
                    Engine Size
                  </label>
                  <Select value={ccFilter} onValueChange={setCcFilter}>
                    <SelectTrigger className="bg-input border-border h-12">
                      <SelectValue placeholder="All CC" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All CC</SelectItem>
                      <SelectItem value="under125">Up to 125cc</SelectItem>
                      <SelectItem value="125to150">125cc - 150cc</SelectItem>
                      <SelectItem value="above150">Above 150cc</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Status Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Filter className="w-4 h-4 text-accent" />
                    Status
                  </label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="bg-input border-border h-12">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="booked">On Rent</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* View Toggle & Count */}
              <div className="flex items-end gap-4">
                <div className="flex bg-muted rounded-lg p-1">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className={viewMode === "grid" ? "gradient-sunset" : ""}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={viewMode === "list" ? "gradient-sunset" : ""}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
                <div className="h-12 px-4 bg-muted/50 rounded-lg flex items-center border border-border">
                  <span className="text-muted-foreground whitespace-nowrap">
                    {bikesLoading
                      ? "Loading..."
                      : `${filteredBikes.length} bikes`}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bikes Display */}
          {bikesLoading ? (
            <div
              className={`grid ${
                viewMode === "grid"
                  ? "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              } gap-6`}
            >
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-card border border-border rounded-2xl overflow-hidden"
                >
                  <Skeleton className="h-48 w-full" />
                  <div className="p-5">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredBikes.length === 0 ? (
            <motion.div className="text-center py-16">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Bike className="w-20 h-20 text-muted-foreground mx-auto mb-4" />
              </motion.div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No Bikes Found
              </h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your filters
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedArea("all");
                  setCcFilter("all");
                  setStatusFilter("all");
                }}
                className="border-primary text-primary hover:bg-primary/10"
              >
                Clear Filters
              </Button>
            </motion.div>
          ) : (
            <motion.div
              className={`grid ${
                viewMode === "grid"
                  ? "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              } gap-6`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence initial={false}>
                {filteredBikes.map((bike) => (
                  <motion.div
                    key={bike._id}
                    
                    onMouseEnter={() => setHoveredBike(bike._id)}
                    onMouseLeave={() => setHoveredBike(null)}
                    className={`group relative bg-card border border-border rounded-2xl overflow-hidden cursor-pointer transition-shadow ${
                      viewMode === "list" ? "flex" : ""
                    } hover:shadow-golden hover:border-primary/50`}
                    whileHover={{ y: -8 }}
                    onClick={() =>
                      bike.status === "available" && handleBookNow(bike._id)
                    }
                  >
                    {/* Image */}
                    <div
                      className={`relative ${
                        viewMode === "list" ? "w-48 h-36" : "h-48"
                      } bg-muted overflow-hidden`}
                    >
                      {bike.image_url ? (
                        <motion.img
                          src={bike.image_url}
                          alt={bike.model}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.4 }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                          <Bike className="w-16 h-16 text-muted-foreground" />
                        </div>
                      )}

                      {/* Status Badge */}
                      <div className="absolute top-3 right-3">
                        <Badge
                          className={`${
                            bike.status === "available"
                              ? "bg-green-500/90 text-white"
                              : bike.status === "booked"
                              ? "bg-red-500/90 text-white"
                              : "bg-amber-500/90 text-white"
                          }`}
                        >
                          {bike.status === "available"
                            ? "Available"
                            : bike.status === "booked"
                            ? "On Rent"
                            : "Maintenance"}
                        </Badge>
                      </div>

                      {/* Area Badge */}
                      {getAreaName(bike.area_id) && (
                        <div className="absolute bottom-3 left-3">
                          <Badge
                            variant="secondary"
                            className="bg-card/90 backdrop-blur-sm text-foreground"
                          >
                            <MapPin className="w-3 h-3 mr-1" />
                            {getAreaName(bike.area_id)}
                          </Badge>
                        </div>
                      )}

                     
                    </div>

                    {/* Info */}
                    <div
                      className={`p-5 ${
                        viewMode === "list"
                          ? "flex-1 flex flex-col justify-between"
                          : ""
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                            {bike.model}
                          </h3>
                          <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                            {bike.cc}cc
                          </span>
                        </div>

                        <p className="text-sm text-muted-foreground mb-4 flex items-center gap-2">
                          <Shield className="w-3 h-3 text-green-500" />
                          {bike.number_plate}
                        </p>
                      </div>

                      {/* Pricing */}
                      <div className="flex items-center justify-between mb-4 p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-1 text-primary">
                          <IndianRupee className="w-4 h-4" />
                          <span className="font-bold text-lg">
                            {bike.price_per_hour}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            /hr
                          </span>
                        </div>
                        <div className="w-px h-6 bg-border" />
                        <div className="flex items-center gap-1 text-secondary">
                          <IndianRupee className="w-4 h-4" />
                          <span className="font-bold text-lg">
                            {bike.price_per_day}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            /day
                          </span>
                        </div>
                      </div>

                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
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
                        ) : bike.status === "booked" ? (
                          "Currently On Rent"
                        ) : (
                          "Under Maintenance"
                        )}
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Catalog;
