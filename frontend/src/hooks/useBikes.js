import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";

const API_URL = "http://localhost:5000/api/bikes";

/* ================= GET ALL BIKES ================= */
export function useBikes() {
  return useQuery({
    queryKey: ["bikes"],
    queryFn: async () => {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to fetch bikes");
      return res.json();
    },
  });
}

/* ================= CREATE BIKE ================= */
export function useCreateBike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      const res = await fetch(API_URL, {
        method: "POST",
        body: formData, // form-data (image upload)
      });

      if (!res.ok) throw new Error("Failed to add bike");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bikes"] });
      toast.success("Bike added successfully");
    },
  });
}

/* ================= UPDATE BIKE ================= */
export function useUpdateBike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, formData }) => {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT", // assuming your backend uses PUT for update
        body: formData, // form-data (image upload)
      });

      if (!res.ok) throw new Error("Failed to update bike");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bikes"] });
      toast.success("Bike updated successfully");
    },
  });
}

/* ================= DELETE BIKE ================= */
export function useDeleteBike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete bike");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bikes"] });
      toast.success("Bike deleted successfully");
    },
  });
}

export function useBike(bikeId) {
 
  return useQuery({
    queryKey: ["bike", bikeId],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:5000/api/bikes/${bikeId}`);
      return res.data;
    },
    enabled: !!bikeId,
    
  });
}