import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/Dialog";

import {
  Plus,
  Search,
  Phone,
  Mail,
  User,
  History,
  MapPin,
  CreditCard,
  FileImage,
  Eye,
} from "lucide-react";
import { Badge } from "../../components/ui/Badge";
import { format } from "date-fns";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/Tabs";
import { ScrollArea } from "../../components/ui/ScrollArea";
import { Label } from "../../components/ui/Label";
import {   useCustomers,
  useCreateCustomer,
  useCustomerBookings, } from "../../hooks/useCustomer";

const initialFormData = {
  name: "",
  phone: "",
  email: "",
  id_proof_type: "",
  id_proof_number: "",
  address: "",
};

function CustomerBookingsPanel({ customerId }) {
  const { data: bookings, isLoading } = useCustomerBookings(customerId);

  if (isLoading) return <p className="text-gray-500">Loading...</p>;

  return (
    <div className="space-y-2 max-h-60 overflow-y-auto">
      {bookings?.map((booking) => (
        <div
          key={booking._id}
          className="p-3 bg-black-50 rounded-lg flex items-center justify-between"
        >
          <div>
            <p className="font-medium">{booking.bikes?.model}</p>
            <p className="text-sm text-gray-500">
              {format(new Date(booking.start_datetime), "MMM d, yyyy HH:mm")} -{" "}
              {format(new Date(booking.end_datetime), "MMM d, yyyy HH:mm")}
            </p>
          </div>
          <Badge variant="outline">{booking.status}</Badge>
        </div>
      ))}
      {bookings?.length === 0 && (
        <p className="text-gray-500 text-center py-4">No bookings yet</p>
      )}
    </div>
  );
}

function DocumentImageViewer({ url, label }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!url) {
    return (
      <div className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg text-gray-500">
        <FileImage className="w-5 h-5" />
        <span>{label} not uploaded</span>
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg cursor-pointer hover:bg-primary/20 transition-colors">
          <FileImage className="w-5 h-5 text-primary" />
          <span className="text-primary font-medium">{label}</span>
          <Eye className="w-4 h-4 ml-auto text-primary" />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <img
            src={url}
            alt={label}
            className="w-full h-auto rounded-lg border"
            onError={(e) => {
              e.target.src = "/placeholder.svg";
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Customers() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [viewingCustomer, setViewingCustomer] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: customers, isLoading } = useCustomers(searchQuery);
  const createCustomer = useCreateCustomer();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone) {
      toast.error("Please fill in name and phone");
      return;
    }

    await createCustomer.mutateAsync(formData);
    setIsAddOpen(false);
    setFormData(initialFormData);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display text-gradient-sunset">
            Customers
          </h1>
          <p className="text-muted-foreground">View Customer Data</p>
        </div>

        {/* <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[calc(90vh-8rem)]">
              <form onSubmit={handleSubmit} className="space-y-4 pr-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="john@example.com"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="id_proof_type">ID Proof Type</Label>
                    <Input
                      id="id_proof_type"
                      value={formData.id_proof_type}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          id_proof_type: e.target.value,
                        })
                      }
                      placeholder="Aadhar / Driving License"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="id_proof_number">ID Number</Label>
                    <Input
                      id="id_proof_number"
                      value={formData.id_proof_number}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          id_proof_number: e.target.value,
                        })
                      }
                      placeholder="XXXX-XXXX-XXXX"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="Full address"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-primary">
                    Add Customer
                  </Button>
                </div>
              </form>
            </ScrollArea>
          </DialogContent>
        </Dialog> */}
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search by name, phone, or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customers?.map((customer, index) => (
            <motion.div
              key={customer._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setViewingCustomer(customer)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{customer.name}</h3>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Phone className="w-3 h-3" />
                          {customer.phone}
                        </div>
                      </div>
                    </div>
                  </div>

                  {customer.email && (
                    <div className="mt-2 flex items-center gap-1 text-sm text-gray-600">
                      <Mail className="w-3 h-3" />
                      {customer.email}
                    </div>
                  )}

                  {customer.id_proof_type && (
                    <div className="mt-2 flex items-center gap-1 text-sm text-gray-600">
                      <CreditCard className="w-3 h-3" />
                      {customer.id_proof_type}: {customer.id_proof_number}
                    </div>
                  )}

                  <div className="mt-4 flex gap-2">
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <History className="w-3 h-3" />
                      View Details
                    </Badge>
                    {(customer.aadhaar_image_url ||
                      customer.license_image_url) && (
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        <FileImage className="w-3 h-3" />
                        Documents
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {customers?.length === 0 && (
            <div className="col-span-full text-center py-12">
              <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No customers found</p>
            </div>
          )}
        </div>
      )}

      <Dialog
        open={!!viewingCustomer}
        onOpenChange={() => setViewingCustomer(null)}
      >
        <DialogContent className="max-w-lg max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
          </DialogHeader>
          {viewingCustomer && (
            <ScrollArea className="max-h-[calc(90vh-8rem)]">
              <div className="space-y-4 pr-4">
                <div className="flex items-center gap-3 p-4 bg-black-50 rounded-lg">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">
                      {viewingCustomer.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {viewingCustomer.phone}
                    </p>
                  </div>
                </div>

                <Tabs defaultValue="details">
                  <TabsList className="w-full">
                    <TabsTrigger value="details" className="flex-1">
                      Details
                    </TabsTrigger>
                    <TabsTrigger value="documents" className="flex-1">
                      Documents
                    </TabsTrigger>
                    <TabsTrigger value="bookings" className="flex-1">
                      Bookings
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="mt-4 space-y-3">
                    {viewingCustomer.email && (
                      <div className="flex items-center gap-3 p-3 bg-black-50 rounded-lg">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Email</p>
                          <p className="font-medium">{viewingCustomer.email}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3 p-3 bg-black-50 rounded-lg">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Phone</p>
                        <p className="font-medium">{viewingCustomer.phone}</p>
                      </div>
                    </div>

                    {viewingCustomer.address && (
                      <div className="flex items-center gap-3 p-3 bg-black-50 rounded-lg">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Address</p>
                          <p className="font-medium">
                            {viewingCustomer.address}
                          </p>
                        </div>
                      </div>
                    )}

                    {viewingCustomer.id_proof_type && (
                      <div className="flex items-center gap-3 p-3 bg-black-50 rounded-lg">
                        <CreditCard className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">
                            {viewingCustomer.id_proof_type}
                          </p>
                          <p className="font-medium">
                            {viewingCustomer.id_proof_number}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="text-sm text-gray-500 pt-2">
                      Customer since{" "}
                      {viewingCustomer.createdAt || viewingCustomer.created_at
                        ? format(
                            new Date(
                              viewingCustomer.createdAt ||
                                viewingCustomer.created_at,
                            ),
                            "MMM d, yyyy",
                          )
                        : "N/A"}
                    </div>
                  </TabsContent>

                  <TabsContent value="documents" className="mt-4 space-y-3">
                    <DocumentImageViewer
                      url={viewingCustomer.aadhaar_image_url}
                      label="Aadhaar Card"
                    />
                    <DocumentImageViewer
                      url={viewingCustomer.license_image_url}
                      label="Driving License"
                    />

                    {!viewingCustomer.aadhaar_image_url &&
                      !viewingCustomer.license_image_url && (
                        <p className="text-gray-500 text-center py-4">
                          No documents uploaded
                        </p>
                      )}
                  </TabsContent>

                  <TabsContent value="bookings" className="mt-4">
                    <CustomerBookingsPanel customerId={viewingCustomer._id} />
                  </TabsContent>
                </Tabs>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
