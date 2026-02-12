import { useState } from "react";
import { motion } from "framer-motion";
import {
  Send,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  MessageSquare,
  CheckCircle,
} from "lucide-react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { useToast } from "../hooks/use-toast";
import { Textarea } from "./ui/Textarea";
import axios from "axios";

const RentalForm = () => {
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    pickupLocation: "",
    date: "",
    duration: "",
    message: "",
  });

  // ================= VALIDATION =================
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.length < 2) {
      newErrors.fullName = "Name must be at least 2 characters";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
      newErrors.mobile = "Enter a valid 10-digit mobile number";
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.pickupLocation.trim()) {
      newErrors.pickupLocation = "Pickup location is required";
    } else if (formData.pickupLocation.length < 5) {
      newErrors.pickupLocation = "Enter a valid pickup location";
    }

    if (!formData.date) {
      newErrors.date = "Please select a pickup date";
    }

    if (!formData.duration) {
      newErrors.duration = "Please select duration";
    }

    if (formData.message && formData.message.length > 500) {
      newErrors.message = "Message is too long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ================= HANDLERS =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const isValid = validateForm();
    if (!isValid) {
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://pipip-backend.onrender.com/api/rentals",
        {
          name: formData.fullName,
          phone: formData.mobile,
          email: formData.email,
          pickupLocation: formData.pickupLocation,
          date: formData.date,
          duration: formData.duration,
          message: formData.message,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );


      setIsSubmitted(true);

      toast({
        title: "Request Submitted! 🛵",
        description:
          "We have received your request. We will contact you shortly.",
      });
    } catch (error) {
      console.error("API ERROR:", error);

      toast({
        title: "Submission Failed",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section id="rent" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-card to-background" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center bg-card border border-secondary/50 rounded-2xl p-12"
          >
            <div className="w-20 h-20 rounded-full gradient-teal flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-secondary-foreground" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl text-gradient-teal mb-4">
              Request Received!
            </h2>
            <p className="text-xl text-foreground/80 mb-6">
              We have received your scooter rental request.
            </p>
            <p className="text-muted-foreground mb-8">
              Our team will contact you shortly to confirm your booking. For
              immediate assistance, call us at{" "}
              <a
                href="tel:9967406205"
                className="text-primary hover:underline font-semibold"
              >
                9967406205
              </a>
            </p>
            <Button
              variant="hero"
              size="lg"
              onClick={() => {
                setIsSubmitted(false);
                setFormData({
                  fullName: "",
                  mobile: "",
                  email: "",
                  pickupLocation: "",
                  date: "",
                  duration: "",
                  message: "",
                });
              }}
            >
              Book Another Scooter
            </Button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="rent" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card to-background" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-4xl md:text-5xl text-gradient-sunset mb-4">
            Rent a Scooter
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Fill out the form below and we'll get back to you within minutes!
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8"
        >
          <div className="grid md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Full Name *
              </label>
              <Input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={errors.fullName ? "border-destructive" : ""}
              />
              {errors.fullName && (
                <p className="text-sm text-destructive">{errors.fullName}</p>
              )}
            </div>

            {/* Mobile Number */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                Mobile Number *
              </label>
              <Input
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                className={errors.mobile ? "border-destructive" : ""}
              />
              {errors.mobile && (
                <p className="text-sm text-destructive">{errors.mobile}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                Email (optional)
              </label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            {/* Pickup Location */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Pickup Location *
              </label>
              <Input
                name="pickupLocation"
                value={formData.pickupLocation}
                onChange={handleChange}
                placeholder="Enter pickup address"
                className={errors.pickupLocation ? "border-destructive" : ""}
              />
              {errors.pickupLocation && (
                <p className="text-sm text-destructive">
                  {errors.pickupLocation}
                </p>
              )}
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Pickup Date *
              </label>

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
      ${errors.date ? "border-destructive" : "border-input"}`}
              />

              {errors.date && (
                <p className="text-sm text-destructive">{errors.date}</p>
              )}
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Duration *
              </label>
              <select
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className={`flex h-10 w-full rounded-lg border bg-input px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  errors.duration ? "border-destructive" : "border-input"
                }`}
              >
                <option value="">Select duration</option>
                <option value="1-hour">1 Hour - ₹100</option>
                <option value="2-hours">2 Hours - ₹200</option>
                <option value="4-hours">4 Hours - ₹400</option>
                <option value="full-day">Full Day (24hrs) - ₹600</option>
                <option value="weekly">Weekly - ₹3000</option>
                <option value="2-days">Monthly - ₹9000</option>
              </select>
              {errors.duration && (
                <p className="text-sm text-destructive">{errors.duration}</p>
              )}
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2 mt-6">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" />
              Message (optional)
            </label>
            <Textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Any special requirements or questions?"
              rows={3}
              className={errors.message ? "border-destructive" : ""}
            />
            {errors.message && (
              <p className="text-sm text-destructive">{errors.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="hero"
            size="xl"
            className="w-full mt-8"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Submit Rental Request
              </>
            )}
          </Button>

          <p className="text-center text-muted-foreground text-sm mt-4">
            By submitting, you agree to our terms of service. We'll contact you
            shortly!
          </p>
        </motion.form>
      </div>
    </section>
  );
};

export default RentalForm;
