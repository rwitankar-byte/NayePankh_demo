import { useState } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Linkedin,
  Youtube,
  Twitter,
  Send,
  Check,
  MessageCircle,
} from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    query: "",
  });

  const submitMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setFormData({ name: "", email: "", query: "" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.query) return;
    submitMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navigation />

      <div className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Back Link */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-[#8a8580] hover:text-[#d4854a] transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          {/* Header */}
          <p className="text-xs font-medium tracking-[0.15em] text-[#d4854a] uppercase mb-4">
            GET IN TOUCH
          </p>
          <h1
            className="font-display font-semibold text-[#f5f2eb] leading-[1.1] tracking-[-0.02em] mb-4"
            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
          >
            We&apos;d Love to Hear
            <br />
            From You
          </h1>
          <p className="text-lg text-[#8a8580] max-w-2xl mb-12">
            Have a question, suggestion, or want to collaborate? Reach out to us
            and our team will get back to you as soon as possible.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <div className="space-y-6 mb-10">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#d4854a]/15 flex items-center justify-center shrink-0">
                    <Mail size={20} className="text-[#d4854a]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#8a8580] mb-1">Email</p>
                    <p className="text-[#f5f2eb]">contact@nayepankh.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#d4854a]/15 flex items-center justify-center shrink-0">
                    <Phone size={20} className="text-[#d4854a]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#8a8580] mb-1">Phone</p>
                    <p className="text-[#f5f2eb]">+91-8318500748</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#d4854a]/15 flex items-center justify-center shrink-0">
                    <MapPin size={20} className="text-[#d4854a]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#8a8580] mb-1">Locations</p>
                    <p className="text-[#f5f2eb]">
                      Kanpur, Ghaziabad, Delhi NCR
                    </p>
                  </div>
                </div>
              </div>

              {/* Social */}
              <div>
                <p className="text-sm text-[#8a8580] mb-4">Follow us</p>
                <div className="flex items-center gap-3">
                  {[
                    {
                      icon: Instagram,
                      href: "https://instagram.com/nayepankhfoundation",
                    },
                    {
                      icon: Linkedin,
                      href: "https://linkedin.com/company/nayepankh",
                    },
                    {
                      icon: Youtube,
                      href: "https://youtube.com/@nayepankhfoundation",
                    },
                    { icon: Twitter, href: "https://twitter.com/nayepankh" },
                  ].map((social) => (
                    <a
                      key={social.href}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 rounded-full border border-[rgba(245,242,235,0.1)] flex items-center justify-center text-[#8a8580] hover:border-[#d4854a] hover:text-[#d4854a] transition-all"
                    >
                      <social.icon size={18} />
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick Chat CTA */}
              <div className="mt-10 bg-[#141414] border border-[rgba(245,242,235,0.06)] rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <MessageCircle size={24} className="text-[#d4854a]" />
                  <h3 className="text-base font-semibold text-[#f5f2eb]">
                    Need quick answers?
                  </h3>
                </div>
                <p className="text-sm text-[#8a8580] mb-4">
                  Our AI Assistant is available 24/7 to answer your questions
                  about volunteering, internships, and more.
                </p>
                <Link
                  to="/chat"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#d4854a] text-[#0a0a0a] rounded-full font-semibold text-sm hover:scale-[1.04] transition-all"
                >
                  Chat with AI
                  <ArrowLeft size={14} className="rotate-180" />
                </Link>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              {submitted ? (
                <div className="bg-[#141414] border border-[rgba(245,242,235,0.06)] rounded-2xl p-8 text-center">
                  <div className="w-16 h-16 bg-[#d4854a]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check size={32} className="text-[#d4854a]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#f5f2eb] mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-sm text-[#8a8580] mb-6">
                    Thank you for reaching out. Our team will get back to you
                    within 24-48 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-sm text-[#d4854a] hover:text-[#ff7e5d] transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="bg-[#141414] border border-[rgba(245,242,235,0.06)] rounded-2xl p-8 space-y-5"
                >
                  <div>
                    <label className="block text-sm text-[#8a8580] mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, name: e.target.value }))
                      }
                      placeholder="Enter your name"
                      required
                      className="w-full bg-[#1c1c1c] border border-[rgba(245,242,235,0.06)] rounded-xl px-4 py-3 text-[#f5f2eb] text-sm placeholder:text-[#8a8580]/50 focus:border-[rgba(212,133,74,0.3)] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-[#8a8580] mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, email: e.target.value }))
                      }
                      placeholder="your@email.com"
                      required
                      className="w-full bg-[#1c1c1c] border border-[rgba(245,242,235,0.06)] rounded-xl px-4 py-3 text-[#f5f2eb] text-sm placeholder:text-[#8a8580]/50 focus:border-[rgba(212,133,74,0.3)] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-[#8a8580] mb-2">
                      Your Message
                    </label>
                    <textarea
                      value={formData.query}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, query: e.target.value }))
                      }
                      placeholder="Tell us how we can help..."
                      required
                      rows={5}
                      className="w-full bg-[#1c1c1c] border border-[rgba(245,242,235,0.06)] rounded-xl px-4 py-3 text-[#f5f2eb] text-sm placeholder:text-[#8a8580]/50 focus:border-[rgba(212,133,74,0.3)] focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitMutation.isPending}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[#d4854a] text-[#0a0a0a] rounded-full font-semibold text-sm hover:scale-[1.02] hover:shadow-[0_4px_20px_rgba(212,133,74,0.3)] active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {submitMutation.isPending ? (
                      "Sending..."
                    ) : (
                      <>
                        Send Message
                        <Send size={16} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
