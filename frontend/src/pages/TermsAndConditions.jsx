import { motion } from "framer-motion";
import {
  FileText,
  Users,
  Bike,
  CreditCard,
  XCircle,
  ShieldAlert,
  BookOpen,
  Scale,
  RefreshCw,
  Mail,
} from "lucide-react";
import Footer from "../components/Footer";
import Header from "../components/Header";

const sections = [
  {
    icon: FileText,
    num: "1",
    title: "Introduction",
    content:
      'Welcome to Pipip! These Terms and Conditions ("Terms") govern your use of our website, mobile app, and services ("Platform"). By accessing or using our Platform, you agree to be bound by these Terms.',
  },
  {
    icon: Users,
    num: "2",
    title: "Definitions",
    list: [
      '"Pipip" refers to Pipip, the provider of bike/scooter rental services.',
      '"User" or "You" refers to individuals or entities using our Platform.',
      '"Host" refers to vehicle owners listing their vehicles on our Platform.',
      '"Guest" refers to users renting vehicles from Hosts.',
    ],
  },
  {
    icon: Bike,
    num: "3",
    title: "Services",
    list: [
      "Pipip provides a platform for Users to rent bikes/scooters from Hosts.",
      "We facilitate bookings, payments, and provide customer support.",
    ],
  },
  {
    icon: Users,
    num: "4",
    title: "User Responsibilities",
    list: [
      "Provide accurate information for registration and booking.",
      "Ensure you have a valid driving license and follow traffic rules.",
      "Use vehicles responsibly and return them in the same condition.",
    ],
  },
  {
    icon: CreditCard,
    num: "5",
    title: "Booking and Payment",
    list: [
      "Bookings are subject to vehicle availability.",
      "Payments are processed through our secure payment gateway.",
      "Rental charges, security deposits, and additional fees apply.",
    ],
  },
  {
    icon: XCircle,
    num: "6",
    title: "Cancellation Policy",
    list: [
      "Cancellations 48 hours before trip start: Complete refund in 3-5 working days (exc. GST)",
      "Cancellations 24 hours before trip starts during trip: 50% of the amount (exc. GST)",
      "Cancellations 12 hours before trip starts: No refund",
    ],
  },
  {
    icon: ShieldAlert,
    num: "7",
    title: "Liability and Insurance",
    list: [
      "Pipip is not liable for damages or losses due to User negligence.",
      "Users are responsible for insurance excess and damages.",
    ],
  },
  {
    icon: BookOpen,
    num: "8",
    title: "Intellectual Property",
    content: "Pipip owns all intellectual property rights to the Platform.",
  },
  {
    icon: Scale,
    num: "9",
    title: "Governing Law",
    list: [
      "These Terms are governed by Indian laws.",
      "Disputes are subject to RTO Mumbai, Jurisdiction Mumbai.",
    ],
  },
  {
    icon: RefreshCw,
    num: "10",
    title: "Changes to Terms",
    list: [
      "Pipip reserves the right to modify these Terms.",
      "Changes are effective immediately upon posting.",
    ],
  },
  {
    icon: Mail,
    num: "11",
    title: "Contact",
    content:
      "For questions or concerns, contact us at pipip6296@gmail.com, 9137858573",
  },
];

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-16">
        <section className="container mx-auto px-4 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="w-16 h-16 rounded-2xl gradient-sunset flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display text-gradient-sunset mb-4">
              Terms & Conditions
            </h1>
            <p className="text-muted-foreground text-lg">
              Last Updated: 31/03/2026
            </p>
          </motion.div>
        </section>

        <section className="container mx-auto px-4 max-w-4xl space-y-6">
          {sections.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="rounded-2xl border border-border bg-card p-6 md:p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <s.icon className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">
                  <span className="text-primary mr-1">{s.num}.</span> {s.title}
                </h2>
              </div>
              {s.content && (
                <p className="text-muted-foreground leading-relaxed">
                  {s.content}
                </p>
              )}
              {s.list && (
                <ul className="space-y-2">
                  {s.list.map((item, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-3 text-muted-foreground"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}

          <p className="text-center text-muted-foreground text-sm pt-4">
            By using Pipip, you acknowledge you've read and agree to these
            Terms.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TermsAndConditions;
