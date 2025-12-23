import { motion } from "framer-motion";
import { Phone, MessageCircle, Instagram, MapPin, Clock } from "lucide-react";
import { Button } from "./ui/Button";


const Contact = () => {
  const contactInfo = [
    {
      icon: Phone,
      label: "Call Us",
      value: "9967406205",
      href: "tel:9967406205",
      color: "gradient-sunset",
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "9967406205",
      href: "https://wa.me/919967406205?text=Hi%2C%20I%20want%20to%20rent%20a%20scooter",
      color: "bg-green-500",
    },
    {
      icon: Instagram,
      label: "Instagram",
      value: "@pipip_mumbai",
      href: "https://instagram.com/pipip_mumbai",
      color: "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500",
    },
  ];

  return (
    <section id="contact" className="py-24 relative">
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
          <h2 className="font-display text-4xl md:text-5xl text-gradient-sunset mb-4">
            Get In Touch
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions? Reach out to us anytime - we're here to help!
          </p>
        </motion.div>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
          {contactInfo.map((item, index) => (
            <motion.a
              key={index}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={
                item.href.startsWith("http") ? "noopener noreferrer" : undefined
              }
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-card border border-border hover:border-primary/50 rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-golden"
            >
              <div
                className={`w-16 h-16 rounded-xl ${item.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <item.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                {item.label}
              </h3>
              <p className="text-primary font-medium">{item.value}</p>
            </motion.a>
          ))}
        </div>

        {/* Location & Hours */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
        >
          {/* Location */}
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl gradient-teal flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-secondary-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Our Location
                </h3>
                <p className="text-muted-foreground">
                  Bhendi Bazar
                  <br />
                  Mumbai - 400003
                  <br />
                  Maharashtra, India
                </p>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl gradient-sunset flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Working Hours
                </h3>
                <p className="text-muted-foreground">
                  Monday - Sunday
                  <br />
                  7:00 AM - 11:00 PM
                  <br />
                  <span className="text-secondary font-medium">
                    Open all days!
                  </span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <a
            href="https://wa.me/919967406205?text=Hi%2C%20I%20want%20to%20rent%20a%20scooter"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="teal" size="xl" className="gap-2">
              <MessageCircle className="w-5 h-5" />
              Chat on WhatsApp
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
