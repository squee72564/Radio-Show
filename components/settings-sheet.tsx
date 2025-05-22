import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { Settings } from "lucide-react"
import { ModeToggle } from "@/components/theme-toggle";

export function SettingsSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
      <button className="sidebar-button flex items-center gap-2 w-full">
        <Settings size={16} />
        <span className="settings-text">Settings</span>
      </button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here.
          </SheetDescription>
        </SheetHeader>
          <div className="mx-auto">
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
  )
}