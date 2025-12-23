import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  User,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock3,
} from "lucide-react";
import axios from "axios";

import { Link } from "react-router-dom";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
const Admin = () => {
  const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
   

  /* ---------------- FETCH DATA ---------------- */

  const fetchSubmissions = async () => {
    try {
      const res = await axios.get(
        "https://pipip-backend.onrender.com/api/rentals/admin"
      );
      setSubmissions(res.data);
    } catch (error) {
      console.error("Failed to fetch rentals", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();

    const interval = setInterval(() => {
      fetchSubmissions();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  /* ---------------- STATUS UPDATE ---------------- */

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `https://pipip-backend.onrender.com/api/rentals/${id}/status`,
        {
          status,
        }
      );
      fetchSubmissions(); // refresh list
    } catch (error) {
      console.error("Status update failed", error);
    }
  };

  /* ---------------- HELPERS ---------------- */

  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <CheckCircle className="w-3 h-3 mr-1" /> Confirmed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            <Clock3 className="w-3 h-3 mr-1" /> Pending
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            <XCircle className="w-3 h-3 mr-1" /> Cancelled
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const stats = {
    total: submissions.length,
    confirmed: submissions.filter((s) => s.status === "confirmed").length,
    pending: submissions.filter((s) => s.status === "pending").length,
    cancelled: submissions.filter((s) => s.status === "cancelled").length,
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <h1 className="font-display text-2xl text-gradient-sunset">
                Pipip Admin
              </h1>
            </Link>
            <Badge
              variant="outline"
              className="border-secondary text-secondary"
            >
              Dashboard
            </Badge>
          </div>
          <Link to="/">
            <Button variant="glass" size="sm">
              Back to Website
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Bookings" value={stats.total} />
          <StatCard title="Confirmed" value={stats.confirmed} color="green" />
          <StatCard title="Pending" value={stats.pending} color="yellow" />
          <StatCard title="Cancelled" value={stats.cancelled} color="red" />
        </div>

        <h2 className="font-display text-3xl mb-6">Rental Submissions</h2>

        {loading ? (
          <p className="text-muted-foreground">Loading submissions...</p>
        ) : (
          <div className="space-y-4">
            {submissions.map((s, index) => (
              <motion.div
                key={s._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card border rounded-xl p-6"
              >
                <div className="flex flex-col lg:flex-row justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    <div className="flex gap-3 flex-wrap items-center">
                      <h3 className="text-xl font-bold flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" />
                        {s.name}
                      </h3>
                      {getStatusBadge(s.status)}
                      <Badge variant="outline">{s.duration}</Badge>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3 text-sm">
                      <div className="flex gap-2">
                        <Phone className="w-4 h-4" />
                        <a href={`tel:${s.phone}`}>{s.phone}</a>
                      </div>

                      {s.email && (
                        <div className="flex gap-2">
                          <Mail className="w-4 h-4" />
                          {s.email}
                        </div>
                      )}

                      <div className="flex gap-2">
                        <MapPin className="w-4 h-4" />
                        {s.pickupLocation}
                      </div>

                      <div className="flex gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(s.date).toLocaleDateString()}
                      </div>
                    </div>

                    {s.message && (
                      <div className="flex gap-2 bg-muted/30 p-3 rounded-lg">
                        <MessageSquare className="w-4 h-4 mt-1" />
                        <p className="text-sm">{s.message}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <div className="text-xs text-muted-foreground flex gap-2">
                      <Clock className="w-3 h-3" />
                      Submitted: {new Date(s.createdAt).toLocaleString()}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="teal"
                        onClick={() => updateStatus(s._id, "confirmed")}
                      >
                        Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(s._id, "cancelled")}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

/* ---------------- SMALL COMPONENT ---------------- */

const StatCard = ({ title, value, color }) => {
  const colors = {
    green: "text-green-400 border-green-500/30",
    yellow: "text-yellow-400 border-yellow-500/30",
    red: "text-red-400 border-red-500/30",
  };

  return (
    <div className={`bg-card border rounded-xl p-4 ${colors[color] || ""}`}>
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
};

export default Admin;
