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

      {/* Main Animation Container - Reduced Size */}
      <div className="relative flex flex-col items-center z-10 scale-75 md:scale-90">
        {/* Proposal Scene */}
        <div className="relative w-[320px] h-[260px] flex items-end justify-center">
          {/* Decorative Floor */}
          <motion.div
            className="absolute bottom-0 w-64 h-6 bg-gradient-to-r from-transparent via-rose-200/50 to-transparent rounded-full blur-md"
            animate={{ scaleX: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          {/* Man Proposing (Kneeling) */}
          <motion.svg
            viewBox="0 0 180 260"
            className="w-32 h-52 absolute left-2 bottom-4"
            initial={{ x: -60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3, type: "spring", stiffness: 60 }}
          >
            {/* Shadow */}
            <ellipse cx="90" cy="250" rx="40" ry="6" fill="rgba(0,0,0,0.1)" />
            
            {/* Back Leg (Kneeling) */}
            <path d="M75 165 Q65 200 60 230 Q55 240 65 242 L78 240 Q82 235 78 220 L88 185 Z" fill="#1E3A5F" />
            
            {/* Front Leg (Kneeling on knee) */}
            <path d="M105 160 L118 190 Q122 205 112 210 L98 212 Q90 210 94 195 L94 170 Z" fill="#1E3A5F" />
            <ellipse cx="106" cy="215" rx="15" ry="6" fill="#1A1A1A" />
            
            {/* Torso */}
            <motion.g
              animate={{ rotate: [-1, 1, -1] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              style={{ transformOrigin: "90px 130px" }}
            >
              <path d="M68 88 Q90 85 112 88 L116 165 L62 165 Z" fill="#1E3A5F" />
              <path d="M78 88 L90 118 L82 122 L70 92 Z" fill="#152C45" />
              <path d="M102 88 L90 118 L98 122 L110 92 Z" fill="#152C45" />
              <path d="M85 88 L90 122 L95 88 Z" fill="#FFFFFF" />
              <path d="M87 92 L90 130 L93 92 Z" fill="#8B2252" />
            </motion.g>
            
            {/* Neck */}
            <ellipse cx="90" cy="82" rx="8" ry="6" fill="#E8B89D" />
            
            {/* Head */}
            <motion.g
              animate={{ y: [0, -2, 0], rotate: [0, 2, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ transformOrigin: "90px 55px" }}
            >
              <ellipse cx="90" cy="55" rx="22" ry="25" fill="#E8B89D" />
              <path d="M68 48 Q72 28 90 25 Q108 28 112 48 Q110 35 90 32 Q70 35 68 48" fill="#2C1810" />
              <path d="M68 48 Q66 52 68 60 L72 52 Z" fill="#2C1810" />
              <path d="M112 48 Q114 52 112 60 L108 52 Z" fill="#2C1810" />
              <path d="M78 46 Q82 44 86 46" stroke="#2C1810" strokeWidth="1.5" fill="none" />
              <path d="M94 46 Q98 44 102 46" stroke="#2C1810" strokeWidth="1.5" fill="none" />
              <ellipse cx="82" cy="52" rx="4" ry="3" fill="#FFFFFF" />
              <ellipse cx="98" cy="52" rx="4" ry="3" fill="#FFFFFF" />
              <circle cx="83" cy="52" r="2" fill="#4A3728" />
              <circle cx="99" cy="52" r="2" fill="#4A3728" />
              <circle cx="84" cy="51" r="0.8" fill="#FFFFFF" />
              <circle cx="100" cy="51" r="0.8" fill="#FFFFFF" />
              <path d="M90 52 Q91 58 90 63" stroke="#C9A089" strokeWidth="1.2" fill="none" />
              <path d="M84 68 Q90 74 96 68" stroke="#B8837A" strokeWidth="1.5" fill="none" />
              <ellipse cx="68" cy="55" rx="4" ry="6" fill="#E8B89D" />
              <ellipse cx="112" cy="55" rx="4" ry="6" fill="#E8B89D" />
            </motion.g>
            
            {/* Arm holding ring box */}
            <motion.g
              animate={{ rotate: [-2, 2, -2] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              style={{ transformOrigin: "112px 100px" }}
            >
              <path d="M112 92 Q130 96 138 88 L146 96 Q138 108 125 112 L112 105 Z" fill="#1E3A5F" />
              <path d="M138 88 Q150 82 155 75 L160 79 Q155 88 146 96 Z" fill="#E8B89D" />
              
              {/* Ring Box */}
              <motion.g animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 1.2, repeat: Infinity }}>
                <rect x="148" y="58" width="20" height="16" rx="2" fill="#8B0000" />
                <rect x="149" y="59" width="18" height="6" rx="1" fill="#A52A2A" />
                <motion.ellipse
                  cx="158" cy="68" rx="5" ry="2.5"
                  fill="none" stroke="#FFD700" strokeWidth="1.5"
                  animate={{ filter: ["drop-shadow(0 0 2px #FFD700)", "drop-shadow(0 0 8px #FFD700)", "drop-shadow(0 0 2px #FFD700)"] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <motion.path
                  d="M158 60 L161 64 L158 68 L155 64 Z"
                  fill="url(#diamondGrad)"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.9, 1, 0.9] }}
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
            <path d="M68 92 Q52 105 48 122 L56 126 Q60 110 72 102 Z" fill="#1E3A5F" />
            <ellipse cx="50" cy="126" rx="6" ry="5" fill="#E8B89D" />
          </motion.svg>

          {/* Woman - Realistic Elegant */}
          <motion.svg
            viewBox="0 0 160 280"
            className="w-28 h-56 absolute right-4 bottom-2"
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5, type: "spring", stiffness: 60 }}
          >
            {/* Shadow */}
            <ellipse cx="80" cy="272" rx="35" ry="6" fill="rgba(0,0,0,0.08)" />
            
            {/* Dress - Elegant Flowing Gown */}
            <motion.g
              animate={{ scaleX: [1, 1.01, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{ transformOrigin: "80px 180px" }}
            >
              {/* Main Dress Body */}
              <path d="M50 105 Q80 100 110 105 Q115 140 130 268 Q80 278 30 268 Q45 140 50 105 Z" fill="url(#dressGradNew)" />
              {/* Dress Folds - subtle */}
              <path d="M55 140 Q60 190 50 260" stroke="rgba(180,140,0,0.3)" strokeWidth="1.5" fill="none" />
              <path d="M80 120 Q82 180 80 260" stroke="rgba(180,140,0,0.3)" strokeWidth="1.5" fill="none" />
              <path d="M105 140 Q100 190 110 260" stroke="rgba(180,140,0,0.3)" strokeWidth="1.5" fill="none" />
              {/* Dress shimmer */}
              <path d="M65 150 Q70 170 68 200" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none" />
              <path d="M95 150 Q90 170 92 200" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none" />
              {/* Waist Belt */}
              <ellipse cx="80" cy="118" rx="32" ry="5" fill="#B8860B" />
              <circle cx="80" cy="118" r="4" fill="#FFD700" />
              <defs>
                <linearGradient id="dressGradNew" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#DAA520" />
                  <stop offset="30%" stopColor="#FFD700" />
                  <stop offset="70%" stopColor="#F0C040" />
                  <stop offset="100%" stopColor="#DAA520" />
                </linearGradient>
              </defs>
            </motion.g>
            
            {/* Upper Body / Shoulders */}
            <path d="M58 100 Q80 92 102 100 L102 108 Q80 105 58 108 Z" fill="#F5D5C8" />
            
            {/* Neck - Elegant long neck */}
            <path d="M72 92 Q80 88 88 92 L86 102 Q80 100 74 102 Z" fill="#F5D5C8" />
            {/* Necklace */}
            <path d="M70 98 Q80 105 90 98" stroke="#FFD700" strokeWidth="1" fill="none" />
            <circle cx="80" cy="103" r="2.5" fill="#FFD700" />
            <circle cx="76" cy="101" r="1.5" fill="#FFD700" opacity="0.7" />
            <circle cx="84" cy="101" r="1.5" fill="#FFD700" opacity="0.7" />
            
            {/* Head - More realistic proportions */}
            <motion.g
              animate={{ y: [0, -3, 0], rotate: [-1, 1, -1] }}
              transition={{ duration: 2.2, repeat: Infinity, delay: 0.2 }}
              style={{ transformOrigin: "80px 58px" }}
            >
              {/* Face - Oval elegant shape */}
              <ellipse cx="80" cy="58" rx="20" ry="24" fill="#F5D5C8" />
              
              {/* Hair - Elegant updo */}
              <path d="M60 50 Q62 28 80 22 Q98 28 100 50 Q102 65 95 82 Q80 75 65 82 Q58 65 60 50" fill="#3D2314" />
              {/* Side hair strands */}
              <path d="M60 50 Q56 62 60 75 L64 60 Z" fill="#3D2314" />
              <path d="M100 50 Q104 62 100 75 L96 60 Z" fill="#3D2314" />
              {/* Hair bun detail */}
              <ellipse cx="80" cy="30" rx="12" ry="8" fill="#3D2314" />
              <path d="M72 28 Q80 22 88 28" stroke="#2A1A0A" strokeWidth="1" fill="none" />
              
              {/* Hair Accessory - Flower */}
              <circle cx="95" cy="38" r="5" fill="#FFD700" />
              <circle cx="95" cy="38" r="2.5" fill="#FFF" opacity="0.4" />
              
              {/* Eyebrows - Elegant arch */}
              <path d="M68 48 Q73 45 78 48" stroke="#3D2314" strokeWidth="1.2" fill="none" />
              <path d="M82 48 Q87 45 92 48" stroke="#3D2314" strokeWidth="1.2" fill="none" />
              
              {/* Eyes - Expressive with lashes */}
              <ellipse cx="73" cy="54" rx="4" ry="3.5" fill="#FFFFFF" />
              <ellipse cx="87" cy="54" rx="4" ry="3.5" fill="#FFFFFF" />
              <circle cx="73" cy="55" r="2.2" fill="#4A3728" />
              <circle cx="87" cy="55" r="2.2" fill="#4A3728" />
              <circle cx="72" cy="54" r="0.8" fill="#FFFFFF" />
              <circle cx="86" cy="54" r="0.8" fill="#FFFFFF" />
              {/* Upper eyelashes */}
              <path d="M69 51 L67 49" stroke="#3D2314" strokeWidth="0.6" />
              <path d="M71 50 L70 48" stroke="#3D2314" strokeWidth="0.6" />
              <path d="M75 50 L76 48" stroke="#3D2314" strokeWidth="0.6" />
              <path d="M85 50 L84 48" stroke="#3D2314" strokeWidth="0.6" />
              <path d="M89 50 L90 48" stroke="#3D2314" strokeWidth="0.6" />
              <path d="M91 51 L93 49" stroke="#3D2314" strokeWidth="0.6" />
              
              {/* Subtle blush */}
              <ellipse cx="67" cy="62" rx="5" ry="2.5" fill="#FFCCCB" opacity="0.35" />
              <ellipse cx="93" cy="62" rx="5" ry="2.5" fill="#FFCCCB" opacity="0.35" />
              
              {/* Nose - Delicate */}
              <path d="M80 54 Q81 60 80 65 Q78 64 79 65" stroke="#E0B8A8" strokeWidth="0.8" fill="none" />
              
              {/* Lips - Full and elegant */}
              <path d="M75 72 Q80 70 85 72" stroke="#D4726A" strokeWidth="1" fill="none" />
              <path d="M76 73 Q80 77 84 73 Q80 78 76 73" fill="#E07060" />
              
              {/* Ears with elegant earrings */}
              <ellipse cx="60" cy="58" rx="3" ry="5" fill="#F5D5C8" />
              <ellipse cx="100" cy="58" rx="3" ry="5" fill="#F5D5C8" />
              <motion.circle 
                cx="60" cy="65" r="2.5" fill="#FFD700"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.circle 
                cx="100" cy="65" r="2.5" fill="#FFD700"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
              />
            </motion.g>
            
            {/* Arms - Graceful surprised gesture */}
            <motion.g
              animate={{ rotate: [0, 6, 0] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              style={{ transformOrigin: "50px 108px" }}
            >
              <path d="M50 108 Q35 95 28 82 L32 78 Q40 90 52 102 Z" fill="#F5D5C8" />
              {/* Delicate hand */}
              <ellipse cx="30" cy="80" rx="6" ry="4.5" fill="#F5D5C8" />
              <path d="M26 78 Q24 74 26 72" stroke="#F5D5C8" strokeWidth="2" fill="none" />
              <path d="M29 77 Q28 73 29 71" stroke="#F5D5C8" strokeWidth="2" fill="none" />
            </motion.g>
            <motion.g
              animate={{ rotate: [0, -6, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: 0.1 }}
              style={{ transformOrigin: "110px 108px" }}
            >
              <path d="M110 108 Q125 95 132 82 L128 78 Q120 90 108 102 Z" fill="#F5D5C8" />
              <ellipse cx="130" cy="80" rx="6" ry="4.5" fill="#F5D5C8" />
              <path d="M134 78 Q136 74 134 72" stroke="#F5D5C8" strokeWidth="2" fill="none" />
              <path d="M131 77 Q132 73 131 71" stroke="#F5D5C8" strokeWidth="2" fill="none" />
            </motion.g>
          </motion.svg>

          {/* Floating Hearts between them */}
          <motion.div
            className="absolute top-2 left-1/2 -translate-x-1/2"
            animate={{ y: [0, -15, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24">
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
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`small-heart-${i}`}
              className="absolute"
              style={{ left: `${38 + i * 12}%`, top: `${12 + i * 6}%` }}
              animate={{
                y: [0, -20, 0],
                x: [0, (i % 2 === 0 ? 8 : -8), 0],
                scale: [0.8, 1, 0.8],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.4 }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#F472B6">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </motion.div>
          ))}

          {/* Sparkles */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`sparkle-${i}`}
              className="absolute"
              style={{ left: `${20 + Math.random() * 60}%`, top: `${8 + Math.random() * 40}%` }}
              animate={{ scale: [0, 1, 0], opacity: [0, 1, 0], rotate: [0, 180, 360] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#FFD700">
                <path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z" />
              </svg>
            </motion.div>
          ))}
          
          {/* Ring glow effect */}
          <motion.div
            className="absolute left-[48%] top-[18%] w-6 h-6 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(255,215,0,0.5) 0%, transparent 70%)" }}
            animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>

        {/* Loading Text */}
        <motion.div
          className="mt-4 text-center"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <motion.h2 
            className="text-xl md:text-2xl font-serif text-rose-700 mb-2"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Finding Your Perfect Match
          </motion.h2>
          <div className="flex items-center justify-center gap-1.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.span
                key={i}
                className="w-2 h-2 rounded-full"
                style={{
                  background: i % 2 === 0 ? "linear-gradient(135deg, #EC4899, #BE185D)" : "linear-gradient(135deg, #F59E0B, #D97706)",
                }}
                animate={{ y: [0, -8, 0], scale: [1, 1.15, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoadingAnimation;
