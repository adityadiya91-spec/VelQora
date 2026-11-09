import { motion } from "framer-motion";

export function LandingHeroBackground({ isPrimaryMode }) {
  // Key corridor route nodes across Western Maharashtra
  const nodes = [
    { name: "Shirur", x: 180, y: 70, label: "North Node" },
    { name: "Daund", x: 420, y: 110, label: "Railway Hub" },
    { name: "Baramati", x: 280, y: 220, label: "APMC Central HQ", hub: true },
    { name: "Indapur", x: 620, y: 250, label: "Eastern Mandi" },
    { name: "Jejuri", x: 140, y: 280, label: "Highland Depot" },
    { name: "Phaltan", x: 380, y: 360, label: "Southern Corridor" },
  ];

  return (
    <div className="absolute inset-x-0 top-0 h-[820px] overflow-hidden pointer-events-none select-none z-0">
      {/* 1. Multi-spectrum Ambient Glowing Orbs */}
      {isPrimaryMode ? (
        <>
          {/* Top-left Electric Blue & Lime Aura */}
          <div className="absolute -top-24 -left-16 w-[780px] h-[700px] bg-gradient-to-br from-[#0052FF]/35 via-[#CCFF00]/20 to-transparent rounded-full blur-[120px]" />
          
          {/* Top-right Warm Orange Aura behind the Fare Card */}
          <div className="absolute top-0 right-[-100px] w-[700px] h-[700px] bg-gradient-to-bl from-[#FF6600]/30 via-[#0052FF]/25 to-transparent rounded-full blur-[130px]" />
          
          {/* Center Subtle Electric Green Beam */}
          <div className="absolute top-40 left-1/4 w-[560px] h-[450px] bg-[#CCFF00]/12 rounded-full blur-[140px]" />
        </>
      ) : (
        <>
          {/* Light Mode: Warm Amber & Sunset Orange Glows */}
          <div className="absolute -top-24 -left-16 w-[780px] h-[700px] bg-gradient-to-br from-orange-400/30 via-amber-300/20 to-transparent rounded-full blur-[120px]" />
          <div className="absolute top-0 right-[-100px] w-[700px] h-[700px] bg-gradient-to-bl from-orange-500/25 via-rose-300/15 to-transparent rounded-full blur-[130px]" />
        </>
      )}

      {/* 2. High-Tech Matrix Dot Grid Pattern */}
      <div
        className="absolute inset-0 opacity-70 transition-opacity duration-500"
        style={{
          backgroundImage: isPrimaryMode
            ? "radial-gradient(rgba(204, 255, 0, 0.28) 1.5px, transparent 1.5px), radial-gradient(rgba(255, 255, 255, 0.15) 1.2px, transparent 1.2px)"
            : "radial-gradient(rgba(255, 102, 0, 0.35) 1.5px, transparent 1.5px), radial-gradient(rgba(0, 0, 0, 0.08) 1.2px, transparent 1.2px)",
          backgroundSize: "36px 36px, 18px 18px",
          backgroundPosition: "0 0, 9px 9px",
          maskImage: "radial-gradient(ellipse 95% 85% at 50% 35%, black 55%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 95% 85% at 50% 35%, black 55%, transparent 100%)",
        }}
      />

      {/* 3. Subtle Digital Isometric Highway Grid Lines */}
      <div
        className="absolute inset-x-0 top-0 h-[700px] opacity-40"
        style={{
          backgroundImage: isPrimaryMode
            ? "linear-gradient(to right, rgba(204, 255, 0, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)"
            : "linear-gradient(to right, rgba(255, 102, 0, 0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 102, 0, 0.08) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse 85% 70% at 50% 30%, black 30%, transparent 95%)",
          WebkitMaskImage: "radial-gradient(ellipse 85% 70% at 50% 30%, black 30%, transparent 95%)",
        }}
      />

      {/* 4. Western Maharashtra Corridor Transit Highway Network SVG */}
      <div className="absolute inset-x-0 top-4 h-[680px] max-w-[1536px] mx-auto opacity-90 overflow-hidden">
        <svg
          viewBox="0 0 800 440"
          className="w-full h-full object-cover"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Primary Neon Gradient for Corridors */}
            <linearGradient id="corridorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isPrimaryMode ? "#CCFF00" : "#FF6600"} stopOpacity="0.8" />
              <stop offset="50%" stopColor={isPrimaryMode ? "#0052FF" : "#F97316"} stopOpacity="0.4" />
              <stop offset="100%" stopColor={isPrimaryMode ? "#CCFF00" : "#EA580C"} stopOpacity="0.7" />
            </linearGradient>

            {/* Glowing filter */}
            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Curving Transit Highway Arcs Connecting Rural Mandis */}
          <path
            d="M 180 70 Q 280 90 420 110"
            stroke="url(#corridorGrad)"
            strokeWidth="1.5"
            strokeDasharray="6 4"
            opacity="0.6"
          />
          <path
            d="M 420 110 Q 350 160 280 220"
            stroke="url(#corridorGrad)"
            strokeWidth="2"
            strokeDasharray="8 5"
            opacity="0.7"
          />
          <path
            d="M 180 70 Q 210 160 280 220"
            stroke="url(#corridorGrad)"
            strokeWidth="1.5"
            strokeDasharray="5 5"
            opacity="0.5"
          />
          <path
            d="M 140 280 Q 200 240 280 220"
            stroke="url(#corridorGrad)"
            strokeWidth="2"
            strokeDasharray="6 4"
            opacity="0.75"
          />
          <path
            d="M 280 220 Q 450 210 620 250"
            stroke="url(#corridorGrad)"
            strokeWidth="2"
            strokeDasharray="10 5"
            opacity="0.8"
          />
          <path
            d="M 280 220 Q 340 300 380 360"
            stroke="url(#corridorGrad)"
            strokeWidth="2.5"
            filter="url(#neonGlow)"
            opacity="0.85"
          />
          <path
            d="M 140 280 Q 260 340 380 360"
            stroke="url(#corridorGrad)"
            strokeWidth="1.5"
            strokeDasharray="7 5"
            opacity="0.6"
          />

          {/* Animated moving pulse dots along main Baramati -> Phaltan corridor */}
          <motion.circle
            r="3.5"
            fill={isPrimaryMode ? "#CCFF00" : "#FF6600"}
            filter="url(#neonGlow)"
            animate={{
              cx: [280, 310, 340, 380],
              cy: [220, 260, 300, 360],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.circle
            r="3"
            fill={isPrimaryMode ? "#0052FF" : "#FF6600"}
            animate={{
              cx: [620, 500, 380, 280],
              cy: [250, 230, 215, 220],
              opacity: [0, 0.9, 0.9, 0],
            }}
            transition={{
              duration: 4.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />

          {/* Rural Hub Nodes */}
          {nodes.map((node) => (
            <g key={node.name} className="transition-transform duration-300">
              {/* Outer pulsing beacon ring for APMC Central Hub */}
              {node.hub && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="14"
                  fill="none"
                  stroke={isPrimaryMode ? "#CCFF00" : "#FF6600"}
                  strokeWidth="1"
                  strokeOpacity="0.4"
                  className="animate-ping"
                  style={{ transformOrigin: `${node.x}px ${node.y}px`, animationDuration: "2.8s" }}
                />
              )}

              {/* Node core circle */}
              <circle
                cx={node.x}
                cy={node.y}
                r={node.hub ? "6" : "4.5"}
                fill={node.hub ? (isPrimaryMode ? "#CCFF00" : "#FF6600") : (isPrimaryMode ? "#161B26" : "#FFFFFF")}
                stroke={isPrimaryMode ? "#CCFF00" : "#FF6600"}
                strokeWidth={node.hub ? "2.5" : "1.8"}
                filter="url(#neonGlow)"
              />

              {/* Node text tag */}
              <text
                x={node.x + 10}
                y={node.y + 4}
                fill={isPrimaryMode ? "#FFFFFF" : "#1E293B"}
                fontSize="10"
                fontFamily="sans-serif"
                fontWeight="800"
                opacity="0.8"
                letterSpacing="0.05em"
              >
                {node.name}
              </text>
              <text
                x={node.x + 10}
                y={node.y + 14}
                fill={isPrimaryMode ? (node.hub ? "#CCFF00" : "#94A3B8") : "#64748B"}
                fontSize="7.5"
                fontFamily="sans-serif"
                fontWeight="600"
                opacity="0.75"
              >
                {node.label}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* 5. Bottom Gradient Transition to Smoothly Blend with Slide Section */}
      <div
        className={`absolute bottom-0 inset-x-0 h-32 transition-colors duration-300 ${
          isPrimaryMode
            ? "bg-gradient-to-t from-[#07090E] via-[#07090E]/80 to-transparent"
            : "bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC]/80 to-transparent"
        }`}
      />
    </div>
  );
}

export default LandingHeroBackground;
