import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/Select";
import {
  useBookingStats,
  useBikeRevenueReport,
  useIdleBikesReport,
  useDailyRevenueReport,
} from "../../hooks/useReports";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  Download,
  TrendingUp,
  Bike,
  DollarSign,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { format, startOfMonth, endOfMonth } from "date-fns";

const COLORS = ["#F97316", "#3B82F6", "#22C55E", "#EAB308", "#8B5CF6"];

export default function Reports() {
  const [period, setPeriod] = useState("month");
  const [revenueDays, setRevenueDays] = useState(30);

  // Data fetching using our MERN hooks
  const { data: stats } = useBookingStats(period);
  const { data: bikeRevenue } = useBikeRevenueReport(
    startOfMonth(new Date()),
    endOfMonth(new Date()),
  );
  const { data: idleBikes } = useIdleBikesReport();
  const { data: dailyRevenue } = useDailyRevenueReport(revenueDays);

  // Prepare data for Pie Chart
  const bookingStatusData = stats
    ? [
        {
          name: "Completed",
          value: stats.completed_bookings,
          color: "#22C55E",
        },
        { name: "Active", value: stats.active_bookings, color: "#3B82F6" },
        { name: "Pending", value: stats.pending_bookings, color: "#EAB308" },
        {
          name: "Cancelled",
          value: stats.cancelled_bookings,
          color: "#EF4444",
        },
      ].filter((d) => d.value > 0)
    : [];

  // Prepare data for Bar Chart (MERN uses _id for bike grouping)
  const bikeRevenueData =
    bikeRevenue?.slice(0, 10).map((b) => ({
      name: b.model?.substring(0, 15) || "Unknown",
      revenue: b.total_revenue,
      bookings: b.total_bookings,
    })) || [];

  const exportCSV = () => {
    if (!bikeRevenue) return;

    const headers = [
      "Bike Model",
      "Number Plate",
      "Total Bookings",
      "Total Revenue",
      "Total Hours",
    ];
    const rows = bikeRevenue.map((b) => [
      b.model,
      b.number_plate,
      b.total_bookings,
      b.total_revenue,
      b.total_hours?.toFixed(1),
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bike-revenue-report-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display text-gradient-sunset">
            Reports
          </h1>
          <p className="text-muted-foreground">
            Business analytics and insights
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={(v) => setPeriod(v)}>
            <SelectTrigger className="w-40 bg-card">
              <SelectValue placeholder="Select Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={exportCSV}
            className="border-primary/20 hover:bg-primary/10"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Bookings",
            value: stats?.total_bookings,
            icon: Calendar,
            color: "bg-blue-500/10 text-blue-500",
          },
          {
            label: "Revenue",
            value: `₹${stats?.total_revenue?.toLocaleString()}`,
            icon: DollarSign,
            color: "bg-green-500/10 text-green-500",
          },
          {
            label: "Completion Rate",
            value: `${stats?.total_bookings ? Math.round((stats.completed_bookings / stats.total_bookings) * 100) : 0}%`,
            icon: TrendingUp,
            color: "bg-purple-500/10 text-purple-500",
          },
          {
            label: "Idle Bikes",
            value: idleBikes?.length,
            icon: AlertTriangle,
            color: "bg-yellow-500/10 text-yellow-500",
          },
        ].map((card, i) => (
          <Card key={i} className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{card.label}</p>
                  <p className="text-3xl font-bold text-foreground">
                    {card.value || 0}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${card.color}`}>
                  <card.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Line Chart */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-foreground text-lg">
              Revenue Trend
            </CardTitle>
            <Select
              value={revenueDays.toString()}
              onValueChange={(v) => setRevenueDays(parseInt(v))}
            >
              <SelectTrigger className="w-32 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="14">Last 14 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
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
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#F97316"
                  strokeWidth={3}
                  dot={{ fill: "#F97316", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Booking Distribution Pie Chart */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground text-lg">
              Booking Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={bookingStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {bookingStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Horizontal Bar Chart for Bike Revenue */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground text-lg">
            Top 10 Performing Bikes (This Month)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {bikeRevenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={bikeRevenueData}
                layout="vertical"
                margin={{ left: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  horizontal={false}
                />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={120}
                  fontSize={12}
                  stroke="hsl(var(--foreground))"
                />
                <Tooltip
                  cursor={{ fill: "hsl(var(--muted)/0.2)" }}
                  formatter={(value) => [`₹${value}`, "Revenue"]}
                />
                <Bar
                  dataKey="revenue"
                  fill="#F97316"
                  radius={[0, 4, 4, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground italic">
              No revenue data available for this period
            </div>
          )}
        </CardContent>
      </Card>

      {/* Idle Bikes Alert List */}
      {idleBikes && idleBikes.length > 0 && (
        <Card className="border-yellow-500/50 bg-yellow-500/5 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-yellow-600 dark:text-yellow-500 text-lg">
              <AlertTriangle className="w-5 h-5" />
              Inventory Optimization: Idle Bikes (30+ Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {idleBikes.map((bike) => (
                <div
                  key={bike._id}
                  className="flex items-center gap-3 p-3 bg-card rounded-lg border border-yellow-500/20 shadow-sm"
                >
                  <div className="p-2 bg-yellow-500/10 rounded-full">
                    <Bike className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {bike.model}
                    </p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                      {bike.number_plate}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
