import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "What documents are required to rent a scooter?",
    answer:
      "You need a valid driving license (original), Aadhaar card (original), and a refundable security deposit. All documents must be original — photocopies are not accepted.",
  },
  {
    question: "What is the minimum age requirement?",
    answer:
      "You must be at least 18 years old with a valid driving license to rent a scooter from Pipip.",
  },
  {
    question: "Is there a security deposit?",
    answer:
      "Yes, a fully refundable security deposit is required at the time of pickup. The amount varies based on the scooter model and rental duration. It is refunded upon safe return of the vehicle.",
  },
  {
    question: "What are your rental rates?",
    answer:
      "Our rates start from ₹299/day. We offer hourly, daily, weekly, and monthly packages — longer rentals come with better discounts.",
  },
  {
    question: "Is fuel included in the rental?",
    answer:
      "Fuel is not included. You'll receive the scooter with some fuel and are expected to return it at the same level. You only pay for what you use.",
  },
  {
    question: "What happens if the scooter breaks down?",
    answer:
      "Contact our 24/7 support line immediately. We'll either fix the issue on the spot or provide a replacement scooter at no additional cost.",
  },
  {
    question: "Can I extend my rental period?",
    answer:
      "Absolutely. Just call us before your current rental ends. Extensions are subject to availability and will be charged at the applicable rate.",
  },
  {
    question: "Are helmets provided with the rental?",
    answer:
      "Yes, one ISI-certified helmet is included free with every rental. Additional helmets are available for a small fee.",
  },
];

// JSON-LD Schema for SEO
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

const FAQItem = ({
  faq,
  index,
  isOpen,
  onToggle,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.3, delay: index * 0.04 }}
    className="border-b border-border last:border-b-0"
  >
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between py-6 text-left group"
    >
      <span
        className={`text-base md:text-lg font-medium transition-colors duration-200 pr-8 ${
          isOpen ? "text-primary" : "text-foreground group-hover:text-primary"
        }`}
      >
        {faq.question}
      </span>
      <span
        className={`flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${
          isOpen
            ? "bg-primary border-primary text-primary-foreground"
            : "border-border text-muted-foreground group-hover:border-primary group-hover:text-primary"
        }`}
      >
        {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
      </span>
    </button>
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed pb-6 pr-12">
            {faq.answer}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" className="py-24 relative">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <p className="text-sm font-medium tracking-widest uppercase text-primary mb-3">
              Support
            </p>
            <h2 className="font-display text-3xl md:text-5xl text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground text-base md:text-lg">
              Everything you need to know before you ride.
            </p>
          </motion.div>

          {/* FAQ List */}
          <div className="border-t border-border">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                faq={faq}
                index={index}
                isOpen={openIndex === index}
                onToggle={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
              />
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mt-14"
          >
            <p className="text-muted-foreground text-sm mb-4">
              Can't find what you're looking for?
            </p>
            <a
              href="https://wa.me/919967406205"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full gradient-sunset text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
            >
              Get in touch
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
