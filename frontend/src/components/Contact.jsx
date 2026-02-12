import { motion } from "framer-motion";
import {
  Phone,
  MessageCircle,
  Instagram,
  MapPin,
  Clock,
  Mail,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { Button } from "./ui/Button";
import Footer from "./Footer";
import Header from "./Header";
import { NavLink } from "react-router-dom";


const Contact = () => {
  const contactMethods = [
    {
      icon: Phone,
      title: "Call Us",
      description: "Speak directly with our team",
      value: "9967406205",
      href: "tel:9967406205",
      action: "Call Now",
      gradient: "gradient-sunset",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      description: "Quick responses, easy booking",
      value: "9967406205",
      href: "https://wa.me/919967406205?text=Hi%2C%20I%20want%20to%20rent%20a%20scooter",
      action: "Chat Now",
      gradient: "bg-gradient-to-br from-green-500 to-green-600",
    },
    {
      icon: Instagram,
      title: "Instagram",
      description: "Follow us for updates & offers",
      value: "@pipip_mumbai",
      href: "https://instagram.com/pipip_mumbai",
      action: "Follow Us",
      gradient: "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500",
    },
    {
      icon: Mail,
      title: "Email",
      description: "For business inquiries",
      value: "hello@pipip.in",
      href: "mailto:hello@pipip.in",
      action: "Send Email",
      gradient: "gradient-teal",
    },
  ];

  const mapSrc =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3773.5974745044096!2d72.82755!3d18.9582!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7ce1e8fa69f6f%3A0x8a3a7c7e05fa37e0!2sBhendi%20Bazaar%2C%20Mumbai%2C%20Maharashtra%20400003!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-b from-card via-background to-background" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
                We're Here to Help
              </span>
              <h1 className="font-display text-5xl md:text-6xl text-gradient-sunset mb-6">
                Get In Touch
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Have questions about renting a scooter? Need help with your
                booking? We're just a message away. Reach out through any of
                these channels.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Methods Grid */}
        <section className="py-16 relative">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {contactMethods.map((method, index) => (
                <motion.a
                  key={index}
                  href={method.href}
                  target={method.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    method.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-golden overflow-hidden"
                >
                  {/* Hover Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative z-10">
                    <div
                      className={`w-14 h-14 rounded-xl ${method.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <method.icon className="w-7 h-7 text-primary-foreground" />
                    </div>

                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {method.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {method.description}
                    </p>
                    <p className="text-primary font-semibold mb-4">
                      {method.value}
                    </p>

                    <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {method.action}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* Map & Location Section */}
        <section className="py-16 relative">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
              >
                <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
                  Visit Our Location
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Pick up your scooter from our convenient location in the heart
                  of Mumbai
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="grid lg:grid-cols-5 gap-8"
              >
                {/* Map */}
                <div className="lg:col-span-3 relative rounded-2xl overflow-hidden border border-border shadow-golden h-[400px] lg:h-[450px]">
                  <iframe
                    src={mapSrc}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Pipip Bikes Location - Bhendi Bazar, Mumbai"
                    className="grayscale-[20%] contrast-[1.05]"
                  />

                  {/* Get Directions Button */}
                  <a
                    href="https://www.google.com/maps/dir//Bhendi+Bazaar,+Mumbai,+Maharashtra+400003"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-4 right-4 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-primary text-primary-foreground font-semibold shadow-lg hover:bg-primary/90 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Get Directions
                  </a>
                </div>

                {/* Location Details */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Address Card */}
                  <div className="bg-card border border-border rounded-2xl p-6 hover:border-primary/30 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl gradient-teal flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-secondary-foreground" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          Our Address
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          Bhendi Bazar
                          <br />
                          Mumbai - 400003
                          <br />
                          Maharashtra, India
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Working Hours Card */}
                  <div className="bg-card border border-border rounded-2xl p-6 hover:border-primary/30 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl gradient-sunset flex items-center justify-center flex-shrink-0">
                        <Clock className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          Working Hours
                        </h3>
                        <div className="space-y-1 text-muted-foreground">
                          <p>Monday - Sunday</p>
                          <p className="text-foreground font-medium">
                            7:00 AM - 11:00 PM
                          </p>
                          <p className="text-secondary font-semibold">
                            Open all 7 days!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Contact CTA */}
                  <a
                    href="https://wa.me/919967406205?text=Hi%2C%20I%20want%20to%20rent%20a%20scooter"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button className="w-full gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-6 text-lg">
                      <MessageCircle className="w-5 h-5" />
                      Chat on WhatsApp
                    </Button>
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 gradient-navy opacity-50" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.1)_0%,transparent_70%)]" />

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-2xl mx-auto"
            >
              <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
                Ready to Ride?
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Book your scooter in minutes and explore Mumbai your way
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <NavLink to="/catalog">
                  <Button
                    size="lg"
                    className="gap-2 gradient-sunset text-primary-foreground font-semibold px-8"
                  >
                    View Our Fleet
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </NavLink>
                <a href="tel:9967406205">
                  <Button
                    size="lg"
                    variant="outline"
                    className="gap-2 border-primary/50 hover:bg-primary/10 font-semibold px-8"
                  >
                    <Phone className="w-5 h-5" />
                    Call to Book
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
