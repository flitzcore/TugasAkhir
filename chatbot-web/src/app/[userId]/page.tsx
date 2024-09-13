import { ChatLayout } from "@/components/chat/chat-layout";
import { cookies } from "next/headers";

export default function UserPage() {
  const layout = cookies().get("react-resizable-panels:layout");
  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;

  return (
    <main className="flex h-[calc(100dvh)] flex-col">
      <div className="z-10 w-full h-full text-sm lg:flex justify-center">
        <div className="w-full max-w-screen-lg">
          <ChatLayout defaultLayout={defaultLayout} navCollapsedSize={8} />
        </div>
      </div>
    </main>
  );
}
