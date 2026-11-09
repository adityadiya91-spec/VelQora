import { cn } from "@/lib/utils";

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
        <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted">
          {label}
        </span>
      ) : null}

      <div
        className={cn(
          "flex items-center gap-3 rounded-lg border border-hairline bg-white px-4 transition focus-within:border-primary",
          className
        )}
      >
        {icon ? <span className="text-muted shrink-0">{icon}</span> : null}

        <select
          className={cn(
            "w-full appearance-none bg-transparent py-4 text-sm font-medium outline-none text-ink cursor-pointer",
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

export default SelectBox;
