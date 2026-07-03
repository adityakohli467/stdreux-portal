"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Eye,
  EyeOff,
  User,
  Phone,
  Mail,
  Lock,
  Tag,
  Star,
  Percent,
  Users,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";

type VipBenefit = {
  icon: LucideIcon;
  title: string;
  eyebrow: string;
  highlight?: string;
  description: string;
  featured?: boolean;
  wide?: boolean;
};

const VIP_BENEFITS: VipBenefit[] = [
  {
    icon: Tag,
    title: "30% OFF\nYOUR FIRST ORDER",
    eyebrow: "Your First Order",
    highlight: "30% OFF",
    description: "Enjoy 30% off your first coffee purchase when you join.",
    featured: true,
    wide: true,
  },
  {
    icon: Star,
    title: "PRIORITY ACCESS\nTO NEW RELEASES",
    eyebrow: "Priority Access to",
    highlight: "New Releases",
    description:
      "Be the first to get your hands on all our new coffee releases before anyone else.",
  },
  {
    icon: Percent,
    title: "VIP DISCOUNT\nRENEWED ANNUALLY",
    eyebrow: "VIP Discount",
    highlight: "Renewed Annually",
    description:
      "Enjoy an exclusive VIP discount on all coffee products, every year.",
  },
  {
    icon: Users,
    title: "VIP COMMUNITY",
    eyebrow: "VIP Community",
    description: "Join a community of coffee lovers who share their passion.",
  },
];

