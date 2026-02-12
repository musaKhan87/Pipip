import { Phone, MessageCircle, Instagram, Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="font-display text-3xl text-gradient-sunset mb-4">
              Pipip
            </h3>
            <p className="text-muted-foreground mb-4">
              Self-drive scooters in Mumbai. Explore the city your way with our
              reliable and affordable rental service.
            </p>
            <div className="flex gap-4">
              <a
                href="tel:9967406205"
                className="w-10 h-10 rounded-full bg-muted hover:bg-primary/20 flex items-center justify-center transition-colors"
                aria-label="Call us"
              >
                <Phone className="w-5 h-5 text-foreground" />
              </a>
              <a
                href="https://wa.me/919967406205"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-muted hover:bg-green-500/20 flex items-center justify-center transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5 text-foreground" />
              </a>
              <a
                href="https://instagram.com/pipip_mumbai"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-muted hover:bg-pink-500/20 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 text-foreground" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Home", href: "/#home" },
                { label: "About Us", href: "/#about" },
                { label: "Pricing", href: "/#pricing" },
                { label: "Catalog", href: "/catalog" },
                { label: "Contact", href: "/contact" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-4">
              Contact Info
            </h4>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <a
                  href="tel:9967406205"
                  className="hover:text-primary transition-colors"
                >
                  9967406205
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Instagram className="w-4 h-4 text-primary" />
                <a
                  href="https://instagram.com/pipip_mumbai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  @pipip_mumbai
                </a>
              </li>
              <li>Bhendi Bazar, Mumbai - 400003</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© {currentYear} Pipip. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Made with{" "}
              <Heart className="w-4 h-4 text-destructive fill-destructive" /> in
              Mumbai
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
