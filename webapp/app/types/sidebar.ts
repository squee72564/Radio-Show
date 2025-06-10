import { LucideIcon } from "lucide-react";

export interface SidebarComponentProps {
  Title: string;
  Items?: { title: string; url: string }[];
  Icon: LucideIcon;
}

export interface SidebarItems {
  title: string;
  url?: string;
  icon: LucideIcon;
  component?: React.ComponentType<SidebarComponentProps>
  items?: {title: string, url:string }[];
};
