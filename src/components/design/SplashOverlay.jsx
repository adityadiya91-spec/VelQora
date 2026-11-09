import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

export function SplashOverlay() {
  const location = useLocation();
  const isLanding = location.pathname === "/" || location.pathname === "/landing";

  const [visible, setVisible] = useState(isLanding);

  useEffect(() => {
    if (!isLanding) {
      setVisible(false);
      return;
    }

    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
    }, 2200);

    return () => clearTimeout(timer);
  }, [location.pathname, isLanding]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[#07090E] p-6 select-none"
        >
          {/* Ambient background glows */}
          <div className="absolute w-80 h-80 bg-[#FF6600]/20 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute w-72 h-72 bg-[#CCFF00]/15 rounded-full blur-[130px] pointer-events-none" />

          <div className="flex flex-col items-center text-center space-y-8 relative z-10">
            {/* ONLY Karwan Logo with continuous smooth hovering/floating effect */}
            <motion.div
              animate={{
                y: [-8, 8, -8],
              }}
              transition={{
                repeat: Infinity,
                duration: 2.4,
                ease: "easeInOut",
              }}
              whileHover={{ scale: 1.08 }}
              className="relative cursor-pointer"
            >
              {/* Pulsing glow aura */}
              <motion.div
                animate={{
                  opacity: [0.4, 0.8, 0.4],
                  scale: [0.95, 1.05, 0.95],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2.4,
                  ease: "easeInOut",
                }}
                className="absolute -inset-6 bg-gradient-to-r from-[#FF6600]/40 to-[#CCFF00]/30 rounded-3xl blur-2xl"
              />

              <div className="relative rounded-3xl bg-white/10 border border-white/20 p-5 sm:p-7 backdrop-blur-2xl shadow-[0_10px_40px_rgba(255,102,0,0.4)]">
                <img
                  src="/Karwan-logo.png"
                  alt="Karwan Logo"
                  className="h-16 sm:h-22 w-auto object-contain max-w-[260px] drop-shadow-[0_8px_25px_rgba(204,255,0,0.35)]"
                />
              </div>
            </motion.div>

            {/* Animation of the loading */}
            <div className="flex flex-col items-center space-y-3">
              <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/15 shadow-inner">
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.4,
                    ease: "easeInOut",
                  }}
                  className="w-1/2 h-full bg-gradient-to-r from-[#FF6600] via-[#CCFF00] to-[#FF6600] rounded-full shadow-[0_0_14px_#CCFF00]"
                />
              </div>

              {/* Pulsing loading dots */}
              <div className="flex items-center gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.4, 1, 0.4],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      delay: i * 0.2,
                      ease: "easeInOut",
                    }}
                    className="w-1.5 h-1.5 rounded-full bg-[#CCFF00]"
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default SplashOverlay;