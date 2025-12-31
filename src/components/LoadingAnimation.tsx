import { motion } from "framer-motion";

const LoadingAnimation = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50"
    >
      {/* Floating Hearts Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-rose-300/40"
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 50,
              scale: 0.5 + Math.random() * 0.5,
              rotate: Math.random() * 30 - 15,
            }}
            animate={{
              y: -100,
              rotate: Math.random() * 60 - 30,
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "linear",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </motion.div>
        ))}
      </div>

      {/* Main Animation Container */}
      <div className="relative flex flex-col items-center">
        {/* Proposal Scene */}
        <div className="relative w-80 h-60 flex items-end justify-center">
          {/* Ground/Shadow */}
          <motion.div
            className="absolute bottom-0 w-64 h-4 bg-gradient-to-r from-transparent via-rose-200/30 to-transparent rounded-full blur-sm"
            animate={{ scaleX: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Man Proposing (Kneeling) */}
          <motion.svg
            viewBox="0 0 120 180"
            className="w-28 h-40 absolute left-12 bottom-4"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Man's Head */}
            <motion.circle
              cx="60"
              cy="30"
              r="18"
              fill="#8B6914"
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            {/* Hair */}
            <path d="M42 25 Q50 12 60 15 Q70 12 78 25 Q75 20 60 18 Q45 20 42 25" fill="#4A3000" />
            {/* Face */}
            <circle cx="65" cy="28" r="2" fill="#333" /> {/* Eye */}
            <path d="M68 35 Q72 37 75 35" stroke="#333" strokeWidth="1.5" fill="none" /> {/* Smile */}
            
            {/* Body/Torso */}
            <motion.path
              d="M45 48 L60 50 L75 48 L70 90 L50 90 Z"
              fill="#C41E3A"
              animate={{ rotate: [-1, 1, -1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ transformOrigin: "60px 70px" }}
            />
            
            {/* Kneeling Leg */}
            <path d="M50 90 L45 120 L55 125 L60 95" fill="#2C3E50" />
            <path d="M70 90 L75 110 L80 130 L70 135 L65 115 L60 95" fill="#2C3E50" />
            
            {/* Arm with Ring Box */}
            <motion.g
              animate={{ rotate: [-5, 5, -5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ transformOrigin: "75px 60px" }}
            >
              <path d="M75 55 L95 50 L100 60 L80 70" fill="#E8B89D" />
              {/* Ring Box */}
              <motion.rect
                x="92"
                y="45"
                width="18"
                height="16"
                rx="2"
                fill="#8B0000"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              {/* Ring */}
              <motion.circle
                cx="101"
                cy="50"
                r="4"
                fill="none"
                stroke="#FFD700"
                strokeWidth="2"
                animate={{ 
                  filter: ["drop-shadow(0 0 2px #FFD700)", "drop-shadow(0 0 8px #FFD700)", "drop-shadow(0 0 2px #FFD700)"]
                }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              {/* Diamond */}
              <motion.path
                d="M101 44 L104 47 L101 50 L98 47 Z"
                fill="#87CEEB"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            </motion.g>
          </motion.svg>

          {/* Woman */}
          <motion.svg
            viewBox="0 0 100 200"
            className="w-24 h-44 absolute right-12 bottom-4"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {/* Woman's Head */}
            <motion.circle
              cx="50"
              cy="30"
              r="18"
              fill="#F5CBA7"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: 0.3 }}
            />
            {/* Hair */}
            <path d="M32 28 Q35 10 50 8 Q65 10 68 28 Q70 45 65 60 Q50 55 35 60 Q30 45 32 28" fill="#5D4E37" />
            {/* Face */}
            <circle cx="45" cy="28" r="2" fill="#333" /> {/* Eye */}
            <path d="M42 38 Q46 42 52 38" stroke="#333" strokeWidth="1.5" fill="none" /> {/* Smile */}
            
            {/* Dress */}
            <motion.path
              d="M35 48 L50 50 L65 48 L80 160 L20 160 Z"
              fill="#DAA520"
              animate={{ scaleX: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ transformOrigin: "50px 100px" }}
            />
            {/* Dress Details */}
            <path d="M35 80 Q50 85 65 80" stroke="#C49102" strokeWidth="2" fill="none" />
            <path d="M30 120 Q50 130 70 120" stroke="#C49102" strokeWidth="2" fill="none" />
            
            {/* Arms - Surprised Gesture */}
            <motion.g
              animate={{ rotate: [0, 5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              style={{ transformOrigin: "35px 55px" }}
            >
              <path d="M35 55 L15 45 L10 50 L30 65" fill="#F5CBA7" />
            </motion.g>
            <motion.g
              animate={{ rotate: [0, -5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              style={{ transformOrigin: "65px 55px" }}
            >
              <path d="M65 55 L80 50 L82 58 L68 65" fill="#F5CBA7" />
            </motion.g>
          </motion.svg>

          {/* Floating Heart between them */}
          <motion.div
            className="absolute top-8 left-1/2 -translate-x-1/2"
            animate={{
              y: [0, -15, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="#E91E63">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </motion.div>

          {/* Sparkles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${10 + Math.random() * 40}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                rotate: [0, 180],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#FFD700">
                <path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z" />
              </svg>
            </motion.div>
          ))}
        </div>

        {/* Loading Text */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-2xl font-serif text-rose-700 mb-2">Finding Your Perfect Match</h2>
          <div className="flex items-center justify-center gap-1">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-2 h-2 bg-rose-400 rounded-full"
                animate={{
                  y: [0, -8, 0],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoadingAnimation;
