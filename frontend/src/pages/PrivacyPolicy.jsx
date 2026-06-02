import { motion } from "framer-motion";

import {
  Shield,
  Eye,
  Share2,
  UserCheck,
  Lock,
  Clock,
  Mail,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const sections = [
  {
    icon: Eye,
    title: "What We Collect",
    items: [
      { label: "Identity & Contact Info", desc: "Name, email, phone, address" },
      { label: "Government ID", desc: "Aadhaar, Driving License" },
      { label: "Vehicle Info", desc: "Registration, insurance, permits" },
      {
        label: "Payment Details",
        desc: "Bank account, UPI, transaction history",
      },
      {
        label: "Location Data",
        desc: "GPS tracking during trips (with consent)",
      },
    ],
  },
  {
    icon: Shield,
    title: "How We Use Your Data",
    items: [
      { desc: "Provide and improve services" },
      { desc: "Process bookings and payments" },
      { desc: "Ensure safety and security" },
      { desc: "Communicate with you" },
      { desc: "Comply with laws and regulations" },
    ],
  },
  {
    icon: Share2,
    title: "Sharing Your Data",
    items: [
      { desc: "Service providers and partners" },
      { desc: "Law enforcement and regulatory authorities" },
      { desc: "Hosts and Guests (for trip-related info)" },
    ],
  },
  {
    icon: UserCheck,
    title: "Your Rights",
    items: [
      { desc: "Access and correct your data" },
      { desc: "Withdraw consent" },
      { desc: "Delete your data" },
      { desc: "Nominate someone to manage your data" },
    ],
  },
  {
    icon: Lock,
    title: "Security",
    items: [
      { desc: "We use encryption and secure servers to protect your data" },
      { desc: "Only authorized personnel access your data" },
    ],
  },
  {
    icon: Clock,
    title: "Retention",
    items: [
      {
        desc: "We retain your data for as long as necessary to provide services and comply with laws",
      },
    ],
  },
];

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-16">
        {/* Hero */}
        <section className="container mx-auto px-4 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="w-16 h-16 rounded-2xl gradient-sunset flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display text-gradient-sunset mb-4">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground text-lg">
              Last Updated: 30/03/2026
            </p>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              At Pipip, your trust is our top priority. This Privacy Policy
              explains how we collect, use, and protect your personal data when
              you use our services.
            </p>
          </motion.div>
        </section>

        {/* Sections */}
        <section className="container mx-auto px-4 max-w-4xl space-y-8">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-border bg-card p-6 md:p-8"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <section.icon className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">
                  {section.title}
                </h2>
              </div>
              <ul className="space-y-3">
                {section.items.map((item, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-3 text-muted-foreground"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span>
                      {item.label && (
                        <span className="font-medium text-foreground">
                          {item.label}:{" "}
                        </span>
                      )}
                      {item.desc}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Grievance Officer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-border bg-card p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                Grievance Officer
              </h2>
            </div>
            <div className="space-y-2 text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">Name:</span> Ayaan
              </p>
              <p>
                <span className="font-medium text-foreground">Email:</span>{" "}
                pipip6296@gmail.com
              </p>
              <p>
                <span className="font-medium text-foreground">
                  Response Time:
                </span>{" "}
                Within 7 business days
              </p>
            </div>
          </motion.div>

          <p className="text-center text-muted-foreground text-sm pt-4">
            By using Pipip, you consent to this Privacy Policy. We'll notify you
            of any changes.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
