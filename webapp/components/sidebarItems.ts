import { SidebarItems } from "@/types/sidebar";
import {
  Archive,
  Calendar,
  CalendarCogIcon,
  FileQuestionIcon,
  LayoutDashboard,
  Music,
  Settings,
  UserRoundCogIcon,
  ShieldUserIcon
} from "lucide-react";
import { AboutCollapsible } from "./about-collapsible";
import { SettingsSheet } from "./settings-sheet";

export const adminItems: SidebarItems[] = [
  {
    title: "Admin Dashboard",
    url: "/admin/dashboard",
    icon: ShieldUserIcon,
  },
  {
    title: "Main Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Schedules Info",
    url: "/admin/schedules",
    icon: CalendarCogIcon,
  },
  {
    title: "Users Info",
    url: "/admin/users",
    icon: UserRoundCogIcon,
  },
  {
    title: "Archive Info",
    url: "/admin/archives",
    icon: Archive,
  },
  {
    title: "Settings",
    component: SettingsSheet,
    icon: Settings,
  },
];

export const appItems: SidebarItems[] = [
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
