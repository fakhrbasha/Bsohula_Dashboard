"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Toaster } from "@/components/ui/toaster"
import { DashboardHeader } from "@/components/dashboard/header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <DashboardHeader user={{name:'Abdelrahman', email:'zed.tech@dev.com'}} />
      <div className="flex flex-1 pb-4">
        <Sidebar />
        <main className="flex-1 lg:mr-64 transition-all duration-300 ease-in-out">{children}</main>
      </div>
    </div>
  )
}
