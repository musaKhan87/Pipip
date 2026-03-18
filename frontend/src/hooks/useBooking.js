import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

// const API_URL = "http://localhost:5000/api/bookings";

const API_URL = " https://pipip-backend.onrender.com/api/bookings";


/* =========================
   GET ALL BOOKINGS
========================= */
export function useBookings(status = "all") {
  return useQuery({
    queryKey: ["bookings", status],
    queryFn: async () => {
      const { data } = await axios.get(API_URL, {
        params: status !== "all" ? { status } : {},
      });
      return data;
    },
  });
}



/* =========================
   GET SINGLE BOOKING
========================= */
export function useBooking(id) {
  return useQuery({
    queryKey: ["bookings", id],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

/* =========================
   CREATE BOOKING
========================= */
export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingData) => {
      const { data } = await axios.post(API_URL, bookingData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Booking created successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create booking");
    },
  });
}

export function useAdminCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingData) => {
      // --- BETTER LOGGING START ---
      console.log("🚀 Preparing to send booking request...");

      if (bookingData instanceof FormData) {
        const logObject = {};
        for (let [key, value] of bookingData.entries()) {
          // If the value is a File, show the name/size, otherwise show the value
          logObject[key] =
            value instanceof File
              ? `File: ${value.name} (${value.size} bytes)`
              : value;
        }
        console.table(logObject); // console.table is much easier to read for FormData
      } else {
        console.log("📦 Sending JSON Object:", bookingData);
      }
      // --- BETTER LOGGING END ---

      const { data } = await axios.post(`${API_URL}/admin`, bookingData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Booking created successfully");
    },
    onError: (error) => {
      console.error("❌ Backend Error Details:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to create booking");
    },
  });
}
/* =========================
   UPDATE BOOKING STATUS (ADMIN)
========================= */
export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }) => {
      const { data } = await axios.patch(`${API_URL}/${id}/status`, { status });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Booking status updated");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Status update failed");
    },
  });
}

/* =========================
   UPDATE BOOKING (ADMIN)
========================= */
export function useUpdateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { data } = await axios.put(`${API_URL}/${id}`, updates);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Booking updated successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Update failed");
    },
  });
}

/* =========================
   DELETE BOOKING (ADMIN)
========================= */
export function useDeleteBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await axios.delete(`${API_URL}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Booking deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Delete failed");
    },
  });
}
