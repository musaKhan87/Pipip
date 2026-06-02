import { Outlet, Navigate, useLocation } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { Loader2 } from "lucide-react";
import { useAuth } from "../../utils/AuthProvider";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

// Determine the backend URL dynamically to support both local development and production
const getBackendUrl = () => {
  if (import.meta.env.VITE_BACKEND_URL) {
    return import.meta.env.VITE_BACKEND_URL;
  }
  return window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "https://pipip-backend.onrender.com";
};

const BACKEND_URL = getBackendUrl();

export default function AdminLayout() {
  const { user, isAdminOrStaff, loading } = useAuth();
  const location = useLocation();
  const scrollRef = useRef(null); // Create a reference to the scrollable area

  // Notification logs state persisted in localStorage
  const [logs, setLogs] = useState(() => {
    try {
      const savedLogs = localStorage.getItem("pipip_notifications");
      return savedLogs ? JSON.parse(savedLogs) : [
        {
          id: 1,
          title: "Pipip Cloud Live",
          message: "Real-time communication channels active and operational.",
          type: "system",
          read: true,
          time: "Active",
        },
      ];
    } catch (e) {
      console.error("Failed to load notifications from localStorage", e);
      return [
        {
          id: 1,
          title: "Pipip Cloud Live",
          message: "Real-time communication channels active and operational.",
          type: "system",
          read: true,
          time: "Active",
        },
      ];
    }
  });

  // Persist logs to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem("pipip_notifications", JSON.stringify(logs));
    } catch (e) {
      console.error("Failed to persist notifications to localStorage", e);
    }
  }, [logs]);

  // Global socket listener for new order alerts
  useEffect(() => {
    if (!user || !isAdminOrStaff) return;

    const socket = io(BACKEND_URL, {
      transports: ["websocket", "polling"],
      secure: BACKEND_URL.startsWith("https"),
      withCredentials: true,
    });

    socket.on("newOnlineOrderStream", (incomingAlert) => {
      const dynamicChimeSound = new Audio(
        "https://assets.mixkit.co/active_storage/sfx/2869/2869-600.wav",
      );
      dynamicChimeSound
        .play()
        .catch(() =>
          console.log(
            "Audio play blocked by browser sandbox until click gesture.",
          ),
        );

      setLogs((prev) => [
        { ...incomingAlert, id: Date.now(), read: false, time: "Just Now" },
        ...prev,
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, [user, isAdminOrStaff]);

  // Scroll to top whenever the path changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, 0);
    }
  }, [location.pathname]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin" state={{ from: "/admin/panel" }} replace />;
  }

  if (!isAdminOrStaff) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8 bg-card border border-border rounded-2xl shadow-golden max-w-md">
          <h2 className="text-2xl font-bold text-destructive mb-2">
            Access Denied
          </h2>
          <p className="text-muted-foreground mb-4">
            You don't have permission to access the admin panel. Please contact
            an administrator to get access.
          </p>
          <a href="/" className="text-primary hover:underline">
            Return to Website
          </a>
        </div>
      </div>
    );
  }

  const unreadCount = logs.filter((log) => !log.read).length;

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <AdminSidebar unreadCount={unreadCount} />

      <main
        className="flex-1 p-4 lg:p-8 overflow-y-auto h-full bg-background scrollbar-hide"
        ref={scrollRef}
      >
        <div className="max-w-7xl mx-auto">
          <Outlet context={{ logs, setLogs }} />
        </div>
      </main>
    </div>
  );
}
