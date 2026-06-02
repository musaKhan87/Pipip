import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Smartphone,
  ShieldCheck,
  Trash2,
  Check,
  Radio,
  Volume2,
  Layers,
  ArrowRight,
} from "lucide-react";
import axios from "axios";
import { useOutletContext, useNavigate } from "react-router-dom";
import { cn } from "../../utils/utils";
import { Button } from "../../components/ui/Button";

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


export default function NotificationsCenter() {
  const { logs, setLogs } = useOutletContext();
  const [deviceLinked, setDeviceLinked] = useState(false);
  const [linkingProcess, setLinkingProcess] = useState(false);
  const navigate = useNavigate();

  // VAPID Public Verification Key
  const VAPID_PUBLIC_KEY =
    "BMcdPJyGlZNqtAKuUfuzo21doY4i9M2TvRArzooJ3Mfo2-z_3y7Hyay20I_qdxhxrAZ1TJH8H5vf-nTE4mKa3kw";

  // Cryptographic string conversion parser
  function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, "+")
      .replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  useEffect(() => {
    // 1. Verify active push registrations in browser cache
    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg) {
          reg.pushManager.getSubscription().then((sub) => {
            if (sub) setDeviceLinked(true);
          });
        }
      });
    }
  }, []);

  // Handshake to request smartphone OS locks-screen visibility permissions
  const syncSmartDeviceNotificationChannels = async () => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      alert(
        "This mobile browser environment does not support system push background threads.",
      );
      return;
    }

    setLinkingProcess(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const authorizationStatus = await Notification.requestPermission();

      if (authorizationStatus !== "granted") {
        alert(
          "Notification permissions blocked. Check browser lock-icon privacy panel settings to grant access.",
        );
        setLinkingProcess(false);
        return;
      }

      let activeTokenSubscription =
        await registration.pushManager.getSubscription();
      if (!activeTokenSubscription) {
        activeTokenSubscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });
      }

      // Ship device endpoint token credentials safely up to our node endpoint routes
      await axios.post(
        `${BACKEND_URL}/api/notifications/subscribe`,
        activeTokenSubscription,
        { credentials: true },
      );

      setDeviceLinked(true);
      setLogs((prev) => [
        {
          id: Date.now(),
          title: "📱 Device Synced!",
          message:
            "WhatsApp-style smartphone lock screen push banners are now active for this browser.",
          type: "success",
          read: false,
          time: "Just Now",
        },
        ...prev,
      ]);
    } catch (error) {
      console.error("Device notification linkage sync down error:", error);
      alert("Could not register token endpoints with Express API.");
    } finally {
      setLinkingProcess(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* ========================================================================= */}
      {/* 🌅 PREMIUM HEADER BANNER (MATCHES SIDEBAR .gradient-sunset PARAMS) */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden rounded-2xl gradient-sunset p-6 text-primary-foreground shadow-golden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md border border-white/20">
            <Smartphone className="w-8 h-8 text-white animate-pulse" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight">
              Mobile Device Notification Interceptor
            </h2>
            <p className="text-white/80 text-sm mt-1 max-w-md">
              Receive high-priority WhatsApp-style sound banners directly on
              your smartphone screen the exact second a client books online.
            </p>
          </div>
        </div>

        <Button
          onClick={syncSmartDeviceNotificationChannels}
          disabled={linkingProcess || deviceLinked}
          className={cn(
            "w-full md:w-auto h-12 px-6 rounded-xl font-semibold transition-all duration-300 shadow-md flex items-center justify-center gap-2",
            deviceLinked
              ? "bg-white/10 text-white cursor-default border border-white/20 hover:bg-white/10 shadow-none"
              : "bg-white text-zinc-900 hover:bg-zinc-100 hover:scale-[1.02]",
          )}
        >
          {deviceLinked ? (
            <>
              <ShieldCheck className="w-5 h-5 text-white" /> Linked Active
            </>
          ) : linkingProcess ? (
            "Binding Handshakes..."
          ) : (
            <>
              <Radio className="w-4 h-4 text-rose-500 animate-ping" /> Link
              Admin Phone
            </>
          )}
        </Button>
      </div>

      {/* ========================================================================= */}
      {/* 📑 ALERT HISTORY HEADER COUNTERS CONTROLS */}
      {/* ========================================================================= */}
      <div className="flex justify-between items-center px-1">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
          <h3 className="font-display text-lg font-bold text-foreground">
            Alert History Stream
          </h3>
          {logs.filter((l) => !l.read).length > 0 && (
            <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse shadow-sm">
              {logs.filter((l) => !l.read).length} UNREAD
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 text-xs font-medium">
          <button
            onClick={() =>
              setLogs((prev) => prev.map((l) => ({ ...l, read: true })))
            }
            className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" /> Mark all read
          </button>
          <span className="text-border">|</span>
          <button
            onClick={() => setLogs([])}
            className="text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" /> Reset Stream
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🚀 LIVE LOG ALERT STREAM INTERACTION CARDS */}
      {/* ========================================================================= */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {logs.map((log) => {
            const hasRedirect = log.type === "order" && log.bookingData;
            return (
              <motion.div
                key={log.id}
                layout
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, x: -30, transition: { duration: 0.2 } }}
                onClick={() => {
                  // Mark as read when clicked
                  setLogs((prev) =>
                    prev.map((item) =>
                      item.id === log.id ? { ...item, read: true } : item
                    )
                  );
                  // Redirect if order and has booking data
                  if (hasRedirect) {
                    const bookingId = log.bookingData._id || log.bookingData.payment_order_id || log.bookingData.booking_id;
                    if (bookingId) {
                      navigate(`/admin/panel/bookings?search=${encodeURIComponent(bookingId)}`);
                    }
                  }
                }}
                className={cn(
                  "rounded-xl border transition-all duration-200 overflow-hidden",
                  log.read
                    ? "bg-card/40 border-border/50 opacity-60 shadow-none"
                    : "bg-card border-l-4 border-l-rose-500 border-border shadow-md ring-1 ring-zinc-500/5",
                  hasRedirect && "cursor-pointer hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50"
                )}
              >
                <div className="p-4 flex gap-4 items-center">
                  <div
                    className={cn(
                      "p-2.5 rounded-lg shrink-0",
                      log.type === "order"
                        ? "bg-rose-500/10 text-rose-500 animate-bounce"
                        : "bg-zinc-500/10 text-zinc-500",
                    )}
                  >
                    {log.type === "order" ? (
                      <Volume2 className="w-4 h-4" />
                    ) : (
                      <Layers className="w-4 h-4" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline gap-4">
                      <h4
                        className={cn(
                          "text-sm font-bold tracking-tight",
                          log.read ? "text-muted-foreground" : "text-foreground",
                        )}
                      >
                        {log.title}
                      </h4>
                      <span className="text-[10px] text-muted-foreground font-semibold uppercase">
                        {log.time}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 whitespace-pre-line leading-relaxed">
                      {log.message}
                    </p>
                  </div>

                  {/* Individual actions */}
                  <div className="flex gap-2 shrink-0 ml-2">
                    {!log.read && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setLogs((prev) =>
                            prev.map((item) =>
                              item.id === log.id ? { ...item, read: true } : item
                            )
                          );
                        }}
                        className="p-2 rounded-lg bg-zinc-100 hover:bg-emerald-500/10 text-zinc-500 hover:text-emerald-600 transition-colors dark:bg-zinc-800"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setLogs((prev) => prev.filter((item) => item.id !== log.id));
                      }}
                      className="p-2 rounded-lg bg-zinc-100 hover:bg-destructive/10 text-zinc-500 hover:text-destructive transition-colors dark:bg-zinc-800"
                      title="Delete notification"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Stream Empty Placeholder State View */}
        {logs.length === 0 && (
          <div className="text-center py-20 border border-dashed border-border rounded-xl bg-card/10">
            <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-20" />
            <p className="text-muted-foreground text-sm font-medium">
              The notification stream history log is completely empty.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
