import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Make API - Gerador de APIs",
  description: "Crie e gerencie suas APIs de forma simples e eficiente com Make API",
  generator: "Make API",
  keywords: ["API", "gerador", "desenvolvimento", "endpoints", "REST API"],
  authors: [{ name: "Make API Team" }],
  creator: "Make API",
  publisher: "Make API",
  openGraph: {
    title: "Make API - Gerador de APIs",
    description: "Crie e gerencie suas APIs de forma simples e eficiente",
    url: "https://makeapi.vercel.app",
    siteName: "Make API",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Make API - Gerador de APIs",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Make API - Gerador de APIs",
    description: "Crie e gerencie suas APIs de forma simples e eficiente",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/logo-makeapi.png",
    shortcut: "/logo-makeapi.png",
    apple: "/logo-makeapi.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
