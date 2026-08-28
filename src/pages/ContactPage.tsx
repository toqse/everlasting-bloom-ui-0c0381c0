"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MapPin, Clock, Send, Sparkles, Loader2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import PhoneInput from "@/components/PhoneInput";
import { getDisplayErrorMessage } from "@/lib/apiErrors";
import {
  branchDetailLines,
  getWebsiteBranches,
  submitWebsiteEnquiry,
} from "@/lib/websiteContactApi";
import { formatPhoneForApi, isValidIndianMobile } from "@/lib/phone";

type ContactCard = {
  icon: LucideIcon;
  title: string;
  details: string[];
};

const FALLBACK_CARDS: ContactCard[] = [
  {
    icon: MapPin,
    title: "Head Office",
    details: [
      "Aiswarya Marriage Bureau",
      "Near Private Bus Stand",
      "Cherthala – 688524",
      "Customer Care: 7907240062",
    ],
  },
  {
    icon: MapPin,
    title: "Email",
    details: ["aiswarya@aiswaryamatrimonials.com"],
  },
  {
    icon: MapPin,
    title: "Branch Office",
    details: [
      "Pothanicad",
      "Moovattupuzha, Ernakulam",
      "Branch Contact: 6282857276",
    ],
  },
];

const WORKING_HOURS: ContactCard = {
  icon: Clock,
  title: "Working Hours",
  details: ["Mon - Sat: 9:00 AM - 5:00 PM", "Sunday: Closed"],
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

const ContactPage = () => {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [contactCards, setContactCards] = useState<ContactCard[]>(FALLBACK_CARDS);

  useEffect(() => {
    let cancelled = false;
    getWebsiteBranches()
      .then((branches) => {
        if (cancelled || branches.length === 0) return;
        setContactCards(
          branches.map((branch) => ({
            icon: MapPin,
            title: branch.name,
            details: branchDetailLines(branch),
          })),
        );
      })
      .catch(() => {
        /* keep hardcoded fallback */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = form.name.trim();
    const email = form.email.trim();
    const subject = form.subject.trim();
    const message = form.message.trim();

    if (!name || !email || !form.phone || !message) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (!EMAIL_RE.test(email)) {
      toast.error("Enter a valid email address");
      return;
    }
    if (!isValidIndianMobile(form.phone)) {
      toast.error("Enter a valid 10-digit Indian mobile number");
      return;
    }

    setSubmitting(true);
    try {
      const successMessage = await submitWebsiteEnquiry({
        name,
        phone: formatPhoneForApi(form.phone),
        email,
        subject: subject || undefined,
        message,
      });
      toast.success(successMessage);
      setForm(emptyForm);
    } catch (err) {
      toast.error(getDisplayErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const cards = [...contactCards, WORKING_HOURS];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero with wedding background */}
      <section className="pt-28 pb-20 relative overflow-hidden min-h-[400px] flex items-center">
        <div className="absolute inset-0">
          <img
            src="/images/banner.webp"
            alt="Wedding couple"
            className="w-full h-full object-cover object-top"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />
        </div>
        <div className="absolute top-10 left-10 w-48 h-48 bg-secondary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-primary/15 rounded-full blur-3xl animate-float-delayed" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/90 backdrop-blur-sm border border-primary/10 mb-4 shadow-soft animate-fade-in-up">
            <Sparkles className="w-4 h-4 text-secondary animate-sparkle" />
            <span className="text-sm font-medium text-primary">
              Get In Touch
            </span>
          </div>
          <h1
            className="font-serif text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in-up drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]"
            style={{ animationDelay: "0.1s" }}
          >
            Contact{" "}
            <span className="text-[#FCD34D] drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]">
              Us
            </span>
          </h1>
          <p
            className="text-white max-w-2xl mx-auto text-lg animate-fade-in-up drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
            style={{ animationDelay: "0.2s" }}
          >
            Have questions? We'd love to hear from you. Send us a message!
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="space-y-4">
              {cards.map((info, i) => (
                <motion.div
                  key={`${info.title}-${i}`}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl p-5 shadow-card hover-lift flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent-gold flex items-center justify-center flex-shrink-0">
                    <info.icon className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-foreground mb-1">
                      {info.title}
                    </h4>
                    {info.details.map((d, j) => (
                      <p key={j} className="text-sm text-muted-foreground">
                        {d}
                      </p>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2 bg-white rounded-3xl shadow-card p-8"
            >
              <h3 className="font-serif text-2xl font-bold text-foreground mb-6">
                Send us a Message
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Your Name *"
                    value={form.name}
                    disabled={submitting}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-primary/10 focus:border-primary focus:ring-0 transition-colors bg-white disabled:opacity-70"
                  />
                  <input
                    type="email"
                    placeholder="Your Email *"
                    value={form.email}
                    disabled={submitting}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-2xl border-2 border-primary/10 focus:border-primary focus:ring-0 transition-colors bg-white disabled:opacity-70"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <PhoneInput
                    placeholder="Phone Number *"
                    value={form.phone}
                    disabled={submitting}
                    onChange={(v) => setForm({ ...form, phone: v })}
                    inputClassName="py-3"
                  />
                  <input
                    type="text"
                    placeholder="Subject"
                    value={form.subject}
                    disabled={submitting}
                    onChange={(e) =>
                      setForm({ ...form, subject: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-2xl border-2 border-primary/10 focus:border-primary focus:ring-0 transition-colors bg-white disabled:opacity-70"
                  />
                </div>
                <textarea
                  placeholder="Your Message *"
                  value={form.message}
                  rows={5}
                  disabled={submitting}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-2xl border-2 border-primary/10 focus:border-primary focus:ring-0 transition-colors bg-white resize-none disabled:opacity-70"
                />
                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="gap-2 group"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Sending…
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" /> Send Message
                    </>
                  )}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Location Map */}
      <section className="py-16 bg-accent-rose/30">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-8">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
              Our <span className="text-gradient-gold">Location</span>
            </h2>
            <p className="text-muted-foreground">
              Visit us at our office in Cherthala, Alappuzha, Kerala
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl overflow-hidden shadow-elevated border-4 border-card"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31524.66884302874!2d76.32!3d9.68!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0882cd0a0a0a0b%3A0x3b0882cd0a0a0a0b!2sCherthala%2C%20Kerala!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Aiswarya Matrimony Location"
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
