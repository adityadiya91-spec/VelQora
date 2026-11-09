import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminStatCard({ title, value, subtitle, change, trend = "up", icon: Icon, className }) {
  return (
    <div className={cn("rounded-2xl border border-white/10 bg-[#121622] p-5 shadow-xl transition-all duration-300 hover:border-[#CCFF00]/40 hover:shadow-[0_0_25px_rgba(204,255,0,0.1)] group", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        {Icon ? (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#CCFF00]/15 text-[#CCFF00] border border-[#CCFF00]/25 transition group-hover:scale-110">
            <Icon size={18} />
          </div>
        ) : null}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <h3 className="font-heading text-2xl lg:text-3xl font-extrabold text-white tracking-tight">{value}</h3>
      </div>

      {(subtitle || change) ? (
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
          {change ? (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 font-bold px-2 py-0.5 rounded-full text-[11px]",
                trend === "up" ? "text-[#CCFF00] bg-[#CCFF00]/10 border border-[#CCFF00]/20" : "text-rose-400 bg-rose-500/10 border border-rose-500/20"
              )}
            >
              {trend === "up" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {change}
            </span>
          ) : null}
          {subtitle ? <span className="text-slate-400">{subtitle}</span> : null}
        </div>
      ) : null}
    </div>
  );
}

export default AdminStatCard;

