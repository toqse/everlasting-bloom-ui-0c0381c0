import { motion } from "framer-motion";

const LoadingAnimation = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 overflow-hidden"
    >
      {/* Animated Background Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-rose-200/40 to-pink-300/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-amber-200/40 to-yellow-200/30 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -30, 0],
            y: [0, 20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Floating Rose Petals */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`petal-${i}`}
            className="absolute"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: -50,
              rotate: Math.random() * 360,
              scale: 0.4 + Math.random() * 0.6,
            }}
            animate={{
              y: typeof window !== 'undefined' ? window.innerHeight + 100 : 1000,
              x: `+=${Math.sin(i) * 100}`,
              rotate: 360 + Math.random() * 360,
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "linear",
            }}
          >
            <svg width="20" height="24" viewBox="0 0 20 24" fill="none">
              <ellipse cx="10" cy="12" rx="8" ry="11" fill="url(#petalGrad)" opacity="0.7" />
              <defs>
                <linearGradient id="petalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F9A8D4" />
                  <stop offset="100%" stopColor="#FDA4AF" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        ))}
      </div>

      {/* Floating Hearts Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 50,
              scale: 0.3 + Math.random() * 0.4,
              rotate: Math.random() * 30 - 15,
            }}
            animate={{
              y: -100,
              rotate: Math.random() * 60 - 30,
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "linear",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="url(#heartGrad)" opacity="0.4">
              <defs>
                <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F472B6" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </motion.div>
        ))}
      </div>

      {/* Main Animation Container */}
      <div className="relative flex flex-col items-center z-10">
        {/* Proposal Scene */}
        <div className="relative w-[400px] h-[320px] flex items-end justify-center">
          {/* Decorative Floor */}
          <motion.div
            className="absolute bottom-0 w-80 h-8 bg-gradient-to-r from-transparent via-rose-200/50 to-transparent rounded-full blur-md"
            animate={{ scaleX: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          {/* Man Proposing (Kneeling) - Realistic */}
          <motion.svg
            viewBox="0 0 200 280"
            className="w-44 h-64 absolute left-4 bottom-6"
            initial={{ x: -80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3, type: "spring", stiffness: 60 }}
          >
            {/* Shadow */}
            <ellipse cx="100" cy="270" rx="50" ry="8" fill="rgba(0,0,0,0.1)" />
            
            {/* Back Leg (Kneeling) */}
            <path d="M85 180 Q75 220 70 250 Q65 260 75 262 L90 260 Q95 255 90 240 L100 200 Z" fill="#1E3A5F" />
            
            {/* Front Leg (Kneeling on knee) */}
            <path d="M115 175 L130 210 Q135 225 125 230 L110 232 Q100 230 105 215 L105 185 Z" fill="#1E3A5F" />
            <ellipse cx="118" cy="235" rx="18" ry="8" fill="#1A1A1A" /> {/* Shoe */}
            
            {/* Torso - Formal Suit */}
            <motion.g
              animate={{ rotate: [-1, 1, -1] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              style={{ transformOrigin: "100px 140px" }}
            >
              <path d="M75 95 Q100 92 125 95 L130 180 L70 180 Z" fill="#1E3A5F" />
              {/* Suit Lapels */}
              <path d="M88 95 L100 130 L92 135 L80 100 Z" fill="#152C45" />
              <path d="M112 95 L100 130 L108 135 L120 100 Z" fill="#152C45" />
              {/* Shirt/Tie */}
              <path d="M95 95 L100 135 L105 95 Z" fill="#FFFFFF" />
              <path d="M97 100 L100 145 L103 100 Z" fill="#8B2252" />
            </motion.g>
            
            {/* Neck */}
            <ellipse cx="100" cy="88" rx="10" ry="8" fill="#E8B89D" />
            
            {/* Head */}
            <motion.g
              animate={{ y: [0, -3, 0], rotate: [0, 2, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ transformOrigin: "100px 60px" }}
            >
              {/* Face Shape */}
              <ellipse cx="100" cy="60" rx="26" ry="30" fill="#E8B89D" />
              {/* Hair */}
              <path d="M74 50 Q80 25 100 22 Q120 25 126 50 Q125 35 100 32 Q75 35 74 50" fill="#2C1810" />
              <path d="M74 50 Q72 55 74 65 L78 55 Z" fill="#2C1810" />
              <path d="M126 50 Q128 55 126 65 L122 55 Z" fill="#2C1810" />
              {/* Eyebrows */}
              <path d="M85 48 Q90 45 95 48" stroke="#2C1810" strokeWidth="2" fill="none" />
              <path d="M105 48 Q110 45 115 48" stroke="#2C1810" strokeWidth="2" fill="none" />
              {/* Eyes */}
              <ellipse cx="90" cy="55" rx="5" ry="4" fill="#FFFFFF" />
              <ellipse cx="110" cy="55" rx="5" ry="4" fill="#FFFFFF" />
              <circle cx="91" cy="55" r="2.5" fill="#4A3728" />
              <circle cx="111" cy="55" r="2.5" fill="#4A3728" />
              <circle cx="92" cy="54" r="1" fill="#FFFFFF" />
              <circle cx="112" cy="54" r="1" fill="#FFFFFF" />
              {/* Nose */}
              <path d="M100 55 Q102 62 100 68 Q98 66 99 68" stroke="#C9A089" strokeWidth="1.5" fill="none" />
              {/* Smile */}
              <path d="M92 74 Q100 82 108 74" stroke="#B8837A" strokeWidth="2" fill="none" />
              {/* Ears */}
              <ellipse cx="74" cy="60" rx="5" ry="8" fill="#E8B89D" />
              <ellipse cx="126" cy="60" rx="5" ry="8" fill="#E8B89D" />
            </motion.g>
            
            {/* Arm holding ring box */}
            <motion.g
              animate={{ rotate: [-3, 3, -3] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              style={{ transformOrigin: "125px 110px" }}
            >
              {/* Upper Arm */}
              <path d="M125 100 Q145 105 155 95 L165 105 Q155 120 140 125 L125 115 Z" fill="#1E3A5F" />
              {/* Forearm/Hand */}
              <path d="M155 95 Q170 88 175 80 L180 85 Q175 95 165 105 Z" fill="#E8B89D" />
              {/* Fingers */}
              <path d="M175 80 Q178 76 176 73 L180 72 Q183 78 180 85 Z" fill="#E8B89D" />
              
              {/* Ring Box */}
              <motion.g
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              >
                <rect x="168" y="60" width="24" height="20" rx="3" fill="#8B0000" />
                <rect x="169" y="61" width="22" height="8" rx="2" fill="#A52A2A" />
                {/* Ring inside box */}
                <motion.ellipse
                  cx="180"
                  cy="72"
                  rx="6"
                  ry="3"
                  fill="none"
                  stroke="#FFD700"
                  strokeWidth="2"
                  animate={{ 
                    filter: ["drop-shadow(0 0 3px #FFD700)", "drop-shadow(0 0 12px #FFD700)", "drop-shadow(0 0 3px #FFD700)"]
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                {/* Diamond */}
                <motion.path
                  d="M180 64 L184 68 L180 72 L176 68 Z"
                  fill="url(#diamondGrad)"
                  animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [0.9, 1, 0.9]
                  }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
                <defs>
                  <linearGradient id="diamondGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#E0F7FA" />
                    <stop offset="50%" stopColor="#80DEEA" />
                    <stop offset="100%" stopColor="#B2EBF2" />
                  </linearGradient>
                </defs>
              </motion.g>
            </motion.g>
            
            {/* Other arm */}
            <path d="M75 100 Q55 115 50 135 L60 140 Q65 120 80 110 Z" fill="#1E3A5F" />
            <ellipse cx="52" cy="140" rx="8" ry="6" fill="#E8B89D" />
          </motion.svg>

          {/* Woman - Realistic */}
          <motion.svg
            viewBox="0 0 180 300"
            className="w-40 h-[280px] absolute right-2 bottom-4"
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5, type: "spring", stiffness: 60 }}
          >
            {/* Shadow */}
            <ellipse cx="90" cy="290" rx="45" ry="8" fill="rgba(0,0,0,0.08)" />
            
            {/* Dress - Flowing Gown */}
            <motion.g
              animate={{ scaleX: [1, 1.015, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{ transformOrigin: "90px 200px" }}
            >
              {/* Main Dress */}
              <path d="M55 110 Q90 105 125 110 L150 285 Q90 295 30 285 Z" fill="url(#dressGrad)" />
              {/* Dress Folds */}
              <path d="M60 150 Q70 200 55 280" stroke="#C4A000" strokeWidth="2" fill="none" opacity="0.5" />
              <path d="M90 130 Q95 200 90 280" stroke="#C4A000" strokeWidth="2" fill="none" opacity="0.5" />
              <path d="M120 150 Q110 200 125 280" stroke="#C4A000" strokeWidth="2" fill="none" opacity="0.5" />
              {/* Belt/Waist */}
              <ellipse cx="90" cy="130" rx="38" ry="6" fill="#B8860B" />
              <circle cx="90" cy="130" r="5" fill="#FFD700" />
              <defs>
                <linearGradient id="dressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#DAA520" />
                  <stop offset="50%" stopColor="#FFD700" />
                  <stop offset="100%" stopColor="#DAA520" />
                </linearGradient>
              </defs>
            </motion.g>
            
            {/* Neck */}
            <ellipse cx="90" cy="98" rx="10" ry="10" fill="#F5CBA7" />
            {/* Necklace */}
            <path d="M78 100 Q90 108 102 100" stroke="#FFD700" strokeWidth="1.5" fill="none" />
            <circle cx="90" cy="106" r="3" fill="#FFD700" />
            
            {/* Head */}
            <motion.g
              animate={{ y: [0, -4, 0], rotate: [-2, 2, -2] }}
              transition={{ duration: 2.2, repeat: Infinity, delay: 0.2 }}
              style={{ transformOrigin: "90px 65px" }}
            >
              {/* Face */}
              <ellipse cx="90" cy="65" rx="25" ry="28" fill="#F5CBA7" />
              {/* Hair */}
              <path d="M65 55 Q70 25 90 20 Q110 25 115 55 Q118 75 110 95 Q90 85 70 95 Q62 75 65 55" fill="#3D2314" />
              <path d="M65 55 Q60 70 65 90 L72 75 Z" fill="#3D2314" />
              <path d="M115 55 Q120 70 115 90 L108 75 Z" fill="#3D2314" />
              {/* Hair Accessory */}
              <circle cx="110" cy="40" r="6" fill="#FFD700" />
              <circle cx="110" cy="40" r="3" fill="#FFFFFF" opacity="0.5" />
              {/* Eyebrows */}
              <path d="M77 52 Q82 49 87 52" stroke="#3D2314" strokeWidth="1.5" fill="none" />
              <path d="M93 52 Q98 49 103 52" stroke="#3D2314" strokeWidth="1.5" fill="none" />
              {/* Eyes with lashes */}
              <ellipse cx="82" cy="58" rx="5" ry="4" fill="#FFFFFF" />
              <ellipse cx="98" cy="58" rx="5" ry="4" fill="#FFFFFF" />
              <circle cx="82" cy="59" r="2.5" fill="#4A3728" />
              <circle cx="98" cy="59" r="2.5" fill="#4A3728" />
              <circle cx="81" cy="58" r="1" fill="#FFFFFF" />
              <circle cx="97" cy="58" r="1" fill="#FFFFFF" />
              {/* Eyelashes */}
              <path d="M77 55 L75 52" stroke="#3D2314" strokeWidth="0.8" />
              <path d="M79 54 L78 51" stroke="#3D2314" strokeWidth="0.8" />
              <path d="M103 55 L105 52" stroke="#3D2314" strokeWidth="0.8" />
              <path d="M101 54 L102 51" stroke="#3D2314" strokeWidth="0.8" />
              {/* Blush */}
              <ellipse cx="74" cy="68" rx="6" ry="3" fill="#FFB6C1" opacity="0.4" />
              <ellipse cx="106" cy="68" rx="6" ry="3" fill="#FFB6C1" opacity="0.4" />
              {/* Nose */}
              <path d="M90 58 Q91 65 90 70 Q88 68 89 70" stroke="#DEB887" strokeWidth="1" fill="none" />
              {/* Lips */}
              <path d="M85 78 Q90 82 95 78 Q90 84 85 78" fill="#E57373" />
              {/* Ears with earrings */}
              <ellipse cx="65" cy="65" rx="4" ry="7" fill="#F5CBA7" />
              <ellipse cx="115" cy="65" rx="4" ry="7" fill="#F5CBA7" />
              <circle cx="65" cy="72" r="3" fill="#FFD700" />
              <circle cx="115" cy="72" r="3" fill="#FFD700" />
            </motion.g>
            
            {/* Arms - Surprised Happy Gesture */}
            <motion.g
              animate={{ rotate: [0, 8, 0] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              style={{ transformOrigin: "55px 115px" }}
            >
              <path d="M55 115 Q35 100 25 85 L30 80 Q42 95 60 108 Z" fill="#F5CBA7" />
              <ellipse cx="27" cy="82" rx="8" ry="6" fill="#F5CBA7" />
            </motion.g>
            <motion.g
              animate={{ rotate: [0, -8, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: 0.1 }}
              style={{ transformOrigin: "125px 115px" }}
            >
              <path d="M125 115 Q145 100 155 85 L150 80 Q138 95 120 108 Z" fill="#F5CBA7" />
              <ellipse cx="153" cy="82" rx="8" ry="6" fill="#F5CBA7" />
            </motion.g>
          </motion.svg>

          {/* Floating Hearts between them */}
          <motion.div
            className="absolute top-4 left-1/2 -translate-x-1/2"
            animate={{
              y: [0, -20, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{ duration: 1.8, repeat: Infinity }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24">
              <defs>
                <linearGradient id="mainHeartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#EC4899" />
                  <stop offset="100%" stopColor="#BE185D" />
                </linearGradient>
              </defs>
              <path fill="url(#mainHeartGrad)" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </motion.div>
          
          {/* Small floating hearts */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={`small-heart-${i}`}
              className="absolute"
              style={{
                left: `${35 + i * 10}%`,
                top: `${15 + i * 5}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, (i % 2 === 0 ? 10 : -10), 0],
                scale: [0.8, 1, 0.8],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 2 + i * 0.3,
                repeat: Infinity,
                delay: i * 0.4,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#F472B6">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </motion.div>
          ))}

          {/* Sparkles/Stars */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`sparkle-${i}`}
              className="absolute"
              style={{
                left: `${15 + Math.random() * 70}%`,
                top: `${5 + Math.random() * 50}%`,
              }}
              animate={{
                scale: [0, 1.2, 0],
                opacity: [0, 1, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.25,
                ease: "easeInOut",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#FFD700">
                <path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z" />
              </svg>
            </motion.div>
          ))}
          
          {/* Ring glow effect */}
          <motion.div
            className="absolute left-[52%] top-[22%] w-8 h-8 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(255,215,0,0.6) 0%, transparent 70%)",
            }}
            animate={{
              scale: [1, 1.8, 1],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>

        {/* Loading Text */}
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <motion.h2 
            className="text-2xl md:text-3xl font-serif text-rose-700 mb-3"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Finding Your Perfect Match
          </motion.h2>
          <div className="flex items-center justify-center gap-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.span
                key={i}
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  background: i % 2 === 0 ? "linear-gradient(135deg, #EC4899, #BE185D)" : "linear-gradient(135deg, #F59E0B, #D97706)",
                }}
                animate={{
                  y: [0, -12, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeInOut",
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
