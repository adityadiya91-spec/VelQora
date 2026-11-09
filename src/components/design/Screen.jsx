import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";

export function Screen({
  children,
  className,
  containerClassName,
  maxWidth = "max-w-6xl", // Default responsive width for web resolution
}) {
  const { isPrimaryMode } = useTheme();

  return (
    <div
      className={cn(
        "min-h-screen transition-colors duration-300",
        isPrimaryMode
          ? "bg-[#07090E] text-white selection:bg-[#CCFF00] selection:text-black"
          : "bg-[#F8FAFC] text-slate-900 selection:bg-[#FF6600] selection:text-white",
        className
      )}
    >
      <div
        className={cn(
          "mx-auto w-full px-4 sm:px-6 lg:px-8 pb-28 md:pb-16 pt-4 md:pt-8",
          maxWidth,
          containerClassName
        )}
      >
        {children}
      </div>
    </div>
  );
}

export default Screen;
