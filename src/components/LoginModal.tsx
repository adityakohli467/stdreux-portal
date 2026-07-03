"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthStore } from "@/store/auth"
import { useGoogleLogin } from "@react-oauth/google"
import { toast } from "sonner"

interface LoginModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Called after a successful sign-in. The cart and page state are preserved. */
  onSuccess?: () => void
  /** Where the "Create Account" link should send the user (kept for guest checkout continuity). */
  registerHref?: string
}

const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.15-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
    />
    <path
      fill="#FBBC05"
      d="M5.85 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.67-2.84Z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.05l3.67 2.84C6.71 7.29 9.14 5.38 12 5.38Z"
    />
  </svg>
)

export function LoginModal({
  open,
  onOpenChange,
  onSuccess,
  registerHref = "/auth/register?redirect=/checkout",
}: LoginModalProps) {
  const { login } = useAuthStore()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSuccess = () => {
    setUsername("")
    setPassword("")
    onOpenChange(false)
    onSuccess?.()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    try {
      await login(username, password)
      const authState = useAuthStore.getState()
      if (!authState.isAuthenticated || !authState.token) {
        throw new Error("Login failed - please try again")
      }
      toast.success("Signed in successfully!")
      handleSuccess()
    } catch (error: any) {
      toast.error(error?.message || "Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true)
      try {
        const response = await fetch(
          "https://www.googleapis.com/oauth2/v2/userinfo",
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          }
        )
        if (!response.ok) {
          throw new Error("Failed to get user info from Google")
        }
        const userInfo = await response.json()
        await useAuthStore.getState().googleLogin(userInfo, "customer")

        const authState = useAuthStore.getState()
        if (!authState.isAuthenticated) {
          throw new Error("Google sign-in failed")
        }
        toast.success("Signed in with Google!")
        handleSuccess()
      } catch (error: any) {
        toast.error(error?.message || "Google sign-in failed")
      } finally {
        setLoading(false)
      }
    },
    onError: () => {
      toast.error("Google sign-in was cancelled or failed")
      setLoading(false)
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Sign in to continue</DialogTitle>
          <DialogDescription>
            Your cart is saved — sign in to check out faster.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="login-modal-email">Email</Label>
            <Input
              id="login-modal-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="login-modal-password">Password</Label>
              <Link
                href="/auth/forgot-password"
                className="text-xs text-[#105a9c] hover:underline"
                onClick={() => onOpenChange(false)}
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="login-modal-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#105a9c] hover:bg-[#0d4a80] text-white"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-background px-2 text-gray-400">or</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          disabled={loading}
          onClick={() => googleLogin()}
          className="w-full gap-2"
        >
          <GoogleIcon />
          Continue with Google
        </Button>

        <p className="text-center text-sm text-gray-600 pt-1">
          New here?{" "}
          <Link
            href={registerHref}
            className="text-[#105a9c] font-semibold hover:underline"
            onClick={() => onOpenChange(false)}
          >
            Create an account
          </Link>
        </p>
      </DialogContent>
    </Dialog>
  )
}
