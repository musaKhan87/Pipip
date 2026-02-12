import { motion } from "framer-motion";
import {
  Bike,
  Clock,
  Shield,
  MapPin,
  CreditCard,
  Headphones,
} from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Bike,
      title: "Well-Maintained Scooters",
      description:
        "Our fleet of scooters are regularly serviced and sanitized for your comfort and safety.",
    },
    {
      icon: Clock,
      title: "Flexible Rentals",
      description:
        "Rent by the hour or day. Perfect for quick errands or full-day Mumbai exploration.",
    },
    {
      icon: Shield,
      title: "Fully Insured",
      description:
        "All our scooters come with comprehensive insurance for your peace of mind.",
    },
    {
      icon: MapPin,
      title: "Convenient Pickup",
      description:
        "Pickup and drop service available across Mumbai for just Rs. 100.",
    },
    {
      icon: CreditCard,
      title: "Easy Payment",
      description:
        "Pay at delivery. We accept cash, UPI, and all major payment methods.",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description:
        "Our support team is always available to assist you during your rental.",
    },
  ];

  return (
    <section id="about" className="py-24 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card to-background" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl text-gradient-sunset mb-4">
            Why Choose Pipip?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the freedom of exploring Mumbai on your own terms with
            our reliable self-drive scooter service.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-card/50 backdrop-blur-sm border border-border hover:border-primary/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-golden"
            >
              <div className="w-14 h-14 rounded-xl gradient-teal flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-7 h-7 text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>        
      </div>
    </section>
  );
};

export default About;
