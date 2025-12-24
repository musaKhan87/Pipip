import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "./ui/Button";

const HEADER_OFFSET = 96; // height of fixed header

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "pricing", label: "Pricing" },
    { id: "rent", label: "Rent Now" },
    { id: "contact", label: "Contact" },
  ];

  // ✅ Mobile-safe smooth scrolling
  const scrollToSection = (id) => {
    setIsMenuOpen(false);

    setTimeout(() => {
      const el = document.getElementById(id);
      if (!el) return;

      const y =
        el.getBoundingClientRect().top + window.pageYOffset - HEADER_OFFSET;

      window.scrollTo({
        top: y,
        behavior: "smooth",
      });

      // ✅ Correct way to update hash
      window.history.pushState(null, "", `#${id}`);
    }, 300);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border"
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => scrollToSection("home")}>
          <img
            src="/logo.jpeg"
            alt="Pipip Logo"
            className="h-20 w-20 object-cover rounded-full"
          />
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-16">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="text-foreground/80 hover:text-primary transition-colors font-medium"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex">
          <a href="tel:9967406205">
            <Button variant="hero" size="lg" className="gap-2">
              <Phone className="w-4 h-4" />
              Call Now
            </Button>
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-foreground p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-card border-b border-border overflow-hidden"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="text-left text-foreground/80 hover:text-primary transition-colors font-medium py-2"
                >
                  {link.label}
                </button>
              ))}

              <a href="tel:9967406205">
                <Button variant="hero" size="lg" className="w-full gap-2">
                  <Phone className="w-4 h-4" />
                  Call Now
                </Button>
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
