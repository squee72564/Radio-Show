import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@prisma/client";

export default function UserAvatar({user, className}: {user: User, className?: string}) {
  return (
    <Avatar className={className}>
      <AvatarImage src={user.image || undefined} alt={user.name || "user-avatar"} aria-hidden={true}/>
      <AvatarFallback>{user.name?.charAt(0) ?? "?"}</AvatarFallback>
    </Avatar>
  );
}