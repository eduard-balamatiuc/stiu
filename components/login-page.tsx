"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = () => {
    setIsLoading(true)
    // Simulate authentication
    setTimeout(() => {
      router.push("/dashboard")
    }, 1500)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background/95 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground/90 mb-2">
            Moodle Course Creator
          </h1>
          <div className="h-0.5 w-16 bg-primary/60 mx-auto rounded-full mb-6"></div>
          <p className="mt-3 text-lg text-muted-foreground/90">
            Create and manage your Moodle courses with AI assistance
          </p>
        </div>
        <div className="mt-10">
          <Button
            onClick={handleLogin}
            className="w-full apple-button text-base py-6 relative overflow-hidden group"
            disabled={isLoading}
          >
            <div className="flex items-center justify-center gap-3">
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-t-transparent" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 opacity-90"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              )}
              <span className="font-medium">Sign in with Moodle</span>
            </div>
          </Button>
        </div>
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground/80">
            Powered by advanced AI technology
          </p>
        </div>
      </div>
    </div>
  )
}

