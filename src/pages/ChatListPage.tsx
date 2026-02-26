import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { useNavigate } from "react-router-dom";

const chatData = [
  { id: 1, name: "Ashley Emmy", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face", lastMessage: "Hi Anna, How are you?", time: "9:00 PM", unread: 3 },
  { id: 2, name: "Julia Ann", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face", lastMessage: "Hi Anna, How are you?", time: "9:00 PM", unread: 2 },
  { id: 3, name: "Elizabeth Taylor", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face", lastMessage: "Hi Anna, How are you?", time: "8:00 PM", unread: 3 },
  { id: 4, name: "Angelina Jolie", avatar: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=100&h=100&fit=crop&crop=face", lastMessage: "Hi Anna, How are you?", time: "3:00 PM", unread: 0 },
  { id: 5, name: "Olivia Mia", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face", lastMessage: "Hi Anna, How are you?", time: "5:00 PM", unread: 0 },
  { id: 6, name: "Sophia Rose", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop&crop=face", lastMessage: "Hi Anna, How are you?", time: "9:00 PM", unread: 0 },
];

const ChatListPage = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-secondary italic">Chat list</h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-card overflow-hidden"
        >
          {chatData.map((chat, index) => (
            <motion.div
              key={chat.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => navigate(`/chat/${chat.id}`)}
              className="flex items-center gap-4 px-6 py-5 border-b border-primary/5 last:border-0 cursor-pointer hover:bg-accent-rose/30 transition-colors"
            >
              <div className="relative flex-shrink-0">
                <img
                  src={chat.avatar}
                  alt={chat.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-primary/20"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-serif font-bold text-foreground text-sm">{chat.name}</h3>
                <p className="text-xs text-muted-foreground truncate">{chat.lastMessage}</p>
              </div>

              <div className="text-right flex-shrink-0">
                <p className="text-xs text-muted-foreground">{chat.time}</p>
                {chat.unread > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 bg-green-500 text-white text-[10px] font-bold rounded-full mt-1">
                    {chat.unread}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default ChatListPage;
