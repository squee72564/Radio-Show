"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"


const themes = [
  { name: "Slate", value: "light"},
  { name: "Slate Dark", value: "dark" },
  { name: "Neutral", value: "neutral"},
  { name: "Neutral Dark", value: "neutral-dark" },
  { name: "Bubblegum", value: "bubblegum"},
  { name: "Bubblegum Dark", value: "bubblegum-dark" },
  { name: "Catppuccin", value: "catppuccin"},
  { name: "Catppuccin Dark", value: "catppuccin-dark" },
  { name: "Doom64", value: "doom64"},
  { name: "Doom64 Dark", value: "doom64-dark" },
  { name: "Kodama Grove", value: "kodamagrove"},
  { name: "Kodama Grove Dark", value: "kodamagrove-dark" },
  { name: "Pastel Dreams", value: "pasteldreams"},
  { name: "Pastel Dreams Dark", value: "pasteldreams-dark" },

];

export function ModeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme()

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;
  
  return (
    <>
      <span>Theme: {themes.find((themeData) => themeData.value === theme)?.name || "undefined"}</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            {(theme && theme.includes("dark")) ? (
              <Moon className="h-[1.2rem] w-[1.2rem]" />
            ): (
              <Sun className="h-[1.2rem] w-[1.2rem]" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {themes.map((theme, idx) => (
            <DropdownMenuItem key={idx} onClick={() => setTheme(theme.value)}>
              {theme.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
