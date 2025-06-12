import type { Metadata } from "next";
import { SidebarProvider } from "@/components/ui/sidebar"
import { adminItems } from "@/components/sidebarItems";
import { AppSidebar } from "@/components/sidebar";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin Dashboard for Radio Show"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
        <AppSidebar title={"Admin Dashboard"} sidebarItems={adminItems} />
        {children}
    </SidebarProvider>
  );
}
