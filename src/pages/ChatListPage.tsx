"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { getChatList, type ChatListItem } from "@/lib/chatApi";
import { chatUrl } from "@/lib/chatRoutes";
import { getDisplayErrorMessage } from "@/lib/apiErrors";
import { BASE_URL } from "@/lib/config";
import { parseApiDate } from "@/lib/utils";

function getAvatarUrl(path: string | null | undefined): string {
  if (!path) {
    return "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face";
  }
  if (path.startsWith("http")) return path;
  const base = BASE_URL.replace(/\/api\/?$/, "");
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}

function isPlanRequiredError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : "";
  return /active plan|purchase a plan|plan expired/i.test(msg);
}

const ChatListPage = () => {
  const router = useRouter();
  const [conversations, setConversations] = useState<ChatListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const loadConversations = useCallback(async (opts?: { showLoading?: boolean }) => {
    if (opts?.showLoading) setLoading(true);
    setError(null);
    try {
      const res = await getChatList();
      if (!mountedRef.current) return;
      setConversations(res.data.conversations);
    } catch (e) {
      if (!mountedRef.current) return;
      if (isPlanRequiredError(e)) {
        setConversations([]);
      } else {
        setError(getDisplayErrorMessage(e));
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    void loadConversations({ showLoading: true });

    const onVisible = () => {
      void loadConversations();
    };
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) onVisible();
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") onVisible();
    };

    window.addEventListener("pageshow", onPageShow);
    window.addEventListener("focus", onVisible);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      mountedRef.current = false;
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("focus", onVisible);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [loadConversations]);

  const openConversation = (conversationId: number) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.conversation_id === conversationId ? { ...c, unread_count: 0 } : c,
      ),
    );
    router.push(chatUrl(conversationId));
  };

  return (
    <div className="space-y-4 lg:space-y-6">
        <h1 className="max-lg:hidden font-serif text-2xl md:text-3xl font-bold text-secondary italic">
          Chat list
        </h1>

        {error && (
          <div className="rounded-xl bg-destructive/10 text-destructive px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-card overflow-hidden"
        >
          {loading && conversations.length === 0 ? (
            <div className="px-6 py-8 text-sm text-muted-foreground">
              Loading conversations…
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
              <MessageCircle className="mb-3 h-9 w-9 text-muted-foreground" />
              <p className="font-semibold text-foreground">No conversations yet.</p>
              <p className="mt-1 text-sm text-muted-foreground">
                When you start chatting with matches, they will appear here.
              </p>
            </div>
          ) : (
            conversations.map((chat, index) => (
              <motion.div
                key={chat.conversation_id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => openConversation(chat.conversation_id)}
                className="flex items-center gap-4 px-6 py-5 border-b border-primary/5 last:border-0 cursor-pointer hover:bg-accent-rose/30 transition-colors"
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={getAvatarUrl(chat.other_user.profile_photo)}
                    alt={chat.other_user.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-primary/20"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-serif font-bold text-foreground text-sm truncate">
                    {chat.other_user.name}
                  </h3>
                  <p className="text-xs text-muted-foreground truncate">
                    {chat.last_message?.preview || "No messages yet"}
                  </p>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-muted-foreground">
                    {(() => {
                      const d = parseApiDate(chat.last_message?.timestamp);
                      return d
                        ? d.toLocaleTimeString(undefined, {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "";
                    })()}
                  </p>
                  {chat.unread_count > 0 && (
                    <span className="inline-flex items-center justify-center w-5 h-5 bg-green-500 text-white text-[10px] font-bold rounded-full mt-1">
                      {chat.unread_count}
                    </span>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
    </div>
  );
};

export default ChatListPage;
