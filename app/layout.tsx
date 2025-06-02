import type React from "react"
import type { Metadata } from "next"
import { Inter, Quicksand } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import { Toaster } from "@/components/ui/toaster"
import { StoryProvider } from "@/components/story-provider"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const quicksand = Quicksand({ subsets: ["latin"], variable: "--font-quicksand" })

export const metadata: Metadata = {
  title: "Bilingual Stories",
  description: "Create magical bilingual children's stories from your cherished memories",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${quicksand.variable} font-sans bg-amber-50`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <StoryProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <div className="flex-grow">{children}</div>
            </div>
            <Toaster />
          </StoryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
