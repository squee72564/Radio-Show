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
              <span>Change Theme </span>
              <ModeToggle/>
            </div>
          <SheetFooter>
            {/* <SheetClose asChild>
              <Button type="submit">Save changes</Button>
            </SheetClose> */}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </SidebarMenuItem>
  )
}