import { cn } from "@/lib/utils";

export function Tabs({ tabs = [], activeTab, onChange, className }) {
  return (
    <div className={cn("grid grid-cols-3 gap-2 rounded-lg bg-canvas p-1 border border-hairline", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange?.(tab.id)}
          className={cn(
            "rounded-md py-2 text-xs font-bold transition",
            activeTab === tab.id
              ? "bg-white text-ink shadow-sm"
              : "text-muted hover:text-ink"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default Tabs;
