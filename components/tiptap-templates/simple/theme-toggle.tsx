"use client"

import * as React from "react"
import { useTheme } from "next-themes"

// --- UI Primitives ---
import { Button } from "@/components/tiptap-ui-primitive/button"

// --- Icons ---
import { MoonStarIcon } from "@/components/tiptap-icons/moon-star-icon"
import { SunIcon } from "@/components/tiptap-icons/sun-icon"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleDarkMode = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <Button
      onClick={toggleDarkMode}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      data-style="ghost"
    >
      {theme === "dark" ? (
        <MoonStarIcon className="tiptap-button-icon" />
      ) : (
        <SunIcon className="tiptap-button-icon" />
      )}
    </Button>
  )
}
