import { useState, useCallback } from "react";
import axios from "axios";

export function useBikeAvailability() {
  const [checking, setChecking] = useState(false);

  const checkAvailability = useCallback(async (bikeId, startDate, endDate) => {
    if (!bikeId || !startDate || !endDate) {
      return {
        isAvailable: false,
        message: "Invalid date selection",
      };
    }

    setChecking(true);

    try {
      const res = await axios.post("http://localhost:5000/api/availability", {
        bikeId,
        start_datetime: startDate.toISOString(),
        end_datetime: endDate.toISOString(),
      });

      return {
        isAvailable: res.data.isAvailable,
        message: res.data.message,
        bookedFrom: res.data.bookedFrom,
        bookedTo: res.data.bookedTo,
      };
    } catch (error) {
      console.error("Availability check failed:", error);

      return {
        isAvailable: false,
        message: "Failed to check availability",
      };
    } finally {
      setChecking(false);
    }
  }, []);

  return { checkAvailability, checking };
}
