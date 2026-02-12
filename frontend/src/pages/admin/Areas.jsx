import { useState } from "react";
import { Plus, Search, MapPin, Pencil, Trash2, Loader2 } from "lucide-react";

import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/Badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/Dialog";
import { Label } from "../../components/ui/Label";
import { Switch } from "../../components/ui/Switch";

import {
  
  useCreateArea,
  useUpdateArea,
  useDeleteArea,
  useAllAreas,
} from "../../hooks/useAreas";

export default function Areas() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingArea, setEditingArea] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    city: "Mumbai",
    is_active: true,
  });
  const [searchQuery, setSearchQuery] = useState("");

  const { data: areas, isLoading } = useAllAreas();
  const createArea = useCreateArea();
  const updateArea = useUpdateArea();
  const deleteArea = useDeleteArea();

  const filteredAreas = areas?.filter(
    (area) =>
      area.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      area.city.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingArea) {
      updateArea.mutate(
        { id: editingArea._id, ...formData },
        { onSuccess: () => setIsOpen(false) },
      );
    } else {
      createArea.mutate(formData, {
        onSuccess: () => setIsOpen(false),
      });
    }
  };

  const handleEdit = (area) => {
    setEditingArea(area);
    setFormData({
      name: area.name,
      city: area.city,
      is_active: area.is_active,
    });
    setIsOpen(true);
  };

  const handleOpenChange = (open) => {
    setIsOpen(open);
    if (!open) {
      setEditingArea(null);
      setFormData({ name: "", city: "Mumbai", is_active: true });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display text-gradient-sunset">Areas</h1>
          <p className="text-muted-foreground">Manage pickup/drop locations</p>
        </div>

        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button className="gradient-sunset text-primary-foreground shadow-golden">
              <Plus className="w-4 h-4 mr-2" />
              Add Area
            </Button>
          </DialogTrigger>

          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">
                {editingArea ? "Edit Area" : "Add New Area"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Area Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="bg-input border-border"
                />
              </div>

              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  required
                  className="bg-input border-border"
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_active: checked })
                  }
                />
                <Label>Active</Label>
              </div>

              <Button
                type="submit"
                className="w-full gradient-sunset text-primary-foreground"
                disabled={createArea.isPending || updateArea.isPending}
              >
                {(createArea.isPending || updateArea.isPending) && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                {editingArea ? "Update" : "Add"} Area
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search areas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-input border-border"
        />
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAreas?.map((area) => (
            <Card
              key={area._id}
              className="bg-card border-border hover:border-primary/50 transition-colors"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-foreground">
                      {area.name}
                    </h3>
                  </div>

                  <Badge
                    variant={area.is_active ? "default" : "secondary"}
                    className={
                      area.is_active ? "bg-green-500/20 text-green-400" : ""
                    }
                  >
                    {area.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                  {area.city}
                </p>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(area)}
                    className="flex-1 border-border"
                  >
                    <Pencil className="w-3 h-3 mr-1" />
                    Edit
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteArea.mutate(area._id)}
                    className="flex-1"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
