"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api"
import { toast } from "sonner"

export function Footer() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      toast.error("Please enter your email address")
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      toast.error("Please enter a valid email address")
      return
    }

    try {
      setLoading(true)
      const response = await api.post("/store/newsletter/subscribe", {
        email: email.trim(),
      })

      toast.success(response.data.message || "Successfully subscribed to our newsletter!")
      setEmail("")
    } catch (error: any) {
      console.error("Newsletter subscription error:", error)
      const errorMessage = error.response?.data?.message || "Failed to subscribe. Please try again later."
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <footer className="bg-[#0b1a2e] text-white relative overflow-hidden">
      {/* Watermark Background */}
      <div className="absolute right-0 bottom-0 w-[300px] h-[300px] md:w-[400px] md:h-[400px] opacity-[0.08] pointer-events-none">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <circle cx="100" cy="100" r="95" stroke="white" strokeWidth="2"/>
          <circle cx="100" cy="100" r="80" stroke="white" strokeWidth="1.5"/>
          {/* Face outline */}
          <ellipse cx="100" cy="95" rx="45" ry="55" stroke="white" strokeWidth="1.5"/>
          {/* Eyes */}
          <circle cx="85" cy="85" r="4" fill="white"/>
          <circle cx="115" cy="85" r="4" fill="white"/>
          {/* Nose */}
          <path d="M97 95 Q100 105 103 95" stroke="white" strokeWidth="1.5" fill="none"/>
          {/* Mouth */}
          <path d="M88 110 Q100 120 112 110" stroke="white" strokeWidth="1.5" fill="none"/>
          {/* Hair/decorative lines */}
          <path d="M70 60 Q85 45 100 50 Q115 45 130 60" stroke="white" strokeWidth="1.5" fill="none"/>
          <path d="M65 70 Q80 55 100 58 Q120 55 135 70" stroke="white" strokeWidth="1" fill="none"/>
        </svg>
      </div>

      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-12">
          {/* Logo and Brand */}
          <div className="lg:col-span-2">
            <div className="mb-2">
              <Image
                src="/assets/images/logo.png"
                alt="St. Dreux Coffee"
                width={180}
                height={45}
                className="object-contain"
              />
            </div>
            <p className="text-xs text-white/50 tracking-[0.2em]">COFFEE</p>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-2">
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-white/80 hover:text-white transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-white/80 hover:text-white transition-colors text-sm">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-white/80 hover:text-white transition-colors text-sm">
                  About
                </Link>
              </li>
              <li>
                <Link href="/shop?purchaseType=subscription" className="text-white/80 hover:text-white transition-colors text-sm">
                  Subscriptions
                </Link>
              </li>
              <li>
                <Link href="/wholesale-info" className="text-white/80 hover:text-white transition-colors text-sm">
                  Wholesale Partner
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-white/80 hover:text-white transition-colors text-sm">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-white/80 hover:text-white transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info & Social */}
          <div className="lg:col-span-3">
            <ul className="space-y-2 text-sm mb-6">
              <li className="text-white/80">contact@stdreux.com.au</li>
              <li className="text-white/80">+61 246117229</li>
            </ul>

            <div>
              <h4 className="font-semibold mb-3 text-sm">Follow us</h4>
              <div className="flex gap-4 items-center">
                {/* Facebook */}
                <a
                  href="https://facebook.com/stdreuxcoffee"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-white/80 transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                {/* Instagram */}
                <a
                  href="https://instagram.com/stdreuxcoffee"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-white/80 transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
                {/* TikTok */}
                <a
                  href="https://tiktok.com/@stdreuxcoffee"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-white/80 transition-colors"
                  aria-label="TikTok"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.88 2.89 2.89 0 01-2.88-2.88 2.89 2.89 0 012.88-2.88c.28 0 .56.04.82.11V9.4a6.33 6.33 0 00-.82-.05A6.34 6.34 0 003.15 15.7 6.34 6.34 0 009.49 22a6.34 6.34 0 006.34-6.34V9.01a8.16 8.16 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.44z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-5">
            <h4 className="text-base font-semibold mb-4" style={{ fontFamily: 'Albert Sans' }}>Sign up for our Newsletter</h4>
            <form onSubmit={handleNewsletterSubmit} className="flex w-full max-w-md">
              <div className="flex w-full rounded-full border border-white/30 bg-white/5 overflow-hidden">
                <input
                  type="email"
                  placeholder="Enter Email Address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="flex-1 bg-transparent text-white placeholder:text-white/50 px-5 py-3 text-sm outline-none disabled:opacity-50"
                  required
                  style={{ fontFamily: 'Albert Sans' }}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-6 py-3 text-sm font-semibold rounded-full m-1 transition-colors disabled:opacity-50 whitespace-nowrap"
                  style={{ fontFamily: 'Albert Sans' }}
                >
                  {loading ? "..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 flex justify-end">
          <p className="text-sm text-white/50">
            COPYRIGHT © {new Date().getFullYear()} ST.DREUX COFFEE
          </p>
        </div>
      </div>
    </footer>
  )
}
