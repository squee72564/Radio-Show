import { Calendar, LayoutDashboard, Music, Settings, Archive, LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, JSX, RefAttributes } from "react";
import { SettingsSheet } from "./settings-sheet";
import Link from "next/link"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"


interface SidebarItems {
  title: string;
  url?: string;
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  component?: JSX.Element | (() => JSX.Element);
};

const items: SidebarItems[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Live Radio",
    url: "/live",
    icon: Music,
  },
  {
    title: "Archived Shows",
    url: "/archive",
    icon: Archive,
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar,
  },
  {
    title: "Settings",
    component: SettingsSheet, // use component reference, not JSX here
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex justify-center text-center mb-10 font-bold text-lg">Radio Show</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-5">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                  {item.url ? (
                    <Link href={item.url} className="flex items-center gap-2">
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  ) : item.component ? (
                    <div className="flex items-center gap-2">
                      {typeof item.component === "function" ? <item.component /> : item.component}
                    </div>
                  ) : (
                    <div>
                      <item.icon />
                      <span>{item.title}</span>
                    </div>
                  )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

    </Sidebar>
  )
}
