import { Message, UserData } from "@/app/data";
import ChatTopbar from "./chat-topbar";
import { ChatList } from "./chat-list";
import React from "react";
import internal from "stream";

interface ChatProps {
  messages?: Message[];
  selectedUser: UserData;
  isMobile: boolean;
}

export function Chat({ messages, selectedUser, isMobile }: ChatProps) {
  const [messagesState, setMessages] = React.useState<Message[]>(
    messages ?? []
  );

  const sendMessage = (newMessage: Message) => {
    setMessages((currentMessages) => [...currentMessages, newMessage]);
  };
  const getLastMessages = (total: number) => {
    const lastSixCharacters = messagesState.slice(-total);
    const formattedMessages = lastSixCharacters
      .map((msg) => `${msg.name}:${msg.message}`)
      .join("\n");
    // Get the last 6 characters of the concatenated string

    return formattedMessages;
  };
  // ;
  //   const getMessage = (newMessage: Message) => {
  //     setMessages([...messagesState, newMessage]);
  //   };

  interface ChatListProps {
    messages: Message[];
    selectedUser: UserData;
    sendMessage: (newMessage: Message) => void;
    getLastMessages: (total: any) => Message[];
    isMobile: boolean;
  }

  interface ChatListProps {
    messages: Message[];
    selectedUser: UserData;
    sendMessage: (newMessage: Message) => void;
    getLastMessages: (total: any) => Message[]; // Add this line
    isMobile: boolean;
  }

  return (
    <div className="flex flex-col justify-between w-full h-full">
      <ChatTopbar selectedUser={selectedUser} />

      <ChatList
        messages={messagesState}
        selectedUser={selectedUser}
        sendMessage={sendMessage}
        getLastMessages={getLastMessages}
        isMobile={isMobile}
      />
    </div>
  );
}
