"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { getChatList, type ChatListItem } from "@/lib/chatApi";
import { BASE_URL } from "@/lib/config";

function getAvatarUrl(path: string | null | undefined): string {
  if (!path) {
    return "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face";
  }
  if (path.startsWith("http")) return path;
  const base = BASE_URL.replace(/\/api\/?$/, "");
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}

function parseApiDate(input: unknown): Date | null {
  if (input instanceof Date)
    return Number.isNaN(input.getTime()) ? null : input;
  if (input === null || input === undefined) return null;

  if (typeof input === "number" && Number.isFinite(input)) {
    const ms = input < 1e12 ? input * 1000 : input;
    const d = new Date(ms);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  if (typeof input === "string") {
    const s = input.trim();
    if (!s) return null;

    if (/^\d+(\.\d+)?$/.test(s)) {
      const n = Number(s);
      if (!Number.isFinite(n)) return null;
      const ms = n < 1e12 ? n * 1000 : n;
      const d = new Date(ms);
      return Number.isNaN(d.getTime()) ? null : d;
    }

    let normalized = s.replace(" ", "T");
    normalized = normalized.replace(/(\.\d{3})\d+/, "$1");
    const d = new Date(normalized);
    if (!Number.isNaN(d.getTime())) return d;

    const d2 = new Date(s);
    return Number.isNaN(d2.getTime()) ? null : d2;
  }

  return null;
}

const ChatListPage = () => {
  const router = useRouter();
  const [conversations, setConversations] = useState<ChatListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getChatList();
        if (mounted) setConversations(res.data.conversations);
      } catch (e) {
        if (mounted)
          setError(e instanceof Error ? e.message : "Failed to load chats");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-secondary italic">
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
            <div className="px-6 py-8 text-sm text-muted-foreground">
              No conversations yet.
            </div>
          ) : (
            conversations.map((chat, index) => (
              <motion.div
                key={chat.conversation_id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => router.push(`/chat/${chat.conversation_id}`)}
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
