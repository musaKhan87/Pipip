import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

import {
  Bike,
  Calendar,
  Users,
  ClipboardList,
  BarChart3,
  Settings,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  MapPin,
  Activity,
} from "lucide-react";
import { cn } from "../../utils/utils";
import { Button } from "../ui/Button";
import { useAuth } from "../../utils/AuthProvider";

const menuItems = [
  {
    path: "/admin/panel",
    icon: LayoutDashboard,
    label: "Dashboard",
    end: true,
  },
  { path: "/admin/panel/bikes", icon: Bike, label: "Bikes" },
  { path: "/admin/panel/bookings", icon: ClipboardList, label: "Bookings" },
  {
    path: "/admin/panel/active-rentals",
    icon: Activity,
    label: "Active Rentals",
  },
  { path: "/admin/panel/scheduler", icon: Calendar, label: "Scheduler" },
  { path: "/admin/panel/customers", icon: Users, label: "Customers" },
  { path: "/admin/panel/areas", icon: MapPin, label: "Areas" },
  { path: "/admin/panel/reports", icon: BarChart3, label: "Reports" },
  { path: "/admin/panel/settings", icon: Settings, label: "Settings" },
];

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { signOut, user, role } = useAuth();

  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin");
  };

  const handleNavigation = () => {
    navigate("/#home");
  }

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="lg:hidden md:hidden fixed top-4 right-4 z-50 p-2 gradient-sunset rounded-lg text-primary-foreground shadow-golden"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay */}
      {collapsed && (
        <div
          className="lg:hidden md:hidden fixed inset-0 bg-background/80  backdrop-blur-md z-40"
          onClick={() => setCollapsed(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static md:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 lg:transform-none md:transform-none",
          collapsed ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="p-2">
                <button onClick={handleNavigation}>
                  <img
                    src="/logo.jpeg"
                    alt="Pipip"
                    className="w-12 h-12 rounded-full shadow-golden"
                  />
                </button>
              </div>
              <div>
                <h1 className="font-display text-xl text-gradient-sunset">
                  Pipip
                </h1>
                <p className="text-xs text-muted-foreground capitalize">
                  {role} Panel
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-hide">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={() => setCollapsed(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                    isActive
                      ? "gradient-sunset text-primary-foreground shadow-golden font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  )
                }
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* User */}
          <div className="p-4 border-t border-border">
            <div className="mb-3 px-4">
              <p className="text-sm font-medium truncate">{user?.email}</p>
              <p className="text-xs text-muted-foreground capitalize">{role}</p>
            </div>

            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
