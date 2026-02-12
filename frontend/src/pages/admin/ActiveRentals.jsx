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
                className={`overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
                  selectedBike === bikeId ? "ring-2 ring-primary" : ""
                }`}
                onClick={() =>
                  setSelectedBike(selectedBike === bikeId ? null : bikeId)
                }
              >
                <CardHeader className="bg-muted/50 border-b border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {data.bike.image_url ? (
                        <img
                          src={data.bike.image_url}
                          alt={data.bike.model}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                          <Bike className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-xl">
                          {data.bike.model}
                        </CardTitle>
                        <p className="text-muted-foreground">
                          {data.bike.number_plate} • {data.bike.cc}cc
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-primary text-primary-foreground">
                        {data.bookings.length} Booking
                        {data.bookings.length > 1 ? "s" : ""}
                      </Badge>
                      <ChevronRight
                        className={`w-5 h-5 text-muted-foreground transition-transform ${
                          selectedBike === bikeId ? "rotate-90" : ""
                        }`}
                      />
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {data.bookings.map((booking, bookingIndex) => {
                      const statusInfo = getBookingStatus(booking);

                      return (
                        <motion.div
                          key={booking._id}
                          initial={
                            selectedBike === bikeId
                              ? { opacity: 0, height: 0 }
                              : {}
                          }
                          animate={{ opacity: 1, height: "auto" }}
                          className="p-4 hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex flex-col items-center">
                              <div
                                className={`w-4 h-4 rounded-full ${statusInfo.color}`}
                              />
                              {bookingIndex < data.bookings.length - 1 && (
                                <div className="w-0.5 h-full bg-border mt-1" />
                              )}
                            </div>

                            <div className="flex-1 grid md:grid-cols-4 gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground mb-1">
                                  Customer
                                </p>
                                <div className="flex items-center gap-2">
                                  <User className="w-4 h-4 text-primary" />
                                  <span className="font-medium">
                                    {booking.customers?.name}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                  <Phone className="w-3 h-3" />
                                  <a
                                    href={`tel:${booking.customers?.phone}`}
                                    className="hover:text-primary"
                                  >
                                    {booking.customers?.phone}
                                  </a>
                                </div>
                              </div>

                              <div>
                                <p className="text-sm text-muted-foreground mb-1">
                                  Booking Period
                                </p>
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-secondary" />
                                  <span className="text-sm">
                                    {format(
                                      new Date(booking.start_datetime),
                                      "MMM d, h:mm a",
                                    )}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <Clock className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-sm">
                                    to{" "}
                                    {format(
                                      new Date(booking.end_datetime),
                                      "MMM d, h:mm a",
                                    )}
                                  </span>
                                </div>
                              </div>

                              <div>
                                <p className="text-sm text-muted-foreground mb-1">
                                  Status
                                </p>
                                <Badge
                                  className={`${statusInfo.color} text-white mb-1`}
                                >
                                  {statusInfo.label}
                                </Badge>
                                {booking.status === "active" && (
                                  <div className="flex items-center gap-1 text-sm mt-1">
                                    <Timer className="w-3 h-3" />
                                    <span
                                      className={
                                        statusInfo.status === "overdue"
                                          ? "text-red-500 font-medium"
                                          : statusInfo.status === "ending-soon"
                                            ? "text-amber-500 font-medium"
                                            : "text-muted-foreground"
                                      }
                                    >
                                      {getTimeRemaining(booking.end_datetime)}
                                    </span>
                                  </div>
                                )}
                              </div>

                              <div className="text-right">
                                <p className="text-sm text-muted-foreground mb-1">
                                  Amount
                                </p>
                                <p className="text-xl font-bold text-primary">
                                  ₹{booking.total_amount?.toLocaleString() || 0}
                                </p>
                              </div>
                            </div>
                          </div>

                          {(statusInfo.status === "ending-soon" ||
                            statusInfo.status === "overdue") && (
                            <div
                              className={`mt-3 ml-8 p-2 rounded-lg flex items-center gap-2 text-sm ${
                                statusInfo.status === "overdue"
                                  ? "bg-red-500/10 text-red-500"
                                  : "bg-amber-500/10 text-amber-500"
                              }`}
                            >
                              <AlertCircle className="w-4 h-4" />
                              {statusInfo.status === "overdue"
                                ? "This rental is overdue! Contact customer immediately."
                                : "Rental ending soon. Prepare for bike return."}
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>

                  <div className="p-4 bg-muted/30 border-t border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Bike will be free after:
                      </span>
                      <span className="font-medium text-foreground">
                        {format(
                          new Date(
                            data.bookings[data.bookings.length - 1]
                              .end_datetime,
                          ),
                          "MMM d, yyyy h:mm a",
                        )}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
