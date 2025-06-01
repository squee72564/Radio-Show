import { auth, signIn, signOut } from "@/auth";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { MoreVerticalIcon, UserCircleIcon, LogIn, LogOut } from "lucide-react"
import Link from "next/link"

const signInFnAsync = async () => {
  "use server";
  await signIn();
};

const signOutFnAsync = async () => {
  "use server";
  await signOut();
};

export async function SignInOutNav() {
  const session = await auth();
  const user = session?.user;
  const signedIn = user !== undefined;

  const userJSX = (
    <>
      <Avatar className="h-8 w-8 rounded-lg">
        {signedIn ? (
          <>
            <AvatarImage src={user.image || ""} alt={user.name || ""} />
            <AvatarFallback className="rounded-lg">{user.name?.charAt(0) ?? "?"}</AvatarFallback>
          </>
        ) : (
          <AvatarFallback className="rounded-lg">{"?"}</AvatarFallback>
        )} 
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium">{signedIn ? user.name : "Anonymous"}</span>
        {signedIn && <span className="truncate text-xs text-muted-foreground">
          {user.email}
        </span>}
      </div>
    </>
  );
  
  return (
    <SidebarMenu>
      <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                {userJSX}
                <MoreVerticalIcon className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={"right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  {userJSX}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {signedIn && 
                  <Link
                    href={`/user/${user.id}`}
                    className="w-full"
                  >
                    <DropdownMenuItem className="w-full">
                      <UserCircleIcon />
                      User Profile
                    </DropdownMenuItem>
                  </Link>
                }
                <form
                  action={signedIn ? signOutFnAsync : signInFnAsync}
                >
                  <button type="submit" className="flex flex-row gap-2 justify-center items-center w-full">
                    <DropdownMenuItem className="w-full">
                        {signedIn ? (
                          <>
                            <LogOut />
                            Log Out
                          </>
                        ): (
                          <>
                            <LogIn />
                            Log In With Google
                          </>
                        )}
                    </DropdownMenuItem>
                  </button>
                </form>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
