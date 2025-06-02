"use client"

import type React from "react"

import Link from "next/link"
import { Book, Home, Library } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-purple-100">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <motion.div
              initial={{ rotate: -10 }}
              animate={{ rotate: 10 }}
              transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
              className="text-purple-600 mr-2"
            >
              <Book className="h-6 w-6" />
            </motion.div>
            <span className="font-quicksand font-bold text-xl text-purple-700">Bilingual Stories</span>
          </Link>

          <nav className="flex space-x-1">
            <NavLink href="/" active={pathname === "/"}>
              <Home className="h-5 w-5" />
              <span className="sr-only sm:not-sr-only sm:ml-2">Home</span>
            </NavLink>
            <NavLink href="/create" active={pathname === "/create"}>
              <Book className="h-5 w-5" />
              <span className="sr-only sm:not-sr-only sm:ml-2">Create</span>
            </NavLink>
            <NavLink href="/library" active={pathname === "/library"}>
              <Library className="h-5 w-5" />
              <span className="sr-only sm:not-sr-only sm:ml-2">Library</span>
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  )
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center px-3 py-2 rounded-full text-sm font-medium transition-colors",
        active ? "bg-purple-100 text-purple-700" : "text-purple-600 hover:bg-purple-50",
      )}
    >
      {children}
    </Link>
  )
}
