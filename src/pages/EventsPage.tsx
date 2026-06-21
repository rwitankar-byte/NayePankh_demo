import { useState } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  ExternalLink,
  Clock,
  CheckCircle2,
  Circle,
} from "lucide-react";

export default function EventsPage() {
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");

  const { data: events, isLoading } = trpc.event.list.useQuery({ type: filter });

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const isPast = (date: Date | string) => {
    return new Date(date) < new Date();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navigation />

      <div className="pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
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
            EVENTS
          </p>
          <h1
            className="font-display font-semibold text-[#f5f2eb] leading-[1.1] tracking-[-0.02em] mb-4"
            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
          >
            Upcoming Events &amp;
            <br />
            Programs
          </h1>
          <p className="text-lg text-[#8a8580] max-w-2xl mb-10">
            Join us in our mission to create positive change. From health camps
            to educational workshops, there&apos;s always something happening at
            NayePankh.
          </p>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-10">
            {(["all", "upcoming", "past"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === f
                    ? "bg-[#d4854a] text-[#0a0a0a]"
                    : "border border-[rgba(245,242,235,0.1)] text-[#8a8580] hover:text-[#f5f2eb] hover:border-[#d4854a]"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Events List */}
          {isLoading ? (
            <div className="text-center py-16">
              <div className="w-8 h-8 border-2 border-[#d4854a] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-[#8a8580] mt-4">Loading events...</p>
            </div>
          ) : events && events.length > 0 ? (
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className={`bg-[#141414] border rounded-2xl p-6 transition-all hover:border-[rgba(212,133,74,0.2)] ${
                    isPast(event.date)
                      ? "border-[rgba(245,242,235,0.04)] opacity-70"
                      : "border-[rgba(245,242,235,0.06)]"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    {/* Date Badge */}
                    <div className="shrink-0">
                      <div
                        className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center ${
                          isPast(event.date)
                            ? "bg-[rgba(245,242,235,0.05)]"
                            : "bg-[#d4854a]/15"
                        }`}
                      >
                        <span
                          className={`text-lg font-bold ${
                            isPast(event.date) ? "text-[#8a8580]" : "text-[#d4854a]"
                          }`}
                        >
                          {new Date(event.date).getDate()}
                        </span>
                        <span
                          className={`text-[10px] uppercase ${
                            isPast(event.date) ? "text-[#8a8580]" : "text-[#d4854a]"
                          }`}
                        >
                          {new Date(event.date).toLocaleDateString("en-IN", {
                            month: "short",
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {isPast(event.date) ? (
                              <span className="inline-flex items-center gap-1 text-xs text-[#8a8580] bg-[rgba(245,242,235,0.05)] px-2 py-0.5 rounded-full">
                                <CheckCircle2 size={12} />
                                Completed
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs text-[#d4854a] bg-[#d4854a]/15 px-2 py-0.5 rounded-full">
                                <Circle size={12} />
                                Upcoming
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-semibold text-[#f5f2eb] mb-1">
                            {event.title}
                          </h3>
                          <p className="text-sm text-[#8a8580] mb-3 leading-relaxed">
                            {event.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-[#8a8580]">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar size={14} className="text-[#d4854a]" />
                          {formatDate(event.date)}
                        </span>
                        {event.location && (
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin size={14} className="text-[#d4854a]" />
                            {event.location}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1.5">
                          <Clock size={14} className="text-[#d4854a]" />
                          {new Date(event.date).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      {event.registrationLink && !isPast(event.date) && (
                        <a
                          href={event.registrationLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm text-[#d4854a] hover:text-[#ff7e5d] mt-3 transition-colors"
                        >
                          Register Now
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Calendar size={48} className="text-[#8a8580]/30 mx-auto mb-4" />
              <p className="text-[#8a8580]">No events found.</p>
            </div>
          )}

          {/* CTA */}
          <div className="mt-16 text-center bg-[#141414] border border-[rgba(245,242,235,0.06)] rounded-2xl p-8">
            <h3 className="text-xl font-semibold text-[#f5f2eb] mb-2">
              Want to organize an event with us?
            </h3>
            <p className="text-sm text-[#8a8580] mb-6">
              We&apos;re always open to collaborations. Get in touch with our team.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#d4854a] text-[#0a0a0a] rounded-full font-semibold text-sm hover:scale-[1.04] transition-all"
            >
              Contact Us
              <ArrowLeft size={16} className="rotate-180" />
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
