import { Link } from "react-router";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  ArrowLeft,
  PenTool,
  Share2,
  Palette,
  Code,
  Calendar,
  MapPin,
  ClipboardList,
  Search,
  GraduationCap,
  Clock,
  Award,
  Check,
} from "lucide-react";

const ROLES = [
  {
    icon: PenTool,
    title: "Content Writing",
    desc: "Create impactful content for social media, blogs, newsletters, and awareness campaigns.",
    skills: ["Writing", "Creativity", "Research"],
  },
  {
    icon: Share2,
    title: "Social Media",
    desc: "Manage NayePankh's social presence across Instagram, LinkedIn, Twitter, and YouTube.",
    skills: ["Social Media", "Analytics", "Content Strategy"],
  },
  {
    icon: Palette,
    title: "Graphic Design",
    desc: "Design posters, social media graphics, and visual content for campaigns and events.",
    skills: ["Canva/Photoshop", "Creativity", "Branding"],
  },
  {
    icon: Code,
    title: "Web Development",
    desc: "Help build and maintain digital platforms, websites, and internal tools.",
    skills: ["HTML/CSS/JS", "React", "Problem Solving"],
  },
  {
    icon: Calendar,
    title: "Event Management",
    desc: "Plan, organize, and execute community events, drives, and outreach programs.",
    skills: ["Planning", "Leadership", "Communication"],
  },
  {
    icon: ClipboardList,
    title: "Field Operations",
    desc: "Coordinate on-ground activities, volunteer teams, and community interactions.",
    skills: ["Leadership", "Organization", "Communication"],
  },
  {
    icon: Search,
    title: "Research",
    desc: "Conduct research on social issues, impact measurement, and community needs.",
    skills: ["Research", "Analysis", "Reporting"],
  },
  {
    icon: GraduationCap,
    title: "HR & Recruitment",
    desc: "Support volunteer onboarding, intern coordination, and team management.",
    skills: ["People Skills", "Organization", "Communication"],
  },
];

const BENEFITS = [
  "Hands-on experience in NGO operations",
  "Certificate of completion",
  "Letter of recommendation (performance-based)",
  "Networking with social sector leaders",
  "Flexible working hours",
  "Remote options available for select roles",
];

export default function InternshipPage() {
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
            INTERNSHIP PROGRAM
          </p>
          <h1
            className="font-display font-semibold text-[#f5f2eb] leading-[1.1] tracking-[-0.02em] mb-4"
            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
          >
            Learn, Grow, and
            <br />
            Make an Impact
          </h1>
          <p className="text-lg text-[#8a8580] max-w-2xl mb-12">
            Our internship program offers students and recent graduates hands-on
            experience in the social sector. Work on real projects that create
            lasting change.
          </p>

          {/* Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
            <div className="bg-[#141414] border border-[rgba(245,242,235,0.06)] rounded-2xl p-6">
              <Clock size={24} className="text-[#d4854a] mb-3" />
              <h3 className="text-lg font-semibold text-[#f5f2eb] mb-1">
                Duration
              </h3>
              <p className="text-sm text-[#8a8580]">1-3 months (flexible)</p>
            </div>
            <div className="bg-[#141414] border border-[rgba(245,242,235,0.06)] rounded-2xl p-6">
              <MapPin size={24} className="text-[#d4854a] mb-3" />
              <h3 className="text-lg font-semibold text-[#f5f2eb] mb-1">
                Location
              </h3>
              <p className="text-sm text-[#8a8580]">
                Kanpur, Ghaziabad, Delhi NCR (Remote available)
              </p>
            </div>
            <div className="bg-[#141414] border border-[rgba(245,242,235,0.06)] rounded-2xl p-6">
              <Award size={24} className="text-[#d4854a] mb-3" />
              <h3 className="text-lg font-semibold text-[#f5f2eb] mb-1">
                Certificate
              </h3>
              <p className="text-sm text-[#8a8580]">
                Provided upon completion
              </p>
            </div>
          </div>

          {/* Roles */}
          <h2 className="font-display text-2xl font-semibold text-[#f5f2eb] mb-8">
            Available Roles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
            {ROLES.map((role) => (
              <div
                key={role.title}
                className="bg-[#141414] border border-[rgba(245,242,235,0.06)] rounded-2xl p-6 hover:border-[rgba(212,133,74,0.2)] transition-all duration-300 group"
              >
                <role.icon
                  size={24}
                  className="text-[#d4854a] mb-4 group-hover:scale-110 transition-transform"
                />
                <h3 className="text-base font-semibold text-[#f5f2eb] mb-2">
                  {role.title}
                </h3>
                <p className="text-sm text-[#8a8580] mb-4 leading-relaxed">
                  {role.desc}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {role.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs px-2 py-1 bg-[rgba(245,242,235,0.05)] text-[#8a8580] rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Benefits */}
          <div className="bg-[#141414] border border-[rgba(245,242,235,0.06)] rounded-2xl p-8 mb-16">
            <h2 className="font-display text-2xl font-semibold text-[#f5f2eb] mb-6">
              What You&apos;ll Gain
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {BENEFITS.map((benefit) => (
                <div key={benefit} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#d4854a]/20 flex items-center justify-center shrink-0">
                    <Check size={14} className="text-[#d4854a]" />
                  </div>
                  <span className="text-sm text-[#f5f2eb]">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#d4854a] text-[#0a0a0a] rounded-full font-semibold hover:scale-[1.04] hover:shadow-[0_4px_20px_rgba(212,133,74,0.3)] transition-all"
            >
              Apply for Internship
              <Award size={18} />
            </Link>
            <p className="text-sm text-[#8a8580] mt-4">
              Or chat with our AI Assistant for more details
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
