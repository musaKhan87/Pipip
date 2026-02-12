import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { Textarea } from "../../components/ui/Textarea";
import { ScrollArea } from "../../components/ui/ScrollArea";
import { Button } from "../../components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/Select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../../components/ui/Dialog";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/Tabs";

// import { useAuth } from "../lib/auth";
import {
  Plus,
  Search,
  Phone,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Play,
  Edit,
  Upload,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Badge } from "../../components/ui/Badge";
import { format } from "date-fns";
import { toast } from "sonner";
import { useBikes } from "../../hooks/useBikes";
import {
  useBookings,
  useUpdateBookingStatus,
  useAdminCreateBooking,
  useUpdateBooking,
} from "../../hooks/useBooking";
import {
  useCustomers,
  useCreateCustomer,
  useUpdateCustomer,
} from "../../hooks/useCustomer";
import { useBikeAvailability } from "../../hooks/useBikeAvailability";
import { useEffect } from "react";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  confirmed: "bg-blue-100 text-blue-800 border-blue-300",
  active: "bg-green-100 text-green-800 border-green-300",
  completed: "bg-gray-100 text-gray-800 border-gray-300",
  cancelled: "bg-red-100 text-red-800 border-red-300",
};

const statusActions = {
  pending: [
    {
      next: "confirmed",
      label: "Confirm",
      icon: <CheckCircle className="w-4 h-4" />,
    },
    {
      next: "cancelled",
      label: "Cancel",
      icon: <XCircle className="w-4 h-4" />,
    },
  ],
  confirmed: [
    {
      next: "active",
      label: "Start Rental",
      icon: <Play className="w-4 h-4" />,
    },
    {
      next: "cancelled",
      label: "Cancel",
      icon: <XCircle className="w-4 h-4" />,
    },
  ],
  active: [
    {
      next: "completed",
      label: "Complete",
      icon: <CheckCircle className="w-4 h-4" />,
    },
  ],
  completed: [],
  cancelled: [],
};

