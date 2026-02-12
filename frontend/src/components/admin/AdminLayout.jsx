import { Outlet, Navigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { Loader2 } from "lucide-react";
import { useAuth } from "../../utils/AuthProvider";

export default function AdminLayout() {
  const { user, isAdminOrStaff, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin" state={{ from: "/admin/panel" }} replace />;
  }

  if (!isAdminOrStaff) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8 bg-card border border-border rounded-2xl shadow-golden max-w-md">
          <h2 className="text-2xl font-bold text-destructive mb-2">
            Access Denied
          </h2>
          <p className="text-muted-foreground mb-4">
            You don't have permission to access the admin panel. Please contact
            an administrator to get access.
          </p>
          <a href="/" className="text-primary hover:underline">
            Return to Website
          </a>
        </div>
      </div>
    );
  }

  // return (
  //   <div className="min-h-screen bg-background flex">
  //     <AdminSidebar />
  //     <main className="flex-1 p-4 lg:p-8 overflow-auto">
  //       <div className="max-w-7xl mx-auto">
  //         <Outlet />
  //       </div>
  //     </main>
  //   </div>
  // );

  // AdminLayout.jsx

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <AdminSidebar />

      {/* Added scrollbar-hide here */}
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto h-full bg-background scrollbar-hide">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
