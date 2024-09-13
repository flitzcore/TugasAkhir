import {
  FileImage,
  Mic,
  Paperclip,
  PlusCircle,
  SendHorizontal,
  Smile,
  ThumbsUp,
} from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Message, UserData, userData } from "@/app/data";
import { Textarea } from "../ui/textarea";
import { EmojiPicker } from "../emoji-picker";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface ChatBottombarProps {
  sendMessage: (newMessage: Message) => void;
  getLastMessages: (total: any) => String;
  isMobile: boolean;
  selectedUser: UserData;
}

export const BottombarIcons = [{ icon: FileImage }, { icon: Paperclip }];

export default function ChatBottombar({
  sendMessage,
  getLastMessages,
  isMobile,
  selectedUser,
}: ChatBottombarProps) {
  const [message, setMessage] = useState("");
  const [isWaiting, setIsWaiting] = React.useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const PREDICT_API = "https://darling-redfish-recently.ngrok-free.app/predict";
  const CHAT_API = "https://chat-bot-backend-auth.vercel.app";
  const { userId } = useParams();

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  // const handleThumbsUp = () => {
  //   const newMessage: Message = {
  //     id: message.length + 1,
  //     name: loggedInUserData.name,
  //     avatar: loggedInUserData.avatar,
  //     message: "👍",
  //   };
  //   sendMessage(newMessage);
  //   setMessage("");
  // };
  const handlePredictApi = async (message: string) => {

    const jsonMsg = {
      text: message,
      history: getLastMessages(12),
    };
    setMessage("");
    setIsWaiting(true);

    try {
      const response = await fetch(PREDICT_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(jsonMsg),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json(); // This parses the JSON response body

      const newMessage: Message = {
        id: message.length + 2,
        name: "Chat bot",
        avatar: "/User1.ico",
        message: data.text,
      };
      sendMessage(newMessage);
      return data.text; // Return the chatbot message text
    } catch (error) {
      throw new Error(`Failed to send message: ${error}`);
    } finally {
      setIsWaiting(false);
    }
  };
  const handleChatApi = async (chatBotMsg: string, userMsg: string) => {
    const chatBody = {
      chatBotMsg,
      userMsg,
    };
    const chatHeaders = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${selectedUser.token}`,
    };

    try {
      const postData = {
        method: "POST",
        headers: JSON.stringify(chatHeaders),
        body: JSON.stringify(chatBody),
      };

      const response = await fetch(
        `${CHAT_API}/v1/users/${selectedUser.id}/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${selectedUser.token}`,
          },
          body: JSON.stringify(chatBody),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Chat API response:", data);
    } catch (error) {
      console.error("Failed to send chat message:", error);
    }
  };
  const handleSend = async () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: message.length + 1,
        name: selectedUser.name,
        avatar: selectedUser.avatar,
        message: message.trim(),
      };

      sendMessage(newMessage);

      const chatBotMessage = await handlePredictApi(message.trim());
      if (userId && chatBotMessage) {
        await handleChatApi(chatBotMessage, message.trim());
      }

      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }

    if (event.key === "Enter" && event.shiftKey) {
      event.preventDefault();
      setMessage((prev) => prev + "\n");
    }
  };

  return (
    <div className="p-5 flex justify-between w-full  items-center gap-2">
      <AnimatePresence initial={false}>
        <motion.div
          key="input"
          className="w-full relative"
          layout
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{
            opacity: { duration: 0.05 },
            layout: {
              type: "spring",
              bounce: 0.15,
            },
          }}
        >
          <Textarea
            autoComplete="off"
            value={message}
            ref={inputRef}
            onKeyDown={handleKeyPress}
            onChange={handleInputChange}
            name="message"
            placeholder="Aa"
            className=" w-full border rounded-full flex items-center h-11 resize-none overflow-hidden bg-background"
            disabled={isWaiting}
          ></Textarea>
        </motion.div>

        <Link
          href="#"
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "h-11 w-11",
            "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white shrink-0"
          )}
          onClick={handleSend}
        >
          <SendHorizontal size={30} className="text-muted-foreground" />
        </Link>
      </AnimatePresence>
    </div>
  );
}
