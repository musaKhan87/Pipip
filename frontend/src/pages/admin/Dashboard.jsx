import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import {
  useBookingStats,
  useDailyRevenueReport,
  useIdleBikesReport,
  useActiveBookingsEndingSoon,
} from "../../hooks/useReports";
import { useBookings } from "../../hooks/useBooking";
import { useBikes } from "../../hooks/useBikes";
import {
  Bike,
  Calendar,
  DollarSign,
  Clock,
  AlertTriangle,
  TrendingUp,
  Bell,
  Timer,
  Phone,
} from "lucide-react";
import { format } from "date-fns";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  active: "bg-green-100 text-green-800",
  completed: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function Dashboard() {
  const navigate = useNavigate();

  // Data fetching
  const { data: stats } = useBookingStats("month");
  const { data: todayStats } = useBookingStats("today");
  const { data: recentBookings } = useBookings();
  const { data: bikes } = useBikes();
  const { data: idleBikes } = useIdleBikesReport();
  const { data: dailyRevenue } = useDailyRevenueReport(14);
  const { data: expiringBookings } = useActiveBookingsEndingSoon();

  // Fleet logic
  const availableBikes =
    bikes?.filter((b) => b.status === "available").length || 0;
  const bookedBikes = bikes?.filter((b) => b.status === "booked").length || 0;
  const maintenanceBikes =
    bikes?.filter((b) => b.status === "maintenance").length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display text-gradient-sunset">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back! Here's your rental overview.
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          {format(new Date(), "EEEE, MMMM d, yyyy")}
        </p>
      </div>

      {/* Expiring Bookings Alert - Live Notification Logic */}
      <AnimatePresence>
        {expiringBookings && expiringBookings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="border-orange-300 bg-orange-50 dark:bg-orange-950/20 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      repeatDelay: 2,
                    }}
                  >
                    <Bell className="w-5 h-5" />
                  </motion.div>
                  Bookings Ending Soon
                  <Badge className="bg-orange-500 text-white ml-2">
                    {expiringBookings.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {expiringBookings.slice(0, 5).map((booking, index) => (
                    <motion.div
                      key={booking._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center justify-between p-3 rounded-lg border shadow-sm ${
                        booking.minutesRemaining <= 30
                          ? "bg-red-50 dark:bg-red-900/20 border-red-200"
                          : "bg-white dark:bg-gray-800 border-orange-100"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            booking.minutesRemaining <= 30
                              ? "bg-red-200"
                              : "bg-orange-200"
                          }`}
                        >
                          <Timer
                            className={`w-4 h-4 ${
                              booking.minutesRemaining <= 30
                                ? "text-red-600"
                                : "text-orange-600"
                            }`}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {booking.bike_id?.model} —{" "}
                            {booking.bike_id?.number_plate}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Customer: {booking.customer_id?.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p
                            className={`font-bold ${
                              booking.minutesRemaining <= 30
                                ? "text-red-600"
                                : "text-orange-600"
                            }`}
                          >
                            {booking.minutesRemaining} min left
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Ends:{" "}
                            {format(new Date(booking.end_datetime), "h:mm a")}
                          </p>
                        </div>
                        <a
                          href={`tel:${booking.customer_id?.phone}`}
                          className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors shadow-md"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>
                {expiringBookings.length > 5 && (
                  <Button
                    variant="ghost"
                    className="w-full mt-2 text-orange-600 hover:bg-orange-100"
                    onClick={() =>
                      navigate("/admin/panel/bookings?status=active")
                    }
                  >
                    View all {expiringBookings.length} expiring bookings
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Total Bookings (Month)",
            val: stats?.total_bookings,
            icon: Calendar,
            gradient: "from-blue-500 to-blue-600",
          },
          {
            title: "Revenue (Month)",
            val: `₹${stats?.total_revenue?.toLocaleString()}`,
            icon: DollarSign,
            gradient: "from-green-500 to-green-600",
          },
          {
            title: "Active Bookings",
            val: stats?.active_bookings,
            icon: TrendingUp,
            gradient: "from-orange-500 to-orange-600",
          },
          {
            title: "Pending Approval",
            val: stats?.pending_bookings,
            icon: Clock,
            gradient: "from-purple-500 to-purple-600",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card
              className={`bg-gradient-to-br ${item.gradient} text-white border-0 shadow-lg`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-80">{item.title}</p>
                    <p className="text-3xl font-bold">{item.val || 0}</p>
                  </div>
                  <item.icon className="w-10 h-10 opacity-30" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Fleet and Revenue Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Bike className="w-5 h-5 text-primary" />
              Fleet Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  label: "Available",
                  count: availableBikes,
                  color: "bg-green-500",
                  bg: "bg-green-500/10",
                  text: "text-green-600",
                },
                {
                  label: "On Rent",
                  count: bookedBikes,
                  color: "bg-red-500",
                  bg: "bg-red-500/10",
                  text: "text-red-600",
                },
                {
                  label: "Maintenance",
                  count: maintenanceBikes,
                  color: "bg-yellow-500",
                  bg: "bg-yellow-500/10",
                  text: "text-yellow-600",
                },
              ].map((status, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-3 ${status.bg} rounded-lg`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${status.color}`} />
                    <span className="text-foreground">{status.label}</span>
                  </div>
                  <span className={`font-bold ${status.text}`}>
                    {status.count}
                  </span>
                </div>
              ))}
            </div>

            {idleBikes?.length > 0 && (
              <div className="mt-4 p-3 bg-orange-500/10 rounded-lg border border-orange-500/30">
                <div className="flex items-center gap-2 text-orange-500">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {idleBikes.length} bike(s) idle for 30+ days
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Revenue Trend Chart */}
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">
              Revenue Trend (Last 14 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={dailyRevenue || []}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tickFormatter={(val) => format(new Date(val), "MMM d")}
                  fontSize={12}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis fontSize={12} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  formatter={(value) => [`₹${value}`, "Revenue"]}
                  labelFormatter={(label) =>
                    format(new Date(label), "MMM d, yyyy")
                  }
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Activity and Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Today's Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  label: "New Bookings",
                  val: todayStats?.total_bookings,
                  color: "text-foreground",
                },
                {
                  label: "Completed",
                  val: todayStats?.completed_bookings,
                  color: "text-green-500",
                },
                {
                  label: "Pending",
                  val: todayStats?.pending_bookings,
                  color: "text-yellow-500",
                },
                {
                  label: "Revenue",
                  val: `₹${todayStats?.total_revenue || 0}`,
                  color: "text-green-600",
                },
              ].map((activity, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between border-b border-border pb-2 last:border-0"
                >
                  <span className="text-muted-foreground">
                    {activity.label}
                  </span>
                  <span className={`font-bold ${activity.color}`}>
                    {activity.val || 0}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Bookings List */}
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar ">
              {recentBookings?.slice(0, 5).map((booking) => (
                <div
                  key={booking._id}
                  className="flex items-center justify-between p-3 bg-muted/40 rounded-lg border border-border/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Bike className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {booking.customer_id?.name || "Walk-in"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {booking.bike_id?.model}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      className={`${statusColors[booking.status] || "bg-gray-100"} border-none`}
                    >
                      {booking.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {booking.start_datetime
                        ? format(
                            new Date(booking.start_datetime),
                            "MMM d, h:mm a",
                          )
                        : "N/A"}
                    </p>
                  </div>
                </div>
              ))}
              {(!recentBookings || recentBookings.length === 0) && (
                <div className="flex flex-col items-center justify-center py-8 opacity-50">
                  <Calendar className="w-8 h-8 mb-2" />
                  <p className="text-sm">No bookings recorded yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
