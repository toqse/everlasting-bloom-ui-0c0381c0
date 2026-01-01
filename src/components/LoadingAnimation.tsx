import { motion } from "framer-motion";

const LOADER_IMAGES = [
  "https://rn53themes.net/themes/matrimo/images/loder/1.png",
  "https://rn53themes.net/themes/matrimo/images/loder/2.png",
  "https://rn53themes.net/themes/matrimo/images/loder/3.png",
];

const LoadingAnimation = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-romantic overflow-hidden"
      aria-label="Loading"
      role="status"
    >
      {/* Soft vignette */}
      <div className="absolute inset-0 bg-background/40" />

      <div className="relative z-10 flex flex-col items-center">
        {/* Loader scene (matches reference site) */}
        <div className="relative w-[220px] h-[150px] md:w-[260px] md:h-[170px]">
          <motion.img
            src={LOADER_IMAGES[0]}
            alt="Proposal loader character"
            loading="eager"
            className="absolute left-2 bottom-2 w-[78px] md:w-[92px] select-none pointer-events-none"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.img
            src={LOADER_IMAGES[1]}
            alt="Proposal loader lady"
            loading="eager"
            className="absolute right-2 bottom-2 w-[62px] md:w-[72px] select-none pointer-events-none"
            animate={{ y: [0, -3, 0], rotate: [0, 1, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.img
            src={LOADER_IMAGES[2]}
            alt="Proposal loader hearts"
            loading="eager"
            className="absolute left-1/2 top-3 -translate-x-1/2 w-[70px] md:w-[82px] select-none pointer-events-none"
            animate={{ y: [0, -10, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 1.25, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Loading text */}
        <motion.div
          className="mt-4 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.h2
            className="text-lg md:text-xl font-serif text-primary"
            animate={{ opacity: [0.75, 1, 0.75] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Finding Your Perfect Match
          </motion.h2>
          <div className="mt-2 flex items-center justify-center gap-1.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.span
                key={i}
                className={`w-2 h-2 rounded-full ${i % 2 === 0 ? "bg-primary" : "bg-secondary"}`}
                animate={{ y: [0, -7, 0], scale: [1, 1.15, 1] }}
                transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.12, ease: "easeInOut" }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoadingAnimation;
