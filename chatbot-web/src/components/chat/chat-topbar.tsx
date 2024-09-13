import React from "react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { Avatar, AvatarImage } from "../ui/avatar";
import { UserData } from "@/app/data";
import { Info, Phone, Video } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AuthButton } from "./login-form";
import UserAvatar from "./user-avatar";

interface ChatTopbarProps {
  selectedUser: UserData;
}

export const TopbarIcons = [{ icon: Phone }, { icon: Video }, { icon: Info }];

export default function ChatTopbar({ selectedUser }: ChatTopbarProps) {
  const { userId } = useParams();
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    if (userId) {
      setCurrentUserId(userId as string);
    } else {
      setCurrentUserId(undefined);
    }
  }, [userId]);
  return (
    <div className="w-full h-20 flex p-4 justify-between items-center border-b">
      <div className="flex items-center gap-2">
        {/* <Avatar className="flex justify-center items-center">
            <AvatarImage
              src={selectedUser.avatar}
              alt={selectedUser.name}
              width={6}
              height={6}
              className="w-10 h-10 "
            />
          </Avatar> */}
        <div className="flex flex-row items-center gap-2">
          {currentUserId ? (
            <UserAvatar
              userEmail={selectedUser.email}
              userName={selectedUser.name}
            />
          ) : (
            <></>
          )}
          <span className="font-medium">{selectedUser.name}</span>
          {/* <span className="text-xs">Active 2 mins ago</span> */}
        </div>
      </div>
      {currentUserId ? <></> : <AuthButton />}

      {/* <div>
        {TopbarIcons.map((icon, index) => (
          <Link
            key={index}
            href="#"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "h-9 w-9",
              "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
            )}
          >
            <icon.icon size={20} className="text-muted-foreground" />
          </Link>
        ))}
      </div> */}
    </div>
  );
}
