import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";

const API_BASE = "http://localhost:5000/api/areas"; // your backend endpoint

// Fetch all areas
export function useAreas() {
  return useQuery({
    queryKey: ["areas"],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE}`);
      return data;
    },
    onError: (error) => {
      toast.error(error.message || "Failed to fetch areas");
    },
  });
}

// Fetch all areas
export function useAllAreas() {
  return useQuery({
    queryKey: ["areas"],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE}/areas`);
      return data;
    },
    onError: (error) => {
      toast.error(error.message || "Failed to fetch areas");
    },
  });
}

// Fetch only active areas
export function useActiveAreas() {
  return useQuery({
    queryKey: ["areas", "active"],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE}?active=true`);
      return data;
    },
    onError: (error) => {
      toast.error(error.message || "Failed to fetch active areas");
    },
  });
}

// Create a new area
export function useCreateArea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (area) => {
      const { data } = await axios.post(API_BASE, area);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["areas"]);
      toast.success("Area added successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add area");
    },
  });
}

// Update an existing area
export function useUpdateArea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { data } = await axios.put(`${API_BASE}/${id}`, updates);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["areas"]);
      toast.success("Area updated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update area");
    },
  });
}

// Delete an area
export function useDeleteArea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      await axios.delete(`${API_BASE}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["areas"]);
      toast.success("Area deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete area");
    },
  });
}
