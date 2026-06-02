import { motion } from "framer-motion";
import {
  RotateCcw,
  UserX,
  Building2,
  ArrowDownToLine,
  ShieldCheck,
  AlertTriangle,
  Ban,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const sections = [
  {
    icon: UserX,
    num: "1",
    title: "Cancellation by User",
    subsections: [
      {
        subtitle: "Before Trip Start",
        items: [
          "24 hours or more: Full refund minus convenience fee (if applicable).",
          "Less than 24 hours: 50% of rental amount refunded.",
        ],
      },
      {
        subtitle: "During Trip",
        items: ["No refund for remaining rental period."],
      },
    ],
  },
  {
    icon: Building2,
    num: "2",
    title: "Cancellation by Pipip",
    content:
      "If we cancel due to unforeseen circumstances, you'll receive a full refund.",
  },
  {
    icon: ArrowDownToLine,
    num: "3",
    title: "Refund Process",
    content:
      "Refunds are processed within 5-7 business days to the original payment method.",
  },
  {
    icon: ShieldCheck,
    num: "4",
    title: "Security Deposit",
    content: "Refunded within 24-48 hours after vehicle return and inspection.",
  },
  {
    icon: AlertTriangle,
    num: "5",
    title: "Damages and Charges",
    content:
      "Any damages, fines, or charges will be deducted from the security deposit.",
  },
  {
    icon: Ban,
    num: "6",
    title: "Non-Refundable Items",
    content:
      "Convenience fees, late return fees, and fuel charges are non-refundable.",
  },
];

const RefundPolicy = () => {
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
              <RotateCcw className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display text-gradient-sunset mb-4">
              Refund Policy
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              At Pipip, we strive to provide a seamless experience. Below is our
              refund policy.
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
              transition={{ delay: i * 0.05 }}
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
              {s.subsections?.map((sub, k) => (
                <div key={k} className={k > 0 ? "mt-4" : ""}>
                  <h3 className="text-sm font-semibold text-foreground mb-2">
                    {sub.subtitle}
                  </h3>
                  <ul className="space-y-2">
                    {sub.items.map((item, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-3 text-muted-foreground"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </motion.div>
          ))}

          <p className="text-center text-muted-foreground text-sm pt-4">
            Refunds are subject to our Terms and Conditions. For questions,
            contact our support team.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default RefundPolicy;
