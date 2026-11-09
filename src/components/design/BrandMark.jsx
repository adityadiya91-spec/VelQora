import { cn } from "@/lib/utils";

export function BrandMark({ size = "md", showTagline = false, className }) {
  const sizeClasses = {
    sm: "h-7",
    md: "h-9",
    lg: "h-11",
    xl: "h-14",
  };

  return (
    <div className={cn("inline-flex items-center gap-2 select-none", className)}>
      <img
        src="/Karwan-logo.png"
        alt="Karwan Logo"
        className={cn("w-auto object-contain max-w-[160px] sm:max-w-[200px]", sizeClasses[size] || "h-9")}
      />
      {showTagline ? (
        <span className="text-xs font-semibold tracking-wider uppercase text-white/60">
          Rural Shared Freight
        </span>
      ) : null}
    </div>
  );
}

export default BrandMark;