export default function VipRegisterPage() {
  const router = useRouter();
  const register = useAuthStore((state) => state.register);

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const nameParts = formData.fullName.trim().split(/\s+/);
      const firstname = nameParts[0] || "";
      const lastname = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

      await register({
        firstname,
        lastname,
        email: formData.email,
        username: formData.email,
        password: formData.password,
        telephone: formData.phoneNumber || "",
        // Registrations from the VIP landing page are saved as Retail
        // customers and automatically marked as VIP in the backend.
        customer_type: "Retail",
        vip: true,
      });

      toast.success(
        "Registration Successful! Please check your email for your St. Dreux VIP welcome and exclusive benefits.",
        {
          duration: 6000,
        }
      );
      router.push("/");
    } catch (error: any) {
      console.error("VIP registration error:", error);
      const errorMsg =
        error.message || error.response?.data?.message || "Registration failed";

      if (
        errorMsg.includes("User already exists") ||
        errorMsg.includes("email already exists") ||
        errorMsg.includes("EXISTING_EMAIL_PASSWORD_USER")
      ) {
        toast.error("This email already exists. Please login with your password.");
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Banner */}
      <section className="relative lg:min-h-[640px] flex items-center">
        <div className="absolute inset-0">
          {/* Mobile banner */}
          <Image
            src="/assets/images/mobile_banner_vip.png"
            alt="St. Dreux VIP Access"
            fill
            priority
            className="object-cover lg:hidden"
            style={{ objectPosition: "center top" }}
          />
          {/* Desktop banner */}
          <Image
            src="/assets/images/vip-banner.png"
            alt="St. Dreux Coffee Roasted With Purpose"
            fill
            priority
            className="object-cover hidden lg:block"
            style={{ objectPosition: "center 35%" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/40 lg:bg-gradient-to-r lg:from-black/85 lg:via-black/45 lg:to-transparent" />
        </div>

        <div className="relative w-full container mx-auto px-6 py-8 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-5 lg:gap-16 items-center">
            {/* Left - Copy */}
            <div className="text-white">
              <p className="text-[#E07856] tracking-[0.3em] text-xs font-semibold uppercase mb-2 lg:mb-4">
                You&apos;re Invited
              </p>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-3 lg:mb-4">
                Welcome back
                <br />
                to St. Dreux
              </h1>
              <div className="w-16 h-1 bg-[#E07856] mb-3 lg:mb-6" />
              <p className="text-white/85 text-sm sm:text-lg max-w-md mb-0 lg:mb-8 leading-relaxed">
                As one of our valued customers before 2022, you&apos;re invited
                to unlock exclusive VIP benefits created just for you.
              </p>
              {/* CTA hidden on mobile */}
              <a
                href="#vip-register-form"
                className="hidden lg:inline-flex items-center justify-center gap-2 bg-[#E07856] hover:bg-[#cf6a49] text-white text-sm font-semibold tracking-wider uppercase px-8 py-4 rounded-md transition-colors"
              >
                Unlock Your VIP Access
                <ArrowRight className="w-4 h-4" />
              </a>
              <p className="hidden lg:block text-white/70 text-sm mt-4">
                Create your account to get started
              </p>
            </div>

            {/* Right - Register Form */}
            <div id="vip-register-form" className="lg:justify-self-end w-full max-w-md">
              <div className="bg-white rounded-lg shadow-2xl p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-[#0d1a44] leading-tight mb-2">
                  Register to Unlock
                  <br />
                  Exclusive VIP Access
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                  Create your account and enjoy exclusive benefits, offers and
                  early access to new releases.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={formData.fullName}
                      onChange={(e) => handleChange("fullName", e.target.value)}
                      required
                      className="w-full h-11 pl-10 pr-3 rounded-md border border-gray-300 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#105a9c] focus:border-[#105a9c]"
                    />
                  </div>

                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      placeholder="Contact Number"
                      value={formData.phoneNumber}
                      onChange={(e) => handleChange("phoneNumber", e.target.value)}
                      className="w-full h-11 pl-10 pr-3 rounded-md border border-gray-300 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#105a9c] focus:border-[#105a9c]"
                    />
                  </div>

                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      required
                      className="w-full h-11 pl-10 pr-3 rounded-md border border-gray-300 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#105a9c] focus:border-[#105a9c]"
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      required
                      className="w-full h-11 pl-10 pr-10 rounded-md border border-gray-300 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#105a9c] focus:border-[#105a9c]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleChange("confirmPassword", e.target.value)
                      }
                      required
                      className="w-full h-11 pl-10 pr-10 rounded-md border border-gray-300 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#105a9c] focus:border-[#105a9c]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 bg-[#105a9c] hover:bg-[#0d4a82] disabled:opacity-70 text-white text-sm font-semibold tracking-wider uppercase rounded-md transition-colors"
                  >
                    {loading ? "Creating account..." : "Register & Unlock VIP Access"}
                  </button>
                </form>

                <p className="mt-5 text-[11px] leading-relaxed text-gray-500 border-t border-gray-200 pt-4">
                  <span className="font-semibold text-gray-600">Disclaimer:</span>{" "}
                  VIP membership is available exclusively to customers who register
                  using the email address that received this invitation. Registrations
                  made with any other email address will not qualify for VIP status or
                  associated benefits, including the one-time 30% discount code
                  (VIP30). Please register within two weeks of receiving this email to
                  enjoy the VIP benefits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VIP Benefits */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8 sm:mb-12">
            <p className="text-[#105a9c] tracking-[0.25em] text-xs font-semibold uppercase mb-2">
              Your VIP Benefits
            </p>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#0d1a44]">
              Exclusive perks, just for you
            </h2>
            <div className="w-12 h-0.5 bg-[#105a9c] mx-auto mt-4" />
          </div>

          {/* Mobile: wide first-order card on top + 4 equal square boxes */}
          <div className="max-w-2xl mx-auto lg:hidden">
            {VIP_BENEFITS.filter((b) => b.wide).map((benefit) => {
              const Icon = benefit.icon;
              const featuredWide = benefit.featured;
              return (
                <div
                    key={benefit.eyebrow}
                    className={`flex items-center gap-4 rounded-2xl border px-5 py-3 text-left ${
                      featuredWide
                        ? "border-transparent"
                        : "bg-[#f8f6f0] border-[#ece8e0]"
                    }`}
                    style={
                      featuredWide
                        ? {
                            backgroundImage:
                              "url(/assets/images/footer-bg.png)",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }
                        : undefined
                    }
                  >
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${
                        featuredWide ? "bg-white/10" : "bg-[#eaf1f8]"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          featuredWide ? "text-white" : "text-[#105a9c]"
                        }`}
                      />
                    </div>
                    <div>
                      <p
                        className={`text-[11px] font-bold uppercase tracking-wide mb-1 ${
                          featuredWide ? "text-white/70" : "text-[#0d1a44]"
                        }`}
                      >
                        {benefit.eyebrow}
                      </p>
                      {benefit.highlight && (
                        <p
                          className={`font-extrabold mb-1 ${
                            featuredWide
                              ? "text-white text-lg"
                              : "text-[#105a9c] text-sm"
                          }`}
                        >
                          {benefit.highlight}
                        </p>
                      )}
                      <p
                        className={`text-xs leading-relaxed ${
                          featuredWide ? "text-white/60" : "text-gray-500"
                        }`}
                      >
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                );
            })}

            <div className="grid grid-cols-2 auto-rows-fr gap-3 mt-3">
              {VIP_BENEFITS.filter((b) => !b.wide).map((benefit) => {
                const Icon = benefit.icon;
                const featured = benefit.featured;
                return (
                <div
                  key={benefit.eyebrow}
                  className={`flex flex-col items-center justify-center rounded-2xl border px-4 py-5 text-center ${
                    featured
                      ? "border-transparent"
                      : "bg-[#f8f6f0] border-[#ece8e0]"
                  }`}
                  style={
                    featured
                      ? {
                          backgroundImage:
                            "url(/assets/images/footer-bg.png)",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }
                      : undefined
                  }
                >
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center mb-3 ${
                      featured ? "bg-white/10" : "bg-[#eaf1f8]"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        featured ? "text-white" : "text-[#105a9c]"
                      }`}
                    />
                  </div>
                  <p
                    className={`text-[11px] font-bold uppercase tracking-wide mb-1 ${
                      featured ? "text-white/70" : "text-[#0d1a44]"
                    }`}
                  >
                    {benefit.eyebrow}
                  </p>
                  {benefit.highlight && (
                    <p
                      className={`font-extrabold mb-1.5 ${
                        featured ? "text-white text-lg" : "text-[#105a9c] text-sm"
                      }`}
                    >
                      {benefit.highlight}
                    </p>
                  )}
                  <p
                    className={`text-xs leading-relaxed ${
                      featured ? "text-white/60" : "text-gray-500"
                    }`}
                  >
                    {benefit.description}
                  </p>
                </div>
              );
              })}
            </div>
          </div>

          {/* Desktop: 4-column layout, centered */}
          <div className="hidden lg:grid grid-cols-4 gap-8 max-w-5xl mx-auto">
            {VIP_BENEFITS.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div key={benefit.eyebrow} className="text-center px-2">
                  <div className="w-16 h-16 rounded-full bg-[#eaf1f8] flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-[#105a9c]" />
                  </div>
                  <h3 className="text-sm font-bold text-[#0d1a44] uppercase mb-2 whitespace-pre-line leading-snug">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Instagram Follow Section */}
      <section className="py-8 bg-[#f5f5f0]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Left - Follow CTA */}
            <div className="lg:w-[20%] text-center lg:text-left">
              <p className="text-xs font-semibold tracking-widest text-gray-600 mb-1">FOLLOW THE JOURNEY</p>
              <p className="text-xl font-bold text-[#0d1a44] mb-3">@stdreuxau</p>
              <a
                href="https://www.instagram.com/stdreuxau"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#105a9c] text-white text-xs font-semibold tracking-wider px-6 py-2.5 rounded-sm hover:bg-[#0d4a82] transition-colors"
              >
                FOLLOW US
              </a>
            </div>
            {/* Right - Image & Video Grid (alternating) */}
            <div className="lg:w-[80%] grid grid-cols-3 md:grid-cols-6 gap-2">
              {/* Video 3 Thumbnail (moved to first) */}
              <div className="aspect-square overflow-hidden rounded-lg relative cursor-pointer group" onClick={() => setActiveVideo("/assets/videos/video3.mp4")}>
                <Image src="/assets/images/video-thumb-3.png" alt="St. Dreux Coffee Video" width={200} height={200} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#0d1a44] ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                </div>
              </div>
              {/* Image 1 */}
              <div className="aspect-square overflow-hidden rounded-lg">
                <Image src="/assets/sndurex/Feature Card.png" alt="St. Dreux Coffee" width={200} height={200} className="w-full h-full object-cover" />
              </div>
              {/* Video 1 Thumbnail */}
              <div className="aspect-square overflow-hidden rounded-lg relative cursor-pointer group" onClick={() => setActiveVideo("/assets/videos/video1.mp4")}>
                <Image src="/assets/images/video-thumb-1.png" alt="St. Dreux Coffee Video" width={200} height={200} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#0d1a44] ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                </div>
              </div>
              {/* Image 2 */}
              <div className="aspect-square overflow-hidden rounded-lg">
                <Image src="/assets/sndurex/Feature Card (2).png" alt="St. Dreux Coffee" width={200} height={200} className="w-full h-full object-cover" />
              </div>
              {/* Video 2 Thumbnail */}
              <div className="aspect-square overflow-hidden rounded-lg relative cursor-pointer group" onClick={() => setActiveVideo("/assets/videos/video2.mp4")}>
                <Image src="/assets/images/video-thumb-2.png" alt="St. Dreux Coffee Video" width={200} height={200} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#0d1a44] ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                </div>
              </div>
              {/* Image 3 */}
              <div className="aspect-square overflow-hidden rounded-lg">
                <Image src="/assets/sndurex/Feature Card (1).png" alt="St. Dreux Coffee" width={200} height={200} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => setActiveVideo(null)}>
          <div className="relative w-full max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute -top-10 right-0 text-white hover:text-white/80 text-2xl font-bold"
            >
              ✕
            </button>
            <video src={activeVideo} controls autoPlay className="w-full rounded-lg" />
          </div>
        </div>
      )}
    </div>
  );
}
