"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { profilesData } from "@/components/FeaturedProfiles";
import {
  ArrowLeft,
  Send,
  Sparkles,
  Shield,
  Crown,
  Smile,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { buildChatWebSocketUrl, getChatMessages, type ChatMessage } from "@/lib/chatApi";
import { useAuthStore } from "@/stores/authStore";

const ChatPage = () => {
  const params = useParams();
  const profileId = (params?.profileId as string | undefined) ?? undefined;
  const router = useRouter();
  const profileFromList = profileId ? profilesData.find((p) => p.id === Number(profileId)) : null;
  const otherUser = profileFromList
    ? { matri_id: String(profileFromList.id), name: profileFromList.name, profile_photo: profileFromList.image ?? null }
    : undefined;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [emojiOpen, setEmojiOpen] = useState(false);

  const fallbackProfile = profilesData[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const idNum = Number(profileId);
    if (!idNum) return;

    let socket: WebSocket | null = null;

    const connect = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getChatMessages(idNum, 1, 100);
        setMessages(res.data.messages);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load messages");
      } finally {
        setLoading(false);
      }

      const url = buildChatWebSocketUrl(idNum);
      if (!url) return;

      socket = new WebSocket(url);
      setWs(socket);

      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data) as {
            message_id: number;
            sender_id: string;
            sender_matri_id: string;
            sender_name: string;
            text: string;
            created_at: string;
          };
          const msg: ChatMessage = {
            id: payload.message_id,
            sender_id: payload.sender_id,
            sender_matri_id: payload.sender_matri_id,
            sender_name: payload.sender_name,
            text: payload.text,
            created_at: payload.created_at,
            read_at: null,
          };
          setMessages((prev) => [...prev, msg]);
        } catch {
          // ignore malformed frames
        }
      };
    };

    connect();

    return () => {
      if (socket) {
        socket.close();
      }
      setWs(null);
    };
  }, [profileId]);

  if (!profileId) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-28 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md mx-auto px-4"
          >
            <motion.div
              className="w-24 h-24 mx-auto mb-6 rounded-full bg-accent-rose/50 flex items-center justify-center"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Lock className="w-12 h-12 text-primary" />
            </motion.div>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-3">
              Chat Not Available
            </h2>
            <p className="text-muted-foreground mb-6">
              You can only chat with this person once your interest has been accepted or you've accepted their interest.
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => router.back()}>
                Go Back
              </Button>
              <Button variant="hero" onClick={() => router.back()}>
                View Profile
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ message: newMessage }));
      setNewMessage("");
      setEmojiOpen(false);
    } else {
      toast.error("Chat connection is not active. Please try again.");
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gradient-romantic flex flex-col">
      {/* Chat Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg shadow-soft"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="hover:bg-accent-rose/50"
              >
                <ArrowLeft className="w-5 h-5 text-primary" />
              </Button>
              
              <div className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <img
                    src={
                      otherUser?.profile_photo ||
                      fallbackProfile.image
                    }
                    alt={otherUser?.name ?? fallbackProfile.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                  />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                </div>
                <div>
                  <h2 className="font-serif font-bold text-foreground flex items-center gap-2">
                    {otherUser?.name ?? fallbackProfile.name}
                    {fallbackProfile.isVerified && <Shield className="w-4 h-4 text-primary" />}
                    {fallbackProfile.isPremium && <Crown className="w-4 h-4 text-secondary" />}
                  </h2>
                  <p className="text-xs text-green-600">Online now</p>
                </div>
              </div>
            </div>

            {/* Top-right call / more actions removed as per UI requirement */}
          </div>
        </div>
      </motion.header>

      {/* Messages Area */}
      <div className="flex-1 pt-24 pb-24 overflow-y-auto">
        <div className="container mx-auto px-4 py-6">
          {/* Date Separator */}
          <div className="flex items-center justify-center mb-6">
            <div className="px-4 py-1.5 bg-white/70 backdrop-blur-sm rounded-full text-xs text-muted-foreground shadow-soft">
              Today
            </div>
          </div>

          {/* Messages */}
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((message, index) => {
                const isOwn = message.sender_matri_id === useAuthStore.getState().user?.matriId;
                
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[75%] ${isOwn ? 'order-2' : ''}`}>
                      <div
                        className={`px-4 py-3 rounded-2xl shadow-soft ${
                          isOwn
                            ? 'bg-gradient-to-br from-primary to-primary-light text-primary-foreground rounded-br-sm'
                            : 'bg-white/90 backdrop-blur-sm text-foreground rounded-bl-sm'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.text}</p>
                      </div>
                      <div className={`flex items-center gap-1 mt-1 text-xs text-muted-foreground ${isOwn ? 'justify-end' : ''}`}>
                        <span>{formatTime(new Date(message.created_at))}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-primary/5 shadow-elevated"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
                className="w-full px-4 py-3 bg-accent-rose/30 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 hover:bg-accent-rose/50"
                onClick={() => setEmojiOpen((v) => !v)}
              >
                <Smile className="w-5 h-5 text-muted-foreground" />
              </Button>
              {emojiOpen && (
                <div className="absolute right-0 bottom-12 z-20 w-64 max-h-64 overflow-y-auto rounded-2xl bg-white shadow-elevated border border-primary/10 p-2 grid grid-cols-8 gap-1 text-lg">
                  {["😀","😁","😂","🤣","😃","😄","😅","😆","😉","😊","😍","😘","😜","😎","🙂","🙃","🤗","🤔","🤨","😐","😶","🙄","😏","😣","😥","😮","🤐","😯","😪","😫","😴","😌","🤤","🤒","🤕","🤠","🥳","🥰","❤️","💖","💗","💓","💞","💕","💘","💝","👍","👎","👏","🙌","🙏","💪","💃","🕺","👋","🤝","👀","👩","👨","👫","💑","👩‍❤️‍👨"].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      className="hover:bg-accent-rose/40 rounded-md leading-none"
                      onClick={() => setNewMessage((prev) => prev + emoji)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <motion.div whileTap={{ scale: 0.9 }}>
              <Button
                variant="hero"
                size="icon"
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="rounded-full w-12 h-12"
              >
                <Send className="w-5 h-5" />
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Floating Sparkles */}
      {[...Array(3)].map((_, i) => (
        <Sparkles
          key={i}
          className="fixed text-secondary/20 animate-sparkle pointer-events-none"
          style={{
            left: `${20 + i * 30}%`,
            top: `${30 + i * 20}%`,
            width: '24px',
            animationDelay: `${i * 0.5}s`,
          }}
        />
      ))}
    </div>
  );
};

export default ChatPage;
