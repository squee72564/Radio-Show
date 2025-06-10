import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { SignInOutNav } from "./signin-nav";
import { SidebarItems } from "@/app/types/sidebar";

export function AppSidebar({title, sidebarItems} : {title: string, sidebarItems: SidebarItems[]}) {
  
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex justify-center text-center min-h-15 font-bold text-lg">
            <Link href={"/"}>
              <span className="font-bold">{title}</span>
            </Link>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-5">
              {sidebarItems.map((item) => (
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
      <SidebarFooter>
        <SignInOutNav />
      </SidebarFooter>
    </Sidebar>
  )
}
