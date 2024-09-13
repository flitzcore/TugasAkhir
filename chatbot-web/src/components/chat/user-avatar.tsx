import { Avatar, AvatarImage } from "../ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface UserAvatarProps {
  userName: String | undefined;
  userEmail: String | undefined;
}
export default function UserAvatar({ userEmail, userName }: UserAvatarProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Avatar className="flex justify-center items-center">
          <AvatarImage
            src="/LoggedInUser.jpg"
            width={6}
            height={6}
            className="w-10 h-10 "
          />
        </Avatar>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <div className="space-y-1">
            <p className="text-md">Name : {userName}</p>
            <span className="text-sm text-muted-foreground">
              Email : {userEmail}
            </span>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
