"use client"

import Link from "next/link"
import { ThemeToggle } from "./theme-toggle"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-8 flex">
          <Link href="/" className="flex items-center space-x-3 transition-colors hover:text-foreground/80">
            <span className="text-xl font-semibold tracking-tight">Moodle Course Creator</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-4">
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
} 