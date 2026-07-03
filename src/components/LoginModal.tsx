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
import { toast } from "sonner"

interface LoginModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Called after a successful sign-in. The cart and page state are preserved. */
  onSuccess?: () => void
  /** Where the "Create Account" link should send the user (kept for guest checkout continuity). */
  registerHref?: string
}

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
