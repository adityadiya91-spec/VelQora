import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { ThemeToggle } from "@/components/design/ThemeToggle";
import { LanguageSwitcher } from "@/components/design/LanguageSwitcher";
import { cn } from "@/lib/utils";

export function ScreenHeader({ title, subtitle, backTo, showControls = true }) {
  const navigate = useNavigate();
  const { isPrimaryMode } = useTheme();

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => (backTo ? navigate(backTo) : navigate(-1))}
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-2xl border transition shadow-sm",
            isPrimaryMode
              ? "border-white/15 bg-[#121622] text-white hover:bg-white/10 hover:border-[#CCFF00]/40"
              : "border-orange-200 bg-white text-slate-800 hover:bg-orange-50 hover:border-orange-300"
          )}
          type="button"
          aria-label="Back"
        >
          <ArrowLeft size={18} />
        </button>

        {showControls && (
          <div className="flex items-center gap-2">
            <ThemeToggle compact={true} />
            <LanguageSwitcher compact />
          </div>
        )}
      </div>

      <h1
        className={cn(
          "text-2xl sm:text-3xl font-black tracking-tight",
          isPrimaryMode ? "text-white" : "text-slate-900"
        )}
      >
        {title}
      </h1>

      {subtitle ? (
        <p
          className={cn(
            "mt-1.5 text-xs sm:text-sm font-medium",
            isPrimaryMode ? "text-slate-400" : "text-slate-600"
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

export default ScreenHeader;
