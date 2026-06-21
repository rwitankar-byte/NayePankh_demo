import { useState } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  HeartHandshake,
  BookOpen,
  Utensils,
  Users,
  Wrench,
  TreePine,
  Sparkles,
  ChevronRight,
} from "lucide-react";

const STEPS = [
  { title: "Personal Details", fields: ["name", "email", "phone", "city"] },
  { title: "Interests", fields: ["interests"] },
  { title: "Availability", fields: ["availability"] },
  { title: "Confirmation", fields: [] },
];

const INTEREST_OPTIONS = [
  { value: "education", label: "Education", icon: BookOpen },
  { value: "health", label: "Health & Sanitation", icon: HeartHandshake },
  { value: "food", label: "Food Distribution", icon: Utensils },
  { value: "women", label: "Women Empowerment", icon: Users },
  { value: "skills", label: "Skill Development", icon: Wrench },
  { value: "environment", label: "Environmental Awareness", icon: TreePine },
];

const AVAILABILITY_OPTIONS = [
  { value: "weekdays", label: "Weekdays" },
  { value: "weekends", label: "Weekends" },
  { value: "flexible", label: "Flexible" },
];

export default function VolunteerPage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    interests: [] as string[],
    availability: "",
  });

  const registerMutation = trpc.volunteer.register.useMutation({
    onSuccess: () => setSubmitted(true),
  });

  const updateField = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const isStepValid = () => {
    switch (step) {
      case 0:
        return (
          formData.name.length >= 2 &&
          formData.email.includes("@") &&
          formData.phone.length >= 10 &&
          formData.city.length > 0
        );
      case 1:
        return formData.interests.length > 0;
      case 2:
        return formData.availability.length > 0;
      default:
        return true;
    }
  };

  const handleSubmit = () => {
    registerMutation.mutate({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      city: formData.city,
      interests: formData.interests,
      availability: formData.availability as "weekdays" | "weekends" | "flexible",
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#1a1410]">
        <Navigation />
        <div className="pt-24 pb-16 px-6 min-h-screen flex items-center justify-center">
          <div className="max-w-md w-full text-center">
            <div className="w-20 h-20 bg-[#e8734a]/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={40} className="text-[#e8734a]" />
            </div>
            <h2 className="font-display text-3xl font-semibold text-[#f5f2eb] mb-4">
              Registration Complete!
            </h2>
            <p className="text-[#8a8580] mb-8">
              Thank you for registering as a volunteer! Our team will reach out
              to you shortly with next steps. Together, we can make a difference.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                to="/chat"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#e8734a] text-[#1a1410] rounded-full font-semibold hover:bg-[#ff7e5d] transition-all"
              >
                <Sparkles size={16} />
                Chat with AI Assistant
              </Link>
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-[#2a2018] text-[#f5f2eb] rounded-full font-medium hover:border-[#e8734a] transition-all"
              >
                <ArrowLeft size={16} />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1410]">
      <Navigation />

      <div className="pt-24 pb-16 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Back Link */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-[#8a8580] hover:text-[#e8734a] transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          {/* Header */}
          <p className="text-xs font-medium tracking-[0.15em] text-[#e8734a] uppercase mb-4">
            VOLUNTEER WITH US
          </p>
          <h1
            className="font-display font-semibold text-[#f5f2eb] leading-[1.1] tracking-[-0.02em] mb-4"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            Be the Change You
            <br />
            Wish to See
          </h1>
          <p className="text-[#8a8580] mb-10">
            Join thousands of young changemakers. Fill out the form below to
            register as a volunteer.
          </p>

          {/* Progress */}
          <div className="flex items-center gap-2 mb-10">
            {STEPS.map((_s, i) => (
              <div key={i} className="flex items-center gap-2 flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                    i < step
                      ? "bg-[#ff7e5d] text-[#1a1410]"
                      : i === step
                      ? "bg-[#e8734a] text-[#1a1410]"
                      : "bg-[rgba(245,242,235,0.15)] text-[#8a8580]"
                  }`}
                >
                  {i < step ? <Check size={14} /> : i + 1}
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`h-px flex-1 transition-all ${
                      i < step ? "bg-[#ff7e5d]" : "bg-[#2a2018]"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Form Card */}
          <div className="bg-[#141210] border border-[#2a2018] rounded-2xl p-8">
            <p className="text-sm font-semibold text-[#f5f2eb] mb-6">
              Step {step + 1}: {STEPS[step].title}
            </p>

            {/* Step 1: Personal Details */}
            {step === 0 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[#8a8580] mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full bg-transparent border border-[#2a2018] rounded-xl px-4 py-3 text-[#f5f2eb] text-sm placeholder:text-[rgba(245,242,235,0.3)] focus:border-[#e8734a] focus:outline-none focus:shadow-[0_0_0_3px_rgba(232,115,74,0.1)] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#8a8580] mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="your@email.com"
                    className="w-full bg-transparent border border-[#2a2018] rounded-xl px-4 py-3 text-[#f5f2eb] text-sm placeholder:text-[rgba(245,242,235,0.3)] focus:border-[#e8734a] focus:outline-none focus:shadow-[0_0_0_3px_rgba(232,115,74,0.1)] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#8a8580] mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="+91-XXXXXXXXXX"
                    className="w-full bg-transparent border border-[#2a2018] rounded-xl px-4 py-3 text-[#f5f2eb] text-sm placeholder:text-[rgba(245,242,235,0.3)] focus:border-[#e8734a] focus:outline-none focus:shadow-[0_0_0_3px_rgba(232,115,74,0.1)] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#8a8580] mb-2">
                    City
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    className="w-full bg-[#141210] border border-[#2a2018] rounded-xl px-4 py-3 text-[#f5f2eb] text-sm focus:border-[#e8734a] focus:outline-none focus:shadow-[0_0_0_3px_rgba(232,115,74,0.1)] transition-all"
                  >
                    <option value="" disabled>
                      Select your city
                    </option>
                    <option value="Kanpur">Kanpur</option>
                    <option value="Ghaziabad">Ghaziabad</option>
                    <option value="Lucknow">Lucknow</option>
                    <option value="Delhi NCR">Delhi NCR</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 2: Interests */}
            {step === 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {INTEREST_OPTIONS.map((option) => {
                  const isSelected = formData.interests.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      onClick={() => toggleInterest(option.value)}
                      className={`flex items-center gap-3 px-5 py-4 rounded-full border transition-all ${
                        isSelected
                          ? "bg-[#e8734a] border-[#e8734a] text-[#1a1410]"
                          : "border-[#2a2018] text-[#f5f2eb] hover:border-[#e8734a]"
                      }`}
                    >
                      <option.icon size={18} />
                      <span className="text-sm font-medium">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Step 3: Availability */}
            {step === 2 && (
              <div className="space-y-3">
                {AVAILABILITY_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateField("availability", option.value)}
                    className={`w-full flex items-center justify-between px-5 py-4 rounded-full border transition-all ${
                      formData.availability === option.value
                        ? "bg-[#e8734a] border-[#e8734a] text-[#1a1410]"
                        : "border-[#2a2018] text-[#f5f2eb] hover:border-[#e8734a]"
                    }`}
                  >
                    <span className="text-sm font-medium">{option.label}</span>
                    {formData.availability === option.value && (
                      <Check size={16} />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Step 4: Confirmation */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="bg-[rgba(245,242,235,0.03)] rounded-xl p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8a8580]">Name</span>
                    <span className="text-[#f5f2eb]">{formData.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8a8580]">Email</span>
                    <span className="text-[#f5f2eb]">{formData.email}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8a8580]">Phone</span>
                    <span className="text-[#f5f2eb]">{formData.phone}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8a8580]">City</span>
                    <span className="text-[#f5f2eb]">{formData.city}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8a8580]">Interests</span>
                    <span className="text-[#f5f2eb] text-right">
                      {formData.interests
                        .map(
                          (i) =>
                            INTEREST_OPTIONS.find((o) => o.value === i)?.label || i
                        )
                        .join(", ")}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8a8580]">Availability</span>
                    <span className="text-[#f5f2eb] capitalize">
                      {formData.availability}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-[#8a8580]">
                  By submitting, you agree to be contacted by NayePankh
                  Foundation regarding volunteer opportunities.
                </p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8">
              {step > 0 ? (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  className="text-[#f5f2eb]/60 text-sm hover:text-[#f5f2eb] transition-colors"
                >
                  Back
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button
                  onClick={() => isStepValid() && setStep((s) => s + 1)}
                  disabled={!isStepValid()}
                  className="flex items-center gap-2 px-6 py-3 bg-[#e8734a] text-[#1a1410] rounded-full font-semibold text-sm hover:bg-[#ff7e5d] transition-all disabled:opacity-50 disabled:hover:bg-[#e8734a]"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={registerMutation.isPending}
                  className="flex items-center gap-2 px-8 py-3 bg-[#e8734a] text-[#1a1410] rounded-full font-semibold text-sm hover:bg-[#ff7e5d] hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(232,115,74,0.25)] transition-all disabled:opacity-50"
                >
                  {registerMutation.isPending ? "Submitting..." : "Submit Registration"}
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
