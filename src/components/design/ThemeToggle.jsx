import { useTheme } from "@/contexts/ThemeContext";
import { Sparkles, Sun, Moon } from "lucide-react";

export function ThemeToggle({ compact = false, className = "" }) {
  const { isPrimaryMode, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`group relative inline-flex items-center gap-2 rounded-full p-1 transition-all duration-300 select-none ${
        isPrimaryMode
          ? "bg-[#1C2333] border border-white/20 text-white shadow-lg hover:border-[#CCFF00]/50"
          : "bg-white border-2 border-orange-400 text-slate-800 shadow-lg hover:border-orange-500"
      } ${className}`}
      title={
        isPrimaryMode
          ? "Toggle Mode ON: Primary Dark Theme (Click to switch to White + Orange)"
          : "Toggle Mode OFF: White + Orange Theme (Click to switch to Primary)"
      }
      aria-label="Toggle Color Theme"
    >
      {/* Switch Track & Thumb */}
      <div
        className={`relative flex items-center justify-center w-7 h-7 rounded-full transition-all duration-300 ${
          isPrimaryMode
            ? "bg-[#CCFF00] text-black shadow-[0_0_12px_rgba(204,255,0,0.6)]"
            : "bg-[#FF6600] text-white shadow-[0_0_12px_rgba(255,102,0,0.6)]"
        }`}
      >
        {isPrimaryMode ? (
          <Sparkles size={14} className="stroke-[2.5]" />
        ) : (
          <Sun size={14} className="stroke-[2.5]" />
        )}
      </div>

      {/* Label Text (if not compact) */}
      {!compact && (
        <div className="flex flex-col text-left pr-2.5">
          <span className="text-[10px] font-black uppercase tracking-wider leading-none">
            {isPrimaryMode ? "Primary Mode" : "White + Orange"}
          </span>
          <span
            className={`text-[9px] font-bold leading-tight ${
              isPrimaryMode ? "text-[#CCFF00]" : "text-[#FF6600]"
            }`}
          >
            {isPrimaryMode ? "Toggle ON" : "Toggle OFF"}
          </span>
        </div>
      )}
    </button>
  );
}

export default ThemeToggle;