export default function Bookings() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [editTimeData, setEditTimeData] = useState({
    start_datetime: "",
    end_datetime: "",
  });
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [aadhaarPreview, setAadhaarPreview] = useState(null);
  const aadhaarInputRef = useRef(null);

  const [licensePreview, setLicensePreview] = useState(null);
  const LicenseInputRef = useRef(null);

  const { data: bookings, isLoading } = useBookings(activeTab);

  const { data: bikes } = useBikes();
  const { data: customers } = useCustomers();

  const updateStatus = useUpdateBookingStatus();
  const createBooking = useAdminCreateBooking();
  const updateBooking = useUpdateBooking();
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();
  // const { user } = useAuth();

  const [availabilityMessage, setAvailabilityMessage] = useState(null);
  const [isAvailable, setIsAvailable] = useState(null);
  const { checkAvailability, checking } = useBikeAvailability(); // Assuming you use the same hook

  const uploading = false;
  const progress = 0;

  const [newBooking, setNewBooking] = useState({
    bike_id: "",
    customer_id: "",
    start_datetime: "",
    end_datetime: "",
    notes: "",
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    is_new_customer: false,
    aadhaar_image: null,
    license_image: null,
  });
  const filteredBookings = bookings
    ?.filter((booking) => {
      if (activeTab === "all") return true;
      return booking.status === activeTab;
    })
    ?.filter((booking) => {
      if (!searchQuery) return true;

      const query = searchQuery.toLowerCase();
      return (
        booking.customers?.name?.toLowerCase().includes(query) ||
        booking.customers?.phone?.includes(query) ||
        booking.bikes?.model?.toLowerCase().includes(query) ||
        booking.bikes?.number_plate?.toLowerCase().includes(query)
      );
    });

  const handleStatusUpdate = async (bookingId, newStatus) => {
    await updateStatus.mutateAsync({ id: bookingId, status: newStatus });
  };

  const handleAadhaarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewBooking({ ...newBooking, aadhaar_image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setAadhaarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLicenseChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewBooking({ ...newBooking, license_image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setLicensePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleCreateBooking = async (e) => {
    e.preventDefault();

    // 1️⃣ VALIDATION
    if (
      !newBooking.bike_id ||
      !newBooking.start_datetime ||
      !newBooking.end_datetime ||
      (!newBooking.is_new_customer && !newBooking.customer_id) ||
      (newBooking.is_new_customer &&
        (!newBooking.customer_name || !newBooking.customer_phone))
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!isAvailable) {
      toast.error("Selected slot is not available");
      return;
    }

    const selectedBike = bikes?.find((b) => b._id === newBooking.bike_id);
    if (!selectedBike) {
      toast.error("Selected bike not found");
      return;
    }

    try {
      // 2️⃣ PRICE CALCULATION
      const start = new Date(newBooking.start_datetime);
      const end = new Date(newBooking.end_datetime);

      const totalHours = Math.max(
        1,
        Math.ceil((end - start) / (1000 * 60 * 60)),
      );

      const days = Math.floor(totalHours / 24);
      const remainingHours = totalHours % 24;

      const total_amount =
        days * Number(selectedBike.price_per_day || 0) +
        remainingHours * Number(selectedBike.price_per_hour || 0);

      let customerId = newBooking.customer_id;

      // 3️⃣ CREATE CUSTOMER FIRST (IF NEW)
      if (newBooking.is_new_customer) {
        const customerFormData = new FormData();
        customerFormData.append("name", newBooking.customer_name);
        customerFormData.append("phone", newBooking.customer_phone);
        customerFormData.append("email", newBooking.customer_email || "");

        if (!newBooking.aadhaar_image) {
          toast.error("Aadhaar photo is required");
          return;
        }

        if (!newBooking.license_image) {
          toast.error("License photo is required");
          return;
        }
        customerFormData.append("aadhaar_image", newBooking.aadhaar_image);
        customerFormData.append("license_image", newBooking.license_image);

        const customer = await createCustomer.mutateAsync(customerFormData);
        customerId = customer._id; // ✅ THIS IS THE KEY FIX
      }

      // 4️⃣ CREATE BOOKING
      const bookingFormData = new FormData();
      bookingFormData.append("bike_id", newBooking.bike_id);
      bookingFormData.append("customer_id", customerId);
      bookingFormData.append("start_datetime", start.toISOString());
      bookingFormData.append("end_datetime", end.toISOString());
      bookingFormData.append("total_amount", total_amount);
      bookingFormData.append("notes", newBooking.notes || "");
      bookingFormData.append("booking_source", "admin");
      bookingFormData.append("created_by", "admin-temp-id");

      // 🧪 DEBUG (optional – remove later)
      for (let [k, v] of bookingFormData.entries()) {
        console.log(k, v);
      }

      // 5️⃣ SAVE BOOKING
      await createBooking.mutateAsync(bookingFormData);

      toast.success("Booking created successfully!");
      setIsOpen(false);
      resetForm();
    } catch (err) {
      console.error("Booking Error:", err);
      toast.error(err?.response?.data?.message || "Failed to create booking");
    }
  };

  // Helper function to reset form
  const resetForm = () => {
    setNewBooking({
      bike_id: "",
      customer_id: "",
      start_datetime: "",
      end_datetime: "",
      notes: "",
      customer_name: "",
      customer_phone: "",
      customer_email: "",
      is_new_customer: false,
      aadhaar_image: null,
      license_image: null,
    });
    setAadhaarPreview(null);
    setLicensePreview(null);
    setAvailabilityMessage(null);
  };
  const handleEditTime = (booking) => {
    setEditingBooking(booking._id);

    // Apply rounding immediately when loading the edit data
    setEditTimeData({
      start_datetime: roundToHour(booking.start_datetime),
      end_datetime: roundToHour(booking.end_datetime),
    });
  };

  const handleCancelForm = (e) => {
    if (e) e.preventDefault(); // Prevents the form from trying to submit
    setIsOpen(false);
    resetForm();
  };

  const handleSaveTimeEdit = async () => {
    if (!editingBooking) return;

    const booking = bookings?.find((b) => b._id === editingBooking);
    if (!booking) return;

    // Check bike_id correctly (handling both populated object or ID string)
    const bikeId = booking.bike_id?._id || booking.bike_id;
    const bike = bikes?.find((b) => b._id === bikeId);
    if (!bike) {
      toast.error("Bike data not found");
      return;
    }

    const start = new Date(editTimeData.start_datetime);
    const end = new Date(editTimeData.end_datetime);

    const diffMs = end.getTime() - start.getTime();
    if (diffMs <= 0) {
      toast.error("End time must be after start time");
      return;
    }

    // 1. Calculate Total Hours (Rounded Up)
    const totalHours = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60)));

    // 2. Pricing Logic (Daily + Remaining Hours)
    let total_amount = 0;
    const hourlyRate = Number(bike.price_per_hour || 0);
    const dailyRate = Number(bike.price_per_day || 0);

    if (totalHours >= 24 && dailyRate > 0) {
      const days = Math.floor(totalHours / 24);
      const remainingHours = totalHours % 24;
      total_amount = days * dailyRate + remainingHours * hourlyRate;

      // Cap at the next full day if remaining hours are more expensive
      if (remainingHours * hourlyRate > dailyRate) {
        total_amount = (days + 1) * dailyRate;
      }
    } else {
      total_amount = totalHours * hourlyRate;
    }

    try {
      await updateBooking.mutateAsync({
        id: editingBooking,
        start_datetime: start.toISOString(),
        end_datetime: end.toISOString(),
        total_amount,
      });

      setEditingBooking(null);
      toast.success("Booking updated with new rates");
    } catch (error) {
      toast.error("Failed to update booking time");
    }
  };
  const roundToHour = (dateTimeStr) => {
    if (!dateTimeStr) return "";
    const date = new Date(dateTimeStr);
    const minutes = date.getMinutes();

    // If there are any minutes, round up to the next full hour
    if (minutes > 0) {
      date.setMinutes(0);
      date.setHours(date.getHours() + 1);
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:00`;
  };

  useEffect(() => {
    const checkDates = async () => {
      if (
        !newBooking.bike_id ||
        !newBooking.start_datetime ||
        !newBooking.end_datetime
      ) {
        setAvailabilityMessage(null);
        setIsAvailable(null);
        return;
      }

      const start = new Date(newBooking.start_datetime);
      const end = new Date(newBooking.end_datetime);

      if (end <= start) {
        setAvailabilityMessage("⚠️ Return date must be after pickup date");
        setIsAvailable(false);
        return;
      }

      const result = await checkAvailability(newBooking.bike_id, start, end);

      if (!result.isAvailable && result.bookedFrom) {
        // Format the dates exactly like your BookBike code
        const fromDate = format(
          new Date(result.bookedFrom),
          "dd/MM/yyyy hh:mm a",
        );
        const toDate = format(new Date(result.bookedTo), "dd/MM/yyyy hh:mm a");

        setAvailabilityMessage(
          `❌ Bike is already booked from ${fromDate} to ${toDate}`,
        );
        setIsAvailable(false);
      } else {
        setAvailabilityMessage(
          result.isAvailable
            ? "✅ Bike is available for this slot"
            : result.message,
        );
        setIsAvailable(result.isAvailable);
      }
    };

    checkDates();
  }, [
    newBooking.bike_id,
    newBooking.start_datetime,
    newBooking.end_datetime,
    checkAvailability,
  ]);
  const availableBikes = bikes?.filter((b) => b.status !== "maintenance");
  useEffect(() => {
    console.log("Active tab changed to:", activeTab);
  }, [activeTab]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display text-gradient-sunset">
            Bookings
          </h1>
          <p className="text-muted-foreground">Manage rental bookings</p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-sunset text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              New Booking
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col overflow-hidden p-6">
            {/* Increased overall padding */}
            <DialogHeader className="flex-shrink-0 mb-4">
              {/* Added bottom margin to title */}
              <DialogTitle>Create Manual Booking</DialogTitle>
            </DialogHeader>
            <ScrollArea className="flex-1 overflow-auto pr-6 ">
              {/* Increased padding for scroll area */}
              <form onSubmit={handleCreateBooking} className="space-y-6">
                {/* Increased spacing between rows from 4 to 6 */}
                {/* Bike Selection */}
                <div className="space-y-3">
                  <Label>Select Bike *</Label>
                  <Select
                    value={newBooking.bike_id}
                    onValueChange={(value) =>
                      setNewBooking({ ...newBooking, bike_id: value })
                    }
                  >
                    <SelectTrigger className="h-11">
                      {/* Slightly taller trigger */}
                      <SelectValue placeholder="Choose a bike" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableBikes?.map((bike) => (
                        <SelectItem key={bike._id} value={bike._id}>
                          {bike.model} - {bike.number_plate} (₹
                          {bike.price_per_hour}/hr)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Date/Time Grid */}
                <div className="space-y-4">
                  {/* Container to keep grid and message together */}
                  <div className="grid grid-cols-2 gap-6">
                    {/* Increased gap between columns */}
                    <div className="space-y-2">
                      <Label>Start Date/Time *</Label>
                      <Input
                        type="datetime-local"
                        className="bg-input border-border [color-scheme:dark] h-11"
                        value={newBooking.start_datetime}
                        onChange={(e) =>
                          setNewBooking({
                            ...newBooking,
                            start_datetime: roundToHour(e.target.value),
                          })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date/Time *</Label>
                      <Input
                        type="datetime-local"
                        className="bg-input border-border [color-scheme:dark] h-11"
                        value={newBooking.end_datetime}
                        onChange={(e) =>
                          setNewBooking({
                            ...newBooking,
                            end_datetime: roundToHour(e.target.value),
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  {/* Availability Message - Moved to its own block below the grid */}
                  {availabilityMessage && (
                    <div
                      className={`p-4 rounded-xl flex items-center gap-3 text-sm mt-2 transition-all ${
                        isAvailable
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      {isAvailable ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <AlertCircle className="w-5 h-5" />
                      )}
                      <span className="font-medium">{availabilityMessage}</span>
                    </div>
                  )}
                </div>
                {/* Customer Section */}
                <div className="space-y-4 pt-2">
                  {/* Added top padding to separate from dates */}
                  <div className="flex items-center gap-4 mb-2">
                    <Label className="text-base font-semibold">
                      Customer Details
                    </Label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded"
                        checked={newBooking.is_new_customer}
                        onChange={(e) =>
                          setNewBooking({
                            ...newBooking,
                            is_new_customer: e.target.checked,
                            customer_id: "",
                          })
                        }
                      />
                      New Customer
                    </label>
                  </div>
                  {newBooking.is_new_customer ? (
                    <div className="space-y-4 p-4 bg-muted/50 rounded-xl border border-border/50">
                      {/* Increased internal padding */}
                      <Input
                        className="h-11"
                        placeholder="Customer Name *"
                        value={newBooking.customer_name}
                        onChange={(e) =>
                          setNewBooking({
                            ...newBooking,
                            customer_name: e.target.value,
                          })
                        }
                        required
                      />
                      <Input
                        className="h-11"
                        placeholder="Phone Number *"
                        value={newBooking.customer_phone}
                        onChange={(e) =>
                          setNewBooking({
                            ...newBooking,
                            customer_phone: e.target.value,
                          })
                        }
                        required
                      />
                      <Input
                        className="h-11"
                        type="email"
                        placeholder="Email (optional)"
                        value={newBooking.customer_email}
                        onChange={(e) =>
                          setNewBooking({
                            ...newBooking,
                            customer_email: e.target.value,
                          })
                        }
                      />
                    </div>
                  ) : (
                    <Select
                      value={newBooking.customer_id}
                      onValueChange={(value) =>
                        setNewBooking({ ...newBooking, customer_id: value })
                      }
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select existing customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers?.map((customer) => (
                          <SelectItem key={customer._id} value={customer._id}>
                            {customer.name} - {customer.phone}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                {/* Aadhaar Section */}
                {newBooking.is_new_customer && (
                  <div className="space-y-3 pt-2">
                    <Label>Aadhaar Card Photo *</Label>
                    <div
                      onClick={() => aadhaarInputRef.current?.click()}
                      className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                    >
                      {aadhaarPreview ? (
                        <div className="relative">
                          <img
                            src={aadhaarPreview}
                            alt="Preview"
                            className="max-h-36 mx-auto rounded-lg shadow-sm"
                          />
                          <p className="text-xs text-muted-foreground mt-3 font-medium">
                            Click to change photo
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-3 py-2">
                          <Upload className="w-10 h-10 text-muted-foreground opacity-70" />
                          <p className="text-sm text-muted-foreground font-medium">
                            Upload Aadhaar Front Image
                          </p>
                        </div>
                      )}
                      <input
                        ref={aadhaarInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAadhaarChange}
                        style={{
                          position: "absolute",
                          width: "1px",
                          height: "1px",
                          padding: "0",
                          margin: "-1px",
                          overflow: "hidden",
                          clip: "rect(0,0,0,0)",
                          border: "0",
                          display: "block", // Must be block or inline, NOT none
                          visibility: "visible", // Must be visible for the tooltip to anchor
                        }}
                        required
                      />
                    </div>
                    {uploading && (
                      <div className="w-full bg-muted rounded-full h-2 mt-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                )}
                {/* License  Section */}
                {newBooking.is_new_customer && (
                  <div className="space-y-3 pt-2">
                    <Label>License Photo *</Label>
                    <div
                      onClick={() => LicenseInputRef.current?.click()}
                      className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                    >
                      {licensePreview ? (
                        <div className="relative">
                          <img
                            src={licensePreview}
                            alt="Preview"
                            className="max-h-36 mx-auto rounded-lg shadow-sm"
                          />
                          <p className="text-xs text-muted-foreground mt-3 font-medium">
                            Click to change photo
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-3 py-2">
                          <Upload className="w-10 h-10 text-muted-foreground opacity-70" />
                          <p className="text-sm text-muted-foreground font-medium">
                            Upload License Front Image
                          </p>
                        </div>
                      )}
                      <input
                        ref={LicenseInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLicenseChange}
                        style={{
                          position: "absolute",
                          width: "1px",
                          height: "1px",
                          padding: "0",
                          margin: "-1px",
                          overflow: "hidden",
                          clip: "rect(0,0,0,0)",
                          border: "0",
                          display: "block", // Must be block or inline, NOT none
                          visibility: "visible", // Must be visible for the tooltip to anchor
                        }}
                        required
                      />
                    </div>
                    {uploading && (
                      <div className="w-full bg-muted rounded-full h-2 mt-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                )}
                {/* Notes */}
                <div className="space-y-2 pt-2">
                  <Label>Notes</Label>
                  <Textarea
                    placeholder="Any additional notes..."
                    value={newBooking.notes}
                    onChange={(e) =>
                      setNewBooking({ ...newBooking, notes: e.target.value })
                    }
                    rows={3}
                    className="resize-none"
                  />
                </div>
                {/* Actions */}
                <div className="flex justify-end gap-3 pt-6 pb-2 border-t">
                  {/* Added border-t and more padding */}
                  <Button
                    type="button"
                    variant="outline"
                    className="px-6"
                    onClick={handleCancelForm}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="gradient-sunset px-8"
                    disabled={uploading}
                  >
                    {uploading ? "Processing..." : "Create Booking"}
                  </Button>
                </div>
              </form>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog
        open={!!editingBooking}
        onOpenChange={(open) => !open && setEditingBooking(null)}
      >
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Booking Time</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Start Date/Time</Label>
              <Input
                type="datetime-local"
                value={editTimeData.start_datetime}
                className="bg-input border-border [color-scheme:dark]"
                onChange={(e) =>
                  setEditTimeData({
                    ...editTimeData,
                    start_datetime: roundToHour(e.target.value), // Round here too!
                  })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label>End Date/Time</Label>
              <Input
                type="datetime-local"
                value={editTimeData.end_datetime}
                className="bg-input border-border [color-scheme:dark]"
                onChange={(e) =>
                  setEditTimeData({
                    ...editTimeData,
                    end_datetime: roundToHour(e.target.value), // Round here too!
                  })
                }
                required
              />
            </div>
            <p className="text-sm text-muted-foreground">
              ⚠️ Extending the booking will recalculate the total amount based
              on current pricing.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingBooking(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTimeEdit} className="gradient-sunset">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by customer, bike, plate..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v)}>
        <TabsList className="bg-muted">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings?.map((booking, index) => (
            <motion.div
              key={booking._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <Card className="hover:shadow-md transition-shadow border-border">
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Customer
                        </p>
                        <p className="font-semibold text-foreground">
                          {booking.customers?.name}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="w-3 h-3" />
                          {booking.customers?.phone}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground">Bike</p>
                        <p className="font-semibold text-foreground">
                          {booking.bikes?.model}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {booking.bikes?.number_plate}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground">
                          Duration
                        </p>
                        <div className="flex items-center gap-1 text-sm text-foreground">
                          <Calendar className="w-3 h-3" />
                          {format(
                            new Date(booking.start_datetime),
                            "MMM d, h:mm a",
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          to
                          {format(
                            new Date(booking.end_datetime),
                            "MMM d, h:mm a",
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* <div className="text-right">
                        <Badge
                          className={`${statusColors[booking.status]} border`}
                        >
                          {booking.status}
                        </Badge>

                        <div className="mt-1">
                          <Badge
                            className={`border ${
                              booking.payment_status === "paid"
                                ? "bg-green-100 text-green-700 border-green-300"
                                : booking.payment_status === "failed"
                                  ? "bg-red-100 text-red-700 border-red-300"
                                  : "bg-yellow-100 text-yellow-700 border-yellow-300"
                            }`}
                          >
                           {booking.payment_status || "pending"}
                          </Badge>
                        </div>
                        <p className="text-sm font-semibold text-primary mt-1">
                          ₹{booking.total_amount?.toLocaleString() || 0}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          via{" "}
                          <span className="font-semibold text-primary">
                            {booking.payment_method}
                          </span>
                        </p>
                      </div> */}
                      <div className="text-right space-y-1">
                        {/* Rental Status (Primary) */}

                        <Badge
                          className={`${statusColors[booking.status]} border`}
                        >
                          {booking.status}
                        </Badge>
                        <div className="mt-1">
                          {/* Payment Status (Subtle Secondary Line) */}
                          <Badge
                            className={`border ${
                              booking.payment_status === "paid"
                                ? "bg-green-100 text-green-700 border-green-300"
                                : booking.payment_status === "failed"
                                  ? "bg-red-100 text-red-700 border-red-300"
                                  : "bg-yellow-100 text-yellow-700 border-yellow-300"
                            }`}
                          >
                            {booking.payment_status === "paid"
                              ? "Paid"
                              : booking.payment_status === "failed"
                                ? "Payment failed"
                                : "Payment pending"}{" "}
                            · {booking.payment_method}
                          </Badge>
                        </div>

                        {/* Price (Strongest Element) */}
                        <p className="text-lg font-bold text-foreground">
                          ₹{booking.total_amount?.toLocaleString() || 0}
                        </p>
                      </div>

                      <div className="flex flex-col gap-1">
                        {(booking.status === "active" ||
                          booking.status === "confirmed") && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditTime(booking)}
                            className="text-blue-600 hover:bg-blue-50 border-blue-200"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit Time
                          </Button>
                        )}
                        {statusActions[booking.status]?.map((action) => (
                          <Button
                            key={action.next}
                            size="sm"
                            variant={
                              action.next === "cancelled"
                                ? "outline"
                                : "default"
                            }
                            onClick={() =>
                              handleStatusUpdate(booking._id, action.next)
                            }
                            className={
                              action.next === "cancelled"
                                ? "text-red-600 hover:bg-red-50"
                                : "gradient-sunset"
                            }
                          >
                            {action.icon}
                            <span className="ml-1">{action.label}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {booking.notes && (
                    <p className="mt-3 text-sm text-muted-foreground bg-muted p-2 rounded">
                      📝 {booking.notes}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {filteredBookings?.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No bookings found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
