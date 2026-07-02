"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
} from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";

const VIP_BENEFITS = [
  {
    icon: Tag,
    title: "30% OFF\nYOUR FIRST ORDER",
    description: "Enjoy 30% off your first coffee purchase when you join.",
  },
  {
    icon: Lock,
    title: "PRIORITY ACCESS\nTO LIMITED RELEASES",
    description: "Be the first to get your hands on our most exclusive coffees.",
  },
  {
    icon: Star,
    title: "EARLY ACCESS\nTO NEW RELEASES",
    description: "Get early access to all new product launches before anyone else.",
  },
  {
    icon: Percent,
    title: "VIP DISCOUNT\nRENEWED ANNUALLY",
    description: "Enjoy an exclusive VIP discount on all coffee products, every year.",
  },
  {
    icon: Users,
    title: "VIP COMMUNITY",
    description: "Join a community of coffee lovers who share their passion.",
  },
];

const CRAFTED_CARDS = [
  {
    image: "/assets/sndurex/Feature Card.png",
    title: "ETHICALLY\nSOURCED",
  },
  {
    image: "/assets/sndurex/Feature Card (1).png",
    title: "EXPERTLY\nROASTED",
  },
  {
    image: "/assets/sndurex/Feature Card (2).png",
    title: "UNIQUELY\nYOURS",
  },
];

