import type { Metadata } from "next";
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar";
import { appItems } from "@/components/sidebarItems";

export const metadata: Metadata = {
  title: "MugenBeat - Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
        <AppSidebar title={"MugenBeat"} sidebarItems={appItems}/>
        {children}
    </SidebarProvider>
  );
}
