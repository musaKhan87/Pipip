import { motion } from "framer-motion";
import { Check, IndianRupee, Clock, Calendar, Truck } from "lucide-react";
import { Button } from "./ui/Button";
import { NavLink } from "react-router-dom";

const Pricing = () => {
  const plans = [
    {
      name: "Hourly",
      icon: Clock,
      price: "100",
      unit: "/hour",
      description: "Perfect for quick trips and errands",
      features: [
        "Minimum 1 hour rental",
        "Helmet included",
        "Basic insurance",
        "24/7 support",
      ],
      popular: false,
    },
    {
      name: "Daily",
      icon: Calendar,
      price: "From 600",
      unit: "/day",
      description: "Best value for full-day exploration",
      features: [
        "24 hours rental",
        "Helmet included",
        "Full insurance coverage",
        "Free pickup & drop",
        "24/7 roadside assistance",
      ],
      popular: true,
    },
    {
      name: "Pickup & Drop",
      icon: Truck,
      price: "100",
      unit: "flat / within 5km",
      description: "We deliver the scooter to your doorstep",
      features: [
        "Anywhere in Mumbai",
        "Quick delivery",
        "Doorstep service",
        "Flexible timing",
      ],
      popular: false,
    },
    {
      name: "Weekly",
      icon: Calendar,
      price: "3,000",
      unit: "/week",
      description: "Great for extended city exploration",
      features: [
        "7 days rental",
        "Helmet included",
        "Full insurance coverage",
        "Free pickup & drop",
        "24/7 roadside assistance",
        "10% discount applied",
      ],
      popular: false,
    },
    {
      name: "Monthly",
      icon: Calendar,
      price: "9,000",
      unit: "/month",
      description: "Best for long-term commuters",
      features: [
        "30 days rental",
        "Helmet included",
        "Full insurance coverage",
        "Free pickup & drop",
        "24/7 roadside assistance",
        "20% discount applied",
        "Priority support",
      ],
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-card via-background to-card" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl text-gradient-teal mb-4">
            Simple Pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Affordable rates with no hidden charges. Pay as you ride!
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative bg-card border rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 ${
                plan.popular
                  ? "border-primary shadow-golden scale-105"
                  : "border-border hover:border-secondary/50 hover:shadow-teal"
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="gradient-sunset text-primary-foreground text-sm font-bold px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${
                  plan.popular ? "gradient-sunset" : "gradient-teal"
                }`}
              >
                <plan.icon className="w-7 h-7 text-primary-foreground" />
              </div>

              {/* Plan Name */}
              <h3 className="text-2xl font-bold text-foreground mb-2">
                {plan.name}
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                {plan.description}
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-1 mb-6">
                <IndianRupee className="w-6 h-6 text-primary" />
               
                <span className="text-5xl font-bold text-foreground">
                  {plan.price}
                </span>

                <span className="text-muted-foreground">{plan.unit}</span>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, featureIndex) => (
                  <li
                    key={featureIndex}
                    className="flex items-center gap-2 text-foreground/80 "
                  >
                    <Check className="w-5 h-5 text-secondary flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <NavLink to="/catalog" className="block">
                <Button
                  variant={plan.popular ? "hero" : "teal"}
                  size="lg"
                  className="w-full"
                  
                >
                  Book Now
                </Button>
              </NavLink>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center text-muted-foreground mt-12"
        >
          💳 Cash on delivery available • No hidden charges • Instant booking
          confirmation
        </motion.p>
      </div>
    </section>
  );
};

export default Pricing;
