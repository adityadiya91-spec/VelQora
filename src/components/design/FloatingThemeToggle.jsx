import { useTheme } from "@/contexts/ThemeContext";
import { Sparkles, Sun } from "lucide-react";

export function FloatingThemeToggle() {
  const { isPrimaryMode, toggleTheme } = useTheme();

  return (
    <div className="fixed bottom-20 md:bottom-6 right-5 z-40">
      <button
        type="button"
        onClick={toggleTheme}
        className={`group flex items-center gap-2 rounded-full p-1.5 px-3 transition-all duration-300 shadow-2xl select-none backdrop-blur-xl border active:scale-95 ${
          isPrimaryMode
            ? "bg-[#121622]/90 border-white/20 text-white hover:border-[#CCFF00]/50 hover:shadow-[0_0_20px_rgba(204,255,0,0.3)]"
            : "bg-white/95 border-orange-300 text-slate-800 hover:border-orange-500 hover:shadow-[0_0_20px_rgba(255,102,0,0.3)]"
        }`}
        title={
          isPrimaryMode
            ? "Color Mode ON (Primary). Click to switch to White + Orange"
            : "Color Mode OFF (White + Orange). Click to switch to Primary"
        }
      >
        <div
          className={`flex h-6 w-6 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110 ${
            isPrimaryMode
              ? "bg-[#CCFF00] text-black shadow-[0_0_10px_#CCFF00]"
              : "bg-[#FF6600] text-white shadow-[0_0_10px_#FF6600]"
          }`}
        >
          {isPrimaryMode ? <Sparkles size={13} /> : <Sun size={13} />}
        </div>
        <span className="text-[11px] font-bold tracking-tight pr-1">
          {isPrimaryMode ? "Primary ON" : "Orange/White"}
        </span>
      </button>
    </div>
  );
}

export default FloatingThemeToggle;
