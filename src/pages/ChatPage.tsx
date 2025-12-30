import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useInterestStore } from "@/stores/interestStore";
import { profilesData } from "@/components/FeaturedProfiles";
import { 
  ArrowLeft, Send, Heart, Sparkles, Shield, Crown,
  Phone, Video, MoreVertical, Smile, Image, Paperclip,
  Check, CheckCheck, Lock
} from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  senderId: number;
  text: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
}

const ChatPage = () => {
  const { profileId } = useParams();
  const navigate = useNavigate();
  const { canChat } = useInterestStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderId: Number(profileId),
      text: "Hi! Thanks for accepting my interest. I'm excited to get to know you better! 😊",
      timestamp: new Date(Date.now() - 3600000),
      status: 'read',
    },
    {
      id: '2',
      senderId: 0,
      text: "Hello! Nice to meet you too. I noticed we have a lot in common!",
      timestamp: new Date(Date.now() - 3500000),
      status: 'read',
    },
    {
      id: '3',
      senderId: Number(profileId),
      text: "Yes! I saw that we both love traveling. What's your favorite destination?",
      timestamp: new Date(Date.now() - 3400000),
      status: 'read',
    },
  ]);

  const profile = profilesData.find(p => p.id === Number(profileId));

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-romantic">
        <div className="text-center">
          <h1 className="font-serif text-2xl font-bold mb-4">Profile Not Found</h1>
          <Button onClick={() => navigate("/search")}>Browse Profiles</Button>
        </div>
      </div>
    );
  }

  if (!canChat(profile.id)) {
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
              <Button variant="outline" onClick={() => navigate(-1)}>
                Go Back
              </Button>
              <Button variant="hero" onClick={() => navigate(`/profile/${profile.id}`)}>
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

    const message: Message = {
      id: Date.now().toString(),
      senderId: 0,
      text: newMessage,
      timestamp: new Date(),
      status: 'sent',
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");

    // Simulate delivery
    setTimeout(() => {
      setMessages(prev => 
        prev.map(m => m.id === message.id ? { ...m, status: 'delivered' } : m)
      );
    }, 500);

    // Simulate read
    setTimeout(() => {
      setMessages(prev => 
        prev.map(m => m.id === message.id ? { ...m, status: 'read' } : m)
      );
    }, 1500);
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
                onClick={() => navigate(-1)}
                className="hover:bg-accent-rose/50"
              >
                <ArrowLeft className="w-5 h-5 text-primary" />
              </Button>
              
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/profile/${profile.id}`)}>
                <div className="relative">
                  <img
                    src={profile.image}
                    alt={profile.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                  />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                </div>
                <div>
                  <h2 className="font-serif font-bold text-foreground flex items-center gap-2">
                    {profile.name}
                    {profile.isVerified && <Shield className="w-4 h-4 text-primary" />}
                    {profile.isPremium && <Crown className="w-4 h-4 text-secondary" />}
                  </h2>
                  <p className="text-xs text-green-600">Online now</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="hover:bg-accent-rose/50" onClick={() => toast.info("Voice call coming soon!")}>
                <Phone className="w-5 h-5 text-primary" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-accent-rose/50" onClick={() => toast.info("Video call coming soon!")}>
                <Video className="w-5 h-5 text-primary" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-accent-rose/50">
                <MoreVertical className="w-5 h-5 text-primary" />
              </Button>
            </div>
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
                const isOwn = message.senderId === 0;
                
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
                        <span>{formatTime(message.timestamp)}</span>
                        {isOwn && (
                          message.status === 'read' ? (
                            <CheckCheck className="w-4 h-4 text-secondary" />
                          ) : message.status === 'delivered' ? (
                            <CheckCheck className="w-4 h-4" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )
                        )}
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
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="hover:bg-accent-rose/50" onClick={() => toast.info("Attachments coming soon!")}>
                <Paperclip className="w-5 h-5 text-muted-foreground" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-accent-rose/50" onClick={() => toast.info("Images coming soon!")}>
                <Image className="w-5 h-5 text-muted-foreground" />
              </Button>
            </div>

            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
                className="w-full px-4 py-3 bg-accent-rose/30 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2">
                <Smile className="w-5 h-5 text-muted-foreground" />
              </Button>
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
