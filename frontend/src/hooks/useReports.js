import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Create an axios instance for cleaner calls
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

/**
 * Hook: Fetch general booking stats
 * GET /api/reports/stats?period=today
 */
export function useBookingStats(period = "all") {
  return useQuery({
    queryKey: ["booking-stats", period],
    queryFn: async () => {
      const { data } = await api.get(`/reports/stats`, { params: { period } });
      return data;
    },
  });
}

/**
 * Hook: Fetch revenue broken down by bike
 * GET /api/reports/bike-revenue
 */
export function useBikeRevenueReport(fromDate, toDate) {
  return useQuery({
    queryKey: ["bike-revenue", fromDate, toDate],
    queryFn: async () => {
      const { data } = await api.get(`/reports/bike-revenue`, {
        params: {
          fromDate: fromDate?.toISOString(),
          toDate: toDate?.toISOString(),
        },
      });
      return data;
    },
  });
}

/**
 * Hook: Find bikes with no bookings in the last 30 days
 */
export function useIdleBikesReport() {
  return useQuery({
    queryKey: ["idle-bikes"],
    queryFn: async () => {
      const { data } = await api.get(`/reports/idle-bikes`);
      return data;
    },
  });
}

/**
 * Hook: Get daily revenue for charts
 */
export function useDailyRevenueReport(days = 30) {
  return useQuery({
    queryKey: ["daily-revenue", days],
    queryFn: async () => {
      const { data } = await api.get(`/reports/daily-revenue`, {
        params: { days },
      });
      return data;
    },
  });
}

export function useActiveBookingsEndingSoon() {
  return useQuery({
    queryKey: ["active-bookings-ending-soon"],
    queryFn: async () => {
      const { data } = await api.get("/reports/ending-soon");
      return data;
    },
    refetchInterval: 30000, // Keep the 30s auto-refresh for the dashboard
  });
}

export function useRecentlyExpiredBookings() {
  return useQuery({
    queryKey: ["recently-expired"],
    queryFn: async () => {
      const { data } = await api.get("/reports/recently-expired");
      return data;
    },
  });
}