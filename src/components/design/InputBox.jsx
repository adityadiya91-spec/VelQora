import { cn } from "@/lib/utils";

export function InputBox({
  label,
  icon,
  className,
  inputClassName,
  ...props
}) {
  return (
    <label className="block w-full">
      {label ? (
        <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-white/60">
          {label}
        </span>
      ) : null}

      <div
        className={cn(
          "flex items-center gap-3 rounded-2xl border border-white/10 bg-[#121622] px-4 transition focus-within:border-[#CCFF00]",
          className
        )}
      >
        {icon ? <span className="text-[#CCFF00]">{icon}</span> : null}

        <input
          className={cn(
            "w-full bg-transparent py-4 text-sm font-medium text-white outline-none placeholder:text-white/40",
            inputClassName
          )}
          {...props}
        />
      </div>
    </label>
  );
}

export function SelectBox({
  label,
  icon,
  className,
  selectClassName,
  children,
  ...props
}) {
  return (
    <label className="block w-full">
      {label ? (
        <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-white/60">
          {label}
        </span>
      ) : null}

      <div
        className={cn(
          "flex items-center gap-3 rounded-2xl border border-white/10 bg-[#121622] px-4 transition focus-within:border-[#CCFF00]",
          className
        )}
      >
        {icon ? <span className="text-[#CCFF00]">{icon}</span> : null}

        <select
          className={cn(
            "w-full bg-transparent py-4 text-sm font-medium text-white outline-none",
            selectClassName
          )}
          {...props}
        >
          {children}
        </select>
      </div>
    </label>
  );
}