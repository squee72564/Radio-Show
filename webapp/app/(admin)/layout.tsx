import type { Metadata } from "next";
import { SidebarProvider } from "@/components/ui/sidebar"
import { adminItems } from "@/components/sidebarItems";
import { AppSidebar } from "@/components/sidebar";
import { auth } from "@/auth";
import { isUserAdmin } from "@/lib/utils";
import { User } from "@prisma/client";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "MugenBeat - Admin",
  description: "Admin Dashboard for MugenBeat"
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const user = session?.user as User | undefined;

  if (!user || !isUserAdmin(user.status)) {
    redirect("/dashboard");
  }

  return (
    <SidebarProvider>
      <AppSidebar title={"Admin Dashboard"} sidebarItems={adminItems} />
      {children}
    </SidebarProvider>
  );
}
