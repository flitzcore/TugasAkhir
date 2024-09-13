export const userData = {
  id: 1,
  avatar: "/User1.ico",
  messages: [
    {
      id: 1,
      avatar: "/User1.ico",
      name: "Chat bot",
      message:
        "Hi! Aku Coral, AI Chatbot yang akan membantu kamu dalam masalah perkapalan. Apa yang bisa aku bantu?",
    },
  ],
  name: "Visitor",
  email: "email@gmail.com",
  token: "",
};

export type UserData = typeof userData;

export const loggedInUserData = {
  id: 5,
  avatar: "/LoggedInUser.jpg",
  name: "anonymous",
  email: "anonym@gmail.com",
};

export type LoggedInUserData = typeof loggedInUserData;

export interface Message {
  id: number;
  avatar: string;
  name: string;
  message: string;
}

export interface User {
  id: number;
  avatar: string;
  messages: Message[];
  name: string;
  email: string;
  token: string;
}
