import { useMemo, useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { useBookings } from "../../hooks/useBooking";
import { useBikes } from "../../hooks/useBikes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/Dialog";
import { Badge } from "../../components/ui/Badge";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
  parseISO,
} from "date-fns";
import {
  Bike,
  Calendar,
  User,
  Phone,
  Clock,
  IndianRupee,
  Globe,
  CheckCircle2,
  AlertCircle,
  Timer,
  Wrench,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { cn } from "../../utils/utils";

const statusColors = {
  pending: "#EAB308",
  confirmed: "#3B82F6",
  active: "#22C55E",
  completed: "#6B7280",
  cancelled: "#EF4444",
};

const statusIcons = {
  pending: Timer,
  confirmed: CheckCircle2,
  active: Bike,
  completed: CheckCircle2,
  cancelled: AlertCircle,
};

export default function Scheduler() {
  const { data: bookings } = useBookings();
  const { data: bikes } = useBikes();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [dayBookings, setDayBookings] = useState([]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get the day of week for the first day (0 = Sunday)
  const startDayOfWeek = monthStart.getDay();
  const paddingDays = Array(startDayOfWeek).fill(null);

  // Map bookings to days
  const bookingsByDay = useMemo(() => {
    if (!bookings) return new Map();

    const map = new Map();

    bookings
      .filter((b) => b.status !== "cancelled")
      .forEach((booking) => {
        const start = parseISO(booking.start_datetime);
        const end = parseISO(booking.end_datetime);

        // Add booking to each day it spans
        const days = eachDayOfInterval({ start, end });
        days.forEach((day) => {
          const key = format(day, "yyyy-MM-dd");
          const existing = map.get(key) || [];
          if (!existing.find((b) => b._id === booking._id)) {
            existing.push({
              id: booking._id,
              status: booking.status,
              bike_model: booking.bikes?.model || "Unknown",
              customer_name: booking.customers?.name || "Unknown",
              customer_phone: booking.customers?.phone || "",
              bike_plate: booking.bikes?.number_plate || "",
              start: booking.start_datetime,
              end: booking.end_datetime,
              amount: booking.total_amount || 0,
              source: booking.booking_source,
            });
          }
          map.set(key, existing);
        });
      });

    return map;
  }, [bookings]);

  const handleDayClick = (day) => {
    const key = format(day, "yyyy-MM-dd");
    const bookingsForDay = bookingsByDay.get(key) || [];
    setSelectedDay(day);
    setDayBookings(bookingsForDay);
  };

  const handleBookingClick = (booking) => {
    setSelectedEvent({
      id: booking._id,
      customer_name: booking.customer_name,
      customer_phone: booking.customer_phone,
      bike_model: booking.bike_model,
      bike_plate: booking.bike_plate,
      start: parseISO(booking.start),
      end: parseISO(booking.end),
      status: booking.status,
      amount: booking.amount,
      source: booking.source,
    });
    setSelectedDay(null);
  };

  // Fleet overview
  const fleetStatus = useMemo(() => {
    if (!bikes) return { available: 0, booked: 0, maintenance: 0 };
    return {
      available: bikes.filter((b) => b.status === "available").length,
      booked: bikes.filter((b) => b.status === "booked").length,
      maintenance: bikes.filter((b) => b.status === "maintenance").length,
    };
  }, [bikes]);

  const StatusIcon = selectedEvent
    ? statusIcons[selectedEvent.status] || Timer
    : Timer;

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-display text-gradient-sunset">
            Scheduler
          </h1>
          <p className="text-muted-foreground">
            Visual booking calendar & fleet overview
          </p>
        </div>

        {/* Fleet Status Cards */}
        <div className="flex flex-wrap items-center gap-3">
          <Card className="border-green-500/30 bg-green-500/10 backdrop-blur-sm">
            <CardContent className="flex items-center gap-3 p-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Available</p>
                <p className="text-xl font-bold text-green-500">
                  {fleetStatus.available}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-500/30 bg-red-500/10 backdrop-blur-sm">
            <CardContent className="flex items-center gap-3 p-3">
              <div className="p-2 rounded-lg bg-red-500/20">
                <Bike className="w-4 h-4 text-red-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Booked</p>
                <p className="text-xl font-bold text-red-500">
                  {fleetStatus.booked}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-500/30 bg-yellow-500/10 backdrop-blur-sm">
            <CardContent className="flex items-center gap-3 p-3">
              <div className="p-2 rounded-lg bg-yellow-500/20">
                <Wrench className="w-4 h-4 text-yellow-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Maintenance</p>
                <p className="text-xl font-bold text-yellow-500">
                  {fleetStatus.maintenance}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Status Legend */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-6">
            <span className="text-sm font-medium text-muted-foreground">
              Booking Status:
            </span>
            {Object.entries(statusColors)
              .filter(([key]) => key !== "cancelled")
              .map(([status, color]) => (
                <div key={status} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full shadow-lg"
                    style={{
                      backgroundColor: color,
                      boxShadow: `0 0 8px ${color}40`,
                    }}
                  />
                  <span className="text-sm capitalize text-foreground/80">
                    {status}
                  </span>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom Calendar */}
      <Card className="border-border/50 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="hover:bg-muted"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h2 className="text-xl font-semibold text-foreground">
              {format(currentMonth, "MMMM yyyy")}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="hover:bg-muted"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-muted-foreground py-2"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {paddingDays.map((_, index) => (
              <div key={`pad-${index}`} className="aspect-square" />
            ))}

            {daysInMonth.map((day) => {
              const key = format(day, "yyyy-MM-dd");
              const dayBookingsList = bookingsByDay.get(key) || [];
              const hasBookings = dayBookingsList.length > 0;
              const today = isToday(day);

              return (
                <button
                  key={key}
                  onClick={() => handleDayClick(day)}
                  className={cn(
                    "aspect-square p-1 rounded-lg transition-all duration-200 flex flex-col items-center justify-start gap-1 hover:bg-muted/80 relative",
                    today &&
                      "ring-2 ring-primary ring-offset-2 ring-offset-background",
                    !isSameMonth(day, currentMonth) && "opacity-40",
                  )}
                >
                  <span
                    className={cn(
                      "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full",
                      today && "bg-primary text-primary-foreground",
                    )}
                  >
                    {format(day, "d")}
                  </span>

                  {hasBookings && (
                    <div className="flex flex-wrap gap-0.5 justify-center max-w-full">
                      {dayBookingsList.slice(0, 4).map((booking, idx) => (
                        <div
                          key={`${booking._id}-${idx}`}
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: statusColors[booking.status],
                            boxShadow: `0 0 4px ${statusColors[booking.status]}60`,
                          }}
                        />
                      ))}
                      {dayBookingsList.length > 4 && (
                        <span className="text-[10px] text-muted-foreground">
                          +{dayBookingsList.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Day Bookings Dialog */}
      <Dialog open={!!selectedDay} onOpenChange={() => setSelectedDay(null)}>
        <DialogContent className="sm:max-w-md border-border/50 bg-card/95 backdrop-blur-xl">
          <DialogHeader className="pb-4 border-b border-border/50">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Calendar className="w-5 h-5 text-primary" />
              {selectedDay && format(selectedDay, "EEEE, MMMM d, yyyy")}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {dayBookings.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No bookings on this day
              </p>
            ) : (
              dayBookings.map((booking) => (
                <button
                  key={booking._id}
                  onClick={() => handleBookingClick(booking)}
                  className="w-full p-3 rounded-xl bg-muted/50 border border-border/50 hover:bg-muted transition-colors text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: statusColors[booking.status],
                        }}
                      />
                      <div>
                        <p className="font-medium text-foreground">
                          {booking.bike_model}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {booking.customer_name}
                        </p>
                      </div>
                    </div>
                    <Badge
                      className="capitalize text-white border-0"
                      style={{ backgroundColor: statusColors[booking.status] }}
                    >
                      {booking.status}
                    </Badge>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {format(parseISO(booking.start), "h:mm a")} -{" "}
                    {format(parseISO(booking.end), "h:mm a")}
                  </div>
                </button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Event Details Dialog */}
      <Dialog
        open={!!selectedEvent}
        onOpenChange={() => setSelectedEvent(null)}
      >
        <DialogContent className="sm:max-w-md border-border/50 bg-card/95 backdrop-blur-xl">
          <DialogHeader className="pb-4 border-b border-border/50">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Calendar className="w-5 h-5 text-primary" />
              Booking Details
            </DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-5 pt-2">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20">
                  <Bike className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-lg text-foreground">
                    {selectedEvent.bike_model}
                  </p>
                  <p className="text-muted-foreground font-mono">
                    {selectedEvent.bike_plate}
                  </p>
                </div>
                <Badge
                  className="flex items-center gap-1.5 px-3 py-1.5 text-white border-0 shadow-lg"
                  style={{
                    backgroundColor: statusColors[selectedEvent.status],
                    boxShadow: `0 4px 12px ${statusColors[selectedEvent.status]}40`,
                  }}
                >
                  <StatusIcon className="w-3.5 h-3.5" />
                  <span className="capitalize">{selectedEvent.status}</span>
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border/50">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Customer</p>
                    <p className="font-medium truncate text-foreground">
                      {selectedEvent.customer_name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border/50">
                  <div className="p-2 rounded-lg bg-secondary/10">
                    <Phone className="w-4 h-4 text-secondary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="font-medium truncate text-foreground">
                      {selectedEvent.customer_phone || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-green-500 font-medium">
                      Start
                    </span>
                  </div>
                  <p className="font-semibold text-foreground">
                    {format(new Date(selectedEvent.start), "MMM d, yyyy")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(selectedEvent.start), "h:mm a")}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-red-500" />
                    <span className="text-xs text-red-500 font-medium">
                      End
                    </span>
                  </div>
                  <p className="font-semibold text-foreground">
                    {format(new Date(selectedEvent.end), "MMM d, yyyy")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(selectedEvent.end), "h:mm a")}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 border border-primary/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <IndianRupee className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Total Amount
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      ₹{selectedEvent.amount?.toLocaleString() || 0}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 justify-end mb-1">
                    <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Source
                    </span>
                  </div>
                  <Badge variant="outline" className="capitalize font-medium">
                    {selectedEvent.source}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
