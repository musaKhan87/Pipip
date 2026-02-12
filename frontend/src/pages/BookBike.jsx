import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { format, differenceInHours } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  FileText,
  User,
  CreditCard,
  Check,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Banknote,
} from "lucide-react";

import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Textarea } from "../components/ui/Textarea";
import { Alert, AlertDescription } from "../components/ui/Alert";

import { toast } from "sonner";
import { Button } from "../components/ui/Button";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useBike } from "../hooks/useBikes";
import { useActiveAreas } from "../hooks/useAreas";
import { useBikeAvailability } from "../hooks/useBikeAvailability";
import { useCreateCustomer } from "../hooks/useCustomer";
import { useCreateBooking } from "../hooks/useBooking";

const initialCustomerData = {
  name: "",
  phone: "",
  email: "",
  address: "",
  id_proof_type: "aadhaar",
  id_proof_number: "",
  aadhaar_image: null, // 👈 FILE
  license_image: null, // 👈 FILE
};

export default function BookBike() {
  const { bikeId } = useParams();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [paymentFailed, setPaymentFailed] = useState(false);

  const startParam = searchParams.get("start");
  const endParam = searchParams.get("end");
  const areaParam = searchParams.get("area");

  const [step, setStep] = useState(1);
  const [customerData, setCustomerData] = useState(initialCustomerData);
  const [startDate, setStartDate] = useState(startParam || "");
  const [endDate, setEndDate] = useState(endParam || "");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [availabilityMessage, setAvailabilityMessage] = useState(null);
  const [isAvailable, setIsAvailable] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState("online"); // 'online' or 'cash'

  const { data: bike, isLoading: bikeLoading } = useBike(bikeId || "");
  const { data: areas } = useActiveAreas();
  const createCustomer = useCreateCustomer();
  const createBooking = useCreateBooking();
  const { checkAvailability, checking } = useBikeAvailability();

  // const handleOnlinePayment = async () => {
  //   try {
  //     setIsSubmitting(true);

  //     // 1️⃣ Create / get customer
  //     const formData = new FormData();
  //     Object.entries(customerData).forEach(([key, value]) => {
  //       if (value !== null) formData.append(key, value);
  //     });
  //     const customer = await createCustomer.mutateAsync(formData);

  //     // 2️⃣ Create payment order (backend)
  //     const res = await fetch("http://localhost:5000/api/payment/create-order", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         amount: calculatePrice(),
  //         customerName: customerData.name,
  //         customerEmail: customerData.email || "test@email.com",
  //         customerPhone: customerData.phone,
  //       }),
  //     });

  //     if (!res.ok) throw new Error("Payment order failed");
  //     const data = await res.json();

  //     // 3️⃣ Init Cashfree
  //     const cashfree = new window.Cashfree({ mode: "sandbox" });

  //     // 4️⃣ Open Checkout with Callbacks
  //     await cashfree
  //       .checkout({
  //         paymentSessionId: data.paymentSessionId,
  //         redirectTarget: "_modal",
  //       })
  //       .then(async (result) => {
  //         if (result.error) {
  //           // This handles immediate SDK errors
  //           toast.error(result.error.message);
  //           setIsSubmitting(false);
  //         }

  //         if (result.redirect) {
  //           // This is for some payment methods that require redirects
  //           console.log("Payment will redirect");
  //         }
  //       });

  //     // 5️⃣ Polling or Manual Status Check
  //     // Since we are in a modal, we check the status after the modal closes
  //     // Or you can use a settimeout/polling to check your backend for "PAID" status
  //     checkStatusAndConfirm(data.orderId, customer._id);
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("An error occurred during payment.");
  //     setIsSubmitting(false);
  //   }
  //   };

  //   const checkStatusAndConfirm = async (orderId, customerId) => {
  //     try {
  //       // Call your backend to verify order status with Cashfree API
  //       const verifyRes = await fetch(
  //         `http://localhost:5000/api/payment/verify/${orderId}`,
  //       );
  //       const verifyData = await verifyRes.json();

  //       if (verifyData.status === "PAID" || verifyData.status === "SUCCESS") {
  //         // ONLY NOW create the booking
  //         await createBooking.mutateAsync({
  //           bike_id: bike._id,
  //           customer_id: customerId,
  //           start_datetime: new Date(startDate).toISOString(),
  //           end_datetime: new Date(endDate).toISOString(),
  //           total_amount: calculatePrice(),
  //           payment_status: "paid",
  //           status: "confirmed",
  //           payment_order_id: orderId,
  //         });

  //         setBookingComplete(true);
  //         toast.success("Payment successful & booking confirmed!");
  //       } else {
  //         toast.error("Payment failed: " + (verifyData.message || "Incomplete"));
  //       }
  //     } catch (error) {
  //       toast.error("Could not verify payment status.");
  //     } finally {
  //       setIsSubmitting(false);
  //     }
  //   };

  // const handleCashBooking = async () => {
  //   try {
  //     setIsSubmitting(true);

  //     // 1. Create the customer first
  //     const formData = new FormData();
  //     Object.entries(customerData).forEach(([key, value]) => {
  //       if (value !== null) formData.append(key, value);
  //     });
  //     const customer = await createCustomer.mutateAsync(formData);

  //     // 2. Create booking directly with 'pending' payment status
  //     await createBooking.mutateAsync({
  //       bike_id: bike._id,
  //       customer_id: customer._id,
  //       start_datetime: new Date(startDate).toISOString(),
  //       end_datetime: new Date(endDate).toISOString(),
  //       total_amount: calculatePrice(),
  //       payment_status: "pending",
  //       status: "pending",
  //       booking_source: "website",
  //     });

  //     setBookingComplete(true);
  //     toast.success("Booking requested! Please pay at the shop.");
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Failed to process cash booking.");
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  // const handleOnlinePayment = async () => {
  //   try {
  //     setIsSubmitting(true);
  //     setPaymentFailed(false);

  //     // 1️⃣ Create customer
  //     const formData = new FormData();
  //     Object.entries(customerData).forEach(([key, value]) => {
  //       if (value !== null) formData.append(key, value);
  //     });
  //     const customer = await createCustomer.mutateAsync(formData);

  //     // 2️⃣ Create Cashfree order
  //     const res = await fetch(
  //       "http://localhost:5000/api/payment/create-order",
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({
  //           amount: calculatePrice(),
  //           customerName: customerData.name,
  //           customerEmail: customerData.email || "test@email.com",
  //           customerPhone: customerData.phone,
  //         }),
  //       },
  //     );

  //     if (!res.ok) throw new Error("Payment order failed");
  //     const data = await res.json();

  //     // 3️⃣ Init Cashfree
  //     const cashfree = new window.Cashfree({ mode: "sandbox" });

  //     // 4️⃣ Open Checkout
  //     const result = await cashfree.checkout({
  //       paymentSessionId: data.paymentSessionId,
  //       redirectTarget: "_modal",
  //     });

  //     // 5️⃣ Handle Result
  //     if (result.error) {
  //       // ❌ Payment failed / cancelled
  //       console.error(result.error);
  //       toast.error("Payment failed or cancelled");
  //       setPaymentFailed(true);
  //       setIsSubmitting(false);
  //       return;
  //     }

  //     // ✅ Payment attempt completed → now verify
  //     await checkStatusAndConfirm(data.orderId, customer._id);
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("An error occurred during payment.");
  //     setPaymentFailed(true);
  //     setIsSubmitting(false);
  //   }
  // };
  // --- 1. ONLINE PAYMENT FLOW ---
  const handleOnlinePayment = async () => {
    try {
      setIsSubmitting(true);
      setPaymentFailed(false);

      // 1. Create/Get the Customer
      const formData = new FormData();
      Object.entries(customerData).forEach(([key, value]) => {
        if (value !== null) formData.append(key, value);
      });
      const customer = await createCustomer.mutateAsync(formData);

      // 2. Create the Order on your Backend
      const res = await fetch(
        "http://localhost:5000/api/payment/create-order",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: calculatePrice(),
            customerName: customerData.name,
            customerEmail: customerData.email || "test@email.com",
            customerPhone: customerData.phone,
          }),
        },
      );

      if (!res.ok) throw new Error("Payment order failed");
      const data = await res.json();

      // 3. Initialize Cashfree
      const cashfree = new window.Cashfree({ mode: "sandbox" });

      // 4. CRITICAL FIX: Await the checkout
      // This pauses the code until the user finishes in the modal
      const result = await cashfree.checkout({
        paymentSessionId: data.paymentSessionId,
        redirectTarget: "_modal",
      });

      // 5. Handle the Result AFTER the modal closes
      if (result.error) {
        // If user cancels or payment fails at gateway
        setPaymentFailed(true);
        setIsSubmitting(false);
      } else {
        // Modal closed successfully, verify with your backend
        await checkStatusAndConfirm(data.orderId, customer._id);
      }
    } catch (err) {
      console.error("Payment Error:", err);
      setPaymentFailed(true);
      setIsSubmitting(false);
    }
  };

