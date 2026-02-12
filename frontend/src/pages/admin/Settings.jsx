import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { toast } from "sonner";
import { User, Shield, Users, Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/Dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/Select";
import { useAuth } from "../../utils/AuthProvider";

export default function Settings() {
 const { user, isAdmin } = useAuth();
 const [staffList, setStaffList] = useState([]);
 const [loading, setLoading] = useState(true);
 const [isAddOpen, setIsAddOpen] = useState(false);
 const [newStaff, setNewStaff] = useState({
   email: "",
   password: "",
   fullName: "", // Changed to match your MERN backend schema
   role: "staff",
 });

 // Base URL for your Node.js backend
  //  const API_URL = "http://localhost:5000/api/auth";
  const API_URL = "https://pipip-backend.onrender.com/api/auth";


 useEffect(() => {
   fetchStaff();
 }, []);

 const fetchStaff = async () => {
   try {
     const token = localStorage.getItem("token"); // Assuming you store JWT here
     const res = await fetch(`${API_URL}/staff`, {
       headers: {
         Authorization: `Bearer ${token}`,
       },
     });

     if (!res.ok) throw new Error("Failed to fetch staff list");

     const data = await res.json();
     setStaffList(data);
   } catch (err) {
     console.error("Error fetching staff:", err);
     toast.error("Could not load team members");
   } finally {
     setLoading(false);
   }
 };

 const handleAddStaff = async (e) => {
   e.preventDefault();

   if (!newStaff.email || !newStaff.password || !newStaff.fullName) {
     toast.error("Please fill in all fields");
     return;
   }

   try {
     const token = localStorage.getItem("token");
     const res = await fetch(`${API_URL}/register`, {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
         Authorization: `Bearer ${token}`,
       },
       body: JSON.stringify(newStaff),
     });

     const data = await res.json();

     if (!res.ok) throw new Error(data.message || "Failed to create account");

     toast.success(
       `${newStaff.role === "admin" ? "Admin" : "Staff"} account created successfully`,
     );
     setIsAddOpen(false);
     setNewStaff({ email: "", password: "", fullName: "", role: "staff" });
     fetchStaff();
   } catch (err) {
     toast.error(err.message);
   }
 };

 const handleRemoveStaff = async (staffId) => {
   if (staffId === user?._id) {
     // MongoDB uses _id
     toast.error("You can't remove yourself");
     return;
   }

   if (!confirm("Are you sure you want to remove this staff member?")) return;

   try {
     const token = localStorage.getItem("token");
     const res = await fetch(`${API_URL}/${staffId}`, {
       method: "DELETE",
       headers: {
         Authorization: `Bearer ${token}`,
       },
     });

     if (!res.ok) throw new Error("Failed to remove staff");

     toast.success("Staff member removed");
     fetchStaff();
   } catch (err) {
     toast.error(err.message);
   }
 };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display text-gradient-sunset">Settings</h1>
        <p className="text-muted-foreground">Manage your account and team</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Your Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-500">Email</Label>
              <p className="font-medium">{user?.email}</p>
            </div>
            <div>
              <Label className="text-gray-500">Role</Label>
              <p className="font-medium capitalize">
                {user?.role === "admin" ? "Administrator" : "Staff"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {isAdmin && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Team Management
              </CardTitle>
              <CardDescription>
                Add and manage admin/staff accounts
              </CardDescription>
            </div>
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Staff
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Staff Member</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddStaff} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input
                      value={newStaff.fullName}
                      onChange={(e) =>
                        setNewStaff({ ...newStaff, fullName: e.target.value })
                      }
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={newStaff.email}
                      onChange={(e) =>
                        setNewStaff({ ...newStaff, email: e.target.value })
                      }
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input
                      type="password"
                      value={newStaff.password}
                      onChange={(e) =>
                        setNewStaff({ ...newStaff, password: e.target.value })
                      }
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Select
                      value={newStaff.role}
                      onValueChange={(v) =>
                        setNewStaff({ ...newStaff, role: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="staff">Staff</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-primary">
                      Create Account
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : (
              <div className="space-y-3">
                {staffList.map((staff) => (
                  <div
                    key={staff._id}
                    className="flex items-center justify-between p-4 bg-black-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full ${staff.role === "admin" ? "bg-purple-100" : "bg-blue-100"}`}
                      >
                        <Shield
                          className={`w-4 h-4 ${staff.role === "admin" ? "text-purple-600" : "text-blue-600"}`}
                        />
                      </div>
                      <div>
                        <p className="font-medium">{staff.fullName}</p>
                        <p className="text-sm text-gray-500 capitalize">
                          {staff.role}
                        </p>
                      </div>
                    </div>
                    {staff._id !== user?._id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveStaff(staff._id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {staffList.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    No staff members yet
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Instructions Card */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-gray-600">
          <p>
            • <strong>First Admin:</strong> The first admin account needs to be
            created via the database. Add a user role with 'admin' role.
          </p>
          <p>
            • <strong>Bikes:</strong> Add your bike fleet with pricing before
            creating bookings.
          </p>
          <p>
            • <strong>Bookings:</strong> Create manual bookings or receive
            online booking requests.
          </p>
          <p>
            • <strong>Scheduler:</strong> View all bookings on the calendar for
            easy management.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
