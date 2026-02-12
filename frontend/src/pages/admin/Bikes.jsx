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
};

export default function Bikes() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingBike, setEditingBike] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [searchQuery, setSearchQuery] = useState("");
  const [areaFilter, setAreaFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: bikes, isLoading } = useBikes();
  const { data: areas } = useAreas();
  const createBike = useCreateBike();
  const updateBike = useUpdateBike();
  const deleteBike = useDeleteBike();

  const filteredBikes = bikes?.filter((bike) => {
    const searchMatch =
      bike.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bike.number_plate.toLowerCase().includes(searchQuery.toLowerCase());
    const areaMatch = areaFilter === "all" || bike.area_id === areaFilter;
    const statusMatch = statusFilter === "all" || bike.status === statusFilter;
    return searchMatch && areaMatch && statusMatch;
  });

  const getAreaName = (areaId) => {
    if (!areaId || !areas) return "Not Assigned";
    return areas.find((a) => a._id === areaId)?.name || "Unknown";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.model || !formData.number_plate || !formData.cc) {
      toast.error("Please fill in all required fields");
      return;
    }

    const data = new FormData();
    for (let key in formData) {
      if (formData[key] !== null) data.append(key, formData[key]);
    }

    try {
      if (editingBike) {
        await updateBike.mutateAsync({ id: editingBike._id, formData: data });
      } else {
        await createBike.mutateAsync(data);
      }
      setIsOpen(false);
      setEditingBike(null);
      setFormData(initialFormData);
    } catch (error) {
      toast.error("Failed to save bike");
    }
  };
  const handleEdit = (bike) => {
    setEditingBike(bike);
    setFormData({
      ...bike,
      image_url: null, // reset, new file can be uploaded
    });
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
      setFormData(initialFormData);
    }
  };

  

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display text-gradient-sunset">Bikes</h1>
          <p className="text-muted-foreground">Manage your bike fleet</p>
        </div>

        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button className="gradient-sunset text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Add Bike
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg bg-card border-border max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle className="text-foreground">
                {editingBike ? "Edit Bike" : "Add New Bike"}
              </DialogTitle>
            </DialogHeader>
            <ScrollArea className="flex-1 overflow-auto pr-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Image Upload */}
                <div className="space-y-2">
                  <Label>Bike Image</Label>
                  <div className="space-y-2">
                    <Label>Bike Image</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          image_url: e.target.files[0],
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div />
                </div>

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
            placeholder="Search by model or number plate..."
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
                <div className="h-40 bg-muted relative overflow-hidden">
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
                    className={`absolute top-2 right-2  border bg-sunset text-black`}
                  >
                    {bike.status}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">
                        {bike.model}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {bike.number_plate}
                      </p>
                    </div>
                    <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
                      {bike.cc}cc
                    </span>
                  </div>

                  {/* Area Badge */}
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

                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(bike)}
                      className="flex-1 border-border hover:border-primary"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
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
