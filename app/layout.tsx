import type React from "react"
import { El_Messiri, Rubik } from "next/font/google"
import "./globals.css"
import "@/styles/_variables.scss"
import "@/styles/_keyframe-animations.scss"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import ReduxProvider from "@/providers/redux-provider"

const elMessiri = El_Messiri({ subsets: ["arabic"] })
export const metadata = {
  title: "لوحة التحكم",
  description: "تطبيق لوحة تحكم Next.js",
    generator: 'zed.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${elMessiri.className} antialiased relative overflow-x-hidden`} >
        <ReduxProvider>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem >
          {children}
        <Toaster />
        </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}


