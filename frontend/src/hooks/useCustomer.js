import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

// const API_URL = "http://localhost:5000/api/customers";
const API_URL = " https://pipip-backend.onrender.com/api/customers";


/* =========================
   GET ALL CUSTOMERS
========================= */
export function useCustomers(search = "") {
  return useQuery({
    queryKey: ["customers", search],
    queryFn: async () => {
      const { data } = await axios.get(API_URL, {
        params: { search },
      });
      return data;
    },
  });
}

/* =========================
   GET CUSTOMER BOOKINGS
========================= */
export function useCustomerBookings(customerId) {
  return useQuery({
    queryKey: ["customer-bookings", customerId],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/${customerId}/bookings`);
      return data;
    },
    enabled: !!customerId,
  });
}

/* =========================
   GET SINGLE CUSTOMER
========================= */
export function useCustomer(id) {
  return useQuery({
    queryKey: ["customers", id],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

/* =========================
   CREATE CUSTOMER
========================= */
export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (customerData) => {
      const { data } = await axios.post(API_URL, customerData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Customer added successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to add customer");
    },
  });
}

/* =========================
   UPDATE CUSTOMER (ADMIN)
========================= */
export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { data } = await axios.put(`${API_URL}/${id}`, updates);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Customer updated successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update customer");
    },
  });
}

/* =========================
   DELETE CUSTOMER (ADMIN)
========================= */
export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await axios.delete(`${API_URL}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Customer deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete customer");
    },
  });
}