const checkStatusAndConfirm = async (orderId, customerId) => {
  try {
    // Pass booking details in query params so backend can save them
    const queryParams = new URLSearchParams({
      customerId: customerId,
      bikeId: bike._id,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      amount: calculatePrice(),
    }).toString();

    const verifyRes = await fetch(
      `http://localhost:5000/api/payment/verify/${orderId}?${queryParams}`,
    );
    const verifyData = await verifyRes.json();

    if (verifyData.status === "PAID") {
      setBookingComplete(true);
      toast.success("Booking Confirmed!");
    } else {
      setPaymentFailed(true);
    }
  } catch (error) {
    setPaymentFailed(true);
  } finally {
    setIsSubmitting(false);
  }
};
  // --- 2. OFFLINE (CASH) BOOKING FLOW ---
  const handleCashBooking = async () => {
    try {
      setIsSubmitting(true);

      // Create Customer
      const formData = new FormData();
      Object.entries(customerData).forEach(([key, value]) => {
        if (value !== null) formData.append(key, value);
      });
      const customer = await createCustomer.mutateAsync(formData);

      // Submit Booking with 'cash' method
      await createBooking.mutateAsync({
        bike_id: bike._id,
        customer_id: customer._id,
        start_datetime: new Date(startDate).toISOString(),
        end_datetime: new Date(endDate).toISOString(),
        total_amount: calculatePrice(),
        payment_method: "cash", // FIX: Sets method to cash in database
        payment_status: "pending",
        status: "pending",
        booking_source: "website",
      });

      setBookingComplete(true);
      toast.success("Booking requested! Pay at pickup.");
    } catch (err) {
      console.error("Cash Booking Error:", err);
      toast.error("Failed to process cash booking.");
    } finally {
      setIsSubmitting(false);
    }
  };


  /* =========================
     AVAILABILITY CHECK
  ========================= */
  useEffect(() => {
    const checkDates = async () => {
      if (!bikeId || !startDate || !endDate) {
        setAvailabilityMessage(null);
        setIsAvailable(null);

        return;
      }

      const start = new Date(startDate);
      const end = new Date(endDate);

      if (end <= start) {
        setAvailabilityMessage("⚠️ Return date must be after pickup date");
        setIsAvailable(false);
        return;
      }

      const result = await checkAvailability(bikeId, start, end);

      if (!result.isAvailable) {
        const fromDate = new Date(result.bookedFrom).toLocaleDateString(
          "en-IN",
          {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          },
        );

        const fromTime = new Date(result.bookedFrom).toLocaleTimeString(
          "en-IN",
          {
            hour: "2-digit",
            minute: "2-digit",
          },
        );

        const toDate = new Date(result.bookedTo).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });

        const toTime = new Date(result.bookedTo).toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        });

        setAvailabilityMessage(
          `Bike is booked from ${fromDate} ${fromTime} to ${toDate} ${toTime}`,
        );
      } else {
        setAvailabilityMessage(result.message);
      }
      setIsAvailable(result.isAvailable);
    };

    checkDates();
  }, [bikeId, startDate, endDate, checkAvailability]);

  /* =========================
     HELPERS
  ========================= */
  const getAreaName = (areaId) => {
    if (!areaId || !areas) return "Mumbai";
    return areas.find((a) => a._id === areaId)?.name || "Mumbai";
  };

  const calculatePrice = () => {
    if (!bike || !startDate || !endDate) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalHours = Math.max(1, differenceInHours(end, start));

    const days = Math.floor(totalHours / 24);
    const remainingHours = totalHours % 24;

    return (
      days * Number(bike.price_per_day) +
      remainingHours * Number(bike.price_per_hour)
    );
  };

  const roundToHour = (dateTimeStr) => {
    if (!dateTimeStr) return "";
    const date = new Date(dateTimeStr);
    const minutes = date.getMinutes();

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

  /* =========================
     DATE HANDLERS
  ========================= */
  const handleStartDateChange = (value) => {
    setStartDate(roundToHour(value));
  };

  const handleEndDateChange = (value) => {
    setEndDate(roundToHour(value));
  };

  /* =========================
     CUSTOMER STEP
  ========================= */
  const handleCustomerSubmit = (e) => {
    e.preventDefault();

    if (!customerData.name || !customerData.phone) {
      toast.error("Please fill in name and phone number");
      return;
    }

    if (!customerData.aadhaar_image && !customerData.license_image) {
      toast.error("Please upload at least one ID proof");
      return;
    }

    setStep(2);
  };

  /* =========================
     BOOKING SUBMIT
  ========================= */
  const handleBookingSubmit = async () => {
    if (!bike || !startDate || !endDate) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();

      Object.entries(customerData).forEach(([key, value]) => {
        if (value !== null) {
          formData.append(key, value);
        }
      });

      const customer = await createCustomer.mutateAsync(formData);

      await createBooking.mutateAsync({
        bike_id: bike._id,
        customer_id: customer._id,
        start_datetime: new Date(startDate).toISOString(),
        end_datetime: new Date(endDate).toISOString(),
        total_amount: calculatePrice(),
        notes: notes || undefined,
        booking_source: "website",
        status: "pending",
      });

      setBookingComplete(true);
      toast.success("Booking request submitted!");
    } catch (err) {
      toast.error("Failed to create booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  // In your handleOnlinePayment catch or verify check:
  // if (failed) setPaymentFailed(true);

  // if (paymentFailed) {
  //   return (
  //     <div className="text-center p-8 bg-card border border-red-500/30 rounded-2xl">
  //       <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
  //       <h2 className="text-xl font-bold">Payment Failed</h2>
  //       <p className="text-muted-foreground mb-4">
  //         Don't worry, no money was deducted.
  //       </p>
  //       <Button onClick={() => setPaymentFailed(false)}>Try Again</Button>
  //     </div>
  //   );
  // }

  if (paymentFailed) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="max-w-md w-full text-center p-10 bg-card/50 backdrop-blur-xl border border-red-500/20 rounded-[2.5rem] shadow-2xl shadow-red-500/10"
        >
          {/* Animated Icon Container */}
          <div className="relative w-24 h-24 mx-auto mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12, delay: 0.2 }}
              className="absolute inset-0 bg-red-500/10 rounded-full blur-xl"
            />
            <div className="relative bg-gradient-to-br from-red-500 to-orange-600 w-24 h-24 rounded-full flex items-center justify-center shadow-lg shadow-red-500/40">
              <XCircle className="w-12 h-12 text-white stroke-[2.5px]" />
            </div>
          </div>

          {/* Text Content */}
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground mb-3">
            Payment Declined
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-8 px-4">
            We couldn't process your transaction. Don't worry, if any amount was
            debited, it will be
            <span className="text-foreground font-medium underline decoration-red-500/30">
              refunded automatically
            </span>
            within 3-5 days.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => setPaymentFailed(false)}
              size="lg"
              className="w-full h-14 text-lg font-bold gradient-sunset text-primary-foreground rounded-2xl shadow-xl shadow-orange-500/20 hover:scale-[1.02] transition-transform active:scale-95"
            >
              Try Another Way
            </Button>

            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="w-full h-12 text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel & Go Home
            </Button>
          </div>

          {/* Footer Note */}
          <div className="mt-8 pt-8 border-t border-border/50">
            <p className="text-xs text-muted-foreground/60 uppercase tracking-widest font-semibold">
              Secure Payment Gateway
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (bikeLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!bike) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <p className="text-muted-foreground mb-4">Bike not found</p>
        <Button onClick={() => navigate("/")}>Go Home</Button>
      </div>
    );
  }

  if (bookingComplete) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background pt-52 pb-12 ">
          <div className="container mx-auto px-4 max-w-lg">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card border border-border rounded-2xl p-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Check className="w-10 h-10 text-green-500" />
              </motion.div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Booking Submitted!
              </h1>
              <p className="text-muted-foreground mb-6">
                Your booking request for{" "}
                <span className="text-primary">{bike.model}</span> has been
                received. Our team will contact you shortly to confirm.
              </p>
              <div className="space-y-2 text-sm text-muted-foreground mb-6">
                <p>
                  📞 We'll call you at:{" "}
                  <span className="text-foreground">{customerData.phone}</span>
                </p>
                <p>
                  📅 Pickup:{" "}
                  <span className="text-foreground">
                    {format(new Date(startDate), "PPp")}
                  </span>
                </p>
                <p>
                  📅 Return:{" "}
                  <span className="text-foreground">
                    {format(new Date(endDate), "PPp")}
                  </span>
                </p>
              </div>
              <Button
                onClick={() => navigate("/")}
                className="gradient-sunset text-primary-foreground"
              >
                Back to Home
              </Button>
            </motion.div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24 pb-12">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Bike Summary */}
            <div className="lg:col-span-1">
              <Card className="bg-card border-border sticky top-24">
                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  {bike.image_url ? (
                    <img
                      src={bike.image_url}
                      alt={bike.model}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground">No Image</span>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h2 className="text-xl font-bold text-foreground mb-1">
                    {bike.model}
                  </h2>
                  <p className="text-muted-foreground text-sm mb-3">
                    {bike.number_plate} • {bike.cc}cc
                  </p>

                  <div className="flex items-center gap-1 text-sm mb-4">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">
                      {getAreaName(bike.area_id)}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm border-t border-border pt-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Hourly Rate</span>
                      <span className="text-foreground">
                        ₹{bike.price_per_hour}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Daily Rate</span>
                      <span className="text-foreground">
                        ₹{bike.price_per_day}
                      </span>
                    </div>
                    {startDate && endDate && (
                      <>
                        <div className="border-t border-border my-2" />
                        <div className="flex justify-between font-semibold">
                          <span className="text-foreground">
                            Estimated Total
                          </span>
                          <span className="text-primary">
                            ₹{calculatePrice()}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Booking Form */}
            <div className="lg:col-span-2 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
              {/* Progress Steps */}
              <div className="flex items-center gap-4 mb-8">
                <div
                  className={`flex items-center gap-2 ${step >= 1 ? "text-primary" : "text-muted-foreground"}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                  >
                    1
                  </div>
                  <span className="font-medium">Your Details</span>
                </div>
                <div className="flex-1 h-0.5 bg-border" />
                <div
                  className={`flex items-center gap-2 ${step >= 2 ? "text-primary" : "text-muted-foreground"}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                  >
                    2
                  </div>
                  <span className="font-medium">Confirm Booking</span>
                </div>
              </div>

              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-foreground flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" />
                        Your Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form
                        onSubmit={handleCustomerSubmit}
                        className="space-y-6"
                      >
                        {/* Personal Info */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name *</Label>
                            <Input
                              id="name"
                              value={customerData.name}
                              onChange={(e) =>
                                setCustomerData({
                                  ...customerData,
                                  name: e.target.value,
                                })
                              }
                              placeholder="Enter your name"
                              className="bg-input border-border"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number *</Label>
                            <Input
                              id="phone"
                              value={customerData.phone}
                              onChange={(e) =>
                                setCustomerData({
                                  ...customerData,
                                  phone: e.target.value,
                                })
                              }
                              placeholder="+91 98765 43210"
                              className="bg-input border-border"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email (Optional)</Label>
                            <Input
                              id="email"
                              type="email"
                              value={customerData.email}
                              onChange={(e) =>
                                setCustomerData({
                                  ...customerData,
                                  email: e.target.value,
                                })
                              }
                              placeholder="your@email.com"
                              className="bg-input border-border"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="id_number">ID Proof Number</Label>
                            <Input
                              id="id_number"
                              value={customerData.id_proof_number}
                              onChange={(e) =>
                                setCustomerData({
                                  ...customerData,
                                  id_proof_number: e.target.value,
                                })
                              }
                              placeholder="Aadhaar/License Number"
                              className="bg-input border-border"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="address">Address (Optional)</Label>
                          <Textarea
                            id="address"
                            value={customerData.address}
                            onChange={(e) =>
                              setCustomerData({
                                ...customerData,
                                address: e.target.value,
                              })
                            }
                            placeholder="Your address"
                            className="bg-input border-border"
                            rows={2}
                          />
                        </div>

                        {/* Document Upload */}
                        <div className="border-t border-border pt-6">
                          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-secondary" />
                            ID Proof Documents
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Upload both ID proof (Aadhaar Card and Driving
                            License)
                          </p>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Aadhaar Card Photo *</Label>
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                  setCustomerData({
                                    ...customerData,
                                    aadhaar_image: e.target.files[0],
                                  })
                                }
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Driving License Photo *</Label>
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                  setCustomerData({
                                    ...customerData,
                                    license_image: e.target.files[0],
                                  })
                                }
                                required
                              />
                            </div>
                          </div>
                        </div>

                        {/* Booking Dates */}
                        <div className="border-t border-border pt-6">
                          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-primary" />
                            Booking Period
                          </h3>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="startDate">
                                Pickup Date & Time *
                              </Label>
                              <Input
                                id="startDate"
                                type="datetime-local"
                                value={startDate}
                                onChange={(e) =>
                                  handleStartDateChange(e.target.value)
                                }
                                step="3600"
                                className="bg-input border-border [color-scheme:dark] "
                                required
                              />
                              <p className="text-xs text-muted-foreground">
                                Time will round to nearest hour
                              </p>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="endDate">
                                Return Date & Time *
                              </Label>
                              <Input
                                id="endDate"
                                type="datetime-local"
                                value={endDate}
                                onChange={(e) =>
                                  handleEndDateChange(e.target.value)
                                }
                                min={startDate}
                                step="3600"
                                className="bg-input border-border [color-scheme:dark] "
                                required
                              />
                              <p className="text-xs text-muted-foreground">
                                Time will round to nearest hour
                              </p>
                            </div>
                          </div>

                          {/* Availability Message */}
                          <AnimatePresence mode="wait">
                            {availabilityMessage && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Alert
                                  className={`${isAvailable ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"}`}
                                >
                                  {isAvailable ? (
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <AlertCircle className="h-4 w-4 text-red-500" />
                                  )}
                                  <AlertDescription
                                    className={`${isAvailable ? "text-green-400" : "text-red-400"}`}
                                  >
                                    {availabilityMessage}
                                  </AlertDescription>
                                </Alert>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {checking && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
                              Checking availability...
                            </div>
                          )}
                        </div>

                        <Button
                          type="submit"
                          className="w-full gradient-sunset text-primary-foreground"
                          disabled={isAvailable === false || checking}
                        >
                          {isAvailable === false
                            ? "Bike Not Available"
                            : "Continue to Confirm"}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-foreground flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-primary" />
                        Confirm Your Booking
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Customer
                          </span>
                          <span className="text-foreground">
                            {customerData.name}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Phone</span>
                          <span className="text-foreground">
                            {customerData.phone}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Bike</span>
                          <span className="text-foreground">{bike.model}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Pickup</span>
                          <span className="text-foreground">
                            {format(new Date(startDate), "PPp")}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Return</span>
                          <span className="text-foreground">
                            {format(new Date(endDate), "PPp")}
                          </span>
                        </div>
                        <div className="border-t border-border pt-2">
                          <div className="flex justify-between font-semibold">
                            <span className="text-foreground">
                              Total Amount
                            </span>
                            <span className="text-primary text-lg">
                              ₹{calculatePrice()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="notes">
                          Additional Notes (Optional)
                        </Label>
                        <Textarea
                          id="notes"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Any special requests or notes..."
                          className="bg-input border-border"
                          rows={2}
                        />
                      </div>

                      {/* <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                        <p className="text-sm text-foreground">
                          💳 <strong>Online Payment Required:</strong> Complete
                          payment to confirm your booking.
                        </p>
                      </div> */}

                      <div className="space-y-2">
                        <Label className="">Choose Payment Method</Label>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Online Option */}
                          <div
                            onClick={() => setPaymentMethod("online")}
                            className={`cursor-pointer p-6 rounded-2xl border-2 transition-all flex items-center gap-4 ${paymentMethod === "online" ? "border-primary bg-primary/10" : "border-border hover:bg-muted"}`}
                          >
                            <CreditCard
                              className={`w-8 h-8 ${paymentMethod === "online" ? "text-primary" : "text-muted-foreground"}`}
                            />
                            <div>
                              <p className="font-bold">Pay Online</p>
                              <p className="text-xs text-muted-foreground">
                                UPI, Cards, NetBanking
                              </p>
                            </div>
                          </div>

                          {/* Cash Option */}
                          <div
                            onClick={() => setPaymentMethod("cash")}
                            className={`cursor-pointer p-6 rounded-2xl border-2 transition-all flex items-center gap-4 ${paymentMethod === "cash" ? "border-primary bg-primary/10" : "border-border hover:bg-muted"}`}
                          >
                            <Banknote
                              className={`w-8 h-8 ${paymentMethod === "cash" ? "text-primary" : "text-muted-foreground"}`}
                            />
                            <div>
                              <p className="font-bold">Pay at Pickup</p>
                              <p className="text-xs text-muted-foreground">
                                Pay at shop via Cash/UPI
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Dynamic Action Button */}
                        <div className="flex gap-4 pt-4">
                          <Button
                            variant="outline"
                            onClick={() => setStep(1)}
                            className="flex-1 h-12 rounded-xl"
                          >
                            Back
                          </Button>
                          <Button
                            onClick={
                              paymentMethod === "online"
                                ? handleOnlinePayment
                                : handleCashBooking
                            }
                            className="flex-[1] h-12 gradient-sunset text-primary-foreground font-bold rounded-xl shadow-lg"
                            disabled={isSubmitting}
                          >
                            {isSubmitting
                              ? "Processing..."
                              : paymentMethod === "online"
                                ? `Pay ₹${calculatePrice()}`
                                : "Confirm Booking"}
                          </Button>
                        </div>
                      </div>

                      {/* <div className="flex gap-4">
                        <Button
                          variant="outline"
                          onClick={() => setStep(1)}
                          className="flex-1"
                        >
                          Back
                        </Button>
                        <Button
                          onClick={handleBookingSubmit}
                          className="flex-1 gradient-sunset text-primary-foreground"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Submitting..." : "Confirm Booking"}
                        </Button> */}
                      {/* <Button
                          onClick={handleOnlinePayment}
                          className="flex-1 gradient-sunset text-primary-foreground"
                          disabled={isSubmitting}
                        >
                          {isSubmitting
                            ? "Processing Payment..."
                            : "Pay ₹" + calculatePrice()}
                        </Button> 
                      </div>*/}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}