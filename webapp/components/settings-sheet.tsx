import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { type LucideIcon } from "lucide-react"
import { ModeToggle } from "@/components/theme-toggle";
import { Button } from "./ui/button";

export function SettingsSheet({
  Icon,
  Title
}: {
  Items?: {title: string, url:string }[],
  Title: string,
  Icon: LucideIcon
}) {
  return (
    <SidebarMenuItem>
      <Sheet>
        <SheetTrigger asChild>
        <SidebarMenuButton tooltip={Title} >
          <Icon />
          <span className="settings-text">{Title}</span>
        </SidebarMenuButton>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Settings</SheetTitle>
            <SheetDescription>
              Changes will automatically be applied.
            </SheetDescription>
          </SheetHeader>
            <div className="flex flex-row  justify-center items-center gap-10 w-full">
              <ModeToggle/>
            </div>
          <SheetFooter className="mx-auto pb-5">
            <a
              href="/api/user-info" // Update this to your actual route
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button>
                Download My Data
              </Button>
            </a>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </SidebarMenuItem>
  )
}