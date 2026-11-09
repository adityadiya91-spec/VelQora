import { cn } from "@/lib/utils";

export function PillButton({
  children,
  variant = "coral",
  className,
  ...props
}) {
  const variants = {
    primary: "bg-[#FF6600] text-white hover:bg-[#E65C00] shadow-md",
    coral: "bg-[#CCFF00] text-black font-black hover:bg-[#DFFF00] shadow-[0_0_20px_rgba(204,255,0,0.4)]",
    ghost: "border border-white/15 bg-white/5 text-white hover:bg-white/10",
    danger: "bg-destructive text-white hover:bg-destructive/80",
  };

  return (
    <button
      className={cn(
        "w-full rounded-2xl px-6 py-4 font-heading text-base font-bold tracking-tight transition active:scale-[0.98] disabled:opacity-50",
        variants[variant] || variants.coral,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}