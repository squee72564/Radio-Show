import Link from "next/link"

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"
import { Music4Icon } from "lucide-react"
import { Button } from "./ui/button"

export default function NavigationHeader() {
  return (
    <header className="sticky top-0 z-40 w-full pt-6">
      <div className="container flex items-center justify-around px-4">
        <Link href={"/"} className="hidden items-center gap-2 md:flex">
          <Music4Icon className="h-10 w-10"/>
          <span className="text-xl font-bold cursor-pointer">Radio Show</span>
        </Link>
        <NavigationMenu>
          <NavigationMenuList>
            <div className="flex sm:gap-15 gap-2 items-center">
              {[
                { title: "Dashboard", href: "/dashboard" },
                { title: "About", href: "/about" },
                { title: "Contact", href: "/contact" },
                { title: "Sign Up To DJ", href: "/join" },

              ].map(({ title, href }) => (
                <NavigationMenuItem key={href}>
                  <NavigationMenuLink asChild>
                    <Button variant={"secondary"}>
                      <Link href={href} className="font-medium">
                          {title}
                      </Link>
                    </Button>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </div>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  )
}