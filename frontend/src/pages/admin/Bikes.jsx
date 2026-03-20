import { useState } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/Dialog";
import { ScrollArea } from "../../components/ui/ScrollArea";
import { useAreas } from "../../hooks/useAreas";
import {
  Plus,
  Edit,
  Trash2,
  Bike as BikeIcon,
  Search,
  MapPin,
  Filter,
  Eye,
  Gauge,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card, CardContent } from "../../components/ui/card";
import { Label } from "../../components/ui/Label";
import { Textarea } from "../../components/ui/Textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/Select";
import {
  useBikes,
  useCreateBike,
  useUpdateBike,
  useDeleteBike,
} from "../../hooks/useBikes";
import { Badge } from "../../components/ui/Badge";


const statusColors = {
  available: "bg-green-500/20 text-green-400 border-green-500/30",
  booked: "bg-red-500/20 text-red-400 border-red-500/30",
  maintenance: "bg-amber-500/20 text-amber-400 border-amber-500/30",
};

const initialFormData = {
  model: "",
  number_plate: "",
  cc: 0,
  price_per_hour: 0,
  price_per_day: 0,
  image_url: "",
  status: "available",
  description: "",
  area_id: "",
  bike_name: "",
  bike_colour: "",
  bike_owner: "",
  insurance_end_date: "",
  puc_end_date: "",
  bike_end_date: "",
  last_service_date: "",
  bike_expenses: 0,
  total_km_run: 0,
  last_battery_changed: "",
  last_tyre_change: "",
  gps_installed_date: "",
  extra_images: [],
};

