import { Suspense } from "react";
import ChatPage from "@/pages/ChatPage";

function ChatLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-muted-foreground text-sm">Loading chat…</p>
    </div>
  );
}

export default function ChatRoutePage() {
  return (
    <Suspense fallback={<ChatLoading />}>
      <ChatPage />
    </Suspense>
  );
}
