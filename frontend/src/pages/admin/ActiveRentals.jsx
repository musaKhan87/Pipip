import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/Badge";
import {
  Bike,
  Clock,
  User,
  Phone,
  Calendar,
  Search,
  ChevronRight,
  Timer,
  AlertCircle,
} from "lucide-react";
import {
  format,
  formatDistanceToNow,
  differenceInMinutes,
  isAfter,
} from "date-fns";
import { Input } from "../../components/ui/Input";
import { useBookings } from "../../hooks/useBooking";
import { useBikes } from "../../hooks/useBikes";

export default function ActiveRentals() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBike, setSelectedBike] = useState(null);

  const { data: allBookings } = useBookings();
  const { data: bikes } = useBikes();

  // Get all active and confirmed bookings (current and upcoming)
  const activeBookings =
    allBookings?.filter(
      (b) => b.status === "active" || b.status === "confirmed",
    ) || [];

  // Group bookings by bike
  
   // Change this section:
const bookingsByBike = bikes?.reduce((acc, bike) => {
  const bikeBookings = activeBookings
    .filter((b) => {
      // Use String() to ensure ID comparison works regardless of type
      // Also handle cases where bike_id might be populated or just an ID string
      const bId = b.bike_id?._id || b.bike_id;
      return String(bId) === String(bike._id);
    })
    .sort((a, b) => new Date(a.start_datetime) - new Date(b.start_datetime));

  if (bikeBookings.length > 0) {
    acc[bike._id] = { bike, bookings: bikeBookings };
  }
  return acc;
}, {}) || {};

  // Filter based on search
  const filteredBikes = Object.entries(bookingsByBike).filter(([_, data]) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      data.bike.model.toLowerCase().includes(query) ||
      data.bike.number_plate.toLowerCase().includes(query) ||
      data.bookings.some(
        (b) =>
          b.customers?.name?.toLowerCase().includes(query) ||
          b.customers?.phone?.includes(query),
      )
    );
  });

  const getBookingStatus = (booking) => {
    const now = new Date();
    const start = new Date(booking.start_datetime);
    const end = new Date(booking.end_datetime);

    if (booking.status === "active") {
      const minutesLeft = differenceInMinutes(end, now);
      if (minutesLeft <= 30 && minutesLeft > 0) {
        return {
          status: "ending-soon",
          label: "Ending Soon",
          color: "bg-amber-500",
        };
      } else if (minutesLeft <= 0) {
        return { status: "overdue", label: "Overdue", color: "bg-red-500" };
      }
      return { status: "active", label: "Active", color: "bg-green-500" };
    }
    return { status: "upcoming", label: "Upcoming", color: "bg-blue-500" };
  };

  const getTimeRemaining = (endDatetime) => {
    const end = new Date(endDatetime);
    const now = new Date();

    if (isAfter(now, end)) {
      return `Overdue by ${formatDistanceToNow(end)}`;
    }
    return `${formatDistanceToNow(end, { addSuffix: true })}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display text-gradient-sunset">
            Active Rentals
          </h1>
          <p className="text-muted-foreground">
            View all bikes currently on rent with booking timeline
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-lg py-2 px-4">
            <Bike className="w-5 h-5 mr-2 text-primary" />
            {filteredBikes.length} Bikes on Rent
          </Badge>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by bike, customer, phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Bikes on Rent Grid */}
      <div className="grid gap-6">
        {/* Replace the entire {filteredBikes.length === 0 ? ... } block with this: */}
        {filteredBikes.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Bike className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No bikes currently on rent
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredBikes.map(([bikeId, data], index) => (
            <motion.div
              key={bikeId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className={`overflow-hidden transition-all hover:shadow-lg ${
                  selectedBike === bikeId ? "ring-2 ring-primary" : ""
                }`}
              >
                <CardHeader
                  className="bg-muted/50 border-b border-border p-3 sm:p-4 cursor-pointer"
                  onClick={() =>
                    setSelectedBike(selectedBike === bikeId ? null : bikeId)
                  }
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      {data.bike.image_url ? (
                        <img
                          src={data.bike.image_url}
                          alt={data.bike.model}
                          className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-muted flex items-center justify-center shrink-0">
                          <Bike className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <CardTitle className="text-sm sm:text-xl truncate">
                          {data.bike.model}
                        </CardTitle>
                        <p className="text-[10px] sm:text-sm text-muted-foreground truncate font-mono">
                          {data.bike.number_plate} • {data.bike.cc}cc
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge className="bg-primary text-primary-foreground text-[10px] sm:text-xs">
                        {data.bookings.length} Book
                      </Badge>
                      <ChevronRight
                        className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${
                          selectedBike === bikeId ? "rotate-90" : ""
                        }`}
                      />
                    </div>
                  </div>
                </CardHeader>

                {/* LOGIC FIX: Wrapped in selectedBike check so it actually expands/collapses */}
                {selectedBike === bikeId && (
                  <CardContent className="p-0 border-t border-border">
                    <div className="divide-y divide-border">
                      {data.bookings.map((booking, bookingIndex) => {
                        const statusInfo = getBookingStatus(booking);

                        return (
                          <motion.div
                            key={booking._id}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="p-3 sm:p-4 hover:bg-muted/30 transition-colors"
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`w-3 h-3 mt-1 rounded-full shrink-0 ${statusInfo.color}`}
                              />

                              {/* Responsive Grid: 1 col on S8, 4 col on desktop */}
                              <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-4">
                                <div className="min-w-0">
                                  <p className="text-[10px] text-muted-foreground uppercase">
                                    Customer
                                  </p>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <User className="w-3.5 h-3.5 text-primary shrink-0" />
                                    <span className="text-sm font-medium truncate">
                                      {booking.customers?.name}
                                    </span>
                                  </div>
                                  <a
                                    href={`tel:${booking.customers?.phone}`}
                                    className="flex items-center gap-2 mt-1 text-xs text-muted-foreground hover:text-primary"
                                  >
                                    <Phone className="w-3 h-3 shrink-0" />
                                    {booking.customers?.phone}
                                  </a>
                                </div>

                                <div>
                                  <p className="text-[10px] text-muted-foreground uppercase">
                                    Ends At
                                  </p>
                                  <div className="flex items-center gap-2 mt-0.5 text-xs">
                                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                                    <span>
                                      {format(
                                        new Date(booking.end_datetime),
                                        "MMM d, h:mm a",
                                      )}
                                    </span>
                                  </div>
                                </div>

                                <div>
                                  <p className="text-[10px] text-muted-foreground uppercase">
                                    Status
                                  </p>
                                  <Badge
                                    className={`${statusInfo.color} text-[10px] text-white mt-1 h-5`}
                                  >
                                    {statusInfo.label}
                                  </Badge>
                                </div>

                                <div className="sm:text-right">
                                  <p className="text-[10px] text-muted-foreground uppercase">
                                    Total Amount
                                  </p>
                                  <p className="text-base sm:text-lg font-bold text-primary">
                                    ₹{booking.total_amount?.toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {(statusInfo.status === "ending-soon" ||
                              statusInfo.status === "overdue") && (
                              <div
                                className={`mt-3 p-2 rounded-lg flex items-center gap-2 text-[11px] sm:text-xs ${
                                  statusInfo.status === "overdue"
                                    ? "bg-red-500/10 text-red-500"
                                    : "bg-amber-500/10 text-amber-500"
                                }`}
                              >
                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                <span>
                                  {statusInfo.status === "overdue"
                                    ? "Contact customer immediately!"
                                    : "Ending soon."}
                                </span>
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </CardContent>
                )}
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
