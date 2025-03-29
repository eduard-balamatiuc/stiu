"use client"

import Link from "next/link"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "./ui/button"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-8 flex">
          <Link href="/" className="flex items-center space-x-3 transition-colors hover:text-foreground/80">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary/80"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              <span className="text-xl font-semibold tracking-tight text-foreground/90">Moodle Course Creator</span>
            </div>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-1">
              <Button variant="ghost" className="text-base text-muted-foreground/90 hover:text-foreground/90">
                Documentation
              </Button>
              <Button variant="ghost" className="text-base text-muted-foreground/90 hover:text-foreground/90">
                Support
              </Button>
            </div>
            <div className="h-6 w-px bg-border/60 mx-2 hidden md:block" />
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
} 