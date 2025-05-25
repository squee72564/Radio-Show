// components/SignInButton.tsx
import { LucideIcon } from "lucide-react";
import { SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { signIn, signOut } from "@/auth";

export default function SignInButton({
  Icon,
  Title,
  signedIn = false,
}: {
  Items?: { title: string; url: string }[];
  Title: string;
  Icon: LucideIcon;
  signedIn: boolean;
}) {
  return (
    <form
      action={async () => {
        "use server";
        if (signedIn) {
          await signOut();
        } else {
          await signIn("google");
        }
      }}
    >
      <SidebarMenuItem>
        <SidebarMenuButton type="submit" tooltip={Title}>
          <Icon />
          <span className="settings-text">
            {signedIn ? "Sign Out" : Title}
          </span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </form>
  );
}
