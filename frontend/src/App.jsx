import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Catalog from "./pages/Catalog";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Bikes from "./pages/admin/Bikes";
import ScrollToTop from "./components/ScrollToTop";
import Bookings from "./pages/admin/Booking";
import AdminLayout from "./components/admin/AdminLayout";
import Areas from "./pages/admin/Areas";
import Customers from "./pages/admin/Customers";
import ActiveRentals from "./pages/admin/ActiveRentals";
import Scheduler from "./pages/admin/Scheduler";
import Reports from "./pages/admin/Reports";
import Dashboard from "./pages/admin/Dashboard";
import { AuthProvider } from "./utils/AuthProvider";
import AdminLogin from "./pages/AdminLogin";
import Settings from "./pages/admin/Settings";
import Contact from "./components/Contact";
import BookBike from "./pages/BookBike";

function App() {
  const queryClient = new QueryClient();
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/book/:bikeId" element={<BookBike />} />
              <Route path="/contact" element={<Contact/>} />
              <Route path="/admin" element={<AdminLogin />} />

              <Route path="/admin/panel" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="bikes" element={<Bikes />} />
                <Route path="bookings" element={<Bookings />} />
                <Route path="customers" element={<Customers />} />
                <Route path="areas" element={<Areas />} />
                <Route path="active-rentals" element={<ActiveRentals />} />
                <Route path="scheduler" element={<Scheduler />} />
                <Route path="reports" element={<Reports />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
