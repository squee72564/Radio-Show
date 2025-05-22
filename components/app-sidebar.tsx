import { FileQuestionIcon, Calendar, LayoutDashboard, Music, Settings, Archive, type LucideIcon } from "lucide-react";
import { SettingsSheet } from "./settings-sheet";
import { AboutCollapsible } from "./about-collapsible";
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
  SidebarTrigger,
} from "@/components/ui/sidebar"

interface SidebarComponentProps {
  Title: string;
  Items?: { title: string; url: string }[];
  Icon: LucideIcon;
}

interface SidebarItems {
  title: string;
  url?: string;
  icon: LucideIcon;
  component?: React.ComponentType<SidebarComponentProps>
  items?: {title: string, url:string }[];
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
    title: "More Information",
    component: AboutCollapsible,
    items : [
      {
        title: "About",
        url: "/about",
      },
            {
        title: "Want to DJ?",
        url: "/join",
      },
            {
        title: "Contact",
        url: "/contact",
      },
    ],
    icon: FileQuestionIcon
  },
  {
    title: "Settings",
    component: SettingsSheet,
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
                  item.url ? (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton tooltip={item.title} asChild>
                        <Link href={item.url} className="flex items-center gap-2">
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ) : item.component ? (
                    <item.component key={item.title} Items={item.items} Title={item.title} Icon={item.icon} />
                  ) : (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton tooltip={item.title} asChild>
                        <div>
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
              ))}
              <SidebarMenuItem className="pt-auto">
                <SidebarMenuButton tooltip={"Toggle Sidebar"} asChild>
                  <SidebarTrigger/>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
