import { useEffect, useRef } from "react";
import { Link } from "react-router";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import HeroCanvas from "@/components/HeroCanvas";
import ChatInterface from "@/components/ChatInterface";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Users, BookOpen, Heart, Globe } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hero entrance animation
    const tl = gsap.timeline({ delay: 0.6 });
    tl.fromTo(
      ".hero-headline",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    )
      .fromTo(
        ".hero-subtitle",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
        "-=0.2"
      )
      .fromTo(
        ".hero-cta",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
        "-=0.2"
      );

    // Stats counter animation
    const statElements = statsRef.current?.querySelectorAll(".stat-number");
    statElements?.forEach((el) => {
      const target = parseInt(el.getAttribute("data-target") || "0");
      gsap.fromTo(
        el,
        { innerText: "0" },
        {
          innerText: target,
          duration: 2,
          ease: "power2.out",
          snap: { innerText: 1 },
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
          },
          onUpdate: function () {
            const val = Math.round(parseFloat(el.textContent || "0"));
            const suffix = el.getAttribute("data-suffix") || "";
            el.textContent = val.toLocaleString() + suffix;
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navigation />

      {/* ─── Hero Section ─────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative w-full h-screen overflow-hidden"
        role="img"
        aria-label="NayePankh community outreach photo with fluid distortion effect"
      >
        <HeroCanvas imageUrl="/hero-photo.jpg" />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(10,10,10,0.4)] to-[rgba(10,10,10,0.7)] z-[1]" />

        {/* Hero Content */}
        <div className="absolute bottom-[15%] left-[5%] max-w-[60vw] z-[2]">
          <h1
            className="hero-headline font-display font-bold text-[#f5f2eb] leading-[1.05] tracking-[-0.03em] opacity-0"
            style={{
              fontSize: "clamp(3rem, 6vw, 5.5rem)",
              textShadow: "0 4px 30px rgba(0,0,0,0.5)",
            }}
          >
            Your Questions,
            <br />
            Our Mission
          </h1>
          <p className="hero-subtitle text-lg text-[#8a8580] max-w-[480px] mt-6 opacity-0">
            NayePankh Foundation&apos;s AI Assistant is here to guide you through
            volunteering, internships, and community programs — instantly.
          </p>
          <div className="hero-cta flex items-center gap-4 mt-8 opacity-0">
            <Link
              to="/chat"
              className="px-8 py-3 bg-[#d4854a] text-[#0a0a0a] rounded-full font-semibold text-sm hover:scale-[1.04] hover:shadow-[0_4px_20px_rgba(212,133,74,0.3)] transition-all duration-200"
            >
              Start Chatting
            </Link>
            <Link
              to="/volunteer"
              className="px-8 py-3 border border-[rgba(245,242,235,0.2)] text-[#f5f2eb] rounded-full font-medium text-sm hover:border-[#d4854a] hover:text-[#d4854a] transition-all duration-200"
            >
              Join as Volunteer
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          className="absolute bottom-[5%] left-1/2 -translate-x-1/2 z-[2]"
          style={{ animation: "scroll-bounce 2s infinite ease-in-out" }}
        >
          <div className="w-px h-10 bg-[#8a8580]/40" />
        </div>
      </section>

      {/* ─── Chat Section ─────────────────────────────────────────── */}
      <section className="relative w-full min-h-screen bg-[#0a0a0a] py-20">
        <div className="max-w-[900px] mx-auto px-4 h-[85vh]">
          <ChatInterface showWelcome={false} />
        </div>
      </section>

      <div className="section-divider" />

      {/* ─── Volunteer Section ────────────────────────────────────── */}
      <section className="w-full bg-[#1a1410] py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-medium tracking-[0.15em] text-[#e8734a] uppercase mb-4">
            VOLUNTEER WITH US
          </p>
          <h2
            className="font-display font-semibold text-[#f5f2eb] leading-[1.1] tracking-[-0.02em] mb-6"
            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
          >
            Be the Change
            <br />
            You Wish to See
          </h2>
          <p className="text-lg text-[rgba(245,242,235,0.7)] max-w-[560px] leading-relaxed mb-12">
            Join thousands of young changemakers across Kanpur, Ghaziabad, and
            beyond. Whether you have an hour or a year, your contribution creates
            ripples of lasting impact.
          </p>

          {/* Stats */}
          <div
            ref={statsRef}
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-16 mb-16"
          >
            <div>
              <p
                className="stat-number font-display text-5xl text-[#e8734a] mb-1"
                data-target="5000"
                data-suffix="+"
              >
                0+
              </p>
              <p className="text-sm text-[rgba(245,242,235,0.6)]">
                Active Volunteers
              </p>
            </div>
            <div>
              <p
                className="stat-number font-display text-5xl text-[#e8734a] mb-1"
                data-target="50"
                data-suffix="+"
              >
                0+
              </p>
              <p className="text-sm text-[rgba(245,242,235,0.6)]">
                Cities Reached
              </p>
            </div>
            <div>
              <p
                className="stat-number font-display text-5xl text-[#e8734a] mb-1"
                data-target="10"
                data-suffix="L+"
              >
                0L+
              </p>
              <p className="text-sm text-[rgba(245,242,235,0.6)]">
                Resources Distributed
              </p>
            </div>
          </div>

          {/* Volunteer Image + CTA */}
          <div className="relative rounded-2xl overflow-hidden mb-8">
            <img
              src="/volunteer-team.jpg"
              alt="NayePankh Volunteers"
              className="w-full h-[400px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1410] via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <Link
                to="/volunteer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#e8734a] text-[#1a1410] rounded-full font-semibold hover:bg-[#ff7e5d] hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(232,115,74,0.25)] transition-all duration-200"
              >
                Register as Volunteer
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ─── Features Section ─────────────────────────────────────── */}
      <section className="w-full bg-[#0a0a0a] py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-medium tracking-[0.15em] text-[#d4854a] uppercase mb-4 text-center">
            WHAT WE DO
          </p>
          <h2
            className="font-display font-semibold text-[#f5f2eb] leading-[1.1] tracking-[-0.02em] mb-16 text-center"
            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
          >
            Our Impact Areas
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: BookOpen,
                title: "Education",
                desc: "Providing quality education and supplies to underprivileged children across India.",
              },
              {
                icon: Heart,
                title: "Health & Sanitation",
                desc: "Organizing health camps, sanitation drives, and awareness programs in communities.",
              },
              {
                icon: Users,
                title: "Women Empowerment",
                desc: "Skill development workshops and self-help groups for women from disadvantaged backgrounds.",
              },
              {
                icon: Globe,
                title: "Environmental Awareness",
                desc: "Tree plantations, clean-up drives, and sustainability education for a greener tomorrow.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-[#141414] border border-[rgba(245,242,235,0.06)] rounded-2xl p-6 hover:border-[rgba(212,133,74,0.2)] transition-all duration-300"
              >
                <feature.icon size={28} className="text-[#d4854a] mb-4" />
                <h3 className="text-lg font-semibold text-[#f5f2eb] mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-[#8a8580] leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ─── Quote Section ────────────────────────────────────────── */}
      <section className="w-full bg-[#0a0a0a] py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <blockquote
            className="font-display font-semibold text-[#f5f2eb] leading-[1.2] tracking-[-0.02em] mb-8"
            style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}
          >
            &ldquo;If we all do something, then together there is no problem that
            we cannot solve!&rdquo;
          </blockquote>
          <p className="text-sm font-semibold text-[#d4854a] tracking-[0.15em] uppercase">
            PRASHANT SHUKLA
          </p>
          <p className="text-sm text-[#8a8580] mt-1">
            Founder &amp; President, NayePankh Foundation
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
