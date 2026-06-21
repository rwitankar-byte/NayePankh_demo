import { Instagram, Linkedin, Youtube, Twitter, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#141414] border-t border-[rgba(245,242,235,0.06)]">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-display font-semibold text-[#f5f2eb] mb-4">
              NayePankh Foundation
            </h3>
            <p className="text-sm text-[#8a8580] leading-relaxed mb-6">
              Uplifting underprivileged communities since 2021. Join us in creating
              meaningful change across India.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com/nayepankhfoundation"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-[rgba(245,242,235,0.1)] flex items-center justify-center text-[#8a8580] hover:border-[#d4854a] hover:text-[#d4854a] transition-all"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://linkedin.com/company/nayepankh"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-[rgba(245,242,235,0.1)] flex items-center justify-center text-[#8a8580] hover:border-[#d4854a] hover:text-[#d4854a] transition-all"
              >
                <Linkedin size={16} />
              </a>
              <a
                href="https://youtube.com/@nayepankhfoundation"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-[rgba(245,242,235,0.1)] flex items-center justify-center text-[#8a8580] hover:border-[#d4854a] hover:text-[#d4854a] transition-all"
              >
                <Youtube size={16} />
              </a>
              <a
                href="https://twitter.com/nayepankh"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-[rgba(245,242,235,0.1)] flex items-center justify-center text-[#8a8580] hover:border-[#d4854a] hover:text-[#d4854a] transition-all"
              >
                <Twitter size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-[#f5f2eb] mb-4 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="/chat" className="text-sm text-[#8a8580] hover:text-[#d4854a] transition-colors">
                  AI Assistant
                </a>
              </li>
              <li>
                <a href="/volunteer" className="text-sm text-[#8a8580] hover:text-[#d4854a] transition-colors">
                  Volunteer
                </a>
              </li>
              <li>
                <a href="/internship" className="text-sm text-[#8a8580] hover:text-[#d4854a] transition-colors">
                  Internships
                </a>
              </li>
              <li>
                <a href="/events" className="text-sm text-[#8a8580] hover:text-[#d4854a] transition-colors">
                  Events
                </a>
              </li>
              <li>
                <a href="https://nayepankh.com/donate" target="_blank" rel="noopener noreferrer" className="text-sm text-[#8a8580] hover:text-[#d4854a] transition-colors">
                  Donate
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-[#f5f2eb] mb-4 uppercase tracking-wider">
              Get in Touch
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-[#8a8580]">
                <Mail size={14} className="text-[#d4854a]" />
                <span>contact@nayepankh.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#8a8580]">
                <Phone size={14} className="text-[#d4854a]" />
                <span>+91-8318500748</span>
              </div>
              <p className="text-xs text-[#8a8580] mt-4">
                UP Government Registered | 80G & 12A Certified
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[rgba(245,242,235,0.06)] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#8a8580]">
            &copy; 2025 NayePankh Foundation. All rights reserved.
          </p>
          <p className="text-xs text-[#8a8580]">
            Built with ❤ for social impact
          </p>
        </div>
      </div>
    </footer>
  );
}
