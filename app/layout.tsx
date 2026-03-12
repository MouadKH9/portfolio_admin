import type React from "react"
import type { Metadata } from "next"
import { JetBrains_Mono, Syne } from "next/font/google"
import { Toaster } from "sonner"
import "./globals.css"

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display",
})

export const metadata: Metadata = {
  title: "Admin — Portfolio",
  description: "Portfolio administration panel",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${jetbrainsMono.variable} ${syne.variable} font-mono antialiased`}
      >
        <div className="noise-overlay" />
        {children}
        <Toaster
          theme="dark"
          toastOptions={{
            style: {
              background: "#0c1117",
              border: "1px solid #1a2332",
              color: "#d4d4d8",
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
            },
          }}
        />
      </body>
    </html>
  )
}