const TESTIMONIALS = [
  {
    text: "Absolutely love ordering from St Dreux Coffee. The coffee beans are consistently high quality and perfect for my morning routine. The website is easy to use and the overall experience feels very premium. Highly recommend anyone looking for great coffee and tea at home.",
    name: "Priya Nair",
  },
  {
    text: "Excellent experience with St Dreux Coffee. The premium tea selection is fantastic and you can tell a lot f care has gone into sourcing quality products. Packaging was neat and professional, and everything arrived on time. Will definitely be ordering again.",
    name: "Daniel Wong",
  },
  {
    text: "I recently ordered from St Dreux Coffee and I'm genuinely impressed. The coffee beans are incredibly fresh and full of flavour, you can really taste the quality. The ordering process was smooth and delivery was quick. Perfect for anyone who takes their home coffee seriously.",
    name: "Sarah Mitchell",
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

    if (formData.password.length < 8) {
      toast.error("Password should be at least 8 characters long");
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

      toast.success("✅ Welcome to VIP! Your account is ready.", {
        duration: 4000,
      });
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
      <section className="relative">
        <div className="absolute inset-0">
          <Image
            src="/assets/images/vip-banner.png"
            alt="St. Dreux Coffee Roasted With Purpose"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        </div>

        <div className="relative container mx-auto px-6 py-12 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left - Copy */}
            <div className="text-white">
              <p className="text-[#e0b84c] tracking-[0.3em] text-xs font-semibold uppercase mb-4">
                Roasted in Australia
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Coffee Roasted
                <br />
                With Purpose.
              </h1>
              <p className="text-white/85 text-base sm:text-lg max-w-md mb-8 leading-relaxed">
                Specialty coffee sourced from exceptional origins and roasted in
                Australia for cafés, hospitality venues, and coffee lovers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#vip-register-form"
                  className="inline-flex items-center justify-center bg-[#105a9c] hover:bg-[#0d4a82] text-white text-sm font-semibold tracking-wider uppercase px-8 py-3.5 rounded-md transition-colors"
                >
                  Register for VIP Access
                </a>
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center border border-white/70 hover:bg-white/10 text-white text-sm font-semibold tracking-wider uppercase px-8 py-3.5 rounded-md transition-colors"
                >
                  Explore Coffee
                </Link>
              </div>
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

                <p className="text-center text-sm text-gray-500 mt-4">
                  Already have an account?{" "}
                  <Link
                    href="/auth/login"
                    className="text-[#105a9c] font-semibold hover:underline"
                  >
                    Log in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VIP Benefits */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-[#105a9c] tracking-[0.25em] text-xs font-semibold uppercase mb-2">
              Your VIP Benefits
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0d1a44]">
              Exclusive perks, just for you
            </h2>
            <div className="w-12 h-0.5 bg-[#105a9c] mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {VIP_BENEFITS.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div key={benefit.title} className="text-center px-2">
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

      {/* Crafted with passion */}
      <section className="py-16 bg-[#F5F5F0]">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-[#105a9c] tracking-[0.25em] text-xs font-semibold uppercase mb-3">
                Exceptional Coffee, Every Time
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#0d1a44] leading-tight mb-6">
                Crafted with passion.
                <br />
                Roasted for you.
              </h2>
              <p className="text-gray-600 max-w-md mb-4 leading-relaxed">
                At St. Dreux, we source the finest beans from sustainable farms
                and roast them to perfection. Experience coffee that&apos;s made
                to be savoured.
              </p>
              <p
                className="text-2xl italic text-[#105a9c]"
                style={{ fontFamily: "cursive" }}
              >
                Taste the difference.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {CRAFTED_CARDS.map((card) => (
                <div
                  key={card.title}
                  className="relative aspect-[3/4] rounded-lg overflow-hidden"
                >
                  <Image
                    src={card.image}
                    alt={card.title.replace("\n", " ")}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <p className="absolute bottom-3 left-3 text-white text-xs font-bold uppercase whitespace-pre-line leading-snug">
                    {card.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0d1a44] mb-1">
              Our customers
            </h2>
            <p className="text-3xl sm:text-4xl font-bold text-[#0d1a44]">
              keep coming back{" "}
              <span
                className="italic text-[#105a9c]"
                style={{ fontFamily: "cursive" }}
              >
                for more.
              </span>
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((review) => (
              <div
                key={review.name}
                className="bg-[#F5F5F0] rounded-xl px-6 pt-8 pb-6"
              >
                <div
                  className="text-[#105a9c] font-serif leading-none mb-2"
                  style={{ fontSize: "56px", lineHeight: "40px" }}
                >
                  &#8220;
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                  {review.text}
                </p>
                <p className="font-semibold text-[#0d1a44] mb-2">{review.name}</p>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-4 h-4 fill-[#105a9c] text-[#105a9c]"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Follow the journey */}
      <section className="py-8 bg-[#F5F5F0]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="lg:w-[20%] text-center lg:text-left">
              <p className="text-xs font-semibold tracking-widest text-gray-600 mb-1">
                FOLLOW THE JOURNEY
              </p>
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
            <div className="lg:w-[80%] grid grid-cols-3 md:grid-cols-6 gap-2">
              <div className="aspect-square overflow-hidden rounded-lg">
                <Image src="/assets/images/video-thumb-3.png" alt="St. Dreux Coffee" width={200} height={200} className="w-full h-full object-cover" />
              </div>
              <div className="aspect-square overflow-hidden rounded-lg">
                <Image src="/assets/sndurex/Feature Card.png" alt="St. Dreux Coffee" width={200} height={200} className="w-full h-full object-cover" />
              </div>
              <div className="aspect-square overflow-hidden rounded-lg">
                <Image src="/assets/images/video-thumb-1.png" alt="St. Dreux Coffee" width={200} height={200} className="w-full h-full object-cover" />
              </div>
              <div className="aspect-square overflow-hidden rounded-lg">
                <Image src="/assets/sndurex/Feature Card (2).png" alt="St. Dreux Coffee" width={200} height={200} className="w-full h-full object-cover" />
              </div>
              <div className="aspect-square overflow-hidden rounded-lg">
                <Image src="/assets/images/video-thumb-2.png" alt="St. Dreux Coffee" width={200} height={200} className="w-full h-full object-cover" />
              </div>
              <div className="aspect-square overflow-hidden rounded-lg">
                <Image src="/assets/sndurex/Feature Card (1).png" alt="St. Dreux Coffee" width={200} height={200} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
