import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import ReactQueryProvider from "@/components/providers/ReactQueryProvider"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Sangli Ceramica | Premium Tiles, Sanitary Ware & Bath Fittings",
  description: "Sangli Ceramica is Maharashtra's premier tiles and bathroom showroom, showcasing high-end floor tiles, wall cladding, sanitary ware, and bath fittings from top global brands.",
  keywords: [
    "Sangli Ceramica",
    "Tiles Showroom in Sangli",
    "Kajaria Tiles Sangli",
    "Somany Tiles Sangli",
    "Sanitary Ware Sangli",
    "Bath Fittings Sangli",
    "Luxury Tiles Maharashtra",
    "Vitrified Tiles Sangli",
    "Jaquar Faucets Sangli"
  ],
  authors: [{ name: "Sangli Ceramica" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  )
}