export default function Bikes() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingBike, setEditingBike] = useState(null);
  const [viewingBike, setViewingBike] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [searchQuery, setSearchQuery] = useState("");
  const [areaFilter, setAreaFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: bikes, isLoading } = useBikes();
  const { data: areas } = useAreas();
  const createBike = useCreateBike();
  const updateBike = useUpdateBike();
  const deleteBike = useDeleteBike();
  const [selectedFile, setSelectedFile] = useState(null);

  // State for multiple extra files
  const [extraFiles, setExtraFiles] = useState([]);
  // State for previews (blob urls)
  const [extraPreviews, setExtraPreviews] = useState([]);

  // File selection handler (One by One)
  const handleExtraFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (extraFiles.length >= 5) {
      toast.error("Maximum 5 extra photos allowed");
      return;
    }

    // Add to binary files state
    setExtraFiles((prev) => [...prev, file]);

    // Add to previews state
    const reader = new FileReader();
    reader.onloadend = () => {
      setExtraPreviews((prev) => [...prev, reader.result]);
    };
    reader.readAsDataURL(file);

    // Clear input value to allow selecting same file again if needed
    e.target.value = "";
  };

  // Remove file handler
 // Remove file handler
  const removeExtraFile = (index) => {
    const itemToRemove = extraPreviews[index];

    // Case 1: If it's a new file (a local blob/base64 preview)
    if (typeof itemToRemove === "string" && (itemToRemove.startsWith("data:") || itemToRemove.startsWith("blob:"))) {
      // Find the relative index in the extraFiles (binary) array
      // We count how many "new" files appear before this one in the previews
      const binaryIndex = extraPreviews
        .slice(0, index)
        .filter(src => src.startsWith("data:") || src.startsWith("blob:")).length;

      setExtraFiles((prev) => prev.filter((_, i) => i !== binaryIndex));
    }

    // Case 2: Always remove from previews (works for both existing URLs and new previews)
    setExtraPreviews((prev) => prev.filter((_, i) => i !== index));
  };
  // Add this to your state declarations

  const downloadImage = async (imageUrl, fileName) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName || "bike-document.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Download failed");
    }
  };

  const filteredBikes = bikes?.filter((bike) => {
    const searchMatch =
      bike.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bike.number_plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (bike.bike_name || "").toLowerCase().includes(searchQuery.toLowerCase());
    const areaMatch = areaFilter === "all" || bike.area_id === areaFilter;
    const statusMatch = statusFilter === "all" || bike.status === statusFilter;
    return searchMatch && areaMatch && statusMatch;
  });

  // Change this:
  const getAreaName = (areaId) => {
    if (!areaId || !areas) return "Not Assigned";
    return (
      areas.find((a) => a._id === areaId || a.id === areaId)?.name || "Unknown"
    );
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const data = new FormData();

  //   // Basic fields
  //   Object.keys(formData).forEach((key) => {
  //     if (key !== "image_url" && key !== "extra_images") {
  //       data.append(key, formData[key]);
  //     }
  //   });

  //   // Main Image
  //   if (selectedFile) {
  //     data.append("image_url", selectedFile);
  //   }

  //   // Extra Images - 'extra_images' key wahi honi chahiye jo backend route mein hai
  //   extraFiles.forEach((file) => {
  //     data.append("extra_images", file);
  //   });

  //   try {
  //     if (editingBike) {
  //       // Corrected to use .id and pass formData
  //       await updateBike.mutateAsync({
  //         id: editingBike._id || editingBike.id,
  //         formData: data,
  //       });
  //     } else {
  //       await createBike.mutateAsync(data);
  //     }
  //     toast.success(editingBike ? "Bike updated" : "Bike added");
  //     handleOpenChange(false);
  //   } catch (error) {
  //     toast.error("Failed to save");
  //   }
  // };

 const handleSubmit = async (e) => {
   e.preventDefault();

   const data = new FormData();

   // 1. Text fields append (Excluding images)
   Object.keys(formData).forEach((key) => {
     if (
       key !== "image_url" &&
       key !== "extra_images" &&
       formData[key] !== undefined
     ) {
       data.append(key, formData[key]);
     }
   });

   // 2. Main Profile Image
   if (selectedFile) {
     data.append("image_url", selectedFile);
   }

   // --- NEW CHANGE START ---
   // 3. Send the list of EXISTING images that were NOT deleted
   // We filter 'extraPreviews' to find strings that are already URLs (hosted on your server/cloudinary)
   const remainingImages = extraPreviews.filter(
     (src) => typeof src === "string" && src.startsWith("http"),
   );

   // Send this as a stringified array so the backend can parse it
   data.append("remaining_extra_images", JSON.stringify(remainingImages));
   // --- NEW CHANGE END ---

   // 4. Append NEWLY selected files
   extraFiles.forEach((file) => {
     data.append("extra_images", file);
   });

   try {
     if (editingBike) {
       await updateBike.mutateAsync({
         id: editingBike._id || editingBike.id,
         formData: data,
       });
     } else {
       await createBike.mutateAsync(data);
     }

     toast.success(editingBike ? "Bike updated" : "Bike added");

     setExtraFiles([]);
     setExtraPreviews([]);
     setSelectedFile(null);
     handleOpenChange(false);
   } catch (error) {
     console.error("Upload Error:", error);
     toast.error(error.response?.data?.message || "Failed to save");
   }
 };
  const handleEdit = (bike) => {
    setEditingBike(bike);
    setSelectedFile(null); // <--- ADD THIS LINE

    const toInputDate = (dateStr) => {
      if (!dateStr) return "";
      return new Date(dateStr).toISOString().split("T")[0];
    };
    setFormData({
      model: bike.model,
      number_plate: bike.number_plate,
      cc: bike.cc,
      price_per_hour: bike.price_per_hour,
      price_per_day: bike.price_per_day,
      image_url: bike.image_url || "",
      status: bike.status,
      description: bike.description || "",
      area_id: bike.area_id || "",
      bike_name: bike.bike_name || "",
      bike_colour: bike.bike_colour || "",
      bike_owner: bike.bike_owner || "",
      
      bike_expenses: bike.bike_expenses || 0,
      total_km_run: bike.total_km_run || 0,


      insurance_end_date: toInputDate(bike.insurance_end_date),
      puc_end_date: toInputDate(bike.puc_end_date),
      bike_end_date: toInputDate(bike.bike_end_date),
      last_service_date: toInputDate(bike.last_service_date),
      last_battery_changed: toInputDate(bike.last_battery_changed),
      last_tyre_change: toInputDate(bike.last_tyre_change),
      gps_installed_date: toInputDate(bike.gps_installed_date),
    });
   if (bike.extra_images) {
     setExtraPreviews(bike.extra_images);
   } else {
     setExtraPreviews([]);
   }

   setIsOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this bike?")) {
      await deleteBike.mutateAsync(id);
    }
  };

  const handleOpenChange = (open) => {
    setIsOpen(open);
    if (!open) {
      setEditingBike(null);
      setSelectedFile(null);
      setExtraFiles([]); // Added
      setExtraPreviews([]);
      setFormData(initialFormData);
    }
  };

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Bikes</h1>
          <p className="text-muted-foreground">Manage your bike fleet</p>
        </div>

        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button className="gradient-sunset text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Add Bike
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-card border-border max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle className="text-foreground">
                {editingBike ? "Edit Bike" : "Add New Bike"}
              </DialogTitle>
            </DialogHeader>
            <ScrollArea className="flex-1 overflow-auto pr-4">
              <form onSubmit={handleSubmit} className="space-y-5 pb-4">
                {/* Image Upload */}
                {/* Image Upload Section */}
                <div className="space-y-2">
                  <Label htmlFor="image_upload">Bike Image</Label>
                  <div className="flex flex-col gap-2">
                    {/* Show Preview (Uses existing URL or the Base64 preview) */}
                    {formData.image_url && (
                      <div className="relative w-20 h-20 rounded-md overflow-hidden border">
                        <img
                          src={formData.image_url}
                          className="w-full h-full object-cover"
                          alt="Preview"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, image_url: "" });
                            setSelectedFile(null); // Clear the binary file too
                          }}
                          className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl-md"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    <Input
                      id="image_upload"
                      type="file"
                      accept="image/*"
                      className="cursor-pointer"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setSelectedFile(file); // CRITICAL: Store actual binary file for handleSubmit

                          // Set local preview so the user sees the image immediately
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFormData({
                              ...formData,
                              image_url: reader.result,
                            });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                </div>
                {/* Section: Basic Details */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b border-border pb-1">
                    Basic Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bike_name">Bike Name</Label>
                      <Input
                        id="bike_name"
                        value={formData.bike_name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            bike_name: e.target.value,
                          })
                        }
                        placeholder="e.g. Activa 6G"
                        className="bg-input border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="model">Model *</Label>
                      <Input
                        id="model"
                        value={formData.model}
                        onChange={(e) =>
                          setFormData({ ...formData, model: e.target.value })
                        }
                        placeholder="Honda Activa"
                        className="bg-input border-border"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="number_plate">Number Plate *</Label>
                      <Input
                        id="number_plate"
                        value={formData.number_plate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            number_plate: e.target.value,
                          })
                        }
                        placeholder="MH12AB1234"
                        className="bg-input border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cc">CC *</Label>
                      <Input
                        id="cc"
                        type="number"
                        value={formData.cc || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            cc: parseInt(e.target.value) || 0,
                          })
                        }
                        placeholder="125"
                        className="bg-input border-border"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bike_colour">Colour</Label>
                      <Input
                        id="bike_colour"
                        value={formData.bike_colour}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            bike_colour: e.target.value,
                          })
                        }
                        placeholder="Black"
                        className="bg-input border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bike_owner">Owner</Label>
                      <Input
                        id="bike_owner"
                        value={formData.bike_owner}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            bike_owner: e.target.value,
                          })
                        }
                        placeholder="Owner name"
                        className="bg-input border-border"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="area_id">Area</Label>
                      <Select
                        value={formData.area_id}
                        onValueChange={(value) =>
                          setFormData({ ...formData, area_id: value })
                        }
                      >
                        <SelectTrigger className="bg-input border-border">
                          <SelectValue placeholder="Select area" />
                        </SelectTrigger>
                        <SelectContent>
                          {areas?.map((area) => (
                            <SelectItem key={area._id} value={area._id}>
                              {area.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) =>
                          setFormData({ ...formData, status: value })
                        }
                      >
                        <SelectTrigger className="bg-input border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="booked">Booked</SelectItem>
                          <SelectItem value="maintenance">
                            Maintenance
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Section: Pricing */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b border-border pb-1">
                    Pricing
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price_per_hour">Price/Hour (₹) *</Label>
                      <Input
                        id="price_per_hour"
                        type="number"
                        value={formData.price_per_hour || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            price_per_hour: parseFloat(e.target.value) || 0,
                          })
                        }
                        placeholder="50"
                        className="bg-input border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price_per_day">Price/Day (₹) *</Label>
                      <Input
                        id="price_per_day"
                        type="number"
                        value={formData.price_per_day || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            price_per_day: parseFloat(e.target.value) || 0,
                          })
                        }
                        placeholder="500"
                        className="bg-input border-border"
                      />
                    </div>
                  </div>
                </div>

                {/* Section: Documents & Dates */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b border-border pb-1">
                    Documents & Dates
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="insurance_end_date">
                        Insurance End Date
                      </Label>
                      <Input
                        id="insurance_end_date"
                        type="date"
                        value={formData.insurance_end_date}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            insurance_end_date: e.target.value,
                          })
                        }
                        className="bg-input border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="puc_end_date">PUC End Date</Label>
                      <Input
                        id="puc_end_date"
                        type="date"
                        value={formData.puc_end_date}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            puc_end_date: e.target.value,
                          })
                        }
                        className="bg-input border-border"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bike_end_date">
                      Bike End Date (Lifecycle)
                    </Label>
                    <Input
                      id="bike_end_date"
                      type="date"
                      value={formData.bike_end_date}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bike_end_date: e.target.value,
                        })
                      }
                      className="bg-input border-border"
                    />
                  </div>
                </div>

                {/* Section: Maintenance & Usage */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b border-border pb-1">
                    Maintenance & Usage
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="last_service_date">
                        Last Service Date
                      </Label>
                      <Input
                        id="last_service_date"
                        type="date"
                        value={formData.last_service_date}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            last_service_date: e.target.value,
                          })
                        }
                        className="bg-input border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bike_expenses">Total Expenses (₹)</Label>
                      <Input
                        id="bike_expenses"
                        type="number"
                        value={formData.bike_expenses || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            bike_expenses: parseFloat(e.target.value) || 0,
                          })
                        }
                        placeholder="0"
                        className="bg-input border-border"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="total_km_run">Total KM Run</Label>
                      <Input
                        id="total_km_run"
                        type="number"
                        value={formData.total_km_run || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            total_km_run: parseFloat(e.target.value) || 0,
                          })
                        }
                        placeholder="0"
                        className="bg-input border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gps_installed_date">
                        GPS Installed Date
                      </Label>
                      <Input
                        id="gps_installed_date"
                        type="date"
                        value={formData.gps_installed_date}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            gps_installed_date: e.target.value,
                          })
                        }
                        className="bg-input border-border"
                      />
                    </div>
                  </div>
                </div>

                {/* Section: Parts Replacement */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b border-border pb-1">
                    Parts Replacement
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="last_battery_changed">
                        Last Battery Changed
                      </Label>
                      <Input
                        id="last_battery_changed"
                        type="date"
                        value={formData.last_battery_changed}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            last_battery_changed: e.target.value,
                          })
                        }
                        className="bg-input border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last_tyre_change">Last Tyre Change</Label>
                      <Input
                        id="last_tyre_change"
                        type="date"
                        value={formData.last_tyre_change}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            last_tyre_change: e.target.value,
                          })
                        }
                        className="bg-input border-border"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Upload Extra Photos (Max 5)</Label>

                  <div className="flex flex-wrap gap-2">
                    {/* Pehle se selected files dikhayein */}
                    {extraPreviews.map((src, index) => (
                      <div key={index} className="relative w-20 h-20">
                        <img
                          src={src}
                          className="w-full h-full object-cover rounded-md border"
                        />
                        <button
                          type="button"
                          onClick={() => removeExtraFile(index)}
                          className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}

                    {/* Naya add karne ka button */}
                    {extraFiles.length < 5 && (
                      <label className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed rounded-md cursor-pointer hover:bg-accent">
                        <Plus className="w-6 h-6" />
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleExtraFileChange}
                          accept="image/*"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Additional details about the bike..."
                    rows={3}
                    className="bg-input border-border"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleOpenChange(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="gradient-sunset text-primary-foreground"
                    disabled={isLoading}
                  >
                    {editingBike ? "Update" : "Add"} Bike
                  </Button>
                </div>
              </form>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, model or number plate..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-input border-border"
          />
        </div>
        <div className="flex gap-2">
          <Select value={areaFilter} onValueChange={setAreaFilter}>
            <SelectTrigger className="w-40 bg-input border-border">
              <MapPin className="w-4 h-4 mr-2 text-primary" />
              <SelectValue placeholder="All Areas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Areas</SelectItem>
              {areas?.map((area) => (
                <SelectItem key={area._id} value={area._id}>
                  {area.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 bg-input border-border">
              <Filter className="w-4 h-4 mr-2 text-secondary" />
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="booked">Booked</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats */}
      {bikes && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-foreground">
                {bikes.length}
              </p>
              <p className="text-sm text-muted-foreground">Total Bikes</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-400">
                {bikes.filter((b) => b.status === "available").length}
              </p>
              <p className="text-sm text-muted-foreground">Available</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-red-400">
                {bikes.filter((b) => b.status === "booked").length}
              </p>
              <p className="text-sm text-muted-foreground">Booked</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-amber-400">
                {bikes.filter((b) => b.status === "maintenance").length}
              </p>
              <p className="text-sm text-muted-foreground">Maintenance</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Bike Detail View Dialog */}
      <Dialog
        open={!!viewingBike}
        onOpenChange={(open) => {
          if (!open) setViewingBike(null);
        }}
      >
        <DialogContent className="max-w-2xl bg-card border-border max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <BikeIcon className="w-5 h-5" />
              {viewingBike?.bike_name || viewingBike?.model}
            </DialogTitle>
          </DialogHeader>
          {viewingBike && (
            <ScrollArea className="flex-1 overflow-auto pr-4">
              <div className="space-y-5 pb-4">
                {/* Image */}
                {viewingBike.image_url && (
                  <div className="h-48 rounded-lg overflow-hidden">
                    <img
                      src={viewingBike.image_url}
                      alt={viewingBike.model}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Basic Details */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Basic Details
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <DetailItem
                      label="Bike Name"
                      value={viewingBike.bike_name}
                    />
                    <DetailItem label="Model" value={viewingBike.model} />
                    <DetailItem
                      label="Number Plate"
                      value={viewingBike.number_plate}
                    />
                    <DetailItem label="CC" value={`${viewingBike.cc}cc`} />
                    <DetailItem
                      label="Colour"
                      value={viewingBike.bike_colour}
                    />
                    <DetailItem label="Owner" value={viewingBike.bike_owner} />
                    <DetailItem
                      label="Area"
                      value={getAreaName(viewingBike.area_id)}
                    />
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Status</p>
                      <Badge className={`${statusColors[viewingBike.status]}`}>
                        {viewingBike.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Pricing
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <DetailItem
                      label="Price/Hour"
                      value={`₹${viewingBike.price_per_hour}`}
                    />
                    <DetailItem
                      label="Price/Day"
                      value={`₹${viewingBike.price_per_day}`}
                    />
                  </div>
                </div>

                {/* Documents */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Documents & Dates
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <DetailItem
                      label="Insurance End"
                      value={formatDate(viewingBike.insurance_end_date)}
                    />
                    <DetailItem
                      label="PUC End"
                      value={formatDate(viewingBike.puc_end_date)}
                    />
                    <DetailItem
                      label="Bike End Date"
                      value={formatDate(viewingBike.bike_end_date)}
                    />
                  </div>
                </div>

                {/* Maintenance */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Maintenance & Usage
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <DetailItem
                      label="Last Service"
                      value={formatDate(viewingBike.last_service_date)}
                    />
                    <DetailItem
                      label="Total Expenses"
                      value={`₹${viewingBike.bike_expenses || 0}`}
                    />
                    <DetailItem
                      label="Total KM Run"
                      value={`${viewingBike.total_km_run || 0} km`}
                    />
                    <DetailItem
                      label="GPS Installed"
                      value={formatDate(viewingBike.gps_installed_date)}
                    />
                  </div>
                </div>

                {/* Parts */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Parts Replacement
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <DetailItem
                      label="Last Battery Changed"
                      value={formatDate(viewingBike.last_battery_changed)}
                    />
                    <DetailItem
                      label="Last Tyre Change"
                      value={formatDate(viewingBike.last_tyre_change)}
                    />
                  </div>
                </div>

                {/* Inside viewingBike Dialog ScrollArea */}
                {/* View Dialog ke andar */}
                {viewingBike?.extra_images?.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-3">
                      Documents & Extra Photos
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {viewingBike.extra_images.map((img, idx) => (
                        <div
                          key={idx}
                          className="relative group rounded-lg overflow-hidden border border-border"
                        >
                          <img
                            src={img}
                            className="w-full h-32 object-cover"
                            alt={`Doc ${idx + 1}`}
                          />
                          {/* Hover Overlay with Download Button */}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => window.open(img, "_blank")}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              className="bg-primary text-white"
                              onClick={() =>
                                downloadImage(img, `bike-doc-${idx + 1}.jpg`)
                              }
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {viewingBike.description && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Description
                    </h3>
                    <p className="text-sm text-foreground">
                      {viewingBike.description}
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      {/* Bikes Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse bg-card border-border">
              <div className="h-40 bg-muted rounded-t-lg" />
              <CardContent className="p-4 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBikes?.map((bike, index) => (
            <motion.div
              key={bike._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="overflow-hidden bg-card border-border hover:border-primary/50 hover:shadow-golden transition-all duration-300">
                <div
                  className="h-40 bg-muted relative overflow-hidden cursor-pointer"
                  onClick={() => setViewingBike(bike)}
                >
                  {bike.image_url ? (
                    <img
                      src={bike.image_url}
                      alt={bike.model}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BikeIcon className="w-16 h-16 text-muted-foreground" />
                    </div>
                  )}
                  <Badge
                    className={`absolute top-2 right-2 border ${statusColors[bike.status]}`}
                  >
                    {bike.status}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">
                        {bike.bike_name || bike.model}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {bike.number_plate}
                      </p>
                    </div>
                    <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
                      {bike.cc}cc
                    </span>
                  </div>

                  {bike.bike_colour && (
                    <div className="mt-1 text-xs text-muted-foreground">
                      {bike.bike_colour}
                    </div>
                  )}

                  <div className="mt-2 flex items-center gap-1 text-sm">
                    <MapPin className="w-3 h-3 text-primary" />
                    <span className="text-muted-foreground">
                      {getAreaName(bike.area_id)}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center gap-3 text-sm">
                    <span className="text-primary font-semibold">
                      ₹{bike.price_per_hour}/hr
                    </span>
                    <span className="text-muted-foreground">|</span>
                    <span className="text-secondary font-semibold">
                      ₹{bike.price_per_day}/day
                    </span>
                  </div>

                  {bike.total_km_run > 0 && (
                    <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                      <Gauge className="w-3 h-3" /> {bike.total_km_run} km
                    </div>
                  )}

                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setViewingBike(bike)}
                      className="border-border hover:border-primary"
                    >
                      <Eye className="w-4 h-4 mr-1" /> View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(bike)}
                      className="flex-1 border-border hover:border-primary"
                    >
                      <Edit className="w-4 h-4 mr-1" /> Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(bike._id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 border-border"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          {filteredBikes?.length === 0 && (
            <div className="col-span-full text-center py-12">
              <BikeIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No bikes found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground">{value || "—"}</p>
    </div>
  );
}